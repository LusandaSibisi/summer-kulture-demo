using System.ComponentModel.DataAnnotations;

namespace SummerKulture.API.Models;

public class Event
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Name { get; set; } = "SUMMER KULTURE";
    public string Presenter { get; set; } = "GROOVE KULTURE X EXCLUSIVE SOUNDS";
    public string Tagline { get; set; } = "SPLASH. SIP. REPEAT. GROOVE.";
    
    public DateTime Date { get; set; } = new DateTime(2026, 10, 24);
    public string Time { get; set; } = "12:00 - 00:00";
    public string Location { get; set; } = "72 ALSATION STREET, GLEN AUSTIN, MIDRAND";
    
    public decimal TicketPrice { get; set; } = 150.00m; // The 'm' means it's money (decimal)
    public int TicketsAvailable { get; set; } = 500;
    
    // We will store the lineup as a single string separated by commas for now
    public string Lineup { get; set; } = "034 MAFIA, LES-D, FLAYMAY, YBF, YONDIE, LOSTBXY, THAMANI, CHOPPER, TKKM, DETOXIC, SJIJOWW, JIMMY, MLOTSHWA, KEAZY, MJAKES";
}