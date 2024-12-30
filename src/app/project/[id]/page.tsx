"use client"
import ProjectDetailsCard from "@/components/ProjectDetailsCard"
import { useParams } from "next/navigation";

const page:React.FC = () => {
   const params = useParams();
    const { id } =params ;
  return (
    <>
      <ProjectDetailsCard id={id}/>
    </>
  )
}

export default page
