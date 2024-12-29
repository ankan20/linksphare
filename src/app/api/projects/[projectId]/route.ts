import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const { projectId } =await  params;

  try {
    // Get logged-in user's Clerk ID
    const {userId} = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch project details, ensuring it belongs to the logged-in user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          clerkUserId: userId, 
        },
      },
      include: { links: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Return project details and links
    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        done: project.done,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      links: project.links,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}
