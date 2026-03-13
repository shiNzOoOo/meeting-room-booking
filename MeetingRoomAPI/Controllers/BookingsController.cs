using System.Security.Claims;
using MeetingRoomAPI.DTOs.Booking;
using MeetingRoomAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetingRoomAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var booking = await _bookingService.CreateBookingAsync(userId, dto);
            return CreatedAtAction(nameof(GetMyHistory), booking);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("my-history")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var bookings = await _bookingService.GetUserBookingHistoryAsync(userId);
        return Ok(bookings);
    }

    [HttpGet("room/{roomId}")]
    public async Task<IActionResult> GetRoomSchedule(int roomId, [FromQuery] DateOnly date)
    {
        try
        {
            var schedule = await _bookingService.GetRoomScheduleAsync(roomId, date);
            return Ok(schedule);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
