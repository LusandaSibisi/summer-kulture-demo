using Bogus;
using SummerKulture.API.Models;
using Microsoft.Extensions.Configuration;

namespace SummerKulture.API.Data;

public static class DbSeeder
{
    // 1. We added IConfiguration here so it can read your secrets
    public static void Seed(AppDbContext context, IConfiguration config)
    {
        // Check if the database already has users. If it does, don't seed again!
        if (context.Users.Any() || context.Events.Any())
        {
            return; 
        }

        // ==========================================
        // 1. ORIGINAL HARDCODED SUPER USER (Admin)
        // ==========================================
        var superUser = new User
        {
            Email = "admin@summerkulture.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("SuperAdmin123!"),
            FirstName = "Super",
            LastName = "Admin",
            Role = "SuperUser" 
        };
        context.Users.Add(superUser);

        // ==========================================
        // 2. NEW CUSTOM SUPER USER (From User-Secrets)
        // ==========================================
        // This pulls the email and password from your terminal secrets
        var secretEmail = config["Seed:SuperUserEmail"] ?? "admin@summerkulture.test";
        var secretPassword = config["Seed:SuperUserPassword"] ?? "RockwoodEstate1";

        var secretSuperUser = new User
        {
            Email = secretEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(secretPassword),
            FirstName = "Secret",
            LastName = "Admin",
            Role = "SuperUser" 
        };
        context.Users.Add(secretSuperUser);

        // ==========================================
        // 3. CREATE 20 FAKE USERS USING BOGUS (Unchanged)
        // ==========================================
        var userFaker = new Faker<User>()
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
            .RuleFor(u => u.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("Password123!"))
            .RuleFor(u => u.Role, f => "User");

        var fakeUsers = userFaker.Generate(20);
        context.Users.AddRange(fakeUsers);

        // ==========================================
        // 4. CREATE THE SUMMER KULTURE EVENT (Unchanged)
        // ==========================================
        var summerKulture = new Event
        {
            Name = "SUMMER KULTURE",
            Presenter = "GROOVE KULTURE X EXCLUSIVE SOUNDS",
            Tagline = "SPLASH. SIP. REPEAT. GROOVE.",
            Date = new DateTime(2026, 10, 24),
            Time = "12:00 - 00:00",
            Location = "72 ALSATION STREET, GLEN AUSTIN, MIDRAND",
            TicketPrice = 150.00m,
            TicketsAvailable = 500,
            Lineup = "034 MAFIA, LES-D, FLAYMAY, YBF, YONDIE, LOSTBXY, THAMANI, CHOPPER, TKKM, DETOXIC, SJIJOWW, JIMMY, MLOTSHWA, KEAZY, MJAKES"
        };
        context.Events.Add(summerKulture);

        // Save everything to the SQL Database
        context.SaveChanges();
    }
}