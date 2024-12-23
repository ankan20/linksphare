import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { ensureUserInDatabase } from '@/lib/ensureUserInDatabase';
import { nanoid } from 'nanoid'; // Import nanoid for generating short URLs

export async function POST(req: NextRequest) {
    try {
        const user = await ensureUserInDatabase();
        const { name, description, links } = await req.json();

        if (!name || !description) {
            return NextResponse.json({ message: 'Name and description are required.' }, { status: 400 });
        }

        // First, create the project
        const project = await prisma.project.create({
            data: {
                name,
                description,
                userId: user.id,
            },
        });

        // Create links if provided
        if (links && links.length > 0) {
            const linkData = links.map((link: { title: string; originalUrl: string; tags: string[] }) => ({
                title: link.title,
                originalUrl: link.originalUrl,
                tags: link.tags || [],  // Default to an empty array if no tags are provided
                projectId: project.id,
                shortUrl: nanoid(8),  // Generate a short URL with nanoid
            }));

            // Bulk create the links
            await prisma.link.createMany({
                data: linkData,
            });
        }

        return NextResponse.json({
            message: 'Project created successfully.',
            project,
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
      // Get the authenticated user's information from Clerk
      const { userId } = getAuth(req);
  
      if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      // Fetch the logged-in user details and their associated projects
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        include: {
          projects: {
            include: {
              links: true, // Include the associated links for each project
            },
          },
        },
      });
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // Restructure and sort the projects array
      const sortedProjects = [
        ...user.projects.filter((project) => !project.done).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
        ...user.projects.filter((project) => project.done).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      ];
  
      // Return the logged-in user details with the sorted projects
      return NextResponse.json(
        {
          user: {
            ...user,
            projects: sortedProjects,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching user and projects:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }
  
