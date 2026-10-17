import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home, Newspaper, BookOpen, Gift, Menu, Search, Sun, Moon, X, Flame, Clock,
  Cpu, Shield, Users, Tags, BookMarked, Bookmark, Heart, MessageCircle, Share2,
  Send, Sparkles, Library, ChevronRight, Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OCDI Library — စာကြည့်တိုက်" },
      { name: "description", content: "Browse books, newspapers, journals and e-books from the OCDI Library." },
      { property: "og:title", content: "OCDI Library — စာကြည့်တိုက်" },
      { property: "og:description", content: "Browse books, newspapers, journals and e-books from the OCDI Library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const hues = [182, 160, 75, 250, 25, 300, 210, 130];
const books = [
  { t: "မြန်မာ့သမိုင်း", a: "ဒေါက်တာ သန်းထွန်း", c: "History", r: 4.8 },
  { t: "Mechanical Engineering", a: "R.K. Rajput", c: "Tech", r: 4.6 },
  { t: "စစ်ပညာ အခြေခံ", a: "ဗိုလ်မှူး အောင်မြင့်", c: "Military", r: 4.5 },
  { t: "Materials Science", a: "W. Callister", c: "Tech", r: 4.7 },
  { t: "ငွေတာရီ", a: "မောင်ထင်", c: "Literature", r: 4.9 },
  { t: "Electronics Basics", a: "B.L. Theraja", c: "Tech", r: 4.4 },
  { t: "ဗမာ့ယဉ်ကျေးမှု", a: "ဦးဖိုးကျား", c: "Culture", r: 4.3 },
  { t: "Ballistics", a: "D. Carlucci", c: "Tech", r: 4.6 },
];
const papers = ["ကြေးမုံ", "မြန်မာ့အလင်း", "ရတနာပုံ", "မြဝတီ"];
const stories = ["Latest", "Popular", "E-Books", "Journals", "Tech", "Army"];

function Cover({ i, title, className = "" }: { i: number; title: string; className?: string }) {
  const h = hues[i % hues.length];
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-lg p-2 ${className}`}
      style={{ background: `linear-gradient(150deg, oklch(0.62 0.13 ${h}), oklch(0.32 0.08 ${h + 30}))` }}
    >
      <div className="absolute left-1.5 top-0 h-full w-px bg-background/30" />
      <span className="line-clamp-3 text-[11px] font-bold leading-snug text-primary-foreground drop-shadow">{title}</span>
    </div>
  );
}

function Index() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState("home");
  const [drawer, setDrawer] = useState(false);
  const [chat, setChat] = useState(false);
  const [hideFab, setHideFab] = useState(false);
  const [paper, setPaper] = useState(0);
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([
    { me: false, t: "မင်္ဂလာပါ 👋 ဘယ်စာအုပ်ကို ရှာပေးရမလဲ?" },
  ]);
  const [input, setInput] = useState("");
  const lastY = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => {
      const y = window.scrollY;
      setHideFab(y > lastY.current && y > 80);
      lastY.current = y;
      clearTimeout(t);
      t = setTimeout(() => setHideFab(false), 1200);
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { me: true, t: text }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { me: false, t: `"${text}" နှင့်ပတ်သက်သော စာအုပ် ၁၂ အုပ် တွေ့ပါသည်။` }]), 600);
  };

  const navTabs = [
    { id: "home", icon: Home, l: "ပင်မ" },
    { id: "pubs", icon: Newspaper, l: "သတင်းစာ" },
    { id: "books", icon: BookOpen, l: "စာအုပ်" },
    { id: "donate", icon: Gift, l: "လှူဒါန်း" },
    { id: "menu", icon: Menu, l: "မီနူး" },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-muted/40 pb-20">
      {/* Top bar */}
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="flex h-14 items-center gap-2 px-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Library className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-primary">OCDI Library</h1>
          </div>
          {[
            { I: Search, f: () => {} , l: "Search"},
            { I: dark ? Sun : Moon, f: () => setDark(!dark), l: "Toggle theme" },
          ].map(({ I, f, l }) => (
            <button key={l} aria-label={l} onClick={f} className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground active:scale-95">
              <I className="h-[18px] w-[18px]" />
            </button>
          ))}
          <div className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">ZA</div>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {["Popular", "Latest", "Books", "Tech", "Authors", "Categories"].map((x, i) => (
            <button key={x} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{x}</button>
          ))}
        </nav>
      </header>

      <main className="space-y-2 pt-2">
        {/* Composer-like search */}
        <section className="bg-card px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">ZA</div>
            <button className="flex-1 rounded-full border border-border bg-muted px-4 py-2 text-left text-sm text-muted-foreground">စာအုပ်၊ စာရေးဆရာ ရှာရန်...</button>
          </div>
        </section>

        {/* Stories-style collections */}
        <section className="no-scrollbar flex gap-2 overflow-x-auto bg-card px-3 py-3">
          {stories.map((s, i) => (
            <div key={s} className="relative h-40 w-24 shrink-0">
              <Cover i={i + 2} title="" className="h-full w-full" />
              <div className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full border-2 border-primary bg-card text-primary">
                {[Clock, Flame, BookMarked, Newspaper, Cpu, Shield][i] && (() => { const I = [Clock, Flame, BookMarked, Newspaper, Cpu, Shield][i]; return <I className="h-4 w-4" />; })()}
              </div>
              <span className="absolute bottom-2 left-2 text-xs font-bold text-primary-foreground drop-shadow">{s}</span>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-px overflow-hidden bg-border">
          {[["12,480", "စာအုပ်"], ["3,215", "E-Books"], ["08:30–16:30", "ဖွင့်ချိန်"]].map(([n, l]) => (
            <div key={l} className="bg-card px-2 py-3 text-center">
              <div className="text-sm font-extrabold text-foreground">{n}</div>
              <div className="text-[11px] text-muted-foreground">{l}</div>
            </div>
          ))}
        </section>

        {/* Featured horizontal */}
        <section className="bg-card py-3">
          <div className="flex items-center justify-between px-3 pb-2">
            <h2 className="text-[15px] font-bold">Featured Books</h2>
            <button className="flex items-center text-xs font-semibold text-primary">See all <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-3">
            {books.map((b, i) => (
              <div key={b.t} className="w-28 shrink-0">
                <Cover i={i} title={b.t} className="aspect-[2/3] w-full" />
                <p className="mt-1.5 line-clamp-1 text-xs font-semibold leading-snug">{b.t}</p>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newspapers */}
        <section className="bg-card px-3 py-3">
          <h2 className="pb-2 text-[15px] font-bold">နေ့စဉ်သတင်းစာ</h2>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {papers.map((p, i) => (
              <button key={p} onClick={() => setPaper(i)} className={`flex-1 rounded-md py-1.5 text-xs font-semibold leading-relaxed transition ${paper === i ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>{p}</button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-border p-2">
            <div className="grid h-16 w-12 place-items-center rounded bg-secondary"><Newspaper className="h-6 w-6 text-muted-foreground" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-relaxed">{papers[paper]} — ယနေ့ထုတ်</p>
              <p className="text-xs text-muted-foreground">17 Oct 2026 · PDF · 24 pages</p>
            </div>
            <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">ဖတ်မည်</button>
          </div>
        </section>

        {/* Feed posts */}
        {books.slice(0, 5).map((b, i) => (
          <article key={b.t} className="bg-card">
            <div className="flex items-center gap-2 px-3 pt-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary"><Library className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">OCDI Library</p>
                <p className="text-[11px] text-muted-foreground">{i + 1}h · New arrival · {b.c}</p>
              </div>
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="px-3 py-2 text-sm leading-relaxed">စာအုပ်အသစ် ရောက်ရှိပါပြီ — <b>{b.t}</b> by {b.a}</p>
            <div className="flex gap-3 bg-muted/60 p-3">
              <Cover i={i + 3} title={b.t} className="aspect-[2/3] w-24 shrink-0" />
              <div className="flex min-w-0 flex-col justify-center gap-1">
                <span className="w-fit rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">{b.c}</span>
                <p className="text-sm font-bold leading-snug">{b.t}</p>
                <p className="text-xs text-muted-foreground">{b.a}</p>
                <p className="flex items-center gap-1 text-xs text-accent"><Star className="h-3.5 w-3.5 fill-current" /> {b.r}</p>
                <span className="text-[11px] font-semibold text-success">● Available</span>
              </div>
            </div>
            <div className="flex border-t border-border text-xs font-semibold text-muted-foreground">
              {[[Heart, "Like"], [MessageCircle, "Review"], [Share2, "Share"]].map(([I, l]) => {
                const Ic = I as typeof Heart;
                return <button key={l as string} className="flex flex-1 items-center justify-center gap-1.5 py-2.5 active:bg-muted"><Ic className="h-4 w-4" />{l as string}</button>;
              })}
            </div>
          </article>
        ))}

        <footer className="px-3 py-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          © 2026 OCDI Library Management System
        </footer>
      </main>

      {/* AI librarian */}
      <button
        onClick={() => setChat(true)}
        className={`glass fixed right-3 z-30 flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 shadow-lg transition-all duration-300 bottom-[calc(64px+env(safe-area-inset-bottom))] ${hideFab || drawer || chat ? "pointer-events-none translate-y-28 opacity-0" : ""}`}
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
        </span>
        <span className="text-xs font-bold leading-relaxed">စာကြည့်တိုက်မှူးလေး</span>
      </button>

      {/* Bottom nav */}
      <nav className="glass pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border">
        <div className="flex">
          {navTabs.map(({ id, icon: I, l }) => {
            const active = tab === id && id !== "menu";
            return (
              <button
                key={id}
                onClick={() => (id === "menu" ? setDrawer(true) : setTab(id))}
                className={`relative flex flex-1 flex-col items-center gap-0.5 pt-2 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-primary" />}
                {id === "donate" ? (
                  <span className="grid h-6 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><I className="h-4 w-4" /></span>
                ) : (
                  <I className="h-6 w-6" strokeWidth={active ? 2.4 : 1.8} />
                )}
                <span className="leading-relaxed">{l}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Drawer */}
      <div className={`fixed inset-0 z-50 transition ${drawer ? "" : "pointer-events-none"}`}>
        <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute inset-y-0 left-0 w-72 overflow-y-auto bg-sidebar p-4 shadow-xl transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-extrabold text-primary">OCDI Library</span>
            <button aria-label="Close" onClick={() => setDrawer(false)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
          </div>
          {[
            ["Primary", [[Home, "Home"], [Gift, "Donate"], [Flame, "Popular"], [Clock, "Latest"]]],
            ["Digital Media", [[BookMarked, "E-Books (DOS)"], [Newspaper, "Newspapers"], [BookOpen, "Journals"]]],
            ["Catalog", [[BookOpen, "Books"], [Cpu, "Tech"], [Shield, "Army Library"]]],
            ["Taxonomy", [[Users, "Authors"], [Tags, "Categories"]]],
          ].map(([g, items]) => (
            <div key={g as string} className="mb-3">
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g as string}</p>
              {(items as [typeof Home, string][]).map(([I, l]) => (
                <button key={l} onClick={() => setDrawer(false)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium hover:bg-sidebar-accent">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-primary"><I className="h-4 w-4" /></span>{l}
                </button>
              ))}
            </div>
          ))}
        </aside>
      </div>

      {/* Chat */}
      {chat && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm">
          <div className="glass flex h-[75vh] w-full max-w-lg flex-col rounded-t-2xl border border-border">
            <div className="flex items-center gap-2 border-b border-border p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></span>
              <div className="flex-1">
                <p className="text-sm font-bold leading-relaxed">စာကြည့်တိုက်မှူးလေး</p>
                <p className="text-[11px] text-success">● Online · 12,480 books</p>
              </div>
              <button aria-label="Close chat" onClick={() => setChat(false)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}>{m.t}</div>
              ))}
            </div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
              {["စစ်ပညာစာအုပ်", "Tech books", "သတင်းစာ"].map((s) => (
                <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="pb-safe flex gap-2 border-t border-border p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="မေးခွန်း ရိုက်ထည့်ပါ..." className="flex-1 rounded-full border border-input bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <button aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
