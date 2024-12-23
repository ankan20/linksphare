"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiFillStar } from "react-icons/ai";
import { BiCoffee } from "react-icons/bi";
import { ModeToggle } from "./ModeToggle";
import { FaStar } from "react-icons/fa";
const Navbar = () => {
  return (
    <div className="w-full border-b h-16 sticky top-0 z-50 lg:px-4 px-2 backdrop-filter backdrop-blur-xl bg-opacity-5">
      <div className="flex h-full items-center px-4 container mx-auto">
        {/* Left Section  */}
        <div className="font-bold text-2xl flex-1">
          <Link href="/" >
            <span className="inline bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text drop-shadow-lg">
              LinkSphare🔗
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.open("https://buymeacoffee.com/ankan_21", "_blank")}
           className = "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
           size = "icon"
              >
              <BiCoffee className="h-5 w-5" />
         </Button>
        <Button
          variant="outline"
          onClick={() => window.open("https://github.com/ankan20/linksphare", "_blank")}
          className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {/* <AiFillStar className="mr-1" /> */}
          <FaStar className="text-yellow-500 text-2xl mr-1" />
          <span className="hidden sm:block">Star this project</span>
        </Button>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </div>
    </div>
   </div >
  );
};

export default Navbar;
