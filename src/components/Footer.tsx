// 'use client'
// import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
// import { BsHeart } from "react-icons/bs"; 
// import { FC } from "react";
// import { Button } from "./ui/button";
// import { usePathname } from "next/navigation";

// const Footer: FC = () => {

//   const urlPath = usePathname();

//     const shouldShowFooter =
//         urlPath.startsWith('/dashboard') || 
//         urlPath.startsWith('/project') || 
//         urlPath === '/'; 

//   return (
//     <>
//         {shouldShowFooter && (
//             <footer className="w-full bg-transparent py-6 mt-10">
//             <div className="flex items-center justify-between max-w-4xl px-4 mx-auto">
//             <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
//                 <span>Made with</span>
//                 <BsHeart className="text-red-500" size={16} />
//                 <span>by Ankan</span>
//               </div>
//               <div className="flex gap-6">
//                 <a
//                   href="https://www.linkedin.com/in/ankan-das/"
//                   target="_blank"
//                   className="no-underline"
//                 >
//                   <Button
//                     variant="ghost"
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     <FaLinkedin size={24} />
//                   </Button>
//                 </a>
      
//                 <a
//                   href="https://github.com/ankan20"
//                   target="_blank"
//                   className="no-underline"
//                 >
//                   <Button
//                     variant="ghost"
//                     className="text-gray-800 hover:text-gray-600"
//                   >
//                     <FaGithub size={24} />
//                   </Button>
//                 </a>
      
//                 <a
//                   href="https://twitter.com/AnkanDas_"
//                   target="_blank"
//                   className="no-underline"
//                 >
//                   <Button
//                     variant="ghost"
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <FaTwitter size={24} />
//                   </Button>
//                 </a>
//               </div>
      
              
//             </div>
//           </footer>)}
//     </>
    
//   );
// };

// export default Footer;
'use client';
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { BsHeart } from "react-icons/bs"; 
import { FC } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Footer: FC = () => {
  const urlPath = usePathname();

  const shouldShowFooter =
    urlPath.startsWith('/dashboard') ||
    urlPath.startsWith('/project') ||
    urlPath === '/'; 

  return (
    <>
      {shouldShowFooter && (
        <footer className="w-full border-b -mt-5 z-50 lg:px-4 px-2 backdrop-filter backdrop-blur-xl bg-opacity-5">
          <div className="flex items-center justify-between max-w-4xl px-4 mx-auto">
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <BsHeart className="text-red-500" size={16} />
              <span>by Ankan</span>
            </div>
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/in/ankan-das-b3ba4022b/"
                target="_blank"
                className="no-underline"
              >
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaLinkedin size={24} />
                </Button>
              </a>

              <a
                href="https://github.com/ankan20/"
                target="_blank"
                className="no-underline"
              >
                <Button
                  variant="ghost"
                  className="text-gray-800 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <FaGithub size={24} />
                </Button>
              </a>

              <a
                href="https://x.com/ankan__20"
                target="_blank"
                className="no-underline"
              >
                <Button
                  variant="ghost"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaTwitter size={24} />
                </Button>
              </a>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
