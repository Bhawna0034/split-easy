"use client";

import { DashboardGroup } from "@/types";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useState } from "react";
import AddMemberModal from "./add-member-modal";
import Avatar from "./avatar";

type GroupMemberData = DashboardGroup["members"][number];

export function Members({
  group,
  onBack,
  onNotify,
  onRefresh,
}: {
  group: DashboardGroup | null;
  onBack: () => void;
  onNotify: (message: string) => void;
  onRefresh: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  if (!group) return null;
  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681]"
      >
        <ArrowLeft className="size-4" /> {group.name}
      </button>
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">
            People in this group
          </p>
          <h1 className="text-3xl font-bold tracking-tighter">Members</h1>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#27232a] px-4 text-sm font-semibold text-white"
        >
          <Plus className="size-4" /> Add member
        </button>
      </div>
      <div className="mt-8 max-w-160 rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">
        {group.members.map((member: GroupMemberData, i: number) => (
          <div
            key={member.id}
            className="flex items-center gap-3 border-b border-[#eeeae5] py-4 last:border-0"
          >
            <Avatar initials={member.initials} index={i} />
            <div className="flex-1">
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-[#aaa5a0]">{member.email}</p>
            </div>
            {member.isAdmin ? (
              <span className="rounded-full bg-[#eeeaff] px-2.5 py-1 text-[11px] font-bold text-[#6d63b7]">
                Admin
              </span>
            ) : (
              <button
                onClick={() => onNotify(`${member.name} removed from group`)}
                className="text-[#aaa5a0] hover:text-[#d87452]"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}
        {addOpen && (
          <AddMemberModal
            group={group}
            onClose={() => setAddOpen(false)}
            onSaved={() => {
              setAddOpen(false);
              onNotify("Member added");
              onRefresh();
            }}
          />
        )}
      </div>
    </>
  );
}
