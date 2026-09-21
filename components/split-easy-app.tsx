'use client'

import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleHelp,
  Copy,
  CreditCard,
  Home,
  LogOut,
  MoreHorizontal,
  Plus,
  Receipt,
  Settings,
  Sparkles,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { BalanceLine as BalanceLineType, DashboardGroup } from '@/types'
import { useRouter } from 'next/navigation';

type ExpenseRowData = DashboardGroup['expenses'][number];
type GroupMemberData = DashboardGroup['members'][number];
type Props = {
  currentUserId: string
  currentUserName: string
  groups: DashboardGroup[]
  recentExpenses: ExpenseRowData[]
  overall: { net: number; owed: number; owe: number; totalSpend: number; groupCount: number }
  debtLines: BalanceLineType[]
}
function Avatar({ initials, index = 0 }: { initials: string; index?: number }) {
  const colors = ['bg-[#ffd8c8]', 'bg-[#dcd7ff]', 'bg-[#c8efdf]', 'bg-[#fbe6a9]']
  return <span className={`flex size-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold text-[#3d3540] ${colors[index % colors.length]}`}>{initials}</span>
}

function formatINR(n: number) {
  return `₹${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

const STYLE_PALETTE = [
  { icon: '◒', tone: 'peach' as const },
  { icon: '⌂', tone: 'lilac' as const },
  { icon: '✦', tone: 'mint' as const },
  { icon: '☀', tone: 'yellow' as const },
]
function styleFor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return STYLE_PALETTE[hash % STYLE_PALETTE.length]
}
function toneClasses(tone: (typeof STYLE_PALETTE)[number]['tone']) {
  switch (tone) {
    case 'peach': return 'bg-[#ffe5da]'
    case 'lilac': return 'bg-[#e9e5ff]'
    case 'mint': return 'bg-[#daf4e7]'
    case 'yellow': return 'bg-[#fbecc0]'
  }
}
// const groups = [
//   { name: 'Goa Trip', subtitle: 'Aug 16–19, 2024', total: '₹18,420', balance: '+₹1,240', status: 'owed', tone: 'peach', members: ['RK', 'PS', 'AM', 'NV'] },
//   { name: 'Roommates', subtitle: 'Apartment 4B', total: '₹32,850', balance: '-₹450', status: 'owe', tone: 'lilac', members: ['RK', 'PS', 'AM'] },
//   { name: 'Weekend Brunch', subtitle: 'Aug 24, 2024', total: '₹3,280', balance: '₹0', status: 'settled', tone: 'mint', members: ['RK', 'NV'] },
// ]

// const expenses = [
//   { title: 'Villa stay', paid: 'Raj paid', amount: '₹12,000', date: 'Aug 16', icon: '⌂', color: 'peach', split: 'Split equally · 4 people' },
//   { title: 'Dinner at Thalassa', paid: 'You paid', amount: '₹3,680', date: 'Aug 17', icon: '✦', color: 'lilac', split: 'Split equally · 4 people' },
//   { title: 'Airport transfers', paid: 'Priya paid', amount: '₹1,540', date: 'Aug 18', icon: '↗', color: 'mint', split: 'Custom split · 4 people' },
//   { title: 'Beach shack', paid: 'You paid', amount: '₹1,200', date: 'Aug 19', icon: '◒', color: 'yellow', split: 'Split equally · 4 people' },
// ]

// function Avatar({ initials, index = 0 }: { initials: string; index?: number }) {
//   const colors = ['bg-[#ffd8c8]', 'bg-[#dcd7ff]', 'bg-[#c8efdf]', 'bg-[#fbe6a9]']
//   return <span className={`flex size-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold text-[#3d3540] ${colors[index % colors.length]}`}>{initials}</span>
// }

export default function SplitEasyApp({ currentUserId, currentUserName, groups, recentExpenses, overall, debtLines }: Props) {
  const router = useRouter()
  const [view, setView] = useState<'overview' | 'group' | 'balance' | 'members'>('overview')
  const [selectedGroup, setSelectedGroup] = useState<DashboardGroup | null>(groups[0] ?? null)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [toast, setToast] = useState('')

  function navigate(next: typeof view) { setView(next) }
  function openGroup(group: DashboardGroup) { setSelectedGroup(group); setView('group') }
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  function refreshAfterSave() { router.refresh() }

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#28252a]">
      <aside className="fixed inset-y-0 left-0 hidden w-[238px] flex-col border-r border-[#e8e4df] bg-[#fbfaf8] px-5 py-7 lg:flex">
        <button onClick={() => navigate('overview')} className="flex items-center gap-2.5 px-2 text-left">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#27232a] text-[#fffaf5]"><Wallet className="size-[18px]" /></span>
          <span className="text-[17px] font-bold tracking-[-0.04em]">Split<span className="text-[#f07d58]">Easy</span></span>
        </button>
        <nav className="mt-16 flex flex-col gap-1">
          <NavItem active={view === 'overview'} icon={<Home />} label="Overview" onClick={() => navigate('overview')} />
          <NavItem active={view === 'balance'} icon={<CreditCard />} label="Overall balance" onClick={() => navigate('balance')} />
        </nav>
        <div className="mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Your groups</div>
        <div className="mt-3 flex flex-col gap-1">
          {groups.map((group) => <button key={group.name} onClick={() => openGroup(group)} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition hover:bg-[#f1eeea] ${selectedGroup?.id === group.id && view === 'group' ? 'bg-[#f1eeea] font-semibold' : 'text-[#69636a]'}`}><span>{group.name}</span><ChevronRight className="size-3.5 text-[#b4aeaa]" /></button>)}
        </div>
        <button onClick={() => setNewGroupOpen(true)} className="mt-3 flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-[#f07d58]"><Plus className="size-4" /> New group</button>
        <div className="mt-auto flex flex-col gap-1 border-t border-[#e8e4df] pt-5">
          <NavItem icon={<Settings />} label="Settings" onClick={() => notify('Settings are coming soon')} />
          <NavItem icon={<CircleHelp />} label="Help center" onClick={() => notify('How can we help?')} />
          <NavItem icon={<LogOut />} label="Sign out" onClick={() => notify('You are signed out')} />
        </div>
      </aside>

      <div className="lg:pl-[238px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e8e4df] bg-[#fbfaf8] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 lg:hidden"><span className="flex size-8 items-center justify-center rounded-lg bg-[#27232a] text-[#fffaf5]"><Wallet className="size-4" /></span><span className="font-bold">Split<span className="text-[#f07d58]">Easy</span></span></div>
          <div className="hidden items-center gap-2 text-[13px] text-[#8c8681] sm:flex"><span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span><span className="size-1 rounded-full bg-[#cfc8c1]" /><span className="font-medium text-[#59525a]">{greeting}, {currentUserName.split(' ')[0]}</span></div>
          <div className="ml-auto flex items-center gap-4"><button onClick={() => notify('No new notifications')} className="relative text-[#777177]"><Bell className="size-[19px]" /><span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-[#f07d58]" /></button><span className="hidden h-6 w-px bg-[#e6e1dc] sm:block" /><button className="flex items-center gap-2"><Avatar initials={currentUserName.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'} /><span className="hidden text-[13px] font-semibold sm:block">{currentUserName}</span></button></div>
        </header>

        <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {view === 'overview' && <Overview overall={overall} groups={groups} recentExpenses={recentExpenses} onAdd={() => setAddExpenseOpen(true)} onNew={() => setNewGroupOpen(true)} onGroup={openGroup} />}
          {view === 'balance' && <Balance debtLines={debtLines} overall={overall} onBack={() => navigate('overview')} />}
          {view === 'members' && <Members group={selectedGroup} onBack={() => navigate('group')} onNotify={notify} />}
          {view === 'group' && <GroupDetail group={selectedGroup} onBack={() => navigate('overview')} onAdd={() => setAddExpenseOpen(true)} onMembers={() => navigate('members')} />}
        </main>
      </div>

      {addExpenseOpen && selectedGroup && <ExpenseModal group={selectedGroup} currentUserId={currentUserId} onClose={() => setAddExpenseOpen(false)} onSaved={() => { setAddExpenseOpen(false); notify(`Expense added to ${selectedGroup.name}`); refreshAfterSave() }} />}
      {newGroupOpen && <NewGroupModal onClose={() => setNewGroupOpen(false)} onSaved={() => { setNewGroupOpen(false); notify('New group created'); refreshAfterSave() }} />}
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#27232a] px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}
    </div>
  )
}

function NavItem({ active, icon, label, onClick }: { active?: boolean; icon: React.ReactNode; label: string; onClick: () => void }) { return <button onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${active ? 'bg-[#f3dfd7] font-semibold text-[#c75f3d]' : 'text-[#777177] hover:bg-[#f1eeea]'}`}>{icon && <span className="[&>svg]:size-[17px]">{icon}</span>}{label}</button> }

function Overview({ overall, groups, recentExpenses, onAdd, onNew, onGroup }: {
  overall: Props['overall']; groups: DashboardGroup[]; recentExpenses: ExpenseRowData[]; onAdd: () => void; onNew: () => void; onGroup: (group: DashboardGroup) => void
}) {

  const owedGroupCount = groups.filter((g) => g.status === 'owed').length
  const owingGroupCount = groups.filter((g) => g.status === 'owe').length
  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Your overview</p><h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-[38px]">Keep things <span className="font-serif italic text-[#f07d58]">even.</span></h1><p className="mt-2 text-sm text-[#88827d]">All your shared expenses, in one calm place.</p></div><button onClick={onAdd} disabled={groups.length === 0} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#27232a] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d3740]"><Plus className="size-4" /> Add expense</button></div>
    <section className="mt-9 grid gap-4 md:grid-cols-3"><BalanceCard label="You are owed" amount={formatINR(overall.owed)} detail={`Across ${owedGroupCount} group${owedGroupCount === 1 ? '' : 's'}`} icon={<ArrowDownLeft />} tone="green" /><BalanceCard label="You owe" amount={formatINR(overall.owe)} detail={`Across ${owingGroupCount} group${owingGroupCount === 1 ? '' : 's'}`} icon={<ArrowUpRight />} tone="red" /><BalanceCard label="Total shared spend" amount={formatINR(overall.totalSpend)} detail={`Across ${overall.groupCount} group${overall.groupCount === 1 ? '' : 's'}`} icon={<Receipt />} tone="neutral" /></section>
    <div className="mt-12 flex items-center justify-between"><div><h2 className="text-xl font-bold tracking-[-0.03em]">Your groups</h2><p className="mt-1 text-sm text-[#8c8681]">Shared spaces for the people you spend with.</p></div><button onClick={onNew} className="hidden items-center gap-1.5 text-sm font-semibold text-[#f07d58] sm:flex"><Plus className="size-4" /> New group</button></div>
    <section className="mt-5 grid gap-4 md:grid-cols-3">{groups.map((group) => <GroupCard key={group.name} group={group} onClick={() => onGroup(group)} />)}<button onClick={onNew} className="flex min-h-[190px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d8d1ca] bg-transparent text-[#9b948e] transition hover:border-[#f07d58] hover:text-[#f07d58] md:hidden"><span className="flex size-10 items-center justify-center rounded-full border border-current"><Plus className="size-5" /></span><span className="text-sm font-semibold">Create a new group</span></button></section>
    <section className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]"><div><div className="flex items-center justify-between"><h2 className="text-xl font-bold tracking-[-0.03em]">Recent activity</h2><button className="text-sm font-semibold text-[#f07d58]">View all</button></div><div className="mt-4 rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">{recentExpenses.length === 0 ? <p className="py-8 text-center text-sm text-[#aaa5a0]">No expenses yet. Add one to see it here.</p>: recentExpenses.slice(0, 3).map((expense) => <ExpenseRow key={expense.id} expense={expense} />)}</div></div><div className="rounded-2xl bg-[#eeeaff] p-6"><div className="flex items-center gap-2 text-[#6d63b7]"><Sparkles className="size-4" /><span className="text-xs font-bold uppercase tracking-[0.12em]">SplitEasy tip</span></div><p className="mt-5 max-w-[270px] text-lg font-semibold leading-snug tracking-[-0.02em] text-[#453d70]">Settle up before your next adventure. Your future self will thank you.</p><button className="mt-6 text-sm font-bold text-[#6d63b7]">Learn how it works <span className="ml-1">→</span></button></div></section>
  </>
}

function BalanceCard({ label, amount, detail, icon, tone }: { label: string; amount: string; detail: string; icon: React.ReactNode; tone: string }) { return <div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#89837e]">{label}</span><span className={`flex size-8 items-center justify-center rounded-lg ${tone === 'green' ? 'bg-[#dff5e9] text-[#3d9c6c]' : tone === 'red' ? 'bg-[#fbe2d8] text-[#d87452]' : 'bg-[#eeeaff] text-[#736ab6]'}`}>{icon}</span></div><div className={`mt-5 text-[28px] font-bold tracking-[-0.05em] ${tone === 'green' ? 'text-[#3e9b6c]' : tone === 'red' ? 'text-[#d87452]' : 'text-[#28252a]'}`}>{amount}</div><p className="mt-1 text-xs text-[#aaa5a0]">{detail}</p></div> }


function GroupCard({ group, onClick }: { group: DashboardGroup; onClick: () => void }) { 
  const style = styleFor(group.id)
  const shownMembers = group.members.slice(0, 4)
  const overflow = group.members.length - shownMembers.length
 
  return <button onClick={onClick} className="group rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#d7cec6] hover:shadow-lg hover:shadow-[#ded7d0]/30">
    <div className="flex items-start justify-between"><div className={`flex size-10 items-center justify-center rounded-xl text-xl ${toneClasses(style.tone)}`}>{style.icon}</div><MoreHorizontal className="size-5 text-[#aaa5a0]" /></div>
    <h3 className="mt-5 text-lg font-bold tracking-[-0.03em]">{group.name}</h3>
    <p className="mt-1 text-xs text-[#aaa5a0]">{group.subtitle}</p>
    <div className="mt-7 flex items-end justify-between"><div><p className="text-[11px] text-[#aaa5a0]">Total spend</p><p className="mt-1 text-[17px] font-bold">{group.total} vvv</p></div><div className="text-right"><p className="text-[11px] text-[#aaa5a0]">Your balance</p><p className={`mt-1 text-[17px] font-bold ${group.status === 'owed' ? 'text-[#3e9b6c]' : group.status === 'owe' ? 'text-[#d87452]' : 'text-[#777177]'}`}>{group.balance}</p></div></div>
    <div className="mt-5 flex items-center justify-between"><div className="flex -space-x-2">{shownMembers.map((m, i) => <Avatar key={m.id} initials={m.initials} index={i} />)}{overflow > 0 && <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-[#eee9e3] text-[10px] font-bold text-[#777177]">+{overflow}</span>}</div><span className="flex items-center gap-1 text-xs font-semibold text-[#aaa5a0] group-hover:text-[#f07d58]">Open group <ChevronRight className="size-3.5" /></span></div>
  </button>
}


function ExpenseRow({ expense }: { expense: ExpenseRowData}) {
  const style = styleFor(expense.id)
   return <div className="flex items-center gap-3 border-b border-[#eeeae5] py-4 last:border-0"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-lg ${toneClasses(style.tone)}`}>{style.icon}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{expense.title}</p><p className="mt-0.5 text-xs text-[#aaa5a0]">{expense.paid} · {expense.date}</p></div><p className="text-sm font-bold">{expense.amount}</p></div> }

function GroupDetail({ group, onBack, onAdd, onMembers }: { group: DashboardGroup | null; onBack: () => void; onAdd: () => void; onMembers: () => void }) { 
  if(!group) return null;

  return <><button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681] hover:text-[#28252a]"><ArrowLeft className="size-4" /> All groups</button><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Group details</p><h1 className="text-3xl font-bold tracking-[-0.05em]">{group.name}</h1><p className="mt-2 text-sm text-[#88827d]">{group.subtitle} · {group.members.length} member{group.members.length === 1 ? '' : 's'}</p></div><div className="flex gap-2"><button onClick={onMembers} className="flex h-10 items-center gap-2 rounded-xl border border-[#ded8d2] px-4 text-sm font-semibold"><Users className="size-4" /> Members</button><button onClick={onAdd} className="flex h-10 items-center gap-2 rounded-xl bg-[#27232a] px-4 text-sm font-semibold text-white"><Plus className="size-4" /> Add expense</button></div></div><div className="mt-9 grid gap-4 lg:grid-cols-[1.45fr_0.75fr]"><div><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Expenses</h2><button className="text-sm font-semibold text-[#8c8681]">Newest first</button></div><div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">{group.expenses.length === 0 ? <p className="py-8 text-center text-sm text-[#aaa5a0]">No expenses in this group yet.</p>: group.expenses.map((expense) => <ExpenseRow key={expense.id} expense={expense} />)}</div></div><div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5"><h2 className="text-lg font-bold">{group.status === 'settled' ? "You're all settled" : group.status === 'owed' ? "You're owed here" : 'You owe here'}</h2><p className="mt-1 text-sm leading-relaxed text-[#8c8681]">{group.status === 'settled' ? 'No outstanding balances in this group.' : `Your current balance is ${group.balance}.`}</p><div className="my-6 border-t border-[#eeeae5]" /><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#aaa5a0]">Group total</p><p className="mt-2 text-3xl font-bold tracking-[-0.05em]">{group.total}</p><p className="mt-1 text-xs text-[#aaa5a0]">{group.expenses.length} expense{group.expenses.length === 1 ? '' : 's'}</p></div></div></> }
function Balance({ debtLines, overall, onBack }: { debtLines: BalanceLineType[]; overall: Props['overall']; onBack: () => void }) { return <><button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681]"><ArrowLeft className="size-4" /> Overview</button><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Across all groups</p><h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-[38px]">Overall balance</h1><p className="mt-2 text-sm text-[#88827d]">A clear picture of who owes what.</p><div className="mt-9 max-w-[640px] rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-6"><p className="text-sm text-[#89837e]">Your net balance</p><p className={`mt-3 text-4xl font-bold tracking-[-0.06em] ${overall.net >= 0 ? 'text-[#3e9b6c]' : 'text-[#d87452]'} `}>{formatINR(overall.net)}</p><p className="mt-2 text-sm text-[#aaa5a0]">{overall.net >= 0 ? 'You are owed more than you owe.' : 'You owe more than you are owed.'}</p><div className="my-7 border-t border-[#eeeae5]" />{debtLines.length === 0 ? <p className="text-sm text-[#aaa5a0]">You&apos; re all settled up - no pending balances.</p>: <div className="flex flex-col gap-5">{debtLines.map((line, i) => <BalanceLine key={`${line.name}-${line.groupName}-${i}`} name={line.name} detail={line.groupName} amount={line.amount} positive={line.positive} />)} </div>}</div></> }


function BalanceLine({ name, detail, amount, positive }: { name: string; detail: string; amount: string; positive: boolean }) { return <div className="flex items-center gap-3"><Avatar initials={name.split(' ').map((x) => x[0]).join('')} /><div className="flex-1"><p className="text-sm font-semibold">{name}</p><p className="text-xs text-[#aaa5a0]">{detail}</p></div><div className="text-right"><p className={`text-sm font-bold ${positive ? 'text-[#3e9b6c]' : 'text-[#d87452]'}`}>{positive ? 'owes you' : 'you owe'} {amount}</p><button className="mt-1 text-xs font-semibold text-[#f07d58]">Settle up</button></div></div> }


function Members({ group, onBack, onNotify }: { group: DashboardGroup | null, onBack: () => void; onNotify: (message: string) => void }) { 
  if(!group) return null
   return <><button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681]"><ArrowLeft className="size-4" /> {group.name}</button><div className="flex items-end justify-between"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">People in this group</p><h1 className="text-3xl font-bold tracking-[-0.05em]">Members</h1></div><button onClick={() => onNotify('Invite link copied')} className="flex h-10 items-center gap-2 rounded-xl bg-[#27232a] px-4 text-sm font-semibold text-white"><Plus className="size-4" /> Invite people</button></div><div className="mt-8 max-w-[640px] rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">{group.members.map((member: GroupMemberData, i: number) => <div key={member.id} className="flex items-center gap-3 border-b border-[#eeeae5] py-4 last:border-0"><Avatar initials={member.initials} index={i} /><div className="flex-1"><p className="text-sm font-semibold">{member.name}</p><p className="text-xs text-[#aaa5a0]">{member.email}</p></div>{member.isAdmin ? <span className="rounded-full bg-[#eeeaff] px-2.5 py-1 text-[11px] font-bold text-[#6d63b7]">Admin</span>: <button onClick={() => onNotify(`${member.name} removed from group`)} className="text-[#aaa5a0] hover:text-[#d87452]"><X className="size-4" /></button>}</div>)}</div></> }

function ExpenseModal({ group, currentUserId, onClose, onSaved }: { group: DashboardGroup; currentUserId: string; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState(currentUserId)
  const [includedIds, setIncludedIds] = useState<string[]>(group.members.map((m) => m.id))
  const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState('')

  function toggleMember(id: string){
    setIncludedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  }
  async function handleSave(){
    const amountNum = Number(amount)
    if(!title.trim() || !amountNum || amountNum <= 0 || includedIds.length === 0){
      setError("Add a description, a valid amount, and at least one person to split with.")
      return
    }
    setError('')
    setSubmitting(true)
    try{
      const res = await fetch(`/api/expenses`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({groupId: group.id, title: title.trim(), amount: amountNum, paidById, memberIds: includedIds})
      })

      if(!res.ok){
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Could not save this expense')
      }
      onSaved()
    }
    catch(error){
      setError(error instanceof Error ? error.message : 'Something went wrong')

    }finally{
      setSubmitting(false)
    }
  }
  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#27232a]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
    <div className="max-h-[92vh] w-full max-w-[500px] overflow-y-auto rounded-t-3xl bg-[#fbfaf8] p-6 shadow-2xl sm:rounded-3xl sm:p-8">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Add an expense</h2><p className="mt-1 text-sm text-[#8c8681]">{group.name}</p></div><button onClick={onClose} className="rounded-full p-2 text-[#8c8681] hover:bg-[#eeeae5]"><X className="size-5" /></button></div>
      <div className="mt-7 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm font-semibold">Description<input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none ring-[#f07d58] focus:ring-2" placeholder="e.g. Dinner at Thalassa" /></label>
        <label className="flex flex-col gap-2 text-sm font-semibold">Amount<div className="flex h-11 items-center rounded-xl border border-[#ded8d2] bg-white px-3"><span className="mr-2 text-[#aaa5a0]">₹</span><input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent font-semibold outline-none" placeholder="0.00" type="number" min="0" step="0.01" /></div></label>
        <label className="flex flex-col gap-2 text-sm font-semibold">Paid by<select value={paidById} onChange={(e) => setPaidById(e.target.value)} className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none">{group.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
        <div>
          <p className="mb-2 text-sm font-semibold">Split type</p>
          <div className="grid grid-cols-3 gap-2">
            <button className="h-10 rounded-xl border border-[#f07d58] bg-[#fff0e9] text-xs font-semibold text-[#c75f3d]">Equal</button>
            <button disabled title="Coming soon" className="h-10 cursor-not-allowed rounded-xl border border-[#ded8d2] bg-white text-xs font-semibold text-[#c4bfba]">Custom</button>
            <button disabled title="Coming soon" className="h-10 cursor-not-allowed rounded-xl border border-[#ded8d2] bg-white text-xs font-semibold text-[#c4bfba]">Percentage</button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Included members</p>
          <div className="flex flex-wrap gap-2">
            {group.members.map((m) => {
              const included = includedIds.includes(m.id)
              return <button key={m.id} type="button" onClick={() => toggleMember(m.id)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${included ? 'border-[#f07d58] bg-[#fff0e9] text-[#c75f3d]' : 'border-[#ded8d2] bg-white text-[#777177]'}`}>{m.name}{included ? ' ✓' : ''}</button>
            })}
          </div>
        </div>
        {error && <p className="text-sm font-semibold text-[#d87452]">{error}</p>}
      </div>
      <button onClick={handleSave} disabled={submitting} className="mt-8 h-12 w-full rounded-xl bg-[#27232a] text-sm font-bold text-white disabled:opacity-60">{submitting ? 'Saving…' : 'Save expense'}</button>
    </div>
  </div>
     }
function NewGroupModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  async function handleCreate(){
    if(!name.trim()){
      setError("Give your group a name.")
      return
    }
    setError('')
    setSubmitting(true)
    try{
      const res = await fetch(`/api/groups`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name.trim()})
      })
      if(!res.ok){
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Could not create this group')
      }
      onSaved()
    } catch(error){
      setError(error instanceof Error ? error.message: 'Something went wrong')
    }
    finally{
      setSubmitting(false)
    }
  }
  return <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#27232a]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"><div className="w-full max-w-[430px] rounded-t-3xl bg-[#fbfaf8] p-6 shadow-2xl sm:rounded-3xl sm:p-8"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Create a new group</h2><button onClick={onClose} className="rounded-full p-2 text-[#8c8681] hover:bg-[#eeeae5]"><X className="size-5" /></button></div><p className="mt-2 text-sm text-[#8c8681]">Start a shared space for a trip, home, or anything else.</p><label className="mt-7 flex flex-col gap-2 text-sm font-semibold">Group name<input value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-[#f07d58]" placeholder="e.g. Goa Trip" /></label>{error && <p className="mt-3 text-sm font-semibold text-[#d87452]">{error}</p>}<button onClick={handleCreate} disabled={submitting}className="mt-7 h-12 w-full rounded-xl bg-[#27232a] text-sm font-bold text-white disabled: opacity-60">{submitting ? 'Creating…' : 'Create group'}</button></div></div> }

