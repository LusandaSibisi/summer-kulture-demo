import { useState } from 'react'

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault(); // Stops the page from refreshing when we submit the form
    setError('');

    // Send the login request to your .NET API
    fetch('http://localhost:5024/api/Users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        return data;
      })
      .then((data) => {
        // data contains: { token, role, firstName }
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('firstName', data.firstName);
        
        // Tell App.jsx that login was successful
        onLoginSuccess(data); 
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Log in to get your Summer Kulture tickets</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Log In</button>
        </form>
        <p className="switch-auth">
          Don't have an account? <span onClick={onSwitchToRegister}>Sign up here</span>
        </p>
      </div>
    </div>
  )
}

export default Login