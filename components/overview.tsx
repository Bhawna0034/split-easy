import { DashboardGroup, ExpenseRowData, Props } from "@/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Receipt,
  Sparkles,
} from "lucide-react";
import BalanceCard from "./balance-card";
import GroupCard from "./group-card";
import ExpenseRow from "./expense-row";
import { formatINR } from "@/lib/format";

export default function Overview({
  overall,
  groups,
  recentExpenses,
  onAdd,
  onNew,
  onGroup,
}: {
  overall: Props["overall"];
  groups: DashboardGroup[];
  recentExpenses: ExpenseRowData[];
  onAdd: () => void;
  onNew: () => void;
  onGroup: (group: DashboardGroup) => void;
}) {
  const owedGroupCount = groups.filter((g) => g.status === "owed").length;
  const owingGroupCount = groups.filter((g) => g.status === "owe").length;
  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">
            Your overview
          </p>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-[38px]">
            Keep things{" "}
            <span className="font-serif italic text-[#f07d58]">even.</span>
          </h1>
          <p className="mt-2 text-sm text-[#88827d]">
            All your shared expenses, in one calm place.
          </p>
        </div>
        <button
          onClick={onAdd}
          disabled={groups.length === 0}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#27232a] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d3740]"
        >
          <Plus className="size-4" /> Add expense
        </button>
      </div>
      <section className="mt-9 grid gap-4 md:grid-cols-3">
        <BalanceCard
          label="You are owed"
          amount={formatINR(overall.owed)}
          detail={`Across ${owedGroupCount} group${owedGroupCount === 1 ? "" : "s"}`}
          icon={<ArrowDownLeft />}
          tone="green"
        />
        <BalanceCard
          label="You owe"
          amount={formatINR(overall.owe)}
          detail={`Across ${owingGroupCount} group${owingGroupCount === 1 ? "" : "s"}`}
          icon={<ArrowUpRight />}
          tone="red"
        />
        <BalanceCard
          label="Total shared spend"
          amount={formatINR(overall.totalSpend)}
          detail={`Across ${overall.groupCount} group${overall.groupCount === 1 ? "" : "s"}`}
          icon={<Receipt />}
          tone="neutral"
        />
      </section>
      <div className="mt-12 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.03em]">Your groups</h2>
          <p className="mt-1 text-sm text-[#8c8681]">
            Shared spaces for the people you spend with.
          </p>
        </div>
        <button
          onClick={onNew}
          className="hidden items-center gap-1.5 text-sm font-semibold text-[#f07d58] sm:flex"
        >
          <Plus className="size-4" /> New group
        </button>
      </div>
      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group.name}
            group={group}
            onClick={() => onGroup(group)}
          />
        ))}
        <button
          onClick={onNew}
          className="flex min-h-47.5 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d8d1ca] bg-transparent text-[#9b948e] transition hover:border-[#f07d58] hover:text-[#f07d58] md:hidden"
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-current">
            <Plus className="size-5" />
          </span>
          <span className="text-sm font-semibold">Create a new group</span>
        </button>
      </section>
      <section className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-[-0.03em]">
              Recent activity
            </h2>
            <button className="text-sm font-semibold text-[#f07d58]">
              View all
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">
            {recentExpenses.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#aaa5a0]">
                No expenses yet. Add one to see it here.
              </p>
            ) : (
              recentExpenses
                .slice(0, 3)
                .map((expense) => (
                  <ExpenseRow key={expense.id} expense={expense} />
                ))
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-[#eeeaff] p-6">
          <div className="flex items-center gap-2 text-[#6d63b7]">
            <Sparkles className="size-4" />
            <span className="text-xs font-bold uppercase tracking-[0.12em]">
              SplitEasy tip
            </span>
          </div>
          <p className="mt-5 max-w-67.5 text-lg font-semibold leading-snug tracking-[-0.02em] text-[#453d70]">
            Settle up before your next adventure. Your future self will thank
            you.
          </p>
          <button className="mt-6 text-sm font-bold text-[#6d63b7]">
            Learn how it works <span className="ml-1">→</span>
          </button>
        </div>
      </section>
    </>
  );
}
