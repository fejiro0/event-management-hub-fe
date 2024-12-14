'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/registry/new-york/ui/button";
import { Tabs, TabsContent } from "@/registry/new-york/ui/tabs";
import { MainNav } from "@/app/dashboard/components/main-nav";
import { Search } from "@/app/dashboard/components/search";
import { UserNav } from "@/app/dashboard/components/user-nav";
import Event from "@/components/Event";
import { format } from "date-fns";
import axios from "axios";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]); // Track shared events
  const [error, setError] = useState(null); // Track errors, if any

  useEffect(() => {
    // Fetch all events
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setAllEvents(response.data); // Assuming the response contains all events
      } catch (err) {
        setError("Failed to load events. Please try again.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const date = new Date();
  const formattedDate = format(date, "MMMM dd, yyyy");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
