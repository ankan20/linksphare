// 'use client'

// import { usePathname } from "next/navigation";
// import Navbar from "./Navbar";

// const NavbarWrapper = () => {
//     const urlPath = usePathname();

//     // Define paths where the Navbar should be hidden
//     const hideNavbarPaths = ['sign-in', 'sign-up', '/[shortUrl]'];
//     const showNavbarPaths =['dashboard','project']

//     const shouldHideNavbar = hideNavbarPaths.some(path => urlPath.includes(path));

//     return (
//         <>
//             {!shouldHideNavbar && <Navbar />}
//         </>
//     );
// };

// export default NavbarWrapper;
'use client'

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
    const urlPath = usePathname();

    // Paths to show the Navbar
    const shouldShowNavbar =
        urlPath.startsWith('/dashboard') || 
        urlPath.startsWith('/project') || 
        urlPath === '/'; // Shows Navbar in the root route

    return (
        <>
            {shouldShowNavbar && <Navbar />}
        </>
    );
};

export default NavbarWrapper;
