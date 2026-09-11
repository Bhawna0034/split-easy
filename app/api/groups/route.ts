import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    const session = await auth();
    if(!session?.user?.id){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    const {groupId, title, amount, paidById, memberIds} = await request.json();

    if(!groupId || !title?.trim() || !amount || !paidById || !memberIds?.length){
        return NextResponse.json({error: "Missing requried fields"}, {status: 400})
    }

    const membership = await prisma.groupMember.findUnique({
        where: {groupId_userId: {groupId, userId: session.user.id}}
    })
    if(!membership){
        return NextResponse.json({error: "Not a member of this group"}, {status: 403})
    }

    const total = Number(amount);
    const share = Math.round((total / memberIds.length) * 100)/100;

    const expense = await prisma.expense.create({
        data: {
            title: title.trim(),
            amount: total,
            groupId,
            paidById,
            shares: {create: memberIds.map((userId: string) => ({userId, amount: share}))},
        }
    });
    return NextResponse.json({expense}, {status: 201});
}