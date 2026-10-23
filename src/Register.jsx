import { useState } from 'react'

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    fetch('http://localhost:5024/api/Users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        return data;
      })
      .then(() => {
        // Show success message and tell App.jsx to switch back to Login
        setMessage({ type: 'success', text: 'Account created! You can now log in.' });
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000); // Wait 2 seconds so they can read the message
      })
      .catch((error) => {
        setMessage({ type: 'error', text: error.message });
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create an Account</h2>
        <p>Join Summer Kulture and get your tickets</p>
        
        {message.text && (
          <div className={`message-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            name="firstName"
            placeholder="First Name" 
            value={formData.firstName} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="lastName"
            placeholder="Last Name" 
            value={formData.lastName} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Sign Up</button>
        </form>

        <p className="switch-auth">
          Already have an account? <span onClick={onSwitchToLogin}>Log in here</span>
        </p>
      </div>
    </div>
  )
}

export default Register