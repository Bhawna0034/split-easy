export default function Avatar({
  initials,
  index = 0,
  className,
}: {
  initials: string;
  index?: number;
  className?: string;
}) {
  const colors = [
    "bg-[#ffd8c8]",
    "bg-[#dcd7ff]",
    "bg-[#c8efdf]",
    "bg-[#fbe6a9]",
  ];
  return (
    <span
      className={`flex size-8 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold text-[#3d3540] ${colors[index % colors.length]}`}
    >
      {initials}
    </span>
  );
}
