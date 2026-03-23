import prisma from "./prisma";

/**
 * Checks if a user is eligible for a monthly credit refresh and performs it if necessary.
 * This should be called before checking or spending credits.
 * 
 * @param userEmail The email of the user to check
 * @returns The updated user object if refreshed, or null if no refresh was needed
 */
export async function checkAndRefreshCredits(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      membership: true,
      credits: true,
      lastCreditReset: true,
    },
  });

  if (!user || user.membership !== "FREE") {
    return null;
  }

  const now = new Date();
  const lastReset = new Date(user.lastCreditReset);
  
  // Calculate if 30 days have passed since the last reset
  // A simpler way is to check if it's a different month/year combo if you want exactly "monthly"
  // But 30 days is more precise for "free trial" style monthly resets.
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  
  if (now.getTime() - lastReset.getTime() >= thirtyDaysInMs) {
    
    return await prisma.user.update({
      where: { email: userEmail },
      data: {
        credits: 200,
        lastCreditReset: now,
      },
    });
  }

  return null;
}
