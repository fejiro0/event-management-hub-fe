'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import withAdminProtection from "@/components/withAdminProtection";

function AdminPage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data (from the token or your user management system)
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    setUser(decodedToken); // Set the user state

    // Fetch the events for the admin to manage
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/create",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the events list after creating a new event
      setEvents([...events, response.data]);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  return (
    <div>
      {user && (
        <div>
          <h1>Welcome Admin: {user.name}</h1>

          {/* Event creation form */}
          <div>
            <h2>Create Event</h2>
            <form onSubmit={handleCreateEvent}>
              <input
                type="text"
                name="eventName"
                placeholder="Event Name"
                required
              />
              <input
                type="text"
                name="eventLocation"
                placeholder="Event Location"
                required
              />
              <input
                type="date"
                name="eventDate"
                required
              />
              <input
                type="time"
                name="eventTime"
                required
              />
              <textarea
                name="eventDescription"
                placeholder="Event Description"
                required
              ></textarea>
              <input
                type="number"
                name="availableSeats"
                placeholder="Available Seats"
                required
              />
              <button type="submit">Create Event</button>
            </form>
          </div>

          {/* Render the list of events */}
          <div>
            <h2>Manage Events</h2>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id}>
                  <h3>{event.name}</h3>
                  <p>{event.location}</p>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>Available Seats: {event.availableSeats}</p>
                  {/* Optionally add options to edit or delete events */}
                </div>
              ))
            ) : (
              <p>No events available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap AdminPage with the `withAdminProtection` HOC to protect the route
export default withAdminProtection(AdminPage);
