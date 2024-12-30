import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { ensureUserInDatabase } from '@/lib/ensureUserInDatabase';
import { nanoid } from 'nanoid'; // Import nanoid for generating short URLs
import { isWebUri } from 'valid-url';

export async function POST(req: NextRequest) {
  try {
    const user = await ensureUserInDatabase();
    const { name, description, links } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ message: 'Name and description are required.' }, { status: 400 });
    }
    for (const link of links) {
      if (!isWebUri(link.originalUrl)) {
        return NextResponse.json({ error: `Invalid URL: ${link.originalUrl}` }, { status: 400 });
      }
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    });

    // const host = req.headers.get('host');
    // const protocol = req.headers.get('x-forwarded-proto') || 'http'; //  protocol (HTTP or HTTPS)
    // const defaultDomain = `${protocol}://${host}`;

    // const baseDomain = user.isMonetized ? user.customDomain : defaultDomain;

    if (links && links.length > 0) {
      const linkData = links.map((link: { title: string; originalUrl: string; tags: string[] }) => (
        {
          title: link.title,
          originalUrl: link.originalUrl,
          tags: link.tags || [],
          projectId: project.id,
          // shortUrl: `${baseDomain}/${nanoid(8)}`,
          shortUrl:nanoid(8),
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
    return NextResponse.json({ error: 'Internal server error', originalError: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    return NextResponse.json({ error: "Internal server error", originalError: error }, { status: 500 });
  }
}

