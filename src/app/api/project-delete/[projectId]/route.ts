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

    // Verify if the project belongs to the authenticated user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project || project.user?.clerkUserId !== userId) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete the project" }, { status: 500 });
  }
}
