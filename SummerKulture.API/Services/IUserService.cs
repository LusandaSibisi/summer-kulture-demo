using SummerKulture.API.DTOs;

namespace SummerKulture.API.Services;

public interface IUserService
{
    Task<UserResponseDto?> RegisterUserAsync(UserRegisterDto request);
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
    Task<LoginResponseDto?> LoginAsync(UserLoginDto request); // <--- ADD THIS
    Task<bool> DeleteUserAsync(Guid id);
}