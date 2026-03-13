using MeetingRoomAPI.DTOs.Room;

namespace MeetingRoomAPI.Services;

public interface IRoomService
{
    Task<List<RoomDto>> GetActiveRoomsAsync();
    Task<List<RoomDto>> GetAllRoomsAsync();
    Task<RoomDto?> GetRoomByIdAsync(int id);
    Task<RoomDto> CreateRoomAsync(CreateUpdateRoomDto dto);
    Task<RoomDto?> UpdateRoomAsync(int id, CreateUpdateRoomDto dto);
}
