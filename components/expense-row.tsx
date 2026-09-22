import { ExpenseRowData } from "@/types";
import { styleFor, toneClasses } from "@/utils";

export default function ExpenseRow({ expense }: { expense: ExpenseRowData }) {
  const style = styleFor(expense.id);

  return (
    <div className="flex items-center gap-3 border-b border-[#eeeae5] py-4 last:border-0">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-lg ${toneClasses(style.tone)}`}
      >
        {style.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{expense.title}</p>
        <p className="mt-0.5 text-xs text-[#aaa5a0]">
          {expense.paid} · {expense.date}
        </p>
      </div>
      <p className="text-sm font-bold">{expense.amount}</p>
    </div>
  );
}
