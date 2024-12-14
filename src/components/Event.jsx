'use client';

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { GiRockingChair } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";  
import { IoMdTime } from "react-icons/io";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";
import { useRouter } from 'next/navigation'; 

export default function Event() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);  // State to hold logged-in user
  const router = useRouter();  // Using next/router's useRouter hook

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    // Fetch events on load
    fetchEvents();

    // Check if the user is logged in (by checking if JWT token exists in localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });  // Example, replace with actual user info parsing if needed
    }
  }, []);

  // UseEffect to update the user state whenever the localStorage token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // If token exists and no user state is set, set the user state
      setUser({ token });
    }
  }, [user]);

  // RSVP Event Handler
  const rsvpEvent = async (eventId) => {
    try {
      const userId = 'USER_ID';  // Get the user ID from your logged-in user state or context
      const userName = 'User Name';  // Replace with actual user name

      // Send RSVP request to backend
      const response = await axios.post('http://localhost:5000/api/events/rsvp', {
        eventId,
        userId,
        userName,
      });

      // If the backend responds successfully, update the event data
      if (response.data.success) {
        // Update events data after successful RSVP
        setEvents((prevEvents) => 
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, availableSeats: event.availableSeats - 1 }
              : event
          )
        );

        alert('RSVP Successful!');
      } else {
        alert('Failed to RSVP. Try again later.');
      }
    } catch (error) {
      console.error("Error RSVPing for event:", error);
      alert("Error RSVPing for event");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {events.length > 0 ? (
        events.map((event, index) => (
          <Card className="mb-6 grid grid-cols=2" key={index}>
            <CardHeader className="flex justify-between items-center">
              {/* Image on the left */}
              <div className="flex-shrink-0">
                <img
                  src={event.picture || '/image/default.jpg'}
                  alt={event.name}
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>

              {/* Center content: Name, Location */}
              <div className="flex flex-col items-center mx-4 text-center">
                <h3 className="text-lg font-semibold text-default-600">{event.name}</h3>
                <h5 className="text-sm text-default-400 flex justify-center items-center gap-2">
                  <IoLocationSharp size={16} /> {event.location}
                </h5>
              </div>

              {/* Available seats on the right */}
              <div className="flex-shrink-0 text-right bg-lime-300 rounded-2xl px-4 py-1">
                <h5 className="text-sm text-default-400 flex justify-end items-center gap-2">
                  <GiRockingChair size={20} /> {event.availableSeats}
                </h5>
              </div>
            </CardHeader>

            <CardBody className="px-3 py-0 text-sm text-default-400">
              <p>{event.description}</p>
            </CardBody>

            {/* CardFooter with centered Date and Time */}
            <CardFooter className="flex justify-center gap-6">
              <div className="flex gap-4 items-center justify-center text-center">
                <p className="text-gray-600 flex gap-2">
                  <CiCalendarDate size={18} />
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 flex gap-2">
                  <IoMdTime size={18} /> {event.time}
                </p>
              </div>
            </CardFooter>

            {/* RSVP Button */}
            {event.availableSeats > 0 ? (
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => rsvpEvent(event._id)}  // Call RSVP function
                >
                  RSVP Now
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button 
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  disabled
                >
                  No Seats Available
                </button>
              </div>
            )}

            <Divider className="my-4" />
          </Card>
        ))
      ) : (
        <p className="text-center text-xl">Loading...</p>
      )}
    </div>
  );
}
