using MeetingRoomAPI.DTOs.Room;
using MeetingRoomAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MeetingRoomAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly IBookingService _bookingService;
    private readonly MeetingRoomAPI.Data.MeetingRoomDbContext _context;

    public AdminController(IRoomService roomService, IBookingService bookingService, MeetingRoomAPI.Data.MeetingRoomDbContext context)
    {
        _roomService = roomService;
        _bookingService = bookingService;
        _context = context;
    }

    [HttpGet("rooms")]
    public async Task<IActionResult> GetAllRooms()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        return Ok(rooms);
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();
        return Ok(bookings);
    }

    [HttpDelete("bookings/{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var deleted = await _bookingService.DeleteBookingAsync(id);
        if (!deleted) return NotFound(new { message = "Booking not found." });
        return Ok(new { message = "Booking deleted successfully." });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.Select(u => new
        {
            u.Id,
            u.Name,
            u.Email,
            u.Role,
            u.CreatedAt
        }).ToListAsync();
        return Ok(users);
    }
}
