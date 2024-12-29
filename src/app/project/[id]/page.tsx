"use client"
import ProjectDetailsCard from "@/components/ProjectDetailsCard"
import { useParams } from "next/navigation";

const page = () => {
   const params = useParams();
    const { id } =params ;
  return (
    <>
      <ProjectDetailsCard id={id}/>
    </>
  )
}

export default page
