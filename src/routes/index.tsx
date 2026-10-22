import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Home, Newspaper, BookOpen, Gift, Menu, Search, Sun, Moon, X, Flame, Clock,
  Cpu, Shield, Users, Tags, BookMarked, Bookmark, Heart, MessageCircle, Share2,
  Send, Sparkles, Library, ChevronRight, Star, CheckCircle, Info, Grid, List,
  BookCheck, Calendar, MapPin
} from "lucide-react";
import { libraryBooks, BookItem } from "../data/books";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OCDI Library — စာကြည့်တိုက် စီမံခန့်ခွဲမှုစနစ်" },
      { name: "description", content: "OCDI Digital Library - Browse books, newspapers, journals and e-books." },
      { property: "og:title", content: "OCDI Library — စာကြည့်တိုက်" },
      { property: "og:description", content: "Browse books, newspapers, journals and e-books from the OCDI Library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  cover?: string | undefined;
  i?: number;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const h = hues[i % hues.length] ?? 182;

  if (cover && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-muted shadow-sm transition-all duration-300 group-hover:scale-102 ${className}`}>
        <img
          src={cover}
          alt={title}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-xl p-3 shadow-sm ${className}`}
      style={{
        background: `linear-gradient(150deg, oklch(0.62 0.13 ${h}), oklch(0.32 0.08 ${h + 30}))`,
      }}
    >
      <div className="absolute left-2 top-0 h-full w-1 bg-white/20" />
      <span className="line-clamp-3 text-xs font-bold leading-snug text-white drop-shadow">
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
    <div className="min-h-screen bg-muted/30 text-foreground transition-colors">
      {/* Top Main Navigation Bar (Desktop & Mobile) */}
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setTab("home"); setSearchQuery(""); }}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow">
              <Library className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-primary">OCDI Library</h1>
              <p className="text-[10px] text-muted-foreground hidden sm:block">စာကြည့်တိုက် စီမံခန့်ခွဲမှုစနစ် · Digital Catalog</p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="စာအုပ်အမည်၊ စာရေးဆရာ၊ စင်နံပါတ် ရှာဖွေပါ..."
              className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navTabs.filter((t) => t.id !== "menu").map(({ id, icon: Icon, l }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{l}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
              className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              OC
            </div>
          </div>
        </div>

        {/* Mobile Quick Search Bar */}
        <div className="md:hidden px-3 pb-2 pt-0.5">
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

        {/* Mobile Categories Scrollbar */}
        <div className="lg:hidden no-scrollbar flex gap-1.5 overflow-x-auto px-3 pb-2.5">
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
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-4 pb-24 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* DESKTOP SIDEBAR (Visible on Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-4">
            {/* Library Quick Stats Box */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">စာကြည့်တိုက် အချက်အလက်</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-muted/60 p-2.5 text-center">
                  <div className="text-base font-extrabold text-primary">{libraryBooks.length}+</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">ကာဗာပါ စာအုပ်</div>
                </div>
                <div className="rounded-xl bg-muted/60 p-2.5 text-center">
                  <div className="text-base font-extrabold text-foreground">3,892</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">စာရင်းသွင်း</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-1 flex items-center justify-between border-t border-border/60">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ဖွင့်ချိန်</span>
                <span className="font-bold text-foreground">08:30 – 16:30</span>
              </div>
            </div>

            {/* Desktop Categories Filter */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ကဏ္ဍများ (Categories)</h3>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const count =
                    cat === "အားလုံး"
                      ? libraryBooks.length
                      : libraryBooks.filter((b) => b.category.includes(cat)).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] rounded-full px-2 py-0.5 font-semibold ${
                          activeCategory === cat ? "bg-white/20 text-white" : "bg-muted text-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Newspapers Quick Box */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2.5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ယနေ့ထုတ် သတင်းစာ</h3>
              <p className="text-xs font-bold text-foreground">{papers[paper]} — သတင်းစာ</p>
              <p className="text-[11px] text-muted-foreground">PDF ဗားရှင်းကို အွန်လိုင်းတွင် အခမဲ့ ဖတ်ရှုနိုင်ပါသည်။</p>
              <button
                onClick={() => setTab("pubs")}
                className="w-full rounded-xl bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                သတင်းစာများ ဖတ်မည်
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0 space-y-5">
            {/* If Search Active, Show Results */}
            {searchQuery.trim() !== "" ? (
              <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div>
                    <h2 className="text-base font-extrabold text-foreground">ရှာဖွေတွေ့ရှိချက်များ</h2>
                    <p className="text-xs text-muted-foreground">"{searchQuery}" နှင့် ကိုက်ညီသော စာအုပ် ({filteredBooks.length}) အုပ်</p>
                  </div>
                  <button onClick={() => setSearchQuery("")} className="text-xs text-primary font-bold hover:underline">
                    ရှင်းလင်းမည်
                  </button>
                </div>

                {filteredBooks.length === 0 ? (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    "{searchQuery}" နှင့် ကိုက်ညီသော စာအုပ် မတွေ့ရှိသေးပါ။
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 pt-4">
                    {filteredBooks.map((b, i) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBook(b)}
                        className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-2.5 shadow-sm transition hover:shadow-md hover:border-primary/50"
                      >
                        <BookCover
                          title={b.title}
                          cover={b.cover}
                          i={i}
                          className="aspect-[2/3] w-full rounded-lg"
                        />
                        <div className="mt-2 space-y-1">
                          <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {b.category}
                          </span>
                          <p className="line-clamp-1 text-xs font-bold group-hover:text-primary transition">{b.title}</p>
                          <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5 text-accent font-bold">
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
              /* ALL BOOKS FULL GRID VIEW */
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div>
                    <h2 className="text-lg font-black text-foreground">စာအုပ်များ စုစည်းမှု (All Books)</h2>
                    <p className="text-xs text-muted-foreground">ကာဗာဓာတ်ပုံပါရှိသော စာအုပ် စုစုပေါင်း ({filteredBooks.length}) အုပ်</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">ကဏ္ဍ -</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {activeCategory}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                  {filteredBooks.map((b, i) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBook(b)}
                      className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-2.5 shadow-sm transition hover:shadow-md hover:border-primary/50"
                    >
                      <BookCover
                        title={b.title}
                        cover={b.cover}
                        i={i}
                        className="aspect-[2/3] w-full rounded-lg"
                      />
                      <div className="mt-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            {b.category}
                          </span>
                          <span className="text-[10px] font-bold text-success">● {b.copies} အုပ်</span>
                        </div>
                        <p className="line-clamp-1 text-xs font-bold text-foreground group-hover:text-primary transition">{b.title}</p>
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-0.5 text-accent font-bold">
                            <Star className="h-3 w-3 fill-current" /> {b.rating}
                          </span>
                          <span className="font-medium">{b.shelf}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : tab === "pubs" ? (
              /* NEWSPAPERS SECTION */
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="text-lg font-black text-foreground">နေ့စဉ်သတင်းစာများနှင့် ဂျာနယ်များ</h2>
                  <p className="text-xs text-muted-foreground">ယနေ့ထုတ် သတင်းစာများကို PDF ဖြင့် အခမဲ့ ဖတ်ရှုနိုင်ပါသည်</p>
                </div>

                <div className="flex gap-2 rounded-xl bg-muted p-1.5 max-w-lg">
                  {papers.map((p, i) => (
                    <button
                      key={p}
                      onClick={() => setPaper(i)}
                      className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
                        paper === i ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-border p-4 bg-muted/20">
                  <div className="grid h-24 w-20 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Newspaper className="h-10 w-10" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
                    <p className="text-base font-extrabold">{papers[paper]} — ယနေ့ထုတ် သတင်းစာ</p>
                    <p className="text-xs text-muted-foreground">23 October 2026 · PDF ထုတ်ဝေမှု · စာမျက်နှာ ၂၄ မျက်နှာ</p>
                    <span className="inline-block rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
                      ● အွန်လိုင်းတွင် ဖတ်ရှုနိုင်ပါသည်
                    </span>
                  </div>
                  <button className="w-full sm:w-auto rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow transition active:scale-95">
                    သတင်းစာ ဖတ်ရှုမည် (PDF)
                  </button>
                </div>
              </section>
            ) : tab === "donate" ? (
              /* DONATE SECTION */
              <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5 max-w-2xl mx-auto">
                <div className="text-center space-y-2">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/20 text-accent">
                    <Gift className="h-7 w-7" />
                  </div>
                  <h2 className="text-xl font-black">စာအုပ်နှင့် စာကြည့်တိုက် ရန်ပုံငွေ လှူဒါန်းရန်</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    OCDI စာကြည့်တိုက် ဖွံ့ဖြိုးတိုးတက်ရေးနှင့် စာဖတ်ပရိသတ်များ ဗဟုသုတရရှိရေးအတွက် စာအုပ်များ၊ သုတရသစာပေများကို လှူဒါန်းနိုင်ပါသည်။
                  </p>
                </div>
                <div className="rounded-2xl border border-border p-4 space-y-2.5 bg-muted/30">
                  <p className="text-xs font-bold text-foreground">လှူဒါန်းနိုင်သည့် စာအုပ် အမျိုးအစားများ -</p>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>သုတ၊ ရသ စာအုပ်အသစ်နှင့် အဟောင်းများ</li>
                    <li>အင်ဂျင်နီယာနှင့် နည်းပညာ သင်ရိုးစာအုပ်များ</li>
                    <li>မဂ္ဂဇင်း၊ ဂျာနယ်နှင့် သမိုင်းမှတ်တမ်းများ</li>
                    <li>E-Books နှင့် Digital Resources များ</li>
                  </ul>
                </div>
                <button className="w-full rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow">
                  လှူဒါန်းရန် ဆက်သွယ်စုံစမ်းမည်
                </button>
              </section>
            ) : (
              /* HOME TAB */
              <>
                {/* Hero / Stories Carousel */}
                <section className="no-scrollbar flex gap-3 overflow-x-auto rounded-2xl border border-border bg-card p-3 shadow-sm">
                  {stories.map(({ name, icon: Icon }, i) => (
                    <div
                      key={name}
                      onClick={() => {
                        if (name === "E-Books" || name === "Popular") setTab("books");
                        if (name === "Journals") setTab("pubs");
                      }}
                      className="group relative h-40 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border transition hover:scale-102"
                    >
                      <BookCover
                        title=""
                        cover={libraryBooks[i]?.cover}
                        i={i + 2}
                        className="h-full w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-primary/50 bg-card text-primary shadow">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="absolute bottom-2.5 left-2.5 text-xs font-bold text-white drop-shadow">
                        {name}
                      </span>
                    </div>
                  ))}
                </section>

                {/* Featured Books Row */}
                <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div>
                      <h2 className="text-base font-extrabold text-foreground">အထူးအကြံပြု စာအုပ်များ (Featured Books)</h2>
                      <p className="text-xs text-muted-foreground">ကာဗာဓာတ်ပုံပါ စာအုပ်သစ်များ</p>
                    </div>
                    <button
                      onClick={() => setTab("books")}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      အားလုံးကြည့် <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="no-scrollbar flex gap-3.5 overflow-x-auto py-1">
                    {libraryBooks.slice(0, 10).map((b, i) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBook(b)}
                        className="group w-32 shrink-0 cursor-pointer transition active:scale-95"
                      >
                        <BookCover
                          title={b.title}
                          cover={b.cover}
                          i={i}
                          className="aspect-[2/3] w-full rounded-xl shadow"
                        />
                        <p className="mt-2 line-clamp-1 text-xs font-bold leading-snug group-hover:text-primary transition">{b.title}</p>
                        <p className="line-clamp-1 text-[11px] text-muted-foreground">{b.author}</p>
                        <p className="flex items-center gap-1 text-[10px] text-accent font-bold pt-0.5">
                          <Star className="h-3 w-3 fill-current" /> {b.rating}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Feed of Arrivals */}
                <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="border-b border-border/60 pb-3">
                    <h2 className="text-base font-extrabold text-foreground">စာကြည့်တိုက် အသစ်ရောက်စာအုပ်များ</h2>
                    <p className="text-xs text-muted-foreground">မကြာသေးမီက စာရင်းသွင်း ရောက်ရှိထားသော စာအုပ်များ</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {libraryBooks.slice(0, 6).map((b, i) => (
                      <article key={b.id} className="overflow-hidden rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition">
                        <div className="flex items-center gap-2.5 p-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary">
                            <Library className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold leading-tight">OCDI Library</p>
                            <p className="text-[10px] text-muted-foreground">{i + 1} ရက်အလို · {b.category}</p>
                          </div>
                          <button onClick={() => toggleSave(b.id)}>
                            <Bookmark
                              className={`h-4 w-4 transition ${
                                savedBooks[b.id] ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        </div>

                        <div
                          onClick={() => setSelectedBook(b)}
                          className="flex cursor-pointer gap-3 p-3 pt-0"
                        >
                          <BookCover
                            title={b.title}
                            cover={b.cover}
                            i={i + 3}
                            className="aspect-[2/3] w-20 shrink-0 rounded-lg shadow"
                          />
                          <div className="flex min-w-0 flex-col justify-center gap-1">
                            <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                              {b.category}
                            </span>
                            <p className="text-xs font-bold leading-snug">{b.title}</p>
                            <p className="text-[11px] text-muted-foreground">{b.author}</p>
                            <p className="text-[10px] text-muted-foreground">နေရာ - {b.shelf}</p>
                            <span className="text-[10px] font-bold text-success">● ရရှိနိုင်သည် ({b.copies} အုပ်)</span>
                          </div>
                        </div>

                        <div className="flex border-t border-border text-xs font-semibold text-muted-foreground">
                          <button
                            onClick={() => toggleLike(b.id)}
                            className={`flex flex-1 items-center justify-center gap-1.5 py-2 hover:bg-muted transition ${
                              likedBooks[b.id] ? "text-red-500" : ""
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${likedBooks[b.id] ? "fill-red-500" : ""}`} />
                            <span>{likedBooks[b.id] ? "Like ပြုလုပ်ပြီး" : "Like"}</span>
                          </button>
                          <button
                            onClick={() => setSelectedBook(b)}
                            className="flex flex-1 items-center justify-center gap-1.5 py-2 hover:bg-muted"
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> အသေးစိတ်
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            <footer className="pt-6 text-center text-xs text-muted-foreground">
              © 2026 OCDI Library Management System · All Rights Reserved
            </footer>
          </main>
        </div>
      </div>

      {/* Floating AI Librarian Trigger */}
      <button
        onClick={() => setChat(true)}
        className={`glass fixed right-4 z-30 flex items-center gap-2 rounded-full border border-border py-2 pl-2 pr-3.5 shadow-xl transition-all duration-300 bottom-[calc(76px+env(safe-area-inset-bottom))] lg:bottom-6 ${
          hideFab || drawer || chat || selectedBook ? "pointer-events-none translate-y-28 opacity-0" : ""
        }`}
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
        </span>
        <span className="text-xs font-bold leading-relaxed">စာကြည့်တိုက်မှူးလေး</span>
      </button>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav className="lg:hidden glass pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-border">
        <div className="flex">
          {navTabs.map(({ id, icon: I, l }) => {
            const active = tab === id && id !== "menu";
            return (
              <button
                key={id}
                onClick={() => (id === "menu" ? setDrawer(true) : setTab(id))}
                className={`relative flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1 text-[10px] font-semibold ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && <span className="absolute top-0 h-0.5 w-10 rounded-full bg-primary" />}
                {id === "donate" ? (
                  <span className="grid h-6 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <I className="h-4 w-4" />
                  </span>
                ) : (
                  <I className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                )}
                <span className="leading-relaxed">{l}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* BOOK DETAILS MODAL (Desktop & Mobile) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="glass max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {selectedBook.category}
              </span>
              <button
                onClick={() => setSelectedBook(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <div className="w-28 sm:w-36 shrink-0">
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

      {/* AI Librarian Chat Modal */}
      {chat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
          <div className="glass flex h-[80vh] w-full max-w-lg flex-col rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border p-3.5">
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
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary hover:bg-secondary/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
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

            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {["နည်းပညာ", "နိုင်ဝင်းဆွေ", "မင်းလူ", "သမိုင်း", "IKIGAI", "သတင်းစာ"].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
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
              className="flex gap-2 border-t border-border p-3 bg-card/60"
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
