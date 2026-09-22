"use client";

import { DashboardGroup } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";

export default function AddMemberModal({
  group,
  onClose,
  onSaved,
}: {
  group: DashboardGroup;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleInvite() {
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/groups/${group.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not add this member");
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#27232a]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
      <div className="w-full max-w-107.5 rounded-t-3xl bg-[#fbfaf8] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Add a member</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#8c8681] hover:bg-[#eeeae5]"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-[#8c8681]">
          Invite someone to {group.name} by email. They&apos;ll need an existing
          SplitEasy account.
        </p>
        <label className="mt-7 flex flex-col gap-2 text-sm font-semibold">
          Email address
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !submitting) handleInvite();
            }}
            className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-[#f07d58]"
            placeholder="e.g. priya@example.com"
          />
        </label>
        {error && (
          <p className="mt-3 text-sm font-semibold text-[#d87452]">{error}</p>
        )}
        <button
          onClick={handleInvite}
          disabled={submitting}
          className="mt-7 h-12 w-full rounded-xl bg-black text-sm font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add member"}
        </button>
      </div>
    </div>
  );
}
