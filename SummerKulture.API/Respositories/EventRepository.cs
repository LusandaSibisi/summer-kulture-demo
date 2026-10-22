using Microsoft.EntityFrameworkCore;
using SummerKulture.API.Data;
using SummerKulture.API.Models;

namespace SummerKulture.API.Repositories;

public class EventRepository : IEventRepository
{
    private readonly AppDbContext _context;

    // The Database context is injected here
    public EventRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetEventByIdAsync(Guid id)
    {
        return await _context.Events.FindAsync(id);
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return await _context.Events.ToListAsync();
    }

    public async Task AddEventAsync(Event newEvent)
    {
        await _context.Events.AddAsync(newEvent);
    }

    public async Task UpdateEventAsync(Event updatedEvent)
    {
        _context.Events.Update(updatedEvent);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}