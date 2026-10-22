using SummerKulture.API.Models;

namespace SummerKulture.API.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task AddUserAsync(User user);
    Task SaveChangesAsync();
}