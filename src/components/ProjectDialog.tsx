import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, Send, Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface LinkField {
    title: string;
    url: string;
}

const ProjectDialog = ({ isDialogOpen, setIsDialogOpen }: any) => {
    const [newProject, setNewProject] = useState({ name: "", description: "" });
    const [linkFields, setLinkFields] = useState<LinkField[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            setErrorMessage(""); // Reset any previous errors

            const projectData = {
                name: newProject.name,
                description: newProject.description,
                links: linkFields.map((link) => ({
                    title: link.title,
                    originalUrl: link.url,
                    tags: "", // Tags can be handled if required
                })),
            };

            // Make the API request using axios
            const response = await axios.post("/api/projects", projectData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // If the request is successful, show success toast and reset the form
            if (response.status === 201) {
                toast.success("Project created successfully!");
                setIsDialogOpen(false);
                setNewProject({ name: "", description: "" });
                setLinkFields([]);
            }
        } catch (error: any) {
            console.error("Error creating project:", error);
            toast.error("An error occurred while creating the project.");
            setErrorMessage("An error occurred while creating the project.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
            <DialogContent className="bg-gray-900 text-white p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Create New Project</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Project Name"
                        className="bg-gray-800 text-white border-gray-600"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                    <Input
                        placeholder="Project Description"
                        className="bg-gray-800 text-white border-gray-600"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />

                    {linkFields.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-300">Links</h3>
                            {linkFields.map((link, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg">
                                    <Input
                                        placeholder="Title"
                                        className="bg-transparent text-white border-gray-600 flex-1"
                                        value={link.title}
                                        onChange={(e) => updateLinkField(index, "title", e.target.value)}
                                    />
                                    <Input
                                        placeholder="URL"
                                        className="bg-transparent text-white border-gray-600 flex-1"
                                        value={link.url}
                                        onChange={(e) => updateLinkField(index, "url", e.target.value)}
                                    />
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteLinkField(index)}
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button variant="outline" className="flex items-center text-black" onClick={handleAddLinkField}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Link
                    </Button>

                    {errorMessage && (
                        <div className="text-red-500 mt-2">{errorMessage}</div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        className="flex items-center"
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
