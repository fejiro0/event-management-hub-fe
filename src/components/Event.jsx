'use client';

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { GiRockingChair } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";  
import { IoMdTime } from "react-icons/io";
import { Card, CardHeader, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";



export default function Event() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);  // State to hold logged-in user

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://campus-event-management-hub.onrender.com/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1])); // Decode the token
        setUser(decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null); // Ensure user is null if decoding fails
      }
    }
  }, []);

  const rsvpEvent = async (eventId) => {
    if (!user) {
      alert("You need to be logged in to RSVP.");
      return;
    }

    try {
      const response = await axios.post('https://campus-event-management-hub.onrender.com/api/events/rsvp', {
        eventId,
        userId: user._id,
        userName: user.fullName,
      });

      if (response.data.success) {
        setEvents((prevEvents) => 
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, availableSeats: event.availableSeats - 1 }
              : event
          )
        );
        alert('RSVP Successful!');
      } else {
        alert(response.data.message || 'Failed to RSVP.');
      }
    } catch (error) {
      console.error('Error RSVPing for event:', error);
      alert('Error RSVPing for event');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {events.length > 0 ? (
        events.map((event, index) => (
          <Card key={index} className="mb-6">
            <CardHeader className="flex items-center justify-between">
              {/* Event Info on the Left */}
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-default-600">{event.name}</h3>
                <p className="text-sm text-default-400 flex items-center gap-2">
                  <IoLocationSharp size={16} /> {event.location}
                </p>
                <p className="text-sm text-default-400 flex items-center gap-2">
                  <CiCalendarDate size={16} /> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-default-400 flex items-center gap-2">
                  <IoMdTime size={16} /> {event.time}
                </p>
              </div>

              {/* Available Seats in the Center */}
              <div className="text-center">
                <h5 className="text-lg font-bold flex items-center gap-2">
                  <GiRockingChair size={20} /> {event.availableSeats}
                </h5>
              </div>

              {/* RSVP Button on the Right */}
              <div>
                {event.availableSeats > 0 ? (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() => rsvpEvent(event._id)}
                  >
                    RSVP Now
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                    disabled
                  >
                    No Seats Available
                  </button>
                )}
              </div>
            </CardHeader>

            <CardBody className="px-3 py-2 text-sm text-default-400">
              <p>{event.description}</p>
            </CardBody>

            <Divider className="my-4" />
          </Card>
        ))
      ) : (
        <p className="text-center text-xl"><Skeleton /></p>
      )}
    </div>
  );
}
