"use client";

import { DashboardGroup, Props } from "@/types";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Home,
  LogOut,
  Plus,
  Settings,
  Wallet,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "./avatar";
import Balance from "./balance";
import ExpenseModal from "./expense-modal";
import GroupDetail from "./group-detail";
import { Members } from "./members";
import { NavItem } from "./nav-item";
import NewGroupModal from "./new-group-modal";
import Overview from "./overview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function SplitEasyApp({
  currentUserId,
  currentUserName,
  groups,
  recentExpenses,
  overall,
  debtLines,
}: Props) {
  const router = useRouter();
  const [view, setView] = useState<
    "overview" | "group" | "balance" | "members"
  >("overview");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    groups[0]?.id ?? null,
  );

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? null;
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [toast, setToast] = useState("");

  function navigate(next: typeof view) {
    setView(next);
  }
  function openGroup(group: DashboardGroup) {
    setSelectedGroupId(group.id);
    setView("group");
  }
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }
  function refreshAfterSave() {
    router.refresh();
  }

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 18
        ? "Good afternoon"
        : "Good evening";
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#28252a]">
      <aside className="fixed inset-y-0 left-0 hidden w-59.5 flex-col border-r border-[#e8e4df] bg-[#fbfaf8] px-5 py-7 lg:flex">
        <button
          onClick={() => navigate("overview")}
          className="flex items-center gap-2.5 px-2 text-left"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#27232a] text-[#fffaf5]">
            <Wallet className="size-4.5" />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.04em]">
            Split<span className="text-[#f07d58]">Easy</span>
          </span>
        </button>
        <nav className="mt-16 flex flex-col gap-1">
          <NavItem
            active={view === "overview"}
            icon={<Home />}
            label="Overview"
            onClick={() => navigate("overview")}
          />
          <NavItem
            active={view === "balance"}
            icon={<CreditCard />}
            label="Overall balance"
            onClick={() => navigate("balance")}
          />
        </nav>
        <div className="mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">
          Your groups
        </div>
        <div className="mt-3 flex flex-col gap-1">
          {groups.map((group) => (
            <button
              key={group.name}
              onClick={() => openGroup(group)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition hover:bg-[#f1eeea] ${selectedGroup?.id === group.id && view === "group" ? "bg-[#f1eeea] font-semibold" : "text-[#69636a]"}`}
            >
              <span>{group.name}</span>
              <ChevronRight className="size-3.5 text-[#b4aeaa]" />
            </button>
          ))}
        </div>
        <button
          onClick={() => setNewGroupOpen(true)}
          className="mt-3 flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-[#f07d58]"
        >
          <Plus className="size-4" /> New group
        </button>
        <div className="mt-auto flex flex-col gap-1 border-t border-[#e8e4df] pt-5">
          <NavItem
            icon={<Settings />}
            label="Settings"
            onClick={() => notify("Settings are coming soon")}
          />
          <NavItem
            icon={<CircleHelp />}
            label="Help center"
            onClick={() => notify("How can we help?")}
          />
          <NavItem
            icon={<LogOut />}
            label="Sign out"
            onClick={() => {
              notify("Signing you out...");
              signOut({ callbackUrl: "/login" });
            }}
          />
        </div>
      </aside>

      <div className="lg:pl-59.5">
        <header className="flex h-19 items-center justify-between border-b border-[#e8e4df] bg-[#fbfaf8] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#27232a] text-[#fffaf5]">
              <Wallet className="size-4" />
            </span>
            <span className="font-bold">
              Split<span className="text-[#f07d58]">Easy</span>
            </span>
          </div>
          <div className="hidden items-center gap-2 text-[13px] text-[#8c8681] sm:flex">
            <span>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="size-1 rounded-full bg-[#cfc8c1]" />
            <span className="font-medium text-[#59525a]">
              {greeting}, {currentUserName.split(" ")[0]}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => notify("No new notifications")}
              className="relative text-[#777177]"
            >
              <Bell className="size-4.75" />
              <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-[#f07d58]" />
            </button>
            <span className="hidden h-6 w-px bg-[#e6e1dc] sm:block" />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2">
                    <Avatar
                      initials={
                        currentUserName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"
                      }
                    />
                    <span className="hidden text-[13px] font-semibold sm:block">
                      {currentUserName}
                    </span>
                  </button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Avatar
                      initials={
                        currentUserName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"
                      }
                      className="shrink-0"
                    />
                    <span className="text-xs font-semibold block">
                      {currentUserName}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      notify("Signing you out...");
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="text-sm text-[#f07d58]"
                  >
                    {" "}
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto max-w-295 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {view === "overview" && (
            <Overview
              overall={overall}
              groups={groups}
              recentExpenses={recentExpenses}
              onAdd={() => setAddExpenseOpen(true)}
              onNew={() => setNewGroupOpen(true)}
              onGroup={openGroup}
            />
          )}
          {view === "balance" && (
            <Balance
              debtLines={debtLines}
              overall={overall}
              onBack={() => navigate("overview")}
            />
          )}
          {view === "members" && (
            <Members
              group={selectedGroup}
              onBack={() => navigate("group")}
              onNotify={notify}
              onRefresh={refreshAfterSave}
            />
          )}
          {view === "group" && (
            <GroupDetail
              group={selectedGroup}
              onBack={() => navigate("overview")}
              onAdd={() => setAddExpenseOpen(true)}
              onMembers={() => navigate("members")}
            />
          )}
        </main>
      </div>

      {addExpenseOpen && selectedGroup && (
        <ExpenseModal
          group={selectedGroup}
          currentUserId={currentUserId}
          onClose={() => setAddExpenseOpen(false)}
          onSaved={() => {
            setAddExpenseOpen(false);
            notify(`Expense added to ${selectedGroup.name}`);
            refreshAfterSave();
          }}
        />
      )}
      {newGroupOpen && (
        <NewGroupModal
          onClose={() => setNewGroupOpen(false)}
          onSaved={() => {
            setNewGroupOpen(false);
            notify("New group created");
            refreshAfterSave();
          }}
        />
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#27232a] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
