'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {Skeleton} from "@nextui-org/skeleton";
import { Button } from "@/registry/new-york/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import { MainNav } from "@/app/dashboard/components/main-nav";
import { Search } from "@/app/dashboard/components/search";
import { UserNav } from "@/app/dashboard/components/user-nav";
import Event from "@/components/Event";
import { format } from "date-fns";
import axios from "axios";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          // Change to a GET request to validate the token, not POST to login
          await axios.get('https://campus-event-management-hub.onrender.com/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAuthenticated(true);
          await fetchEvents(token);
        } catch (error) {
          console.error("Invalid or expired token:", error);
          localStorage.removeItem("authToken");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }

      setLoading(false); // Set loading to false after the auth check completes
    };

    checkAuthStatus();
  }, [router]);

  const fetchEvents = async (token) => {
    try {
      const response = await axios.get('https://campus-event-management-hub.onrender.com/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllEvents(response.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setAllEvents([]);
    }
  };

  if (loading) {
    return <div className="m-auto text-center"><Skeleton /></div>;
  }

  const date = new Date();
  const formattedDate = format(date, "MMMM dd, yyyy");

  return (
    <>
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

      <div className="hidden md:flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2 mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2 bg-slate-200 px-4 py-2 rounded-lg shadow-xs">
              {formattedDate}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">All Events</h3>
                <div>
                  {allEvents.length > 0 ? (
                    allEvents.map((event) => (
                      <Event key={event._id} event={event} />
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
