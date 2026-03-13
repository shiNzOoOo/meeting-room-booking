using MeetingRoomAPI.DTOs.Auth;

namespace MeetingRoomAPI.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
