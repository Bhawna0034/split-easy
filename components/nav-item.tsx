export function NavItem({
  active,
  icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${active ? "bg-[#f3dfd7] font-semibold text-[#c75f3d]" : "text-[#777177] hover:bg-[#f1eeea]"}`}
    >
      {icon && <span className="[&>svg]:size-4.25">{icon}</span>}
      {label}
    </button>
  );
}
