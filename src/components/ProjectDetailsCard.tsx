"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableRow, TableHead, TableBody, TableCell, TableHeader } from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit, Trash, Tag, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import LinkDialog from "./LinkDialog";
import LinkEditDialog from "./LinkEditDialog";
import AlertCard from "./AlertCard";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";


const ITEMS_PER_PAGE = 10;

const ProjectDetailsCard = ({ id }: { id: any }) => {
  const [project, setProject] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpenAddLink, setIsDialogOpenAddLink] = useState(false);
  const [isDialogOpenEditLink, setIsDialogOpenEditLink] = useState(false);
  const [linkId,setLinkId]=useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting,setIsDeleting] = useState(false);
  const { toast } = useToast();

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails(id);
    }
  }, [id, isDialogOpenAddLink,isDialogOpenEditLink]);

  const handleDeleteLink = async (linkId: any,projectId:any) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/projects/${projectId}/links/${linkId}`);
      fetchProjectDetails(id); 
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
    finally{
      setIsDeleting(false);
      setIsAlertOpen(false);
    }
  };

   function filterLinks(links:[], searchQuery:string) {
    const query = searchQuery.toLowerCase();
    console.log(query)
    return links.filter((link:any) => 
      link.title.toLowerCase().includes(query) ||
      (link.tags && link.tags.some((tag:any) => tag.toLowerCase().includes(query)))
    );
  }

  const filteredLinks =filterLinks(links,searchQuery);

  const paginatedLinks = filteredLinks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE);
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="w-48 h-8 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="h-[600px] bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/50 min-h-[90vh] p-6 rounded-lg">
      <Card className="w-full">
        <CardHeader>
          <h2 className="dark:text-white font-semibold">Project Details</h2>
          <CardTitle>
            {project.name}
          </CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-6">
              <CardTitle>Total Links</CardTitle>
              <CardDescription>Total number of links added to this project till now.</CardDescription>
              <CardContent className="mt-4">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{links?.length}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-start gap-5">
            <Input
              type="text"
              placeholder="Search links"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-96  text-black dark:text-white dark:bg-black bg-slate-100"
            />
            <Button
              className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsDialogOpenAddLink(true)}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Link</span>
            </Button>
          </div>
          {
            paginatedLinks.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No links found , try something else?
              </div>
            ) :
              (
                <div className="rounded-md border">
                  <Table >
                    <TableHeader >
                      <TableRow >
                        <TableHead>Title</TableHead>
                        <TableHead>Original URL</TableHead>
                        <TableHead>Shortened URL</TableHead>
                        <TableHead>Total Clicks</TableHead>
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
                              onClick={() => {
                                const fullUrl = `${window.location.origin}/${link.shortUrl}`; // Construct the full URL
                                navigator.clipboard.writeText(fullUrl)
                                  .then(() => {
                                    toast({
                                      title: "Copied!",
                                      description: "The short URL has been copied to your clipboard.",
                                      variant: "success",
                                    });
                                  })
                                  .catch(() => {
                                    toast({
                                      title: "Error",
                                      description: "Failed to copy the URL. Please try again.",
                                      variant: "destructive",
                                    });
                                  });
                              }}
                              variant="ghost"
                              className="text-green-400"
                            >
                              <Copy size={16} />
                            </Button>
                          </TableCell>
                          <TableCell>{link.clicks}</TableCell>
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
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={()=>{setIsAlertOpen(true);setLinkId(link.id)}}
                              variant="ghost"
                              className="text-red-400"
                            >
                              <Trash size={16} />
                            </Button>
                            <Button variant="ghost" className="text-yellow-400" onClick={()=>{setIsDialogOpenEditLink(true);
                              setLinkId(link.id);
                            }}>
                              <Edit size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
          }

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
        </CardContent>
      </Card>
      <LinkDialog isDialogOpen={isDialogOpenAddLink} setIsDialogOpen={setIsDialogOpenAddLink} projectId={id} />
      <LinkEditDialog isDialogOpen={isDialogOpenEditLink} setIsDialogOpen={setIsDialogOpenEditLink} projectId={id} linkId={linkId} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
          <AlertDialogDescription>
          Are you sure you want to delete this link? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2">
            <AlertDialogCancel
              onClick={() => setIsAlertOpen(false)} // Close dialog if cancel
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteLink(linkId,id)} // Proceed with deletion
              disabled={isDeleting}
            >
              {isDeleting? "Deleting...":"Delete"}
              
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetailsCard;
