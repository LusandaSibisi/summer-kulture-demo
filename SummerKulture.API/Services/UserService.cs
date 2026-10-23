using SummerKulture.API.DTOs;
using SummerKulture.API.Models;
using SummerKulture.API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace SummerKulture.API.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IConfiguration _config; 

    public UserService(IUserRepository repository, IConfiguration config) 
    {
        _repository = repository; // <--- Fixed the missing underscore
        _config = config;
    }

    public async Task<UserResponseDto?> RegisterUserAsync(UserRegisterDto request)
    {
        var existingUser = await _repository.GetUserByEmailAsync(request.Email);
        if (existingUser != null) return null; 

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newUser = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = "User" 
        };

        await _repository.AddUserAsync(newUser);
        await _repository.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = newUser.Id,
            Email = newUser.Email,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Role = newUser.Role
        };
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
    {
        var users = await _repository.GetAllUsersAsync();
        
        return users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Email = u.Email,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Role = u.Role
        });
    }

    public async Task<LoginResponseDto?> LoginAsync(UserLoginDto request)
    {
        var user = await _repository.GetUserByEmailAsync(request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null; 
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role) 
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new LoginResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            Role = user.Role,
            FirstName = user.FirstName
        };
    }

        public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _repository.GetUserByIdAsync(id);
        if (user == null) return false; // User not found

        _repository.DeleteUser(user);
        await _repository.SaveChangesAsync();
        return true;
    }
}