import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
   const { name, description } = await request.json();
 
    if (!name?.trim()) {
        return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }
 
    const group = await prisma.group.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            createdById: session.user.id,
            members: {
                create: [{ userId: session.user.id }],
            },
        },
    });
 
    return NextResponse.json({ group }, { status: 201 });
}