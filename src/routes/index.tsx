import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Home, Newspaper, BookOpen, Gift, Menu, Search, Sun, Moon, X, Flame, Clock,
  Cpu, Shield, Users, Tags, BookMarked, Bookmark, Heart, MessageCircle, Share2,
  Send, Sparkles, Library, ChevronRight, Star, CheckCircle, Info, ExternalLink
} from "lucide-react";
import { libraryBooks, BookItem } from "../data/books";

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
const papers = ["ကြေးမုံ", "မြန်မာ့အလင်း", "ရတနာပုံ", "မြဝတီ"];
const stories = [
  { name: "Latest", icon: Clock },
  { name: "Popular", icon: Flame },
  { name: "E-Books", icon: BookMarked },
  { name: "Journals", icon: Newspaper },
  { name: "Tech", icon: Cpu },
  { name: "Army", icon: Shield },
];

const categories = ["အားလုံး", "ရသစာပေ", "နည်းပညာ", "သမိုင်း", "ပညာရေး", "အတွေးအခေါ်/စေ့ဆော်မှု"];

function BookCover({
  title,
  cover,
  i = 0,
  className = "",
}: {
  title: string;
  cover?: string;
  i?: number;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const h = hues[i % hues.length] ?? 182;

  if (cover && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-muted shadow-sm transition-transform duration-200 ${className}`}>
        <img
          src={cover}
          alt={title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity hover:opacity-100" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-lg p-2 ${className}`}
      style={{
        background: `linear-gradient(150deg, oklch(0.62 0.13 ${h}), oklch(0.32 0.08 ${h + 30}))`,
      }}
    >
      <div className="absolute left-1.5 top-0 h-full w-px bg-background/30" />
      <span className="line-clamp-3 text-[11px] font-bold leading-snug text-primary-foreground drop-shadow">
        {title}
      </span>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("အားလုံး");
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [likedBooks, setLikedBooks] = useState<Record<string, boolean>>({});
  const [savedBooks, setSavedBooks] = useState<Record<string, boolean>>({});
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  const [msgs, setMsgs] = useState<{ me: boolean; t: string; books?: BookItem[] }[]>([
    {
      me: false,
      t: "မင်္ဂလာပါ 👋 OCDI စာကြည့်တိုက်မှူးလေး ဖြစ်ပါတယ်။ ဘယ်စာအုပ်၊ ဘယ်စာရေးဆရာကို ရှာပေးရမလဲခင်ဗျာ?",
    },
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

  const filteredBooks = useMemo(() => {
    return libraryBooks.filter((b) => {
      const matchCat =
        activeCategory === "အားလုံး" ||
        b.category.toLowerCase().includes(activeCategory.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.shelf.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { me: true, t: text }]);
    setInput("");

    setTimeout(() => {
      const q = text.toLowerCase().trim();
      const matched = libraryBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      ).slice(0, 3);

      if (matched.length > 0) {
        setMsgs((m) => [
          ...m,
          {
            me: false,
            t: `"${text}" နှင့်ပတ်သက်သော စာအုပ် ${matched.length} အုပ် အောက်တွင် ရှာတွေ့ထားပါသည်ခင်ဗျာ -`,
            books: matched,
          },
        ]);
      } else {
        setMsgs((m) => [
          ...m,
          {
            me: false,
            t: `"${text}" နှင့်ပတ်သက်သော စာအုပ် တိုက်ရိုက်မတွေ့ရှိသေးသော်လည်း စာကြည့်တိုက်ရှာဖွေမှုမှ ရွေးချယ်ဖတ်ရှုနိုင်ပါသည်ခင်ဗျာ။`,
          },
        ]);
      }
    }, 600);
  };

  const toggleLike = (id: string) => {
    setLikedBooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSavedBooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBorrow = () => {
    setBorrowSuccess(true);
    setTimeout(() => setBorrowSuccess(false), 3000);
  };

  const navTabs = [
    { id: "home", icon: Home, l: "ပင်မ" },
    { id: "pubs", icon: Newspaper, l: "သတင်းစာ" },
    { id: "books", icon: BookOpen, l: "စာအုပ်များ" },
    { id: "donate", icon: Gift, l: "လှူဒါန်း" },
    { id: "menu", icon: Menu, l: "မီနူး" },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-muted/40 pb-20">
      {/* Top Header */}
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="flex h-14 items-center gap-2 px-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Library className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-primary">OCDI Library</h1>
            <p className="text-[10px] text-muted-foreground truncate">စာကြည့်တိုက် စီမံခန့်ခွဲမှုစနစ်</p>
          </div>
          <button
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground active:scale-95 transition"
          >
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-sm font-bold text-primary">
            OC
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="px-3 pb-2 pt-1">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="စာအုပ်အမည်၊ စာရေးဆရာ၊ စင်နံပါတ် ရှာရန်..."
              className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto px-3 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="space-y-3 pt-2">
        {/* If Search is Active, Show Search Results directly */}
        {searchQuery.trim() !== "" ? (
          <section className="bg-card px-3 py-3">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-[14px] font-bold">ရှာဖွေတွေ့ရှိချက်များ ({filteredBooks.length})</h2>
              <button onClick={() => setSearchQuery("")} className="text-xs text-primary font-semibold">
                ရှင်းလင်းမည်
              </button>
            </div>
            {filteredBooks.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                "{searchQuery}" နှင့် ကိုက်ညီသော စာအုပ် မတွေ့ရှိပါ။
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredBooks.map((b, i) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBook(b)}
                    className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm transition hover:shadow-md"
                  >
                    <BookCover
                      title={b.title}
                      cover={b.cover}
                      i={i}
                      className="aspect-[2/3] w-full rounded-lg"
                    />
                    <div className="mt-2 space-y-0.5">
                      <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {b.category}
                      </span>
                      <p className="line-clamp-1 text-xs font-bold">{b.title}</p>
                      <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5 text-accent font-semibold">
                          <Star className="h-3 w-3 fill-current" /> {b.rating}
                        </span>
                        <span>{b.shelf}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : tab === "books" ? (
          /* ALL BOOKS TAB */
          <section className="bg-card px-3 py-3">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h2 className="text-[16px] font-extrabold text-foreground">စာအုပ်များ စုစည်းမှု</h2>
                <p className="text-xs text-muted-foreground">စုစုပေါင်း {filteredBooks.length} အုပ်</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredBooks.map((b, i) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBook(b)}
                  className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm transition hover:shadow-md active:scale-98"
                >
                  <BookCover
                    title={b.title}
                    cover={b.cover}
                    i={i}
                    className="aspect-[2/3] w-full rounded-lg"
                  />
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {b.category}
                      </span>
                      <span className="text-[10px] font-bold text-success">● {b.copies} အုပ်</span>
                    </div>
                    <p className="line-clamp-1 text-xs font-bold text-foreground">{b.title}</p>
                    <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5 text-accent font-semibold">
                        <Star className="h-3 w-3 fill-current" /> {b.rating}
                      </span>
                      <span>{b.shelf}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : tab === "pubs" ? (
          /* NEWSPAPERS TAB */
          <section className="bg-card px-3 py-4 space-y-4">
            <h2 className="text-[16px] font-extrabold">နေ့စဉ်သတင်းစာများနှင့် ဂျာနယ်များ</h2>
            <div className="flex gap-1.5 rounded-lg bg-muted p-1">
              {papers.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setPaper(i)}
                  className={`flex-1 rounded-md py-2 text-xs font-bold leading-relaxed transition ${
                    paper === i ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 rounded-xl border border-border p-3 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="grid h-16 w-14 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Newspaper className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-relaxed">{papers[paper]} — ယနေ့ထုတ် သတင်းစာ</p>
                  <p className="text-xs text-muted-foreground">23 October 2026 · PDF ထုတ်ဝေမှု · စာမျက်နှာ ၂၄ မျက်နှာ</p>
                  <span className="mt-1 inline-block rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                    အွန်လိုင်းတွင် ဖတ်ရှုနိုင်ပါသည်
                  </span>
                </div>
              </div>
              <button className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow transition active:scale-95">
                သတင်းစာ အပြည့်အစုံ ဖတ်ရှုမည် (PDF)
              </button>
            </div>
          </section>
        ) : tab === "donate" ? (
          /* DONATE TAB */
          <section className="bg-card px-4 py-5 space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/20 text-accent">
                <Gift className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold">စာအုပ်နှင့် စာကြည့်တိုက် ရန်ပုံငွေ လှူဒါန်းရန်</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                OCDI စာကြည့်တိုက် ဖွံ့ဖြိုးတိုးတက်ရေးနှင့် စာဖတ်ပရိသတ်များ ဗဟုသုတရရှိရေးအတွက် စာအုပ်များ၊ သုတရသစာပေများကို လှူဒါန်းနိုင်ပါသည်။
              </p>
            </div>
            <div className="rounded-xl border border-border p-3 space-y-2 bg-muted/20">
              <p className="text-xs font-bold">လှူဒါန်းနိုင်သည့် အမျိုးအစားများ -</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                <li>သုတ၊ ရသ စာအုပ်အသစ်နှင့် အဟောင်းများ</li>
                <li>အင်ဂျင်နီယာနှင့် နည်းပညာ သင်ရိုးစာအုပ်များ</li>
                <li>မဂ္ဂဇင်း၊ ဂျာနယ်နှင့် သမိုင်းမှတ်တမ်းများ</li>
                <li>E-Books နှင့် Digital Resources များ</li>
              </ul>
            </div>
            <button className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground">
              လှူဒါန်းရန် ဆက်သွယ်စုံစမ်းမည်
            </button>
          </section>
        ) : (
          /* HOME TAB */
          <>
            {/* Stories / Categories */}
            <section className="no-scrollbar flex gap-2.5 overflow-x-auto bg-card px-3 py-3">
              {stories.map(({ name, icon: Icon }, i) => (
                <div
                  key={name}
                  onClick={() => {
                    if (name === "E-Books" || name === "Popular") setTab("books");
                    if (name === "Journals") setTab("pubs");
                  }}
                  className="relative h-36 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border/60 transition hover:scale-102"
                >
                  <BookCover
                    title=""
                    cover={libraryBooks[i]?.cover}
                    i={i + 2}
                    className="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-primary/50 bg-card text-primary shadow">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-xs font-bold text-white drop-shadow">
                    {name}
                  </span>
                </div>
              ))}
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-3 gap-px overflow-hidden bg-border">
              {[
                [`${libraryBooks.length}+`, "စုစုပေါင်းစာအုပ်"],
                ["3,892", "ကတ်တလောက်"],
                ["08:30–16:30", "ဖွင့်ချိန်"],
              ].map(([n, l]) => (
                <div key={l} className="bg-card px-2 py-3 text-center">
                  <div className="text-sm font-extrabold text-foreground">{n}</div>
                  <div className="text-[11px] text-muted-foreground">{l}</div>
                </div>
              ))}
            </section>

            {/* Featured Books Carousel */}
            <section className="bg-card py-3">
              <div className="flex items-center justify-between px-3 pb-2">
                <div>
                  <h2 className="text-[15px] font-bold">အထူးအကြံပြု စာအုပ်များ (Featured)</h2>
                  <p className="text-[11px] text-muted-foreground">ကာဗာဓာတ်ပုံပါ စာအုပ်များ</p>
                </div>
                <button
                  onClick={() => setTab("books")}
                  className="flex items-center text-xs font-semibold text-primary"
                >
                  အားလုံးကြည့် <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="no-scrollbar flex gap-3 overflow-x-auto px-3">
                {libraryBooks.slice(0, 10).map((b, i) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBook(b)}
                    className="w-28 shrink-0 cursor-pointer transition active:scale-95"
                  >
                    <BookCover
                      title={b.title}
                      cover={b.cover}
                      i={i}
                      className="aspect-[2/3] w-full rounded-lg shadow-sm"
                    />
                    <p className="mt-1.5 line-clamp-1 text-xs font-bold leading-snug">{b.title}</p>
                    <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                    <p className="flex items-center gap-1 text-[10px] text-accent font-bold">
                      <Star className="h-3 w-3 fill-current" /> {b.rating}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Daily Newspapers Quick Card */}
            <section className="bg-card px-3 py-3">
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-[15px] font-bold">နေ့စဉ်သတင်းစာ</h2>
                <button onClick={() => setTab("pubs")} className="text-xs font-semibold text-primary">
                  ဖတ်ရှုရန်
                </button>
              </div>
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                {papers.map((p, i) => (
                  <button
                    key={p}
                    onClick={() => setPaper(i)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                      paper === i ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-border p-2">
                <div className="grid h-14 w-12 place-items-center rounded bg-secondary">
                  <Newspaper className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-relaxed">{papers[paper]} — ယနေ့ထုတ်</p>
                  <p className="text-[11px] text-muted-foreground">PDF ထုတ်ဝေမှု · စာမျက်နှာ ၂၄ မျက်နှာ</p>
                </div>
                <button
                  onClick={() => setTab("pubs")}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                >
                  ဖတ်မည်
                </button>
              </div>
            </section>

            {/* Social Feed of New Arrivals */}
            <section className="space-y-2">
              <div className="px-3 pt-2">
                <h2 className="text-[15px] font-bold">စာကြည့်တိုက် အသစ်ရောက်စာအုပ်များ</h2>
              </div>
              {libraryBooks.slice(0, 6).map((b, i) => (
                <article key={b.id} className="bg-card border-b border-border/40">
                  <div className="flex items-center gap-2 px-3 pt-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
                      <Library className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold leading-tight">OCDI Library</p>
                      <p className="text-[11px] text-muted-foreground">{i + 1} ရက်အလို · အသစ်ရောက် · {b.category}</p>
                    </div>
                    <button onClick={() => toggleSave(b.id)}>
                      <Bookmark
                        className={`h-5 w-5 transition ${
                          savedBooks[b.id] ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="px-3 py-2 text-sm leading-relaxed">
                    စာအုပ်အသစ် ရောက်ရှိပါပြီ — <b className="text-foreground">{b.title}</b> ရေးသားသူ ({b.author})
                  </p>

                  <div
                    onClick={() => setSelectedBook(b)}
                    className="flex cursor-pointer gap-3 bg-muted/40 p-3 transition hover:bg-muted/60"
                  >
                    <BookCover
                      title={b.title}
                      cover={b.cover}
                      i={i + 3}
                      className="aspect-[2/3] w-24 shrink-0 rounded-lg shadow"
                    />
                    <div className="flex min-w-0 flex-col justify-center gap-1.5">
                      <span className="w-fit rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {b.category}
                      </span>
                      <p className="text-sm font-bold leading-snug">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.author}</p>
                      <p className="text-[11px] text-muted-foreground">နေရာ - {b.shelf}</p>
                      <p className="flex items-center gap-1 text-xs text-accent font-bold">
                        <Star className="h-3.5 w-3.5 fill-current" /> {b.rating}
                      </p>
                      <span className="text-[11px] font-semibold text-success">● ရရှိနိုင်သည် ({b.copies} အုပ်)</span>
                    </div>
                  </div>

                  <div className="flex border-t border-border text-xs font-semibold text-muted-foreground">
                    <button
                      onClick={() => toggleLike(b.id)}
                      className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 active:bg-muted transition ${
                        likedBooks[b.id] ? "text-red-500" : ""
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedBooks[b.id] ? "fill-red-500" : ""}`} />
                      {likedBooks[b.id] ? "သဘောကျသည်" : "Like"}
                    </button>
                    <button
                      onClick={() => setSelectedBook(b)}
                      className="flex flex-1 items-center justify-center gap-1.5 py-2.5 active:bg-muted"
                    >
                      <MessageCircle className="h-4 w-4" /> အသေးစိတ်
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: b.title, text: `${b.title} by ${b.author}` });
                        }
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 py-2.5 active:bg-muted"
                    >
                      <Share2 className="h-4 w-4" /> မျှဝေမည်
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        <footer className="px-3 py-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          © 2026 OCDI Library Management System · All Rights Reserved
        </footer>
      </main>

      {/* Floating AI Librarian Trigger */}
      <button
        onClick={() => setChat(true)}
        className={`glass fixed right-3 z-30 flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 shadow-lg transition-all duration-300 bottom-[calc(64px+env(safe-area-inset-bottom))] ${
          hideFab || drawer || chat || selectedBook ? "pointer-events-none translate-y-28 opacity-0" : ""
        }`}
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
        </span>
        <span className="text-xs font-bold leading-relaxed">စာကြည့်တိုက်မှူးလေး</span>
      </button>

      {/* Bottom Navigation */}
      <nav className="glass pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border">
        <div className="flex">
          {navTabs.map(({ id, icon: I, l }) => {
            const active = tab === id && id !== "menu";
            return (
              <button
                key={id}
                onClick={() => (id === "menu" ? setDrawer(true) : setTab(id))}
                className={`relative flex flex-1 flex-col items-center gap-0.5 pt-2 text-[10px] font-semibold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-primary" />}
                {id === "donate" ? (
                  <span className="grid h-6 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <I className="h-4 w-4" />
                  </span>
                ) : (
                  <I className="h-6 w-6" strokeWidth={active ? 2.4 : 1.8} />
                )}
                <span className="leading-relaxed">{l}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* BOOK DETAILS MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="glass max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {selectedBook.category}
              </span>
              <button
                onClick={() => setSelectedBook(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <div className="w-32 shrink-0">
                <BookCover
                  title={selectedBook.title}
                  cover={selectedBook.cover}
                  className="aspect-[2/3] w-full rounded-xl shadow-md"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="text-base font-extrabold leading-snug">{selectedBook.title}</h3>
                <p className="text-xs font-semibold text-primary">{selectedBook.author}</p>
                <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                  <p>ထုတ်ဝေခုနှစ် - {selectedBook.year}</p>
                  <p>စာအုပ်စင်နေရာ - <span className="font-bold text-foreground">{selectedBook.shelf}</span></p>
                  <p className="text-success font-semibold">● လက်ကျန်စာအုပ် ({selectedBook.copies}) အုပ်</p>
                  <p className="flex items-center gap-1 text-accent font-bold pt-1">
                    <Star className="h-3.5 w-3.5 fill-current" /> {selectedBook.rating} / 5.0
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 space-y-1">
              <h4 className="text-xs font-bold text-foreground">အကြောင်းအရာ အကျဉ်း</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{selectedBook.desc}</p>
            </div>

            {borrowSuccess ? (
              <div className="flex items-center gap-2 rounded-xl bg-success/20 p-3 text-xs font-bold text-success">
                <CheckCircle className="h-5 w-5" />
                စာအုပ်ငှားရမ်းမှု တောင်းဆိုပြီးပါပြီ။ စာကြည့်တိုက်မှူးထံ လာရောက်ထုတ်ယူနိုင်ပါသည်။
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleBorrow}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow transition active:scale-95"
                >
                  စာအုပ် ငှားရမ်းမည်
                </button>
                <button
                  onClick={() => toggleSave(selectedBook.id)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
                >
                  {savedBooks[selectedBook.id] ? "သိမ်းဆည်းပြီး" : "သိမ်းဆည်းမည်"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Side Drawer */}
      <div className={`fixed inset-0 z-50 transition ${drawer ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity ${
            drawer ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 overflow-y-auto bg-sidebar p-4 shadow-xl transition-transform duration-300 ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-extrabold text-primary">OCDI Library</span>
            <button
              aria-label="Close"
              onClick={() => setDrawer(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {[
            [
              "Primary",
              [
                [Home, "Home", () => setTab("home")],
                [Gift, "Donate", () => setTab("donate")],
                [BookOpen, "Books Catalog", () => setTab("books")],
                [Newspaper, "Newspapers", () => setTab("pubs")],
              ],
            ],
            [
              "Categories",
              [
                [Cpu, "နည်းပညာ", () => { setActiveCategory("နည်းပညာ"); setTab("books"); }],
                [Shield, "သမိုင်းနှင့် နိုင်ငံရေး", () => { setActiveCategory("သမိုင်း"); setTab("books"); }],
                [BookMarked, "ရသစာပေ", () => { setActiveCategory("ရသစာပေ"); setTab("books"); }],
              ],
            ],
          ].map(([g, items]) => (
            <div key={g as string} className="mb-3">
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {g as string}
              </p>
              {(items as [typeof Home, string, () => void][]).map(([I, l, action]) => (
                <button
                  key={l}
                  onClick={() => {
                    action();
                    setDrawer(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium hover:bg-sidebar-accent"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-primary">
                    <I className="h-4 w-4" />
                  </span>
                  {l}
                </button>
              ))}
            </div>
          ))}
        </aside>
      </div>

      {/* AI Librarian Chat */}
      {chat && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm">
          <div className="glass flex h-[78vh] w-full max-w-lg flex-col rounded-t-2xl border border-border">
            <div className="flex items-center gap-2 border-b border-border p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold leading-relaxed">စာကြည့်တိုက်မှူးလေး</p>
                <p className="text-[11px] text-success">● Online · {libraryBooks.length} အုပ် ရှာဖွေနိုင်ပါသည်</p>
              </div>
              <button
                aria-label="Close chat"
                onClick={() => setChat(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {msgs.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    }`}
                  >
                    {m.t}
                  </div>
                  {m.books && m.books.length > 0 && (
                    <div className="space-y-1.5 pl-2">
                      {m.books.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setChat(false);
                            setSelectedBook(b);
                          }}
                          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card p-2 hover:bg-muted"
                        >
                          <BookCover title={b.title} cover={b.cover} className="h-14 w-10 shrink-0 rounded" />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-xs font-bold">{b.title}</p>
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                            <p className="text-[10px] text-primary font-semibold">{b.shelf}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
              {["နည်းပညာ", "နိုင်ဝင်းဆွေ", "မင်းလူ", "သမိုင်း", "IKIGAI", "သတင်းစာ"].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="pb-safe flex gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="စာအုပ်အမည်၊ စာရေးဆရာ မေးမြန်းရန်..."
                className="flex-1 rounded-full border border-input bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
