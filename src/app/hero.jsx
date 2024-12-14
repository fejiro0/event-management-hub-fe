 //@ts-nocheck
 
 "use client";

  import { IconButton, Button, Typography } from "@material-tailwind/react";
  import GradualSpacing from "@/components/ui/gradual-spacing";
  import Link from "next/link";
  import ShinyButton from "@/components/ui/shiny-button";

  function Hero() {
    return (
      <div className="relative min-h-screen w-full bg-[url('/image/Acity.jpg')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <Typography 
          variant="h2"
          color="red"
          >
            WELCOME TO
            </Typography>
          <GradualSpacing text="Acity Campus Event Management Hub"  
          className="font-bold text-4xl text-white pt-8"/>
          <Typography variant="paragraph" color="white" className="mt-8 text-md md:text-3xl">
          Booking workshops, seminars, and club activities <br/> with ease for both students and staff.
          </Typography>
          <div className="pt-8 flex items-center gap-4">
            <Link href='/login'>
            <ShinyButton>Get started</ShinyButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
    );
  }

  export default Hero;
