import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request){

    try{
        const body = await request.json();
        const {name, email, password} = body;

        if(!email || !password){
            return NextResponse.json({
                error: "Email and password are required"
            }, {status: 400});
        }

        if(password.length < 6){
            return NextResponse.json({error: "Password must be at least 6 characters"}, {status: 400});
        }

       const existingUser =  await prisma.user.findUnique({
            where: {
                email
            }
        });
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        return NextResponse.json({
            message: "User created successfully", user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        }, {status: 201});
    } catch(error){
        console.error("SIGNUP_ERROR: ", error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500})
    }

}