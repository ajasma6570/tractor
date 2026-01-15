import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode } from "next-auth/jwt";
import prisma from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password", placeholder: "*********" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const inputUsername = credentials.username.trim();

                try {
                    const user = await prisma.user.findUnique({
                        where: { username: inputUsername }
                    });

                    if (!user) {
                        throw new Error("Invalid username or password");
                    }

                    if (!user.isActive) {
                        throw new Error("Your account has been deactivated");
                    }


                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid username or password");
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };

                } catch (error) {
                    if (error instanceof Error) {
                        throw error;
                    }
                    throw new Error("Authentication failed");
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // @ts-expect-error: role may not exist on user by default
                token.role = user.role
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // @ts-expect-error: session.user may not have id property by default
                session.user.id = token.id as string;
                // @ts-expect-error: session.user may not have role property by default
                session.user.role = token.role as string;

                const encodedToken = await encode({
                    token: token,
                    secret: process.env.NEXTAUTH_SECRET!,
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                });

                // @ts-expect-error: session.user may not have accessToken property by default
                session.user.accessToken = encodedToken;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },

}