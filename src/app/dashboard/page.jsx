'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/registry/new-york/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import { CalendarDateRangePicker } from "@/app/dashboard/components/date-range-picker";
import { MainNav } from "@/app/dashboard/components/main-nav";
import { Search } from "@/app/dashboard/components/search";
import { UserNav } from "@/app/dashboard/components/user-nav";
import Event from "@/components/Event";
import { format } from "date-fns";
import axios from "axios";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track user's authentication status
  const [userEvents, setUserEvents] = useState([]);  // Track user-specific events (RSVPs)
  const [allEvents, setAllEvents] = useState([]);  // Track shared events
  const router = useRouter();
  
  useEffect(() => {
    // Function to check if user is authenticated
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");  // Assume the token is stored in localStorage
      if (token) {
        setIsAuthenticated(true);  // Set authenticated if token is found
        fetchUserData(token);  // Fetch user-specific data if authenticated
      } else {
        setIsAuthenticated(false);  // Set not authenticated
        router.push("/login");  // Redirect to login page if not authenticated
      }
      setLoading(false);  // Once check is done, stop loading
    };
    
    checkAuthStatus();
  }, [router]);

  // Fetch user's RSVP data and all events
  const fetchUserData = async (token) => {
    try {
      // Fetch user-specific events (RSVPs) and shared events
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Assuming the response contains user events and all events
      setUserEvents(response.data.userEvents);  // User's RSVPed events
      setAllEvents(response.data.allEvents);  // All shared events
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // If still loading, show a loading spinner or message
  if (loading) {
    return <div>Loading...</div>;
  }

  const date = new Date();
  const formattedDate = format(date, "MMMM dd, yyyy");

  return (
    <>
      {/* Mobile View Image */}
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            {/* Main Nav */}
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* Dashboard Title and Date */}
          <div className="flex items-center justify-between space-y-2 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2 bg-slate-200 px-4 py-2 rounded-lg shadow-xs">
              {formattedDate}
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Show RSVPed Events */}
              <div>
                <h3 className="text-xl font-semibold">Your RSVPs</h3>
                <div>
                  {userEvents.length > 0 ? (
                    userEvents.map((event) => (
                      <Event key={event.id} event={event} />
                    ))
                  ) : (
                    <p>You have not RSVPed to any events yet.</p>
                  )}
                </div>
              </div>

              {/* Show All Events */}
              <div>
                <h3 className="text-xl font-semibold">All Events</h3>
                <div>
                  {allEvents.length > 0 ? (
                    allEvents.map((event) => (
                      <Event key={event.id} event={event} />
                    ))
                  ) : (
                    <p>No events available at the moment.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
