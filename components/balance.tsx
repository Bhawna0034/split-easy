import { formatINR } from "@/lib/dashboard-data";
import { ArrowLeft } from "lucide-react";
import BalanceLine from "./balance-line";
import { BalanceLine as BalanceLineType, Props } from "@/types";

export default function Balance({
  debtLines,
  overall,
  onBack,
}: {
  debtLines: BalanceLineType[];
  overall: Props["overall"];
  onBack: () => void;
}) {
  return (
    <>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#8c8681]"
      >
        <ArrowLeft className="size-4" /> Overview
      </button>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#aaa5a0]">
        Across all groups
      </p>
      <h1 className="text-3xl font-bold tracking-tighter sm:text-[38px]">
        Overall balance
      </h1>
      <p className="mt-2 text-sm text-[#88827d]">
        A clear picture of who owes what.
      </p>
      <div className="mt-9 max-w-160 rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-6">
        <p className="text-sm text-[#89837e]">Your net balance</p>
        <p
          className={`mt-3 text-4xl font-bold tracking-[-0.06em] ${overall.net >= 0 ? "text-[#3e9b6c]" : "text-[#d87452]"} `}
        >
          {formatINR(overall.net)}
        </p>
        <p className="mt-2 text-sm text-[#aaa5a0]">
          {overall.net >= 0
            ? "You are owed more than you owe."
            : "You owe more than you are owed."}
        </p>
        <div className="my-7 border-t border-[#eeeae5]" />
        {debtLines.length === 0 ? (
          <p className="text-sm text-[#aaa5a0]">
            You&apos; re all settled up - no pending balances.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {debtLines.map((line, i) => (
              <BalanceLine
                key={`${line.name}-${line.groupName}-${i}`}
                name={line.name}
                detail={line.groupName}
                amount={line.amount}
                positive={line.positive}
              />
            ))}{" "}
          </div>
        )}
      </div>
    </>
  );
}
