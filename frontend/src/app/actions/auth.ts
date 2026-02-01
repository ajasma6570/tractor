import prisma from "@/lib/prisma";

export async function authenticateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    if (user && user.password === password) {
        return user;
    }

    return null;
}