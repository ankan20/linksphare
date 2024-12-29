import { nanoid } from "nanoid";
import { isWebUri } from "valid-url";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const { projectId } = params;
        // Get logged-in user's Clerk ID
        const { userId } = getAuth(req);

        

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const body = await req.json(); 
        let user = await prisma.user.findUnique({
            where: { clerkUserId: userId as string },
          });
        if(!user){
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body. Expecting JSON object." },
                { status: 400 }
            );
        }

        const { title, url, tags } = body;
        if(!title){
            return NextResponse.json(
                { error: "Please provide a Title." },
                { status: 400 }
            );
        }

        else if(!isWebUri(url)){
            return NextResponse.json(
                { error: "Please provide a valid URL." },
                { status: 400 }
            );
        }
        const host = req.headers.get('host'); 
        const protocol = req.headers.get('x-forwarded-proto') || 'http'; //  protocol (HTTP or HTTPS)
        const defaultDomain = `${protocol}://${host}`; 

        const baseDomain = user?.isMonetized ? user?.customDomain : defaultDomain;
        const validatedLink = {
            title,
            originalUrl: url,
            tags: Array.isArray(tags) ? tags : [],
            // shortUrl:`${baseDomain}/${nanoid(8)}`,
            shortUrl:nanoid(8),
        };

        try {
            await prisma.project.update({
                where: { 
                    id: projectId,
                    user:{
                        clerkUserId: userId,
                    }
                },
                data: {
                    links: {
                        create: validatedLink,
                    },
                },
            });

            return NextResponse.json({message:"Link added successfully"}, { status: 201 });
        } catch (error: any) {
            console.error("Error updating project:", error);
            return NextResponse.json(
                { error: error.message || "An error occurred while updating the project." },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Error adding Links:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

}
