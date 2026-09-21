import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    const session = await auth();
    if(!session?.user?.id){
     return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {groupId, title, amount, paidById, memberIds} = await request.json();
    if(!groupId || !title?.trim() || !amount || !paidById || !memberIds?.length){
     return NextResponse.json({error: "Missing required fields"}, {status: 400});
    }

    const total = Number(amount);
    if(!Number.isFinite(total) || total <= 0){
     return NextResponse.json({error: "Invalid amount"}, {status: 400});
    }

    // Request must be a member of the group they're adding an expense to.
    const membership = await prisma.groupMember.findUnique({
        where: {groupId_userId: {groupId, userId: session.user.id}}
    });
    if(!membership){
     return NextResponse.json({error: "You are not a member of this group"}, {status: 403});
    }
    // Everyone the expsense is split between (and whoever paid) must also be members of the group
    const groupMembers = await prisma.groupMember.findMany({
        where: {groupId},
        select: {userId: true},
    });
    const memberIdSet = new Set(groupMembers.map((m) => m.userId));
   const invalidIds = [paidById, ...memberIds].filter((id: string) => !memberIdSet.has(id));
   if(invalidIds.length > 0){
    return NextResponse.json({error: "Payer and split members must belong to the group"}, {status: 400});
   }

//    Equal split for now, rounded to cents; give any leftover paise  to the first share so the shared always sum exactly to the total.

const share = Math.floor((total / memberIds.length) * 100) / 100;

const remainder = Math.round((total - share * memberIds.length) * 100) / 100;
const expense = await prisma.expense.create({
    data: {
        title: title.trim(),
        amount: total,
        groupId,
        paidById,
        shares: {
            create: memberIds.map((userId: string, index: number) => ({
                userId,
                amount: share + (index === 0 ? remainder : 0),
            })),
        }
    }
});
return NextResponse.json({expense}, {status: 201});
}
