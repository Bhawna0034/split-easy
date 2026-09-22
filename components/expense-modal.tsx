"use client";
import { DashboardGroup } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";

export default function ExpenseModal({
  group,
  currentUserId,
  onClose,
  onSaved,
}: {
  group: DashboardGroup;
  currentUserId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState(currentUserId);
  const [includedIds, setIncludedIds] = useState<string[]>(
    group.members.map((m) => m.id),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function toggleMember(id: string) {
    setIncludedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }
  async function handleSave() {
    const amountNum = Number(amount);
    if (
      !title.trim() ||
      !amountNum ||
      amountNum <= 0 ||
      includedIds.length === 0
    ) {
      setError(
        "Add a description, a valid amount, and at least one person to split with.",
      );
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: group.id,
          title: title.trim(),
          amount: amountNum,
          paidById,
          memberIds: includedIds,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save this expense");
      }
      onSaved();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#27232a]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
      <div className="max-h-[92vh] w-full max-w-125 overflow-y-auto rounded-t-3xl bg-[#fbfaf8] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Add an expense</h2>
            <p className="mt-1 text-sm text-[#8c8681]">{group.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#8c8681] hover:bg-[#eeeae5]"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Description
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none ring-[#f07d58] focus:ring-2"
              placeholder="e.g. Dinner at Thalassa"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Amount
            <div className="flex h-11 items-center rounded-xl border border-[#ded8d2] bg-white px-3">
              <span className="mr-2 text-[#aaa5a0]">₹</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent font-semibold outline-none"
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Paid by
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none"
            >
              {group.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <div>
            <p className="mb-2 text-sm font-semibold">Split type</p>
            <div className="grid grid-cols-3 gap-2">
              <button className="h-10 rounded-xl border border-[#f07d58] bg-[#fff0e9] text-xs font-semibold text-[#c75f3d]">
                Equal
              </button>
              <button
                disabled
                title="Coming soon"
                className="h-10 cursor-not-allowed rounded-xl border border-[#ded8d2] bg-white text-xs font-semibold text-[#c4bfba]"
              >
                Custom
              </button>
              <button
                disabled
                title="Coming soon"
                className="h-10 cursor-not-allowed rounded-xl border border-[#ded8d2] bg-white text-xs font-semibold text-[#c4bfba]"
              >
                Percentage
              </button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Included members</p>
            <div className="flex flex-wrap gap-2">
              {group.members.map((m) => {
                const included = includedIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMember(m.id)}
                    className={`rounded-full border px-3 py-2 text-xs font-semibold ${included ? "border-[#f07d58] bg-[#fff0e9] text-[#c75f3d]" : "border-[#ded8d2] bg-white text-[#777177]"}`}
                  >
                    {m.name}
                    {included ? " ✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
          {error && (
            <p className="text-sm font-semibold text-[#d87452]">{error}</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={submitting}
          className="mt-8 h-12 w-full rounded-xl bg-[#27232a] text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save expense"}
        </button>
      </div>
    </div>
  );
}
