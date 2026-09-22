import Avatar from "./avatar";

export default function BalanceLine({
  name,
  detail,
  amount,
  positive,
}: {
  name: string;
  detail: string;
  amount: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        initials={name
          .split(" ")
          .map((x) => x[0])
          .join("")}
      />
      <div className="flex-1">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-[#aaa5a0]">{detail}</p>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${positive ? "text-[#3e9b6c]" : "text-[#d87452]"}`}
        >
          {positive ? "owes you" : "you owe"} {amount}
        </p>
        <button className="mt-1 text-xs font-semibold text-[#f07d58]">
          Settle up
        </button>
      </div>
    </div>
  );
}
