import { BalanceLine, DashboardGroup } from "@/types";
import { prisma } from "./prisma";

export function formatINR(amount: number) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}₹${Math.abs(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}


function firstName(name: string | null) {
  return name?.split(" ")[0] ?? "Someone";
}


export async function getDashboardData(userId: string){
 const memberships = await prisma.groupMember.findMany({
    where: {userId},
    include: {
        group: {
            include: {
                members: {include: {user: true}},
                expenses: {include: {shares: true, paidBy: true}, orderBy: {expenseDate: "desc"}}
            }
        }
    }
 });

 let totalOwed = 0;
 let totalOwe = 0;
 let totalSpend = 0;
 const debtLines: BalanceLine[] = [];

 const flatExpenses: (DashboardGroup["expenses"][number] & {rawDate: Date})[] = [];

 const groups: DashboardGroup[] = memberships.map(({group}) => {
    const paid = group.expenses.filter((e) => e.paidById === userId)
    .reduce((s, e) => s + Number(e.amount), 0);

    const owed = group.expenses.flatMap((e) => e.shares).filter((s) => s.userId === userId).reduce((s, x) => s + Number(x.amount), 0);

    const net = paid - owed;
    const groupTotal = group.expenses.reduce((s, e) => s + Number(e.amount), 0);

    totalSpend += groupTotal;
    if(net > 0.01) totalOwed += net;
    if(net < - 0.01) totalOwe += Math.abs(net);

    const netMap = new Map<string, number>();
    for(const m of group.members) netMap.set(m.userId, 0);
    for(const e of group.expenses){
        netMap.set(e.paidById, (netMap.get(e.paidById) ?? 0) + Number(e.amount));
        for(const s of e.shares) netMap.set(s.userId, (netMap.get(s.userId) ?? 0) - Number(s.amount));
    }
    const creditors = [...netMap.entries()].filter(([, v]) => v > 0.01).sort((a, b) => b[1] - a[1]);
    const debtors = [...netMap.entries()].filter(([, v]) => v < -0.01).sort((a, b) => a[1] - b[1]);
    let i = 0, j = 0;
    while(i < creditors.length && j < debtors.length){
        const settle = Math.min(creditors[i][1], -debtors[j][1]);
        if(creditors[i][0] === userId || debtors[j][0] === userId){
            const otherId = creditors[i][0] === userId ? debtors[j][0] : creditors[i][0];
            const otherUser = group.members.find((m) => m.userId === otherId)?.user;
            debtLines.push({
                name: otherUser?.name ?? otherUser?.email ?? "Someone",
                groupName: group.name,
                amount: formatINR(settle),
                positive: creditors[i][0] === userId
            });
        }
        creditors[i][1] -= settle;
        debtors[j][1] += settle;
        if(creditors[i][1] < 0.01) i++;
        if(debtors[j][1] > -0.01) j++;
    }
    const expenseRows = group.expenses.map((e) => ({
        id: e.id,
        title: e.title,
        paid: e.paidById === userId ? "You paid" : `${firstName(e.paidBy.name)} paid`,
        amount: formatINR(Number(e.amount)),
        date: e.expenseDate.toLocaleDateString("en-IN", {day: "numeric", month: "short"})
    }));

    for(const row of expenseRows){
        const source = group.expenses.find((e) => e.id === row.id)!;
        flatExpenses.push({ ...row, rawDate: source.expenseDate})
    }
    return {
      id: group.id,
      name: group.name,
      subtitle: group.description ?? `${group.members.length} members`,
      total: formatINR(groupTotal),
      balance: `${net >= 0 ? "+" : "-"}${formatINR(Math.abs(net)).replace("-", "")}`,
      status: net > 0.01 ? "owed" : net < -0.01 ? "owe" : "settled",
      members: group.members.map((m) => ({
        id: m.userId,
        name: m.userId === userId ? "You" : m.user.name ?? m.user.email,
        initials: initials(m.user.name ?? m.user.email),
        isAdmin: m.userId === group.createdById,
        email: m.user.email,
      })),
      expenses: expenseRows,
    } satisfies DashboardGroup;
 });

  const recentExpenses = flatExpenses
    .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
    .slice(0, 5)
    .map(({ rawDate, ...rest }) => rest);
     return {
    groups,
    recentExpenses,
    overall: {
      net: totalOwed - totalOwe,
      owed: totalOwed,
      owe: totalOwe,
      totalSpend,
      groupCount: memberships.length,
    },
    debtLines,
  };
}