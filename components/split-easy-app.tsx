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

const groups = [
  { name: 'Goa Trip', subtitle: 'Aug 16–19, 2024', total: '₹18,420', balance: '+₹1,240', status: 'owed', tone: 'peach', members: ['RK', 'PS', 'AM', 'NV'] },
  { name: 'Roommates', subtitle: 'Apartment 4B', total: '₹32,850', balance: '-₹450', status: 'owe', tone: 'lilac', members: ['RK', 'PS', 'AM'] },
  { name: 'Weekend Brunch', subtitle: 'Aug 24, 2024', total: '₹3,280', balance: '₹0', status: 'settled', tone: 'mint', members: ['RK', 'NV'] },
]

const expenses = [
  { title: 'Villa stay', paid: 'Raj paid', amount: '₹12,000', date: 'Aug 16', icon: '⌂', color: 'peach', split: 'Split equally · 4 people' },
  { title: 'Dinner at Thalassa', paid: 'You paid', amount: '₹3,680', date: 'Aug 17', icon: '✦', color: 'lilac', split: 'Split equally · 4 people' },
  { title: 'Airport transfers', paid: 'Priya paid', amount: '₹1,540', date: 'Aug 18', icon: '↗', color: 'mint', split: 'Custom split · 4 people' },
  { title: 'Beach shack', paid: 'You paid', amount: '₹1,200', date: 'Aug 19', icon: '◒', color: 'yellow', split: 'Split equally · 4 people' },
]

function Avatar({ initials, index = 0 }: { initials: string; index?: number }) {
  const colors = ['bg-[#ffd8c8]', 'bg-[#dcd7ff]', 'bg-[#c8efdf]', 'bg-[#fbe6a9]']
  return <span className={`flex size-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold text-[#3d3540] ${colors[index % colors.length]}`}>{initials}</span>
}

export default function SplitEasyApp() {
  const [view, setView] = useState<'overview' | 'group' | 'balance' | 'members'>('overview')
  const [selectedGroup, setSelectedGroup] = useState(groups[0])
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [toast, setToast] = useState('')

  function navigate(next: typeof view) { setView(next) }
  function openGroup(group: typeof groups[number]) { setSelectedGroup(group); setView('group') }
  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(''), 2600) }

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
          {groups.map((group) => <button key={group.name} onClick={() => openGroup(group)} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition hover:bg-[#f1eeea] ${selectedGroup.name === group.name && view === 'group' ? 'bg-[#f1eeea] font-semibold' : 'text-[#69636a]'}`}><span>{group.name}</span><ChevronRight className="size-3.5 text-[#b4aeaa]" /></button>)}
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
          <div className="hidden items-center gap-2 text-[13px] text-[#8c8681] sm:flex"><span>Monday, August 26, 2024</span><span className="size-1 rounded-full bg-[#cfc8c1]" /><span className="font-medium text-[#59525a]">Good morning, Rohan</span></div>
          <div className="ml-auto flex items-center gap-4"><button onClick={() => notify('No new notifications')} className="relative text-[#777177]"><Bell className="size-[19px]" /><span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-[#f07d58]" /></button><span className="hidden h-6 w-px bg-[#e6e1dc] sm:block" /><button className="flex items-center gap-2"><Avatar initials="RK" /><span className="hidden text-[13px] font-semibold sm:block">Rohan Kapoor</span></button></div>
        </header>

        <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          {view === 'overview' && <Overview onAdd={() => setAddExpenseOpen(true)} onNew={() => setNewGroupOpen(true)} onGroup={openGroup} />}
          {view === 'balance' && <Balance onBack={() => navigate('overview')} />}
          {view === 'members' && <Members group={selectedGroup} onBack={() => navigate('group')} onNotify={notify} />}
          {view === 'group' && <GroupDetail group={selectedGroup} onBack={() => navigate('overview')} onAdd={() => setAddExpenseOpen(true)} onMembers={() => navigate('members')} />}
        </main>
      </div>

      {addExpenseOpen && <ExpenseModal onClose={() => setAddExpenseOpen(false)} onSaved={() => { setAddExpenseOpen(false); notify('Expense added to Goa Trip') }} />}
      {newGroupOpen && <NewGroupModal onClose={() => setNewGroupOpen(false)} onSaved={() => { setNewGroupOpen(false); notify('New group created') }} />}
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#27232a] px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}
    </div>
  )
}

function NavItem({ active, icon, label, onClick }: { active?: boolean; icon: React.ReactNode; label: string; onClick: () => void }) { return <button onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${active ? 'bg-[#f3dfd7] font-semibold text-[#c75f3d]' : 'text-[#777177] hover:bg-[#f1eeea]'}`}>{icon && <span className="[&>svg]:size-[17px]">{icon}</span>}{label}</button> }

function Overview({ onAdd, onNew, onGroup }: { onAdd: () => void; onNew: () => void; onGroup: (group: typeof groups[number]) => void }) {
  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Your overview</p><h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-[38px]">Keep things <span className="font-serif italic text-[#f07d58]">even.</span></h1><p className="mt-2 text-sm text-[#88827d]">All your shared expenses, in one calm place.</p></div><button onClick={onAdd} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#27232a] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d3740]"><Plus className="size-4" /> Add expense</button></div>
    <section className="mt-9 grid gap-4 md:grid-cols-3"><BalanceCard label="You are owed" amount="₹1,240" detail="Across 1 group" icon={<ArrowDownLeft />} tone="green" /><BalanceCard label="You owe" amount="₹450" detail="Across 1 group" icon={<ArrowUpRight />} tone="red" /><BalanceCard label="Total shared spend" amount="₹54,550" detail="Across 3 groups" icon={<Receipt />} tone="neutral" /></section>
    <div className="mt-12 flex items-center justify-between"><div><h2 className="text-xl font-bold tracking-[-0.03em]">Your groups</h2><p className="mt-1 text-sm text-[#8c8681]">Shared spaces for the people you spend with.</p></div><button onClick={onNew} className="hidden items-center gap-1.5 text-sm font-semibold text-[#f07d58] sm:flex"><Plus className="size-4" /> New group</button></div>
    <section className="mt-5 grid gap-4 md:grid-cols-3">{groups.map((group) => <GroupCard key={group.name} group={group} onClick={() => onGroup(group)} />)}<button onClick={onNew} className="flex min-h-[190px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d8d1ca] bg-transparent text-[#9b948e] transition hover:border-[#f07d58] hover:text-[#f07d58] md:hidden"><span className="flex size-10 items-center justify-center rounded-full border border-current"><Plus className="size-5" /></span><span className="text-sm font-semibold">Create a new group</span></button></section>
    <section className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_1fr]"><div><div className="flex items-center justify-between"><h2 className="text-xl font-bold tracking-[-0.03em]">Recent activity</h2><button className="text-sm font-semibold text-[#f07d58]">View all</button></div><div className="mt-4 rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">{expenses.slice(0, 3).map((expense) => <ExpenseRow key={expense.title} expense={expense} />)}</div></div><div className="rounded-2xl bg-[#eeeaff] p-6"><div className="flex items-center gap-2 text-[#6d63b7]"><Sparkles className="size-4" /><span className="text-xs font-bold uppercase tracking-[0.12em]">SplitEasy tip</span></div><p className="mt-5 max-w-[270px] text-lg font-semibold leading-snug tracking-[-0.02em] text-[#453d70]">Settle up before your next adventure. Your future self will thank you.</p><button className="mt-6 text-sm font-bold text-[#6d63b7]">Learn how it works <span className="ml-1">→</span></button></div></section>
  </>
}

function BalanceCard({ label, amount, detail, icon, tone }: { label: string; amount: string; detail: string; icon: React.ReactNode; tone: string }) { return <div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5"><div className="flex items-center justify-between"><span className="text-sm text-[#89837e]">{label}</span><span className={`flex size-8 items-center justify-center rounded-lg ${tone === 'green' ? 'bg-[#dff5e9] text-[#3d9c6c]' : tone === 'red' ? 'bg-[#fbe2d8] text-[#d87452]' : 'bg-[#eeeaff] text-[#736ab6]'}`}>{icon}</span></div><div className={`mt-5 text-[28px] font-bold tracking-[-0.05em] ${tone === 'green' ? 'text-[#3e9b6c]' : tone === 'red' ? 'text-[#d87452]' : 'text-[#28252a]'}`}>{amount}</div><p className="mt-1 text-xs text-[#aaa5a0]">{detail}</p></div> }
function GroupCard({ group, onClick }: { group: typeof groups[number]; onClick: () => void }) { return <button onClick={onClick} className="group rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#d7cec6] hover:shadow-lg hover:shadow-[#ded7d0]/30"><div className="flex items-start justify-between"><div className={`flex size-10 items-center justify-center rounded-xl text-xl ${group.tone === 'peach' ? 'bg-[#ffe5da]' : group.tone === 'lilac' ? 'bg-[#e9e5ff]' : 'bg-[#daf4e7]'}`}>{group.tone === 'peach' ? '◒' : group.tone === 'lilac' ? '⌂' : '✦'}</div><MoreHorizontal className="size-5 text-[#aaa5a0]" /></div><h3 className="mt-5 text-lg font-bold tracking-[-0.03em]">{group.name}</h3><p className="mt-1 text-xs text-[#aaa5a0]">{group.subtitle}</p><div className="mt-7 flex items-end justify-between"><div><p className="text-[11px] text-[#aaa5a0]">Total spend</p><p className="mt-1 text-[17px] font-bold">{group.total}</p></div><div className="text-right"><p className="text-[11px] text-[#aaa5a0]">Your balance</p><p className={`mt-1 text-[17px] font-bold ${group.status === 'owed' ? 'text-[#3e9b6c]' : group.status === 'owe' ? 'text-[#d87452]' : 'text-[#777177]'}`}>{group.balance}</p></div></div><div className="mt-5 flex items-center justify-between"><div className="flex -space-x-2">{group.members.map((m, i) => <Avatar key={m} initials={m} index={i} />)}</div><span className="flex items-center gap-1 text-xs font-semibold text-[#aaa5a0] group-hover:text-[#f07d58]">Open group <ChevronRight className="size-3.5" /></span></div></button> }
function ExpenseRow({ expense }: { expense: typeof expenses[number] }) { return <div className="flex items-center gap-3 border-b border-[#eeeae5] py-4 last:border-0"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-lg ${expense.color === 'peach' ? 'bg-[#ffe5da]' : expense.color === 'lilac' ? 'bg-[#e9e5ff]' : expense.color === 'mint' ? 'bg-[#daf4e7]' : 'bg-[#fbecc0]'}`}>{expense.icon}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{expense.title}</p><p className="mt-0.5 text-xs text-[#aaa5a0]">{expense.paid} · {expense.date}</p></div><p className="text-sm font-bold">{expense.amount}</p></div> }

function GroupDetail({ group, onBack, onAdd, onMembers }: { group: typeof groups[number]; onBack: () => void; onAdd: () => void; onMembers: () => void }) { return <><button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681] hover:text-[#28252a]"><ArrowLeft className="size-4" /> All groups</button><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Group details</p><h1 className="text-3xl font-bold tracking-[-0.05em]">{group.name}</h1><p className="mt-2 text-sm text-[#88827d]">{group.subtitle} · 4 members</p></div><div className="flex gap-2"><button onClick={onMembers} className="flex h-10 items-center gap-2 rounded-xl border border-[#ded8d2] px-4 text-sm font-semibold"><Users className="size-4" /> Members</button><button onClick={onAdd} className="flex h-10 items-center gap-2 rounded-xl bg-[#27232a] px-4 text-sm font-semibold text-white"><Plus className="size-4" /> Add expense</button></div></div><div className="mt-9 grid gap-4 lg:grid-cols-[1.45fr_0.75fr]"><div><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Expenses</h2><button className="text-sm font-semibold text-[#8c8681]">Newest first</button></div><div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">{expenses.map((expense) => <ExpenseRow key={expense.title} expense={expense} />)}</div></div><div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5"><h2 className="text-lg font-bold">You&apos;re all settled</h2><p className="mt-1 text-sm leading-relaxed text-[#8c8681]">No outstanding balances in this group.</p><div className="my-6 border-t border-[#eeeae5]" /><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#aaa5a0]">Group total</p><p className="mt-2 text-3xl font-bold tracking-[-0.05em]">{group.total}</p><p className="mt-1 text-xs text-[#aaa5a0]">4 expenses</p></div></div></> }
function Balance({ onBack }: { onBack: () => void }) { return <><button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681]"><ArrowLeft className="size-4" /> Overview</button><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">Across all groups</p><h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-[38px]">Overall balance</h1><p className="mt-2 text-sm text-[#88827d]">A clear picture of who owes what.</p><div className="mt-9 max-w-[640px] rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-6"><p className="text-sm text-[#89837e]">Your net balance</p><p className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#3e9b6c]">+₹790</p><p className="mt-2 text-sm text-[#aaa5a0]">You are owed more than you owe.</p><div className="my-7 border-t border-[#eeeae5]" /><div className="flex flex-col gap-5"><BalanceLine name="Raj Mehta" detail="Goa Trip" amount="₹1,240" positive /><BalanceLine name="Priya Shah" detail="Roommates" amount="₹450" positive={false} /></div></div></> }
function BalanceLine({ name, detail, amount, positive }: { name: string; detail: string; amount: string; positive: boolean }) { return <div className="flex items-center gap-3"><Avatar initials={name.split(' ').map((x) => x[0]).join('')} /><div className="flex-1"><p className="text-sm font-semibold">{name}</p><p className="text-xs text-[#aaa5a0]">{detail}</p></div><div className="text-right"><p className={`text-sm font-bold ${positive ? 'text-[#3e9b6c]' : 'text-[#d87452]'}`}>{positive ? 'owes you' : 'you owe'} {amount}</p><button className="mt-1 text-xs font-semibold text-[#f07d58]">Settle up</button></div></div> }
function Members({ group, onBack, onNotify }: { group: typeof groups[number]; onBack: () => void; onNotify: (message: string) => void }) { const members = ['Rohan Kapoor', 'Raj Mehta', 'Priya Shah', 'Aman Malhotra']; return <><button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681]"><ArrowLeft className="size-4" /> {group.name}</button><div className="flex items-end justify-between"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">People in this group</p><h1 className="text-3xl font-bold tracking-[-0.05em]">Members</h1></div><button onClick={() => onNotify('Invite link copied')} className="flex h-10 items-center gap-2 rounded-xl bg-[#27232a] px-4 text-sm font-semibold text-white"><Plus className="size-4" /> Invite people</button></div><div className="mt-8 max-w-[640px] rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] px-5">{members.map((member, i) => <div key={member} className="flex items-center gap-3 border-b border-[#eeeae5] py-4 last:border-0"><Avatar initials={member.split(' ').map((x) => x[0]).join('')} index={i} /><div className="flex-1"><p className="text-sm font-semibold">{member}</p><p className="text-xs text-[#aaa5a0]">{i === 0 ? 'You · rohan@example.com' : `${member.toLowerCase().replace(' ', '.')}@example.com`}</p></div>{i === 0 ? <span className="rounded-full bg-[#eeeaff] px-2.5 py-1 text-[11px] font-bold text-[#6d63b7]">Admin</span> : <button onClick={() => onNotify(`${member} removed from group`)} className="text-[#aaa5a0] hover:text-[#d87452]"><X className="size-4" /></button>}</div>)}</div></> }

function ExpenseModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) { const [split, setSplit] = useState('Equal'); return <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#27232a]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"><div className="max-h-[92vh] w-full max-w-[500px] overflow-y-auto rounded-t-3xl bg-[#fbfaf8] p-6 shadow-2xl sm:rounded-3xl sm:p-8"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Add an expense</h2><p className="mt-1 text-sm text-[#8c8681]">Goa Trip</p></div><button onClick={onClose} className="rounded-full p-2 text-[#8c8681] hover:bg-[#eeeae5]"><X className="size-5" /></button></div><div className="mt-7 flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-semibold">Description<input className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none ring-[#f07d58] focus:ring-2" placeholder="e.g. Dinner at Thalassa" /></label><label className="flex flex-col gap-2 text-sm font-semibold">Amount<div className="flex h-11 items-center rounded-xl border border-[#ded8d2] bg-white px-3"><span className="mr-2 text-[#aaa5a0]">₹</span><input className="w-full bg-transparent font-semibold outline-none" placeholder="0.00" type="number" /></div></label><label className="flex flex-col gap-2 text-sm font-semibold">Paid by<select className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none"><option>You</option><option>Raj Mehta</option><option>Priya Shah</option></select></label><div><p className="mb-2 text-sm font-semibold">Split type</p><div className="grid grid-cols-3 gap-2">{['Equal', 'Custom', 'Percentage'].map((item) => <button key={item} onClick={() => setSplit(item)} className={`h-10 rounded-xl border text-xs font-semibold ${split === item ? 'border-[#f07d58] bg-[#fff0e9] text-[#c75f3d]' : 'border-[#ded8d2] bg-white text-[#777177]'}`}>{item}</button>)}</div></div><div><p className="mb-2 text-sm font-semibold">Included members</p><div className="flex flex-wrap gap-2">{['You', 'Raj', 'Priya', 'Aman'].map((name) => <button key={name} className="rounded-full border border-[#f07d58] bg-[#fff0e9] px-3 py-2 text-xs font-semibold text-[#c75f3d]">{name} ✓</button>)}</div></div></div><button onClick={onSaved} className="mt-8 h-12 w-full rounded-xl bg-[#27232a] text-sm font-bold text-white">Save expense</button></div></div> }
function NewGroupModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) { return <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#27232a]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"><div className="w-full max-w-[430px] rounded-t-3xl bg-[#fbfaf8] p-6 shadow-2xl sm:rounded-3xl sm:p-8"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Create a new group</h2><button onClick={onClose} className="rounded-full p-2 text-[#8c8681] hover:bg-[#eeeae5]"><X className="size-5" /></button></div><p className="mt-2 text-sm text-[#8c8681]">Start a shared space for a trip, home, or anything else.</p><label className="mt-7 flex flex-col gap-2 text-sm font-semibold">Group name<input className="h-11 rounded-xl border border-[#ded8d2] bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-[#f07d58]" placeholder="e.g. Goa Trip" /></label><button onClick={onSaved} className="mt-7 h-12 w-full rounded-xl bg-[#27232a] text-sm font-bold text-white">Create group</button></div></div> }
