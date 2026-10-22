import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/event')
      .then((response) => response.json())
      .then((data) => {
        setEvent(data)
        setLoading(false)
      })
      .catch((error) => console.error("Error fetching data:", error))
  }, [])

  const buyTicket = () => {
    fetch('http://localhost:3001/api/buy-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvent({ ...event, ticketsAvailable: data.ticketsAvailable })
          setMessage(data.message)
          // Clear the message after 3 seconds
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(data.message)
        }
      })
      .catch((error) => console.error("Error buying ticket:", error))
  }

  if (loading) return <div className="loading">Loading the Summer Kulture experience...</div>
  if (!event) return <div className="loading">Could not load event.</div>

  return (
    <div className="app">
      <div className="ticket-card">
        <p className="presenter">{event.presenter} presents</p>
        
        <h1 className="event-title">{event.eventName}</h1>
        <p className="tagline">{event.tagline}</p>

        <div className="event-info">
          <p><strong>📅 {event.date}</strong> | {event.time}</p>
          <p><strong>📍 {event.location}</strong></p>
        </div>

        <div className="lineup-section">
          <h3>LINEUP</h3>
          <div className="lineup-grid">
            {event.lineup.map((artist, index) => (
              <span key={index} className="artist-tag">{artist}</span>
            ))}
          </div>
        </div>

        <div className="ticket-action">
          <p className="price">R{event.ticketPrice}.00</p>
          <p className="availability">{event.ticketsAvailable} tickets left</p>
          
          {message && <p className="success-message">{message} 🎉</p>}
          
          <button 
            onClick={buyTicket} 
            disabled={event.ticketsAvailable === 0}
          >
            {event.ticketsAvailable === 0 ? 'SOLD OUT' : 'BUY TICKET'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App