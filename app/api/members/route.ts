import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, {params}: {params: Promise<{groupId: string}>}){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    }
    const {groupId} = await params;
    const {email} = await request.json();
    if(!email?.trim()){
        return NextResponse.json({error: "Email is required"}, {status: 400});
    }
    // Only existing members can invite others into a group
    const membership = await prisma.groupMember.findUnique({
        where: {groupId_userId: {groupId, userId: session.user.id}}
    });
    if(!membership){
        return NextResponse.json({error: "You are not a member of this group"}, {status: 403});
    }

    const invitedUser = await prisma.user.findUnique({
        where: {email: email.trim().toLowerCase()},
    });
    if(!invitedUser){
        return NextResponse.json({error: "No SplitEasy account found for that email"}, {status: 404});
    }

    const alreadyMember = await prisma.groupMember.findUnique({
        where: {groupId_userId: {groupId, userId: invitedUser.id}},
    });
    if(alreadyMember){
        return NextResponse.json({error: "That person is already in this group"}, {status: 409});
    }
    const member = await prisma.groupMember.create({
        data: {groupId, userId: invitedUser.id},
    });
    return NextResponse.json({member}, {status: 201});
}