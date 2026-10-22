using System.ComponentModel.DataAnnotations;

namespace SummerKulture.API.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid(); // <--- IMPORTANT: Unique ID for every user
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty; // <--- IMPORTANT: Used for login
    
    public string PasswordHash { get; set; } = string.Empty; // <--- IMPORTANT: NEVER save plain passwords!
    
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    
    // This will either be "User" or "SuperUser"
    public string Role { get; set; } = "User"; // <--- IMPORTANT: Used for our Admin vs Normal User logic
}