import prisma  from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { isWebUri } from 'valid-url';

// Fetch link details
export async function GET(req:NextRequest, { params }:{params:{linkId:string}}) {
  const { userId } = getAuth(req);
  const { linkId } =await params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { 
        id: linkId,
        project: {
            user: {
              clerkUserId: userId,
            },
          }, 

      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(link, { status: 200 });
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json({ error: 'Error fetching link details.' }, { status: 500 });
  }
}

// Update link details
export async function POST(req:NextRequest, { params }:{params:{linkId:string,projectId:string}}) {
    const { userId } = getAuth(req);
    const { linkId, projectId } = await params;
  
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const { title, originalUrl, tags } = await req.json();

      if(!title){
        return NextResponse.json(
            { error: "Please provide a Title." },
            { status: 400 }
        );
      }
      else if(!originalUrl || !isWebUri(originalUrl)){
            return NextResponse.json(
                { error: "Please provide a valid URL." },
                { status: 400 }
            );
      }
      else if(!Array.isArray(tags)){
        return NextResponse.json(
            { error: "Please provide valid tags." },
            { status: 400 }
        );
      }
  
    //   if (!title || !originalUrl || !Array.isArray(tags)) {
    //     return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    //   }
  
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          user: {
            clerkUserId: userId, 
          },
        },
      });
  
      if (!project) {
        return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
      }
  
      // Check if the link belongs to the project
      const link = await prisma.link.findFirst({
        where: {
          id: linkId,
          projectId: projectId,
        },
      });
  
      if (!link) {
        return NextResponse.json({ error: 'Link not found in this project' }, { status: 404 });
      }
  
      const updatedLink = await prisma.link.update({
        where: { id: linkId },
        data: {
          title,
          originalUrl,
          tags,
        },
      });
  
      return NextResponse.json(updatedLink, { status: 200 });
    } catch (error) {
      console.error('Error updating link:', error);
      return NextResponse.json({ error: 'Error updating link.' }, { status: 500 });
    }
  }