const STYLE_PALETTE = [
  { icon: "◒", tone: "peach" as const },
  { icon: "⌂", tone: "lilac" as const },
  { icon: "✦", tone: "mint" as const },
  { icon: "☀", tone: "yellow" as const },
];

export function toneClasses(tone: (typeof STYLE_PALETTE)[number]["tone"]) {
  switch (tone) {
    case "peach":
      return "bg-[#ffe5da]";
    case "lilac":
      return "bg-[#e9e5ff]";
    case "mint":
      return "bg-[#daf4e7]";
    case "yellow":
      return "bg-[#fbecc0]";
  }
}
export function styleFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return STYLE_PALETTE[hash % STYLE_PALETTE.length];
}
