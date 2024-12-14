'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Next.js router
import { Button } from "@/registry/new-york/ui/button"; // Assuming you have a Button component
import { format } from "date-fns"; // For date formatting

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    time: "",
    capacity: 0,
  });
  const [activeTab, setActiveTab] = useState('allEvents'); // State to manage active tab
  const router = useRouter();

  // Fetch events when the component loads
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:5000/api/events", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    router.push("/"); // Redirect to landing page
  };

  // Handle event creation
  const handleCreateEvent = async () => {
    const token = localStorage.getItem("authToken");

    const newEventData = {
      name: newEvent.name,
      date: newEvent.date,
      location: newEvent.location,
      description: newEvent.description,
      time: newEvent.time,
      capacity: newEvent.capacity,
      availableSeats: newEvent.capacity, // Initially set availableSeats to capacity
      attendees: [], // Empty array for attendees initially
    };

    try {
      const response = await axios.post("http://localhost:5000/api/admin/events", newEventData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents([...events, response.data.event]); // Add the new event to the list
      setNewEvent({
        name: "",
        date: "",
        location: "",
        description: "",
        time: "",
        capacity: 0,
      });

      setActiveTab("allEvents"); // Redirect to the events tab
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 'allEvents' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('allEvents')}
          >
            All Events
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 'createEvent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('createEvent')}
          >
            Create Event
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg ${activeTab === 'viewRSVP' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('viewRSVP')}
          >
            View RSVPs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'allEvents' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                  <p className="text-gray-700 text-sm mb-2">Location: {event.location}</p>
                  <p className="text-gray-700 text-sm mb-4">Date: {format(new Date(event.date), "PPP")}</p>
                  <p className="text-gray-600 text-base mb-4">{event.description}</p>
                  <div className="text-sm text-gray-500">
                    <span>Capacity: {event.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'createEvent' && (
        <div>
        <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="eventName" className="block text-sm font-semibold text-gray-700">Event Name</label>
            <input
              id="eventName"
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-700">Event Date</label>
            <input
              id="eventDate"
              type="date"
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="eventLocation" className="block text-sm font-semibold text-gray-700">Event Location</label>
            <input
              id="eventLocation"
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
              placeholder="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="eventDescription" className="block text-sm font-semibold text-gray-700">Event Description</label>
            <textarea
              id="eventDescription"
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="eventTime" className="block text-sm font-semibold text-gray-700">Event Time</label>
            <input
              id="eventTime"
              type="time"
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="eventCapacity" className="block text-sm font-semibold text-gray-700">Event Capacity</label>
            <input
              id="eventCapacity"
              type="number"
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
              placeholder="Capacity"
              value={newEvent.capacity}
              onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
            />
          </div>

          <Button
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            onClick={handleCreateEvent}
          >
            Create Event
          </Button>
        </div>
      </div>
    )}
     {activeTab === 'viewRSVP' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">RSVPs by Event</h2>
            {loading ? (
              <p>Loading RSVPs...</p>
            ) : (
              <div>
                {events.map((event, index) => (
                  <div key={index} className="border p-4 rounded-lg shadow-sm mb-6">
                    <h3 className="font-semibold text-xl">{event.name}</h3>
                    <p className="text-sm text-gray-600">Location: {event.location}</p>
                    <p className="text-sm text-gray-600">Date: {format(new Date(event.date), "PPP")}</p>
                    <p className="text-sm text-gray-600">Attendees: {event.attendees.length}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
