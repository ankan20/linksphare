import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function ensureUserInDatabase() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error('User is not authenticated.');
  }

  // Check if the user exists in your database
  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  // If not, create a new user
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'unknown',
        name: clerkUser.firstName || null,
      },
    });
  }

  return user; 
}
