'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusCircle, Send, Tag, Trash, Loader } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const LinkEditDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  projectId,
  linkId,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  projectId: string;
  linkId: string;
}) => {
  const [title, setTitle] = useState<string>('');
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isDialogOpen && linkId) {
      fetchLinkDetails();
    }
  }, [isDialogOpen, linkId]);

  const fetchLinkDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/projects/${projectId}/links/${linkId}`);
      const { title, originalUrl, tags } = response.data;
      setTitle(title);
      setOriginalUrl(originalUrl);
      setTags(tags || []);
      setErrorMessage('');
    } catch (error: any) {
      console.error('Error fetching link details:', error);
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Unable to fetch link details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
    setIsTagInputVisible(false);
  };

  const deleteTag = (index: number) => {
    const updatedTags = tags.filter((_, tagIndex) => tagIndex !== index);
    setTags(updatedTags);
  };

  const handleUpdateLink = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const linkData = {
        title,
        originalUrl,
        tags,
      };

      const response = await axios.post(
        `/api/projects/${projectId}/links/${linkId}`,
        linkData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Link Updated Successfully',
          variant: 'success',
          description: 'Your link has been updated successfully.',
        });
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error updating link:', error);
      toast({
        title: 'Error updating link',
        variant: 'destructive',
        description: error.response?.data?.error || 'An error occurred.',
      });
      setErrorMessage(error.response?.data?.error || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
      setCurrentTag('');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTitle('');
    setOriginalUrl('');
    setTags([]);
    setIsTagInputVisible(false);
    setCurrentTag('');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="p-6 rounded-lg bg-white text-black dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Link</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin w-8 h-8 text-gray-500 dark:text-gray-300" />
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder="Title"
              className="border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              placeholder="URL"
              className="border-gray-300 dark:bg-transparent dark:border-gray-600 dark:text-white"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-yellow-200 px-3 py-1 rounded-full text-sm text-black"
                  >
                    {tag}
                    {!isSubmitting && (
                      <button
                        onClick={() => deleteTag(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {!isSubmitting && isTagInputVisible && (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter tag"
                    className="border-gray-300 dark:border-gray-600 dark:bg-transparent"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                  />
                  <Button
                    className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                    onClick={addTag}
                  >
                    Add
                  </Button>
                </div>
              )}
              {!isSubmitting && !isTagInputVisible && (
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => setIsTagInputVisible(true)}
                >
                  <Tag size={14} /> Add Tag
                </Button>
              )}
            </div>
            {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            className="flex items-center bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-800 dark:hover:bg-purple-900"
            onClick={handleUpdateLink}
            disabled={isSubmitting || loading}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkEditDialog;
