import { useState, useEffect } from 'react'
import Login from './Login'
import Register from './Register'
import AdminDashboard from './AdminDashboard'
import './App.css'

function App() {
  // State to track if the user is logged in
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [role, setRole] = useState(localStorage.getItem('role') || null)
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '')

  // State for the Event data
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchaseMessage, setPurchaseMessage] = useState({ type: '', text: '' });

  // State to toggle between Event view and Admin Dashboard
  const [showAdmin, setShowAdmin] = useState(false);
  // State to toggle between Login and Register
  const [showRegister, setShowRegister] = useState(false);

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
    setShowAdmin(false);
    setShowRegister(false);
  }

  const handleBuyTicket = () => {
    setPurchaseMessage({ type: '', text: '' }); // Clear previous messages

    fetch(`http://localhost:5024/api/Events/${event.id}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <--- THIS IS THE VIP PASS
      }
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to buy ticket');
        }
        return data;
      })
      .then((data) => {
        // 1. Show success message
        setPurchaseMessage({ type: 'success', text: data.message });
        
        // 2. Update the ticket count on the screen instantly
        setEvent((prevEvent) => ({
          ...prevEvent,
          ticketsAvailable: prevEvent.ticketsAvailable - 1
        }));
      })
      .catch((error) => {
        setPurchaseMessage({ type: 'error', text: error.message });
      });
  }

  // --- RENDERING LOGIC ---

  // 1. If no token, show the Login or Register page
  if (!token) {
    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={() => setShowRegister(false)} 
          onSwitchToLogin={() => setShowRegister(false)} 
        />
      )
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    )
  }

  // 2. If token exists, but event is still loading
  if (loading) return <div className="loading">Loading the Summer Kulture experience...</div>
  
  // 3. If event isn't found
  if (!event) return <div className="loading">Could not load event.</div>

  // 4. If SuperUser clicked the Admin button, show the dashboard
  if (showAdmin) {
    return <AdminDashboard token={token} onBack={() => setShowAdmin(false)} />
  }

  // 5. If logged in and event is loaded, show the ticket page
  return (
    <div className="app">
      <div className="user-header">
        <p>Logged in as: <strong>{firstName}</strong> ({role})</p>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Only show this button if the user is a SuperUser */}
          {role === 'SuperUser' && (
            <button className="admin-btn" onClick={() => setShowAdmin(true)}>
              View Users
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
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
          
          {purchaseMessage.text && (
            <div className={`message-alert ${purchaseMessage.type}`}>
              {purchaseMessage.text}
            </div>
          )}

          <button 
            onClick={handleBuyTicket} 
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