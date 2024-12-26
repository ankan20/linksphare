"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeader } from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit, Trash, Tag } from "lucide-react"; // Import icons from lucide-react

const ITEMS_PER_PAGE = 10;

const ProjectDetailsCard = ({ id }: { id: any }) => {
  const [project, setProject] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [tags, setTags] = useState<any>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: any) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data.project);
      setLinks(response.data.links);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    }
  };

  const handleTagAddition = async (linkId: any, newTags: any) => {
    try {
      await axios.put(`/api/links/${linkId}/tags`, { tags: newTags });
      fetchProjectDetails(id); // Refresh data
      toast({
        title: "Success",
        description: "Tags added successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tags",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (linkId: any) => {
    try {
      await axios.delete(`/api/links/${linkId}`);
      fetchProjectDetails(id); // Refresh data
      toast({
        title: "Success",
        description: "Link deleted successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  const filteredLinks = links.filter((link: any) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="dark:bg-[#10101b] bg-[#f8f9fa] min-h-screen p-6 rounded-lg">
      {project && (
        <>
          <div className="mb-6">
            <h2 className="text-white font-semibold">Project Details</h2>
            <h1 className="text-2xl font-bold text-white mb-4">{project.name}</h1>
            <p className="text-white mb-6">{project.description}</p>
          </div>

          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search links"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-dark text-white border-none"
            />
          </div>

          <Table >
            <TableHeader >
              <TableRow >
                <TableHead>Title</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Shortened URL</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLinks.map((link: any) => (
                <TableRow key={link.id} >
                  <TableCell>{link.title}</TableCell>
                  <TableCell>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {link.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    {link.shortUrl}
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(link.shortUrl)
                      }
                      variant="ghost"
                      className="text-green-400"
                    >
                      <Copy size={16} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {link.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          <Tag size={14} />
                          {tag}
                        </span>
                      ))}
                      <Input
                        type="text"
                        placeholder="Add tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="bg-dark text-white"
                      />
                      <Button
                        onClick={() => handleTagAddition(link.id, tags)}
                        className="ml-2 text-blue-400"
                      >
                        <Tag size={16} />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleDeleteLink(link.id)}
                      variant="ghost"
                      className="text-red-400"
                    >
                      <Trash size={16} />
                    </Button>
                    <Button variant="ghost" className="text-yellow-400">
                      <Edit size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        </>
      )}
    </div>
  );
};

export default ProjectDetailsCard;
