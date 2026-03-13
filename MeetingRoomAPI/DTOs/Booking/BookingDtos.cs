using System.ComponentModel.DataAnnotations;

namespace MeetingRoomAPI.DTOs.Booking;

public class BookingDto
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public string RoomName { get; set; } = null!;
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
    public DateOnly BookingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string Title { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}

public class CreateBookingDto
{
    [Required]
    public int RoomId { get; set; }

    [Required]
    public DateOnly BookingDate { get; set; }

    [Required]
    public TimeOnly StartTime { get; set; }

    [Required]
    public TimeOnly EndTime { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = null!;
}

public class BookingScheduleDto
{
    public DateOnly Date { get; set; }
    public string RoomName { get; set; } = null!;
    public List<BookingDto> Bookings { get; set; } = new();
}
