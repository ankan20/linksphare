"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import ProjectItem from "./ProjectItem";
const Dashboard = () => {
  const [projects, setProjects] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <header className="mb-6 mt-10">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-400">Create your projects and add important links.</p>
        <Button className="mt-4 absolute right-11" onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="w-5 h-5" />
          <span>Create New Project</span>
        </Button>
      </header>
    
      <Separator className="mb-4 mt-20" />

      <section>
      <h1 className="text-2xl font-bold mb-2  bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg ">List of your projects</h1>
        {projects.length === 0 ? (
          <p className="text-gray-400">No projects yet. Create one to get started!</p>
        ) : (
          projects.map((project:any, index:any) => (
            <ProjectItem project ={project} markAsDone={()=>{}} key={index}/>
          ))
        )}
      </section>
      <ProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}/>
    </div>
  );
};

export default Dashboard;
