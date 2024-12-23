"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiFillStar } from "react-icons/ai";
import { BiCoffee } from "react-icons/bi";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { setTheme } = useTheme();
  return (
    <div className="border-b">
      <div className="flex h-16 w-full items-center px-4 container mx-auto">
        {/* Left Section  */}
        <div className="font-bold text-2xl flex-1">
          <Link href="/" className="flex items-center">
            <span className="inline bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text drop-shadow-lg">
              LinkSphere🔗
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
          onClick={() => window.open("", "_blank")}
          className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <AiFillStar className="mr-1" />
          Star this project
        </Button>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
        {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4 mr-1" /> Light
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4 mr-1" /> Dark
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setTheme("system")}
                      >
                        <Laptop className="h-4 w-4 mr-1" /> System
                      </Button>
                    </div>
                  </div> */}
      </div>
    </div>
   </div >
  );
};

export default Navbar;
