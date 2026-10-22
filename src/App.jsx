import { useState, useEffect } from 'react'
import Login from './Login'
import './App.css'

function App() {
  // State to track if the user is logged in
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [role, setRole] = useState(localStorage.getItem('role') || null)
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '')

  // State for the Event data
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch event data ONLY if logged in
  useEffect(() => {
    if (!token) return; // If no token, don't fetch

    fetch('http://localhost:5024/api/events')
      .then((response) => response.json())
      .then((data) => {
        // The backend sends an array of events, we only want the first one for now
        setEvent(data[0] || null) 
        setLoading(false)
      })
      .catch((error) => console.error("Error fetching event:", error))
  }, [token])

  const handleLoginSuccess = (data) => {
    setToken(data.token);
    setRole(data.role);
    setFirstName(data.firstName);
    setLoading(true); // Trigger the event fetch
  }

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setFirstName('');
    setEvent(null);
  }

  // --- RENDERING LOGIC ---

  // 1. If no token, show the Login page
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // 2. If token exists, but event is still loading
  if (loading) return <div className="loading">Loading the Summer Kulture experience...</div>
  
  // 3. If event isn't found
  if (!event) return <div className="loading">Could not load event.</div>

  // 4. If logged in and event is loaded, show the ticket page
  return (
    <div className="app">
      <div className="user-header">
        <p>Logged in as: <strong>{firstName}</strong> ({role})</p>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="ticket-card">
        <p className="presenter">{event.presenter} presents</p>
        
        <h1 className="event-title">{event.name}</h1>
        <p className="tagline">{event.tagline}</p>

        <div className="event-info">
          <p><strong>📅 {new Date(event.date).toLocaleDateString()}</strong> | {event.time}</p>
          <p><strong>📍 {event.location}</strong></p>
        </div>

        <div className="lineup-section">
          <h3>LINEUP</h3>
          <div className="lineup-grid">
            {/* We add a comma and space after the map so the words don't mash together */}
            {event.lineup.split(',').map((artist, index) => (
              <span key={index} className="artist-tag">
                {artist.trim()}{index !== event.lineup.split(',').length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="ticket-action">
          <p className="price">R{event.ticketPrice}.00</p>
          <p className="availability">{event.ticketsAvailable} tickets left</p>
          
          {/* We'll hook this button up to the API in the next slice! */}
          <button>BUY TICKET</button>
        </div>
      </div>
    </div>
  )
}

export default App