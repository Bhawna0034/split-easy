export default function BalanceCard({
  label,
  amount,
  detail,
  icon,
  tone,
}: {
  label: string;
  amount: string;
  detail: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8e4df] bg-[#fbfaf8] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#89837e]">{label}</span>
        <span
          className={`flex size-8 items-center justify-center rounded-lg ${tone === "green" ? "bg-[#dff5e9] text-[#3d9c6c]" : tone === "red" ? "bg-[#fbe2d8] text-[#d87452]" : "bg-[#eeeaff] text-[#736ab6]"}`}
        >
          {icon}
        </span>
      </div>
      <div
        className={`mt-5 text-[28px] font-bold tracking-tighter ${tone === "green" ? "text-[#3e9b6c]" : tone === "red" ? "text-[#d87452]" : "text-[#28252a]"}`}
      >
        {amount}
      </div>
      <p className="mt-1 text-xs text-[#aaa5a0]">{detail}</p>
    </div>
  );
}
