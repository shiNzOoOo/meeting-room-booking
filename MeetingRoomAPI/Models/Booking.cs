using System;
using System.Collections.Generic;

namespace MeetingRoomAPI.Models;

public partial class Booking
{
    public int Id { get; set; }

    public int RoomId { get; set; }

    public int UserId { get; set; }

    public DateOnly BookingDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public string Title { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual Room Room { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
