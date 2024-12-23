"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash, ExternalLink } from "lucide-react";
import ProjectDialog from "./ProjectDialog";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importing Shadcn Table
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [projects, setProjects] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6);
  const router = useRouter();

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
  
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
  
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
        // timeZoneName: "short",
      };
  
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

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

  useEffect(() => {
    fetchProjects();
  }, [isDialogOpen]);

  const handleDelete = async (projectId: string) => {
    try {
      const response = await axios.post(`/api/project-delete/${projectId}`);
      setProjects((prevProjects: any) =>
        prevProjects.filter((project: any) => project.id !== projectId)
      );
      toast({ description: response.data?.message || "Project deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        description: error?.response?.data.error || "Failed to delete the project.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsDone = async (projectId: string, status: boolean) => {
    const updatedProject = {
      status: !status,
    };
    try {
      const response = await axios.post(`/api/project-status/${projectId}`, updatedProject);
      setProjects((prevProjects: any) =>
        prevProjects.map((project: any) =>
          project.id === projectId ? { ...project, done: !status } : project
        )
      );
      toast({ description: `Project marked as ${!status ? "done" : "in progress"}.` });
    } catch (error: any) {
      console.error("Error updating project status:", error);
      toast({
        description: error?.response?.data.error || "Failed to update project status.",
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects
    .filter((project: any) =>
      project.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    .filter((project: any) => {
      if (filterStatus === "all") return true;
      return filterStatus === "done" ? project.done : !project.done;
    });

  // Pagination Logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const totalProjects = projects.length;
  const doneProjects = projects.filter((project: any) => project.done === true).length;

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
        <div className="flex flex-col sm:flex-row  items-start sm:items-center gap-4">
          <Button
            className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
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
            className=""
          />
          <Select onValueChange={(value) => setFilterStatus(value)} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shadcn Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400">
                No projects found. Create one to get started!
              </TableCell>
            </TableRow>
          ) : (
            currentProjects.map((project: any) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div className="flex items-center">
                    <span>{project.name}</span>
                    <Button
                      variant="link"
                      size="icon"
                      className="ml-2"
                      onClick={() => router.push(`/project/${project.id}`)}
                    >
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{formatDate(project.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={project.done}
                      onChange={() => handleMarkAsDone(project.id, project.done)}
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {project.done ? "Done" : "In Progress"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      <ProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
    </div>
  );
};

export default Dashboard;
