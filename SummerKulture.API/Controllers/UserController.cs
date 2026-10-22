using Microsoft.AspNetCore.Mvc;
using SummerKulture.API.DTOs;
using SummerKulture.API.Services;
using Microsoft.AspNetCore.Authorization; // <-- ADD THIS

namespace SummerKulture.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto request)
    {
        var result = await _userService.RegisterUserAsync(request);
        if (result == null) return BadRequest(new { message = "Email is already in use." });
        return Ok(result);
    }

    // --- NEW LOGIN ENDPOINT ---
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto request)
    {
        var result = await _userService.LoginAsync(request);
        
        if (result == null) 
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }
        
        return Ok(result);
    }

    // --- THE VIP BOUNCER ---
    [Authorize(Roles = "SuperUser")] // <--- ONLY SuperUsers can pass this line!
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }
}