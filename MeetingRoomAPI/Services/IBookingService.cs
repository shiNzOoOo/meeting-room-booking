using MeetingRoomAPI.DTOs.Booking;

namespace MeetingRoomAPI.Services;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto);
    Task<List<BookingDto>> GetUserBookingHistoryAsync(int userId);
    Task<BookingScheduleDto> GetRoomScheduleAsync(int roomId, DateOnly date);
    Task<List<BookingDto>> GetAllBookingsAsync();
    Task<bool> DeleteBookingAsync(int id);
}
