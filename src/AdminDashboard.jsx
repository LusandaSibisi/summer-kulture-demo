import { useState, useEffect } from 'react'

function AdminDashboard({ token, onBack }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // We call the protected endpoint using the VIP Pass (token)
    fetch('http://localhost:5024/api/Users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users. Are you a SuperUser?')
        }
        return response.json()
      })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [token])

    const handleDeleteUser = (userId, userFirstName) => {
    // Ask for confirmation before deleting
    if (!window.confirm(`Are you sure you want to delete ${userFirstName}?`)) return;

    fetch(`http://localhost:5024/api/Users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete user');
        // If successful, remove the user from the table instantly without refreshing
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((err) => alert(err.message));
  }

  if (loading) return <div className="loading">Loading user database...</div>
  if (error) return <div className="loading" style={{color: 'red'}}>{error}</div>

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>👑 Admin Dashboard</h2>
        <button className="back-btn" onClick={onBack}>← Back to Event</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th> {/* <-- Add this */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role === 'SuperUser' ? 'super' : 'user'}`}>
                    {user.role}
                  </span>
                </td>
                {/* Add the delete button here */}
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteUser(user.id, user.firstName)}
                    disabled={user.role === 'SuperUser'} // Prevent deleting other admins
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard