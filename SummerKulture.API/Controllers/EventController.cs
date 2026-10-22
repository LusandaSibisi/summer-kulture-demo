using Microsoft.AspNetCore.Mvc;
using SummerKulture.API.Services;

namespace SummerKulture.API.Controllers;

[ApiController]
[Route("api/[controller]")] // This makes the route /api/events
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    // We inject the Service here
    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEvents()
    {
        var events = await _eventService.GetAllEventsAsync();
        return Ok(events);
    }

    [HttpPost("{id}/buy")]
    public async Task<IActionResult> BuyTicket(Guid id)
    {
        var success = await _eventService.BuyTicketAsync(id);
        
        if (!success)
        {
            return BadRequest(new { message = "Sold out or event not found!" });
        }

        return Ok(new { message = "Ticket purchased successfully!" });
    }
}