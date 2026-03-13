using MeetingRoomAPI.Data;
using MeetingRoomAPI.DTOs.Booking;
using MeetingRoomAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetingRoomAPI.Services;

public class BookingService : IBookingService
{
    private readonly MeetingRoomDbContext _context;

    public BookingService(MeetingRoomDbContext context)
    {
        _context = context;
    }

    public async Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto)
    {
        if (dto.EndTime <= dto.StartTime)
            throw new InvalidOperationException("End time must be after start time.");

        var room = await _context.Rooms.FindAsync(dto.RoomId);
        if (room == null || !room.IsActive)
            throw new InvalidOperationException("Room not found or is inactive.");

        // Check for overlapping bookings
        var hasOverlap = await _context.Bookings.AnyAsync(b =>
            b.RoomId == dto.RoomId &&
            b.BookingDate == dto.BookingDate &&
            b.StartTime < dto.EndTime &&
            b.EndTime > dto.StartTime);

        if (hasOverlap)
            throw new InvalidOperationException("This room is already booked for the selected time slot.");

        var booking = new Booking
        {
            RoomId = dto.RoomId,
            UserId = userId,
            BookingDate = dto.BookingDate,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Title = dto.Title,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        await _context.Entry(booking).Reference(b => b.Room).LoadAsync();
        await _context.Entry(booking).Reference(b => b.User).LoadAsync();

        return MapToDto(booking);
    }

    public async Task<List<BookingDto>> GetUserBookingHistoryAsync(int userId)
    {
        return await _context.Bookings
            .Include(b => b.Room)
            .Include(b => b.User)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ThenByDescending(b => b.StartTime)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<BookingScheduleDto> GetRoomScheduleAsync(int roomId, DateOnly date)
    {
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null)
            throw new InvalidOperationException("Room not found.");

        var bookings = await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Room)
            .Where(b => b.RoomId == roomId && b.BookingDate == date)
            .OrderBy(b => b.StartTime)
            .Select(b => MapToDto(b))
            .ToListAsync();

        return new BookingScheduleDto
        {
            Date = date,
            RoomName = room.Name,
            Bookings = bookings
        };
    }

    public async Task<List<BookingDto>> GetAllBookingsAsync()
    {
        return await _context.Bookings
            .Include(b => b.Room)
            .Include(b => b.User)
            .OrderByDescending(b => b.BookingDate)
            .ThenByDescending(b => b.StartTime)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<bool> DeleteBookingAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null) return false;
        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return true;
    }

    private static BookingDto MapToDto(Booking b) => new()
    {
        Id = b.Id,
        RoomId = b.RoomId,
        RoomName = b.Room?.Name ?? "",
        UserId = b.UserId,
        UserName = b.User?.Name ?? "",
        BookingDate = b.BookingDate,
        StartTime = b.StartTime,
        EndTime = b.EndTime,
        Title = b.Title,
        CreatedAt = b.CreatedAt
    };
}
