using SummerKulture.API.Models;

namespace SummerKulture.API.Services;

public interface IEventService
{
    Task<IEnumerable<Event>> GetAllEventsAsync();
    Task<Event?> GetEventByIdAsync(Guid id);
    Task<bool> BuyTicketAsync(Guid eventId);
}