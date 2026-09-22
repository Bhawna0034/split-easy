import { DashboardGroup } from "@/types";
import { ArrowLeft, Plus, Users } from "lucide-react";
import ExpenseRow from "./expense-row";

export default function GroupDetail({
  group,
  onBack,
  onAdd,
  onMembers,
}: {
  group: DashboardGroup | null;
  onBack: () => void;
  onAdd: () => void;
  onMembers: () => void;
}) {
  if (!group) return null;

  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681] hover:text-[#28252a]"
      >
        <ArrowLeft className="size-4" /> All groups
      </button>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">
            Group details
          </p>
          <h1 className="text-3xl font-bold tracking-tighter">{group.name}</h1>
          <p className="mt-2 text-sm text-[#88827d]">
            {group.subtitle} · {group.members.length} member
            {group.members.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMembers}
            className="flex h-10 items-center gap-2 rounded-xl border border-[#ded8d2] px-4 text-sm font-semibold"
          >
            <Users className="size-4" /> Members
          </button>
          <button
            onClick={onAdd}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#27232a] px-4 text-sm font-semibold text-white"
          >
            <Plus className="size-4" /> Add expense
          </button>
        </div>
      </div>
      <div className="mt-9 grid gap-4 lg:grid-cols-[1.45fr_0.75fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Expenses</h2>
            <button className="text-sm font-semibold text-[#8c8681]">
              Newest first
            </button>
          </div>
          <div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">
            {group.expenses.length === 0 ? (
              <p className="py-8 text-center text-sm text-[#aaa5a0]">
                No expenses in this group yet.
              </p>
            ) : (
              group.expenses.map((expense) => (
                <ExpenseRow key={expense.id} expense={expense} />
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5">
          <h2 className="text-lg font-bold">
            {group.status === "settled"
              ? "You're all settled"
              : group.status === "owed"
                ? "You're owed here"
                : "You owe here"}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-[#8c8681]">
            {group.status === "settled"
              ? "No outstanding balances in this group."
              : `Your current balance is ${group.balance}.`}
          </p>
          <div className="my-6 border-t border-[#eeeae5]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#aaa5a0]">
            Group total
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tighter">
            {group.total}
          </p>
          <p className="mt-1 text-xs text-[#aaa5a0]">
            {group.expenses.length} expense
            {group.expenses.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </>
  );
}
