using SummerKulture.API.Models;
using SummerKulture.API.Repositories;

namespace SummerKulture.API.Services;

public class EventService : IEventService
{
    private readonly IEventRepository _repository;

    public EventService(IEventRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return await _repository.GetAllEventsAsync();
    }

    public async Task<Event?> GetEventByIdAsync(Guid id)
    {
        return await _repository.GetEventByIdAsync(id);
    }

    public async Task<bool> BuyTicketAsync(Guid eventId)
    {
        var myEvent = await _repository.GetEventByIdAsync(eventId);
        
        // Business Logic: If event doesn't exist or is sold out, return false
        if (myEvent == null || myEvent.TicketsAvailable <= 0)
        {
            return false; 
        }

        // Decrease ticket count and save
        myEvent.TicketsAvailable -= 1;
        await _repository.UpdateEventAsync(myEvent);
        await _repository.SaveChangesAsync();
        
        return true;
    }
}