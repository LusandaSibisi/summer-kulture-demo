using Microsoft.EntityFrameworkCore;
using SummerKulture.API.Models;

namespace SummerKulture.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; } 
    public DbSet<Event> Events { get; set; }
}