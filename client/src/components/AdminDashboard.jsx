import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';

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

  // Event form state now holds imageFile (FileList) and previews (array of URL strings)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    date: '',
    category: '',
    imageFile: null, // FileList from input
  });
  const [imagePreviews, setImagePreviews] = useState([]); // For preview URLs

  const [transportForm, setTransportForm] = useState({
    type: '',
    destination: '',
    date: '',
    time: '',
    price: '',
    availableSeats: '',
  });

  const { axios, getToken } = useAppContext();

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
      setTransports(Array.isArray(data.transports) ? data.transports : []);
    } catch {
      toast.error('Failed to load transports');
    }
  };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers(), fetchReservations(), fetchEvents(), fetchTransports()])
      .catch(() => setError('Failed to load admin data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Add Event function with multiple images sent as 'images'
  const addEvent = async () => {
    const token = await getToken();
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(eventForm)) {
        if (key === 'imageFile' && value) {
          for (const file of value) {
            formData.append('images', file); // multiple files as 'images'
          }
        } else if (value) {
          formData.append(key, value);
        }
      }

      await axios.post('/api/events/create-event', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Event added');

      // Clear form and previews
      setEventForm({
        title: '',
        description: '',
        location: '',
        price: '',
        date: '',
        category: '',
        imageFile: null,
      });
      setImagePreviews([]);

      fetchAll();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to add event');
    }
  };

  const addTransport = async () => {
    const token = await getToken();
    try {
      await axios.post('/api/transport', transportForm, {
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

  const updateRole = async (userId, newRole) => {
    try {
      const token = await getToken();
      await axios.patch(`/api/admin/update-user-role/${userId}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const token = await getToken();
      await axios.delete(`/api/admin/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(e => e._id !== eventId));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const deleteTransport = async (transportId) => {
    if (!window.confirm('Delete this transport?')) return;
    try {
      const token = await getToken();
      await axios.delete(`/api/admin/delete-transport/${transportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransports(transports.filter(t => t._id !== transportId));
      toast.success('Transport deleted');
    } catch {
      toast.error('Failed to delete transport');
    }
  };

  const handleImageUpdate = async (eventId, imageFile) => {
    if (!imageFile) return toast.error('Please select an image.');
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('image', imageFile);
      await axios.patch(`/api/events/${eventId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Image updated');
      fetchEvents();
    } catch {
      toast.error('Failed to update image');
    }
  };

  // Handle image selection & generate preview URLs
  const onImageChange = (e) => {
    const files = e.target.files;
    if (files.length === 0) {
      setImagePreviews([]);
      setEventForm(prev => ({ ...prev, imageFile: null }));
      return;
    }
    // Generate preview URLs
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      previews.push(URL.createObjectURL(files[i]));
    }
    setImagePreviews(previews);
    setEventForm(prev => ({ ...prev, imageFile: files }));
  };

  const filteredUsers = users.filter(u =>
    `${u.fullName || ''} ${u.username || ''} ${u.email || ''} ${u.role || ''}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  const filteredEvents = events.filter(e => {
    const matchesSearch = (e.title || '').toLowerCase().includes(eventSearch.toLowerCase());
    if (!eventDateRange.from && !eventDateRange.to) return matchesSearch;
    const eventDate = new Date(e.date);
    const fromDate = eventDateRange.from ? new Date(eventDateRange.from) : null;
    const toDate = eventDateRange.to ? new Date(eventDateRange.to) : null;
    return matchesSearch && (!fromDate || eventDate >= fromDate) && (!toDate || eventDate <= toDate);
  });

  const filteredTransports = transports.filter(t => {
    const matchesSearch =
      (t.destination || '').toLowerCase().includes(transportSearch.toLowerCase()) ||
      (t.type || '').toLowerCase().includes(transportSearch.toLowerCase());
    if (!transportDateRange.from && !transportDateRange.to) return matchesSearch;
    const transportDate = new Date(t.date);
    const fromDate = transportDateRange.from ? new Date(transportDateRange.from) : null;
    const toDate = transportDateRange.to ? new Date(transportDateRange.to) : null;
    return matchesSearch && (!fromDate || transportDate >= fromDate) && (!toDate || transportDate <= toDate);
  });

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 mt-16">
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
                <div key={key} className="col-span-1 sm:col-span-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageChange}
                    className="border p-2 rounded w-full"
                  />
                  {/* Preview thumbnails */}
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {imagePreviews.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
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
        <h2 className="text-xl font-bold mb-4">Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event._id} className="bg-gray-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col">
                {Array.isArray(event.imageUrl) && event.imageUrl.length > 0 ? (
                  <img src={event.imageUrl[0]} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-2" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-2">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                {Array.isArray(event.imageUrl) && event.imageUrl.length > 1 && (
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {event.imageUrl.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${event.title} - ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
                        onClick={() => {
                          const reordered = [img, ...event.imageUrl.filter(i => i !== img)];
                          setEvents(prev => prev.map(e => e._id === event._id ? { ...e, imageUrl: reordered } : e));
                        }}
                      />
                    ))}
                  </div>
                )}
                <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500 truncate">{event.location}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpdate(event._id, e.target.files[0])}
                  className="border p-2 rounded mt-2"
                />
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
