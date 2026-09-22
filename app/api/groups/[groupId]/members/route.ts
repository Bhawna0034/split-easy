import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = await params;
  const { email } = await request.json();

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Confirm the group exists and the requester is a member of it
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: { select: { userId: true } } },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const isMember = group.members.some((m) => m.userId === session.user?.id);
  if (!isMember) {
    return NextResponse.json(
      { error: "You're not a member of this group" },
      { status: 403 },
    );
  }

  // Look up the invited user by email
  const invitedUser = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!invitedUser) {
    return NextResponse.json(
      {
        error: "No account found with that email. They need to sign up first.",
      },
      { status: 404 },
    );
  }

  const alreadyMember = group.members.some((m) => m.userId === invitedUser.id);
  if (alreadyMember) {
    return NextResponse.json(
      { error: "This person is already in the group" },
      { status: 409 },
    );
  }

  const member = await prisma.groupMember.create({
    data: { groupId, userId: invitedUser.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  return NextResponse.json({ member }, { status: 201 });
}
