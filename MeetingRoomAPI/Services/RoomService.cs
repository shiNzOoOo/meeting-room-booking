using MeetingRoomAPI.Data;
using MeetingRoomAPI.DTOs.Room;
using MeetingRoomAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetingRoomAPI.Services;

public class RoomService : IRoomService
{
    private readonly MeetingRoomDbContext _context;

    public RoomService(MeetingRoomDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoomDto>> GetActiveRoomsAsync()
    {
        return await _context.Rooms
            .Where(r => r.IsActive)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<List<RoomDto>> GetAllRoomsAsync()
    {
        return await _context.Rooms
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<RoomDto?> GetRoomByIdAsync(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        return room == null ? null : MapToDto(room);
    }

    public async Task<RoomDto> CreateRoomAsync(CreateUpdateRoomDto dto)
    {
        if (await _context.Rooms.AnyAsync(r => r.Name == dto.Name))
            throw new InvalidOperationException("A room with this name already exists.");

        var room = new Room
        {
            Name = dto.Name,
            Capacity = dto.Capacity,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow
        };

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();
        return MapToDto(room);
    }

    public async Task<RoomDto?> UpdateRoomAsync(int id, CreateUpdateRoomDto dto)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return null;

        if (await _context.Rooms.AnyAsync(r => r.Name == dto.Name && r.Id != id))
            throw new InvalidOperationException("A room with this name already exists.");

        room.Name = dto.Name;
        room.Capacity = dto.Capacity;
        room.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();
        return MapToDto(room);
    }

    private static RoomDto MapToDto(Room room) => new()
    {
        Id = room.Id,
        Name = room.Name,
        Capacity = room.Capacity,
        IsActive = room.IsActive,
        CreatedAt = room.CreatedAt
    };
}
