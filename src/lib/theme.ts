export const THEME_CONFIG: Record<string, { 
  primary: string; 
  bg: string; 
  hoverBg: string; 
  hoverText: string;
  badge: string;
  badgeText: string;
  ring: string;
  border: string;
  faint: string;
  text: string;
  selection: string;
}> = {
  black: { 
    primary: "bg-black", 
    bg: "bg-black", 
    hoverBg: "hover:bg-black", 
    hoverText: "hover:text-black",
    badge: "bg-gray-100",
    badgeText: "text-gray-600",
    ring: "ring-black",
    border: "border-black",
    faint: "bg-gray-50/50",
    text: "text-black",
    selection: "selection:bg-black selection:text-white"
  },
  blue: { 
    primary: "bg-blue-600", 
    bg: "bg-blue-600", 
    hoverBg: "hover:bg-blue-600", 
    hoverText: "hover:text-blue-600",
    badge: "bg-blue-50",
    badgeText: "text-blue-600",
    ring: "ring-blue-600",
    border: "border-blue-600",
    faint: "bg-blue-50/30",
    text: "text-blue-600",
    selection: "selection:bg-blue-100 selection:text-blue-900"
  },
  emerald: { 
    primary: "bg-emerald-600", 
    bg: "bg-emerald-600", 
    hoverBg: "hover:bg-emerald-600", 
    hoverText: "hover:text-emerald-600",
    badge: "bg-emerald-50",
    badgeText: "text-emerald-600",
    ring: "ring-emerald-600",
    border: "border-emerald-600",
    faint: "bg-emerald-50/30",
    text: "text-emerald-600",
    selection: "selection:bg-emerald-100 selection:text-emerald-900"
  },
  violet: { 
    primary: "bg-violet-600", 
    bg: "bg-violet-600", 
    hoverBg: "hover:bg-violet-600", 
    hoverText: "hover:text-violet-600",
    badge: "bg-violet-50",
    badgeText: "text-violet-600",
    ring: "ring-violet-600",
    border: "border-violet-600",
    faint: "bg-violet-50/30",
    text: "text-violet-600",
    selection: "selection:bg-violet-100 selection:text-violet-900"
  },
  rose: { 
    primary: "bg-rose-600", 
    bg: "bg-rose-600", 
    hoverBg: "hover:bg-rose-600", 
    hoverText: "hover:text-rose-600",
    badge: "bg-rose-50",
    badgeText: "text-rose-600",
    ring: "ring-rose-600",
    border: "border-rose-600",
    faint: "bg-rose-50/30",
    text: "text-rose-600",
    selection: "selection:bg-rose-100 selection:text-rose-900"
  },
};

export function getTheme(id?: string | null) {
  return THEME_CONFIG[id || "black"] || THEME_CONFIG.black;
}
