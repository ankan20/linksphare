import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; 
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: any) {
  const { projectId } = await params;

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { status } = body;

    if (typeof status !== "boolean") {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Check if the project exists and belongs to the user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project || project.user.clerkUserId !== userId) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    // Update the project status
    await prisma.project.update({
      where: { id: projectId },
      data: { done: status },
    });

    return NextResponse.json({ message: "Project status updated successfully" });
  } catch (error) {
    console.error("Error updating project status:", error);
    return NextResponse.json({ error: "Failed to update project status" }, { status: 500 });
  }
}
