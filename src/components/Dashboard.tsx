


"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [projects, setProjects] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data.user.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isDialogOpen]);

  const handleDelete = async (projectId: string) => {
    try {
      await axios.post(`/api/projects/${projectId}/delete`);
      setProjects((prevProjects: any) =>
        prevProjects.filter((project: any) => project._id !== projectId)
      );
      toast({ description: "Project deleted successfully." });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({ description: "Failed to delete the project.", variant: "destructive" });
    }
  };

  const filteredProjects = projects.filter((project: any) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProjects = projects.length;
  const doneProjects = projects.filter((project: any) => project.status === true).length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="w-48 h-8 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-[600px] bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-background/50 dark:bg-[#10101b] bg-[#f8f9fa]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your projects easily.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalProjects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{doneProjects}</p>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-4" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Projects</h2>
        <div className="flex items-center h-full gap-4 sm:flex-row flex-col">
        <Button
          className="w-full bg-gray-200 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Project</span>
        </Button>
        <Input
          type="text"
          placeholder="Search projects"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:w-40 w-full"
        />
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No projects found. Create one to get started!
          </p>
        ) : (
          filteredProjects.map((project: any, index: number) => (
            <Card key={index} className="relative">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={project.status === true}
                    onChange={() => {
                      const updatedProject = {
                        ...project,
                        status: project.status === true ? false : true,
                      };
                      setProjects((prevProjects: any) =>
                        prevProjects.map((proj: any) =>
                          proj._id === project._id ? updatedProject : proj
                        )
                      );
                      axios.put(`/api/projects/${project._id}`, updatedProject);
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {project.status === true ? "Done" : "In Progress"}
                  </span>
                </div>
              </CardContent>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleDelete(project._id)}
              >
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            </Card>
          ))
        )}
      </div>

      <ProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
};

export default Dashboard;
