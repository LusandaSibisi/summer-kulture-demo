using SummerKulture.API.Models;

namespace SummerKulture.API.Repositories;

public interface IEventRepository
{
    Task<Event?> GetEventByIdAsync(Guid id);
    Task<IEnumerable<Event>> GetAllEventsAsync();
    Task AddEventAsync(Event newEvent);
    Task UpdateEventAsync(Event updatedEvent);
    Task SaveChangesAsync();
}