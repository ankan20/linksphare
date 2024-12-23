"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, Send, Trash } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface LinkField {
    title: string;
    url: string;
}

const ProjectDialog = ({ isDialogOpen, setIsDialogOpen }: any) => {
    const [newProject, setNewProject] = useState({ name: "", description: "" });
    const [linkFields, setLinkFields] = useState<LinkField[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {toast }= useToast();

    const handleAddLinkField = () => {
        setLinkFields([...linkFields, { title: "", url: "" }]);
    };

    const updateLinkField = (index: number, field: "title" | "url", value: string) => {
        const updatedLinks = [...linkFields];
        updatedLinks[index][field] = value;
        setLinkFields(updatedLinks);
    };

    const handleDeleteLinkField = (index: number) => {
        const updatedLinks = linkFields.filter((_, idx) => idx !== index);
        setLinkFields(updatedLinks);
    };

    const handleAddProject = async () => {
        try {
            setIsSubmitting(true);
            setErrorMessage("");

            const projectData = {
                name: newProject.name,
                description: newProject.description,
                links: linkFields.map((link) => ({
                    title: link.title,
                    originalUrl: link.url,
                    tags: [],
                })),
            };

            const response = await axios.post("/api/projects", projectData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                toast({
                    title: "Project Created Successfully",
                    variant: "default",
                    description: "Your project has been created successfully.",
                  });
                setIsDialogOpen(false);
                setNewProject({ name: "", description: "" });
                setLinkFields([]);
            }
        } catch (error: any) {
            console.error("Error creating project:", error);
            toast({
                title: "Error creating project",
                variant: "destructive",
                description: error.response.data.message || "An error occurred while creating the project.",
            })
            setErrorMessage(error.response.data.message || "An error occurred while creating the project.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewProject({ name: "", description: "" });
        setLinkFields([]);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="p-6 rounded-lg bg-white text-black dark:bg-gray-900 dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Project Name"
                        className="border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <Input
                        placeholder="Project Description"
                        className="border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />

                    {linkFields.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-700 dark:text-gray-300">Links</h3>
                            {linkFields.map((link, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <Input
                                        placeholder="Title"
                                        className="flex-1 border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-white"
                                        value={link.title}
                                        onChange={(e) => updateLinkField(index, "title", e.target.value)}
                                    />
                                    <Input
                                        placeholder="URL"
                                        className="flex-1 border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-white"
                                        value={link.url}
                                        onChange={(e) => updateLinkField(index, "url", e.target.value)}
                                    />
                                    <button
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                        onClick={() => handleDeleteLinkField(index)}
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        variant="outline"
                        className="flex items-center border-gray-300 dark:border-gray-600"
                        onClick={handleAddLinkField}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Link
                    </Button>

                    {errorMessage && (
                        <div className="text-red-500 mt-2">{errorMessage}</div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        className="flex items-center bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-800 dark:hover:bg-purple-900"
                        onClick={handleAddProject}
                        disabled={isSubmitting}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDialog;
