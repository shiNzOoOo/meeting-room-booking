using System.ComponentModel.DataAnnotations;

namespace MeetingRoomAPI.DTOs.Room;

public class RoomDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int Capacity { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class CreateUpdateRoomDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;

    [Required, Range(1, 500)]
    public int Capacity { get; set; }

    public bool IsActive { get; set; } = true;
}
