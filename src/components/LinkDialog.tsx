"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, Send, Tag, Trash } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const LinkDialog = ({ isDialogOpen, setIsDialogOpen, projectId }: any) => {
    const [title, setTitle] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [isTagInputVisible, setIsTagInputVisible] = useState(false);
    const [currentTag, setCurrentTag] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const { toast } = useToast();
    useEffect(()=>{
        setErrorMessage("");
    },[isDialogOpen])

    const addTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag("");
        }
        setIsTagInputVisible(false);
    };

    const deleteTag = (index: number) => {
        const updatedTags = tags.filter((_, tagIndex) => tagIndex !== index);
        setTags(updatedTags);
    };

    const handleAddLink = async () => {
        try {
            setIsSubmitting(true);
            setErrorMessage("");

            const linkData = {
                title,
                url,
                tags,
            };

            const response = await axios.post(`/api/projects/${projectId}/links`, linkData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                toast({
                    title: "Link Added Successfully",
                    variant: "default",
                    description: "Your link has been added successfully.",
                });
                setIsDialogOpen(false);
                setTitle("");
                setUrl("");
                setTags([]);
            }
        } catch (error: any) {
            console.error("Error adding link:", error);
            toast({
                title: "Error adding link",
                variant: "destructive",
                description: error.response?.data?.error || "An error occurred.",
            });
            setErrorMessage(error.response?.data?.error || "An error occurred.")
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setTitle("");
        setUrl("");
        setTags([]);
        setIsTagInputVisible(false);
        setCurrentTag("");
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="p-6 rounded-lg bg-white text-black dark:bg-gray-900 dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Add Link</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Title"
                        className="border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-white"
                        value={title}
                        disabled={isSubmitting}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                        placeholder="URL"
                        className="border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-white"
                        value={url}
                        disabled={isSubmitting}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="flex items-center bg-yellow-200 px-3 py-1 rounded-full text-sm text-black"
                                >
                                    {tag}
                                    <button
                                        onClick={() => deleteTag(index)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        disabled={isSubmitting}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        {isTagInputVisible ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Enter tag"
                                    className="border-gray-300 dark:border-gray-600 dark:bg-transparent"
                                    value={currentTag}
                                    disabled={isSubmitting}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                />
                                <Button
                                    className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                                    onClick={addTag}
                                    disabled={isSubmitting}
                                >
                                    Add
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                                onClick={() => setIsTagInputVisible(true)}
                                disabled={isSubmitting}
                            >
                                <Tag size={14} /> Add Tag
                            </Button>
                        )}
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 mt-2">{errorMessage}</div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        className="flex items-center bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-800 dark:hover:bg-purple-900"
                        onClick={handleAddLink}
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

export default LinkDialog;
