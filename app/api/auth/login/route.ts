import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;

    try {
        if (!email || !password) {
            return NextResponse.json({
                error: "Email and password are required"
            }, { status: 400 });

        }

        const findUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!findUser || !findUser.password) {
            return NextResponse.json({
                error: "Invalid email or password"
            }, { status: 401 })
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            findUser.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    error: "Invalid email or password",
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: "Login successful", user: {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email
            }
        }, { status: 200 })
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong. Please try again.",
            },
            { status: 500 }
        );
    }
}