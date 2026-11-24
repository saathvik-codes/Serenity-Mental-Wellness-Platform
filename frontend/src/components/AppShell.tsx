import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  Home, Heart, ClipboardList, LineChart, Leaf, MessageCircle, Music, Gamepad2, Users, BookOpen, Award, Settings, LifeBuoy, LogOut,
} from "lucide-react";
import { auth } from "@/firebase";
import { ThemeToggle } from "@/components/ThemeToggle";

// One navigation for every signed-in screen, grouped the way people use the app.
const GROUPS = [
  { label: null, items: [{ to: "/dashboard", label: "Home", icon: Home }] },
  {
    label: "Check in",
    items: [
      { to: "/mood-tracker", label: "Mood", icon: Heart },
      { to: "/assessment-center", label: "Check-ins", icon: ClipboardList },
      { to: "/progress", label: "Progress", icon: LineChart },
    ],
  },
  {
    label: "Feel better",
    items: [
      { to: "/mindfulness", label: "Breathe & meditate", icon: Leaf },
      { to: "/ai-therapist", label: "Talk it through", icon: MessageCircle },
      { to: "/spotify-wellness", label: "Music", icon: Music },
      { to: "/wellness-games", label: "Games", icon: Gamepad2 },
    ],
  },
  {
    label: "Together",
    items: [
      { to: "/community", label: "Community", icon: Users },
      { to: "/resources", label: "Resources", icon: BookOpen },
      { to: "/gamification", label: "Achievements", icon: Award },
    ],
  },
];

export default function AppShell() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive ? "bg-secondary font-medium text-foreground" : "text-foreground/70 hover:bg-secondary/60 hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-background lg:flex">
        <div className="flex items-center justify-between px-5 py-5">
          <NavLink to="/dashboard" className="font-display text-2xl text-foreground">Serenity</NavLink>
          <ThemeToggle />
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {GROUPS.map((g, i) => (
            <div key={i}>
              {g.label && <p className="mb-1 px-3 text-xs font-medium text-muted-foreground">{g.label}</p>}
              <div className="space-y-0.5">
                {g.items.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} className={link}>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="space-y-0.5 border-t border-border px-3 py-3">
          <NavLink to="/emergency-help" className={({ isActive }) => `${link({ isActive })} text-accent`}>
            <LifeBuoy className="h-4 w-4" aria-hidden="true" /> Get help now
          </NavLink>
          <NavLink to="/settings" className={link}>
            <Settings className="h-4 w-4" aria-hidden="true" /> Settings
          </NavLink>
          <button
            type="button"
            onClick={async () => { await signOut(auth); navigate("/auth"); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
          {user?.email && <p className="truncate px-3 pt-2 text-xs text-muted-foreground">{user.email}</p>}
        </div>
      </aside>
      <Outlet />
    </div>
  );
}
