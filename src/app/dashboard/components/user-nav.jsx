import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york/ui/avatar";
import { Button } from "@/registry/new-york/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu";
import cookies from "js-cookies";
import { useState, useEffect } from "react";

export function UserNav() {
  const [userData, setUserData] = useState({ token: "", name: "" });

  useEffect(() => {
    const data = {
      token: localStorage.getItem("authToken"),
      name: localStorage.getItem("name"),
    };
    setUserData(data);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken"); // Clear the token
    localStorage.removeItem("name"); // Clear the user name
    window.location.reload(); // Reload or redirect to login page
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* Dynamic avatar */}
            <AvatarImage src="/avatars/01.png" alt={userData.name || "Avatar"} />
            <AvatarFallback>
              {userData.name ? userData.name[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData.name || "Guest User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.token ? "Logged in" : "Not logged in"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="bg-red-500 hover:bg-red-700">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
