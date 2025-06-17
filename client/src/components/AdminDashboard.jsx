import React, { useEffect, useState } from 'react'
import axios from 'axios'

const roles = ['user', 'hotelOwner', 'foodOwner', 'admin']

export default function AdminDashboard() {
  const [stats, setStats] = useState({ eventCount: 0, transportCount: 0 })
  const [users, setUsers] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats')
      setStats(data)
    } catch (err) {
      setError('Failed to load stats')
    }
  }

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users')
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
    }
  }

  // Fetch reservations
  const fetchReservations = async () => {
    try {
      const { data } = await axios.get('/api/admin/reservations')
      setReservations(data)
    } catch (err) {
      setError('Failed to load reservations')
    }
  }

  // Update user role
  const updateRole = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/update-user-role/${userId}`, { role: newRole })
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      alert('Failed to update role')
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchStats(), fetchUsers(), fetchReservations()]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Statistics</h2>
        <div className="flex gap-8">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold">Total Events</h3>
            <p className="text-2xl">{stats.eventCount}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold">Total Transports</h3>
            <p className="text-2xl">{stats.transportCount}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-3 py-1">Name</th>
              <th className="border border-gray-300 px-3 py-1">Email</th>
              <th className="border border-gray-300 px-3 py-1">Role</th>
              <th className="border border-gray-300 px-3 py-1">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-3 py-1">{user.fullName}</td>
                <td className="border border-gray-300 px-3 py-1">{user.email}</td>
                <td className="border border-gray-300 px-3 py-1">{user.role}</td>
                <td className="border border-gray-300 px-3 py-1">
                  <select
                    value={user.role}
                    onChange={e => updateRole(user.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    {roles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Reservations</h2>
        {reservations.length === 0 && <p>No reservations found.</p>}
        <ul className="space-y-2 max-h-64 overflow-auto border border-gray-300 rounded p-4">
          {reservations.map(res => (
            <li key={res._id} className="border-b border-gray-200 pb-2">
              <p><strong>User ID:</strong> {res.userId || 'N/A'}</p>
              <p><strong>Transport:</strong> {res.transportId?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(res.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {res.status || 'N/A'}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
