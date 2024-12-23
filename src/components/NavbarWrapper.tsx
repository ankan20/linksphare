'use client'

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"

const NavbarWrapper = () => {
    const urlPath = usePathname();
  return (
    <>
        {!(urlPath.includes('sign-in') || urlPath.includes('sign-up')) && <Navbar />}
    </>
  )
}

export default NavbarWrapper
