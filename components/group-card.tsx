import { DashboardGroup } from "@/types";
import { styleFor, toneClasses } from "@/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import Avatar from "./avatar";

export default function GroupCard({
  group,
  onClick,
}: {
  group: DashboardGroup;
  onClick: () => void;
}) {
  const style = styleFor(group.id);
  const shownMembers = group.members.slice(0, 4);
  const overflow = group.members.length - shownMembers.length;

  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#d7cec6] hover:shadow-lg hover:shadow-[#ded7d0]/30"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex size-10 items-center justify-center rounded-xl text-xl ${toneClasses(style.tone)}`}
        >
          {style.icon}
        </div>
        <MoreHorizontal className="size-5 text-[#aaa5a0]" />
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-[-0.03em]">
        {group.name}
      </h3>
      <p className="mt-1 text-xs text-[#aaa5a0]">{group.subtitle}</p>
      <div className="mt-7 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-[#aaa5a0]">Total spend</p>
          <p className="mt-1 text-[17px] font-bold">{group.total}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[#aaa5a0]">Your balance</p>
          <p
            className={`mt-1 text-[17px] font-bold ${group.status === "owed" ? "text-[#3e9b6c]" : group.status === "owe" ? "text-[#d87452]" : "text-[#777177]"}`}
          >
            {group.balance}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {shownMembers.map((m, i) => (
            <Avatar key={m.id} initials={m.initials} index={i} />
          ))}
          {overflow > 0 && (
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-[#eee9e3] text-[10px] font-bold text-[#777177]">
              +{overflow}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#aaa5a0] group-hover:text-[#f07d58]">
          Open group <ChevronRight className="size-3.5" />
        </span>
      </div>
    </button>
  );
}
