import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';

// CSV Utility
const exportCSV = (data, filename) => {
  if (!data || data.length === 0) {
    toast.error('No data to export');
    return;
  }
  const replacer = (key, value) => (value === null ? '' : value);
  const header = Object.keys(data[0] || {});
  const csv = [
    header.join(','),
    ...data.map(row =>
      header
        .map(fieldName => JSON.stringify(row[fieldName], replacer))
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const roles = ['user', 'hotelOwner', 'foodOwner', 'admin'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ eventCount: 0, transportCount: 0 });
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [userSearch, setUserSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [transportSearch, setTransportSearch] = useState('');

  const [eventDateRange, setEventDateRange] = useState({ from: '', to: '' });
  const [transportDateRange, setTransportDateRange] = useState({ from: '', to: '' });

  // Updated eventForm state includes imageFile for file input
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    date: '',
    category: '',
    imageFile: null,
  });

  const [transportForm, setTransportForm] = useState({
    type: '',
    destination: '',
    date: '',
    time: '',
    price: '',
    availableSeats: '',
  });

  const { axios, getToken } = useAppContext();

  // Fetch Functions
  const fetchStats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data || { eventCount: 0, transportCount: 0 });
    } catch {
      toast.error('Failed to load stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load users');
    }
  };

  const fetchReservations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/admin/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load reservations');
    }
  };

  const fetchEvents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load events');
    }
  };

  const fetchTransports = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/transport', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransports(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load transports');
    }
  };

  // Fetch all at once
  const fetchAll = () => {
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers(), fetchReservations(), fetchEvents(), fetchTransports()])
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Add Event with FormData for image upload
  const addEvent = async () => {
    const token = await getToken();

    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('location', eventForm.location);
      formData.append('price', eventForm.price);
      formData.append('date', eventForm.date);
      formData.append('category', eventForm.category);
      if (eventForm.imageFile) {
        formData.append('image', eventForm.imageFile);
      }

      await axios.post('/api/events/create-event', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Event added');
      setEventForm({
        title: '',
        description: '',
        location: '',
        price: '',
        date: '',
        category: '',
        imageFile: null,
      });
      fetchAll();
    } catch {
      toast.error('Failed to add event');
    }
  };

  // Add Transport
  const addTransport = async () => {
    const token = await getToken();
    try {
      await axios.post('/api/transport/create-transport', transportForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transport added');
      setTransportForm({
        type: '',
        destination: '',
        date: '',
        time: '',
        price: '',
        availableSeats: '',
      });
      fetchAll();
    } catch {
      toast.error('Failed to add transport');
    }
  };

  // Update User Role
  const updateRole = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/update-user-role/${userId}`, { role: newRole });
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success('Role updated successfully');
    } catch {
      toast.error('Failed to update role');
    }
  };

  // Delete Event
  const deleteEvent = async eventId => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/admin/delete-event/${eventId}`);
      setEvents(events.filter(e => e._id !== eventId));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  // Delete Transport
  const deleteTransport = async transportId => {
    if (!window.confirm('Are you sure you want to delete this transport?')) return;
    try {
      await axios.delete(`/api/admin/delete-transport/${transportId}`);
      setTransports(transports.filter(t => t._id !== transportId));
      toast.success('Transport deleted');
    } catch {
      toast.error('Failed to delete transport');
    }
  };

  // Filtered lists for search and date filters
  const filteredUsers = users.filter(u =>
    ((u.fullName && u.fullName !== 'null null' ? u.fullName : '') + (u.username || ''))
      .toLowerCase()
      .includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredEvents = events.filter(e => {
    const matchesSearch = (e.title || '').toLowerCase().includes(eventSearch.toLowerCase());
    if (!eventDateRange.from && !eventDateRange.to) return matchesSearch;
    const eventDate = new Date(e.date);
    const fromDate = eventDateRange.from ? new Date(eventDateRange.from) : null;
    const toDate = eventDateRange.to ? new Date(eventDateRange.to) : null;
    return (
      matchesSearch &&
      (!fromDate || eventDate >= fromDate) &&
      (!toDate || eventDate <= toDate)
    );
  });

  const filteredTransports = transports.filter(t => {
    const matchesSearch =
      (t.destination || '').toLowerCase().includes(transportSearch.toLowerCase()) ||
      (t.type || '').toLowerCase().includes(transportSearch.toLowerCase());
    if (!transportDateRange.from && !transportDateRange.to) return matchesSearch;
    const transportDate = new Date(t.date);
    const fromDate = transportDateRange.from ? new Date(transportDateRange.from) : null;
    const toDate = transportDateRange.to ? new Date(transportDateRange.to) : null;
    return (
      matchesSearch &&
      (!fromDate || transportDate >= fromDate) &&
      (!toDate || transportDate <= toDate)
    );
  });

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: stats.eventCount },
          { label: 'Total Transports', value: stats.transportCount },
          { label: 'Total Users', value: users.length },
          { label: 'Reservations', value: reservations.length },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-700">{stat.label}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Add Event Form */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Event</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(eventForm).map(([key, value]) => {
            if (key === 'imageFile') {
              return (
                <input
                  key={key}
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    setEventForm(prev => ({ ...prev, imageFile: e.target.files[0] }))
                  }
                  className="border p-2 rounded"
                />
              );
            }

            const inputType = key === 'price' ? 'number' : key === 'date' ? 'date' : 'text';

            return (
              <input
                key={key}
                type={inputType}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                onChange={e => setEventForm(prev => ({ ...prev, [key]: e.target.value }))}
                className="border p-2 rounded"
              />
            );
          })}
          <button
            onClick={addEvent}
            className="bg-blue-600 text-white p-2 rounded col-span-1 sm:col-span-2 hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>
      </section>

      {/* Add Transport Form */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Transport</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(transportForm).map(([key, value]) => (
            <input
              key={key}
              type={
                key === 'price' || key === 'availableSeats'
                  ? 'number'
                  : key === 'date'
                  ? 'date'
                  : key === 'time'
                  ? 'time'
                  : 'text'
              }
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={e => setTransportForm(prev => ({ ...prev, [key]: e.target.value }))}
              className="border p-2 rounded"
            />
          ))}
          <button
            onClick={addTransport}
            className="bg-blue-600 text-white p-2 rounded col-span-1 sm:col-span-2 hover:bg-blue-700"
          >
            Add Transport
          </button>
        </div>
      </section>

      {/* Users Section */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Users</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="border rounded p-2 w-64"
            />
            <button
              onClick={() => exportCSV(filteredUsers, 'users.csv')}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">
                      {user.fullName && user.fullName !== 'null null'
                        ? user.fullName
                        : user.email}
                    </td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">{user.role}</td>
                    <td className="py-2 px-4 border">
                      <select
                        value={user.role}
                        onChange={e => updateRole(user.id, e.target.value)}
                        className="border rounded p-1"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold">Events</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search events..."
              value={eventSearch}
              onChange={e => setEventSearch(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={eventDateRange.from}
              onChange={e => setEventDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={eventDateRange.to}
              onChange={e => setEventDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border rounded p-2"
            />
            <button
              onClick={() => exportCSV(filteredEvents, 'events.csv')}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div
                key={event._id}
                className="bg-gray-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="rounded-lg object-cover h-40 w-full mb-2"
                  />
                )}
                <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 truncate">{event.location}</p>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="mt-2 text-sm text-red-600 hover:underline self-start"
                >
                  Delete Event
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No events found.</p>
          )}
        </div>
      </section>

      {/* Transports Section */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold">Transports</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search transports..."
              value={transportSearch}
              onChange={e => setTransportSearch(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={transportDateRange.from}
              onChange={e => setTransportDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={transportDateRange.to}
              onChange={e => setTransportDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="border rounded p-2"
            />
            <button
              onClick={() => exportCSV(filteredTransports, 'transports.csv')}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTransports.length > 0 ? (
            filteredTransports.map(transport => (
              <div
                key={transport._id}
                className="bg-gray-50 rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold">
                  {transport.type} - {transport.destination}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(transport.date).toLocaleDateString()}
                </p>
                <button
                  onClick={() => deleteTransport(transport._id)}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Delete Transport
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No transports found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
