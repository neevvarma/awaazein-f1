"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin, Users, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Orbitron } from "next/font/google";

/* ────────────────────────────────────────────────────────────────
   Awaazein F1 — Site
   Home • About • Venue • Line Up • Volunteer • Board • Sponsorship
   Gallery • Contact
──────────────────────────────────────────────────────────────── */

const EVENT_DATE = new Date("2026-02-21T18:00:00-06:00"); // Feb 21, 2026
const VENUE = "Irving, TX";
const TEAMS_COUNT = 10;

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-orbitron",
});

// Labels under the photo
const BOARD_LABEL_POSITION: "below" | "topRight" = "below";

const theme = {
  text: "text-white",
  panel: "bg-white/10",
  ring: "ring-1 ring-white/15",
};

const ACCENT_HEADING =
  "text-[#00E0FF] drop-shadow-[0_0_12px_rgba(0,224,255,0.5)]";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function formatEventDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "America/Chicago",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function useCountdown(to: Date) {
  const calc = React.useCallback(() => {
    const now = Date.now();
    const diff = Math.max(0, to.getTime() - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
  }, [to]);

  const [t, setT] = React.useState(calc());
  React.useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

/* ── Background neon sweeps (brighter + subtle motion) ── */
const SpeedLines: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
    {/* deep base */}
    <div className="absolute inset-0" style={{ background: "#070b14" }} />
    {/* big color pools */}
    <div
      className="absolute -inset-40 animate-[pulse_6s_ease-in-out_infinite]"
      style={{
        background:
          "radial-gradient(1200px 720px at 22% 16%, rgba(0,224,255,0.42), transparent 60%)," +
          "radial-gradient(1200px 720px at 80% 72%, rgba(225,6,0,0.40), transparent 60%)",
        filter: "saturate(185%) blur(0.6px)",
      }}
    />
    {/* fast streaks */}
    <div
      className="absolute -right-[24%] -top-20 h-[170%] w-[95%] rotate-[18deg] opacity-95 animate-[sweep1_14s_linear_infinite]"
      style={{ background: "linear-gradient(90deg, transparent, rgba(0,224,255,0.85), transparent)" }}
    />
    <div
      className="absolute -left-[28%] top-1/3 h-[150%] w-[82%] -rotate-[12deg] opacity-95 animate-[sweep2_16s_linear_infinite]"
      style={{ background: "linear-gradient(90deg, transparent, rgba(225,6,0,0.85), transparent)" }}
    />
    {/* faint cross-glow */}
    <div
      className="absolute inset-0 opacity-50"
      style={{
        background:
          "conic-gradient(from 120deg at 30% 20%, rgba(0,224,255,0.28), transparent 30%)," +
          "conic-gradient(from -60deg at 70% 80%, rgba(225,6,0,0.28), transparent 30%)",
      }}
    />
    <style jsx global>{`
      @keyframes sweep1 { 0% {transform: translateX(0);} 100% {transform: translateX(-8%);} }
      @keyframes sweep2 { 0% {transform: translateX(0);} 100% {transform: translateX(6%);} }
      @keyframes pulse  { 0%,100% {opacity:.95} 50% {opacity:.8} }
    `}</style>
  </div>
);

/* ── Parallax track lines ── */
const TrackParallax: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.35, 0.15, 0]);
  return (
    <motion.svg
      style={{ y, opacity }}
      className="pointer-events-none absolute inset-0 -z-10"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trackGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#00E0FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E10600" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M50,700 C200,650 350,620 500,650 C650,680 800,760 990,710"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M120,620 C300,570 450,560 620,590 C780,615 950,660 1100,640"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
    </motion.svg>
  );
};

/* ── Small helpers ── */
const FadeIn: React.FC<React.PropsWithChildren<{ delay?: number }>> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{ duration: 0.55, delay }}
  >
    {children}
  </motion.div>
);

const Section: React.FC<React.PropsWithChildren<{ id?: string; title?: string }>> = ({
  id,
  title,
  children,
}) => (
  <section id={id} className="relative mx-auto max-w-6xl px-6 pb-24">
    {title && (
      <h2 className={cx("text-2xl md:text-3xl font-bold mb-6 tracking-tight", ACCENT_HEADING)}>
        {title}
      </h2>
    )}
    {children}
  </section>
);

const CheckeredDivider = () => (
  <div
    aria-hidden
    className="h-3 w-full my-12 rounded [background:repeating-linear-gradient(45deg,#fff_0_10px,#000_10px_20px)] opacity-35"
  />
);

const Stat: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full border border-white/20 grid place-items-center">{icon}</div>
    <div>
      <div className="text-white/65 text-xs uppercase tracking-widest">{label}</div>
      <div className="text-white text-lg font-semibold">{value}</div>
    </div>
  </div>
);

/* ── Tickets modal ── */
const ComingSoonModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur">
      <div className="w-[90%] max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 text-white shadow-xl">
        <h3 className={cx("text-xl font-semibold mb-2", ACCENT_HEADING)}>Tickets — Coming Soon</h3>
        <p className="text-white/85">
          Tickets for Awaazein (Feb 21, 2026 • Irving, TX) will be released soon. Check back here or follow our socials.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={onClose} className="bg-[#E10600] hover:bg-[#c70500]">Close</Button>
        </div>
      </div>
    </div>
  );
};

/* ── Lightbox ── */
const Lightbox: React.FC<{ src: string | null; alt: string; onClose: () => void }> = ({
  src,
  alt,
  onClose,
}) => {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (src) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div
      className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm grid place-items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer. Press Escape to close."
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
        aria-label="Close image viewer"
      >
        <X size={18} />
      </button>
      <div className="relative w-[92vw] h-[92vh]" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt={alt} fill className="object-contain select-none" priority />
      </div>
    </div>
  );
};

/* ── F1 Driver Card ── */
type Driver = { name: string; title: string; img: string };

const DriverCard: React.FC<{
  driver: Driver;
  onOpen: (src: string, alt: string) => void;
}> = ({ driver, onOpen }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative rounded-3xl overflow-hidden ring-1 ring-white/15 bg-gradient-to-br from-[#0B1528] to-[#0A0F1E] shadow-[0_10px_50px_rgba(0,0,0,0.35)] cursor-zoom-in"
      onClick={() => onOpen(driver.img, `${driver.name} — ${driver.title}`)}
    >
      {/* Neon livery slash behind */}
      <div
        className="absolute -top-16 -right-24 h-60 w-96 rotate-12 opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,224,255,0.85), rgba(225,6,0,0.85))",
          filter: "blur(18px)",
        }}
      />
      {/* subtle checkered corner */}
      <div className="absolute top-0 left-0 h-20 w-20 opacity-30 [background:repeating-linear-gradient(45deg,#fff_0_8px,#000_8px_16px)] rounded-br-3xl" />

      {/* Image */}
      <div className="relative aspect-[4/5]">
        <Image
          src={driver.img}
          alt={`${driver.name} headshot`}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 768px) 360px, 100vw"
        />
      </div>

      {/* Labels BELOW the image */}
      {BOARD_LABEL_POSITION === "below" && (
        <div className="relative px-4 py-3 md:px-5 md:py-4 bg-black/30 backdrop-blur rounded-b-3xl border-t border-white/10">
          <div className="text-xs text-white/70 uppercase tracking-widest">{driver.title}</div>
          <div className="mt-1 text-xl md:text-2xl font-extrabold [font-family:var(--font-orbitron)] tracking-wide">
            {driver.name}
          </div>
        </div>
      )}

      {/* Outer neon on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-[#00E0FF]/50 group-hover:shadow-[0_0_35px_rgba(0,224,255,0.35)] transition-all duration-300" />
    </motion.div>
  );
};

/* ── Page ── */
export default function Page() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const [ticketsOpen, setTicketsOpen] = React.useState(false);

  const [lightboxSrc, setLightboxSrc] = React.useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = React.useState<string>("");

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };

  // Directors
  const directors: Driver[] = [
    { name: "Dhvani Sharma", title: "Director", img: "/board/directors/dhvani.JPEG" },
    { name: "Neev Varma", title: "Director", img: "/board/directors/neev.JPEG" },
    { name: "Svetlana Gundabathula", title: "Director", img: "/board/directors/svetlana.JPEG" },
  ];

  // Assistant Directors
  const assistantDirectors: Driver[] = [
    { name: "Niharika Saravana", title: "Assistant Director", img: "/board/assistant/niharika.JPEG" },
    { name: "Pallavi Tumuluru", title: "Assistant Director", img: "/board/assistant/pallavi.JPEG" },
    { name: "Omisha Cherala", title: "Assistant Director", img: "/board/assistant/omisha.JPEG" },
  ];

  // Advisors
  const advisors: Driver[] = [
    { name: "Rhea Joshi", title: "Advisor", img: "/board/advisors/rhea.jpeg" },
    { name: "Arya Biju", title: "Advisor", img: "/board/advisors/arya.jpeg" },
  ];

  // Logistics
  const logistics: Driver[] = [
    { name: "Hima Patel", title: "Logistics", img: "/board/logistics/hima.jpeg" },
    { name: "Shreya Bhat", title: "Logistics", img: "/board/logistics/shreyab.jpeg" },
    { name: "Mrinalika Ampagowni", title: "Logistics", img: "/board/logistics/mrinalika.jpeg" },
  ];

  // Finance
  const finance: Driver[] = [
    { name: "Khushi Patel", title: "Finance", img: "/board/finance/khuship.jpeg" },
    { name: "Jay Vellanki", title: "Finance", img: "/board/finance/jay.jpeg" },
    { name: "Manvitha Edara", title: "Finance", img: "/board/finance/manvi.jpeg" },
  ];

  // Tech
  const tech: Driver[] = [
    { name: "Misha Patel", title: "Tech", img: "/board/tech/misha.jpeg" },
    { name: "Lahek Patel", title: "Tech", img: "/board/tech/lahek.jpeg" },
  ];

  // Liaison Coordinators
  const liaisonCoordinators: Driver[] = [
    { name: "Mahak Rawal", title: "Liaison Coordinator", img: "/board/lc/mahak.jpg" },
    { name: "Prakrit Sinha", title: "Liaison Coordinator", img: "/board/lc/prakrit.jpg" },
    { name: "Tamanna Vijay", title: "Liaison Coordinator", img: "/board/lc/tamanna.jpg" },
    { name: "Mahintha Karthik", title: "Liaison Coordinator", img: "/board/lc/mahintha.jpg" },
  ];

  // After Party
  const afterParty: Driver[] = [
    { name: "Anika Kallam", title: "After Party", img: "/board/ap/anika.jpg" },
    { name: "Riya Indukuri", title: "After Party", img: "/board/ap/riya.jpg" },
  ];

  // Mixer
  const mixer: Driver[] = [
    { name: "Sarvani Nookala", title: "Mixer", img: "/board/mixer/sarvani.jpeg" },
    { name: "Sathvika Seeram", title: "Mixer", img: "/board/mixer/sathvika.jpeg" },
    { name: "Samarth Bikki", title: "Mixer", img: "/board/mixer/samarth.jpeg" },
  ];

  // Registration
  const registration: Driver[] = [
    { name: "Aarya Chipalkatti", title: "Registration", img: "/board/reg/aarya.jpg" },
    { name: "Sai Mariappan", title: "Registration", img: "/board/reg/sai.jpg" },
  ];

  // Hospitality
  const hospitality: Driver[] = [
    { name: "Olivia Riju", title: "Hospitality", img: "/board/hosp/olivia.jpg" },
    { name: "Saloni Janorkar", title: "Hospitality", img: "/board/hosp/saloni.jpg" },
    { name: "Tarana Nagarajan", title: "Hospitality", img: "/board/hosp/tarana.jpg" },
  ];

  // Marketing
  const marketing: Driver[] = [
    { name: "Khushi Aggarwal", title: "Marketing", img: "/board/marketing/khushia.jpg" },
    { name: "Sai Manchikanti", title: "Marketing", img: "/board/marketing/saij.jpg" },
    { name: "Giana Abraham", title: "Marketing", img: "/board/marketing/giana.jpg" },
  ];

  // Graphics
  const graphics: Driver[] = [
    { name: "Pranav Cherala", title: "Graphics", img: "/board/graphics/pranav.jpg" },
    { name: "Shreya Sil", title: "Graphics", img: "/board/graphics/shreyas.jpg" },
    { name: "Drshika Chenna", title: "Graphics", img: "/board/graphics/drshika.jpg" },
  ];

  // Contact form local state
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState<"idle" | "ok" | "err">("idle");
  const formRef = React.useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setSent("idle");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Bad response");
      setSent("ok");
      formRef.current?.reset();
    } catch {
      setSent("err");
    } finally {
      setSending(false);
    }
  }

  return (
    <main
      id="home"
      className={cx(
        "min-h-screen relative overflow-hidden scroll-smooth",
        theme.text,
        orbitron.variable
      )}
      style={{
        background:
          "radial-gradient(1200px 800px at 15% 10%, rgba(0,224,255,0.28), transparent 55%)," +
          "radial-gradient(1200px 800px at 85% 75%, rgba(225,6,0,0.28), transparent 55%)," +
          "#070b14",
      }}
    >
      <SpeedLines />
      <TrackParallax />

      {/* NAV + HUD */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full ring-1 ring-white/30 overflow-hidden">
              <Image src="/awz-logo.png" alt="Awaazein" fill sizes="36px" className="object-cover" />
            </div>
            <span className="font-bold tracking-wider">Awaazein 2026</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/85">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#venue" className="hover:text-white">Venue</a>
            <a href="#lineup" className="hover:text-white">Line Up</a>
            <a href="#volunteer" className="hover:text-white">Volunteer Info</a>
            <a href="#board" className="hover:text-white">Board</a>
            <a href="#sponsorship" className="hover:text-white">Sponsorship</a>
            <a href="#gallery" className="hover:text-white">Gallery</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <Button
              onClick={() => setTicketsOpen(true)}
              className="ml-2 bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_20px_rgba(225,6,0,0.45)]"
            >
              Tickets
            </Button>
          </nav>
        </div>

        {/* HUD countdown bar (mobile-friendly) */}
        <div className="sticky top-14 z-20">
          <div className="mx-auto max-w-6xl px-3 sm:px-6 pb-2">
            <div className="rounded-xl bg-black/55 border border-white/15 backdrop-blur grid grid-flow-col auto-cols-max gap-3 sm:gap-4 px-3 sm:px-4 py-2 overflow-x-auto no-scrollbar">
              {["Days", "Hours", "Minutes", "Seconds"].map((lbl, idx) => (
                <div key={lbl} className="flex items-baseline gap-2 pr-1">
                  <span className="text-xs uppercase text-white/60 tracking-widest min-w-12">{lbl}</span>
                  <span className="font-mono text-lg" suppressHydrationWarning>
                    {hydrated ? [d, h, m, s][idx].toString().padStart(2, "0") : "--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              <span className="[font-family:var(--font-orbitron)] tracking-wide normal-case">Awaazein</span>{" "}
              <span className="text-[#00E0FF] drop-shadow-[0_0_18px_rgba(0,224,255,0.55)]">F1 Edition</span>
            </motion.h1>

            <p className="mt-4 max-w-prose text-white/90">
              South Asian a-capella like you’ve never seen it — speed, precision, and harmony.
              Join us for a night where voices race to victory.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => setTicketsOpen(true)}
                className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_24px_rgba(225,6,0,0.5)]"
              >
                Tickets — Coming Soon
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid sm:grid-cols-3 gap-6">
              <Stat label="Date" value={formatEventDate(EVENT_DATE)} icon={<CalendarDays size={18} />} />
              <Stat label="Venue" value={VENUE} icon={<MapPin size={18} />} />
              <Stat label="Teams" value={`${TEAMS_COUNT}`} icon={<Users size={18} />} />
            </div>
          </div>

          {/* Circular logo */}
          <div className="relative rounded-2xl border border-white/20 bg-black/40 p-6 md:p-8">
            <div className="relative h-80 w-80 md:h-[26rem] md:w-[26rem] rounded-full overflow-hidden ring-2 ring-white/25 shadow-[0_0_90px_rgba(0,224,255,0.35)] mx-auto">
              <Image src="/awz-logo.png" alt="Awaazein Logo" fill className="object-contain bg-transparent" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Exec Board hero photo */}
      <section aria-label="Exec Board Photo" className="relative mx-auto max-w-6xl px-6 pb-16">
        <div
          className="group relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in"
          onClick={() =>
            openLightbox("/board.png", "Awaazein Exec Board 2026 holding checkered flags at an indoor kart track")
          }
        >
          <Image
            src="/board.png"
            alt="Awaazein Exec Board 2026 holding checkered flags at an indoor kart track"
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15 pointer-events-none" />
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" title="About Awaazein">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className="order-2 md:order-1">
              <p className="text-white/90 text-lg md:text-xl leading-relaxed md:leading-8">
                Awaazein is DFW&apos;s premier South Asian a-capella competition. Translating to
                &quot;The Voices&quot; in Hindi, Awaazein is a bid competition under the Association of
                South Asian A-Capella (ASA). Teams from all over the nation participate in Awaazein,
                hoping for a chance to win the coveted award and advance to the prestigious national
                competition: All American Awaaz. Check out their website for more information.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <a href="https://www.desiacappella.org" target="_blank" rel="noopener noreferrer">
                    Visit ASA (desiacappella.org)
                  </a>
                </Button>

                <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <a href="https://allamericanawaaz.com/" target="_blank" rel="noopener noreferrer">
                    All American Awaaz
                  </a>
                </Button>
              </div>
            </div>

            {/* Image (clickable) */}
            <div className="order-1 md:order-2">
              <div
                className="group relative w-full aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in"
                onClick={() => openLightbox("/about.png", "Awaazein team performing")}
              >
                <Image
                  src="/about.png"
                  alt="Awaazein team performing"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 768px) 560px, 100vw"
                />
              </div>
            </div>
          </div>
        </FadeIn>
        <CheckeredDivider />
      </Section>

      {/* VENUE */}
      <Section id="venue">
        <div className="mb-4">
          <h2 className={cx("text-2xl md:text-3xl font-bold tracking-tight", ACCENT_HEADING)}>Venue:</h2>
          <div className="text-3xl md:text-4xl font-extrabold text-white mt-1">Irving Arts Center</div>
        </div>

        <div className="mb-6">
          <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
            <a
              href="https://maps.google.com/?q=Irving+Arts+Center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </Button>
        </div>

        <FadeIn>
          <div className="grid gap-6 md:grid-cols-2">
            <div
              className="group relative w-full rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in aspect-[16/9]"
              onClick={() => openLightbox("/Irvingartscenterone.png", "Irving Arts Center exterior")}
            >
              <Image
                src="/Irvingartscenterone.png"
                alt="Irving Arts Center exterior"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>

            <div
              className="group relative w-full rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in aspect-[16/9]"
              onClick={() => openLightbox("/Irvingartscenterthree.jpg", "Irving Arts Center auditorium from balcony")}
            >
              <Image
                src="/Irvingartscenterthree.jpg"
                alt="Irving Arts Center auditorium from balcony"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>

            <div
              className="group relative w-full rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in md:col-span-2 aspect-[21/9] md:aspect-[18/7]"
              onClick={() => openLightbox("/Irvingartscentertwo.png", "Irving Arts Center auditorium from stage")}
            >
              <Image
                src="/Irvingartscentertwo.png"
                alt="Irving Arts Center auditorium from stage"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(min-width: 768px) 100vw, 100vw"
              />
            </div>
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* LINE UP */}
      <Section id="lineup">
        <div className="mb-4">
          <h2 className={cx("text-2xl md:text-3xl font-bold tracking-tight", ACCENT_HEADING)}>Line Up:</h2>
          <div className="mt-1 text-3xl md:text-4xl font-extrabold text-white">10 Teams</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-3xl md:text-4xl font-extrabold text-white">One Champion</div>
            <Flag size={24} className="text-white/90" aria-hidden />
          </div>
        </div>

        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="text-white text-3xl md:text-5xl font-extrabold [text-shadow:_0_0_28px_rgba(0,224,255,0.35)]">
                Coming Soon — Winter 2025
              </div>
            </div>

            <div className="order-1 md:order-2 md:-mt-20 lg:-mt-28 xl:-mt-36">
              <div
                className="group relative w-full aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in shadow-[0_0_40px_rgba(0,224,255,0.15)]"
                onClick={() => openLightbox("/f1.jpg", "F1 car inspiration for lineup reveal")}
              >
                <Image
                  src="/f1.jpg"
                  alt="F1 car inspiration for lineup reveal"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 768px) 560px, 100vw"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* VOLUNTEER INFO */}
      <Section id="volunteer" title="Interested in Being a Volunteer?">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className="order-2 md:order-1">
              <p className="text-white/90 text-lg md:text-xl leading-relaxed md:leading-8">
                Be a part of our Awaazein family and see the behind-the-scenes of our competition!
                Volunteers help with the major parts of the weekend and are the backbone of Awaazein.
                This is the perfect way to get involved with the circuit without a heavy time commitment.
                Click the link below to submit an application—we look forward to working with you!
              </p>

              <p className="mt-3 text-white/75 italic">— Awaazein Executive Board</p>

              <div className="mt-5">
                <Button
                  asChild
                  className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_22px_rgba(225,6,0,0.45)]"
                >
                  <a
                    href="https://forms.gle/Wzbsfnw4m7oLzJiQ6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply to Volunteer
                  </a>
                </Button>
              </div>
            </div>

            {/* Image (clickable) */}
            <div className="order-1 md:order-2 md:-mt-10 lg:-mt-16">
              <div
                className="group relative w-full aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in"
                onClick={() =>
                  openLightbox("/Volunteer.JPG", "Awaazein volunteers and liaisons at the venue")
                }
              >
                <Image
                  src="/Volunteer.JPG"
                  alt="Awaazein volunteers and liaisons at the venue"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 768px) 560px, 100vw"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* BOARD (moved before Gallery) */}
      <Section id="board" title="Meet Our Amazing Board Members">
        {/* Directors */}
        <div className="mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Directors</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {directors.map((d) => (
              <DriverCard key={d.name} driver={d} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Assistant Directors */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Assistant Directors</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {assistantDirectors.map((d) => (
              <DriverCard key={d.name} driver={d} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Advisors */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Advisors</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {advisors.map((a) => (
              <DriverCard key={a.name} driver={a} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Teams */}
        {[
          { title: "Logistics", list: logistics },
          { title: "Finance", list: finance },
          { title: "Tech", list: tech },
          { title: "Liaison Coordinators", list: liaisonCoordinators },
          { title: "After Party", list: afterParty },
          { title: "Mixer", list: mixer },
          { title: "Registration", list: registration },
          { title: "Hospitality", list: hospitality },
          { title: "Marketing", list: marketing },
          { title: "Graphics", list: graphics },
        ].map((grp) => (
          <React.Fragment key={grp.title}>
            <div className="mt-10 mb-4">
              <h3 className="text-2xl md:text-3xl font-extrabold">{grp.title}</h3>
            </div>
            <FadeIn>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {grp.list.map((p) => (
                  <DriverCard key={p.name} driver={p} onOpen={openLightbox} />
                ))}
              </div>
            </FadeIn>
          </React.Fragment>
        ))}

        <CheckeredDivider />
      </Section>

      {/* SPONSORSHIP */}
      <Section id="sponsorship" title="Sponsorship">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: sponsor info + packet */}
            <div className={cx("rounded-2xl p-6 border", theme.ring, theme.panel)}>
              <h3 className="text-xl font-bold mb-3">Partner With Us</h3>
              <p className="text-white/90">
                Interested in supporting our show and promoting your brand? Awaazein gathers an
                audience of diverse individuals from across the nation—an ideal place to advertise
                your business. Click below to view our sponsorship packet for more information. If
                interested, please email <span className="font-semibold">awaazeinexec@gmail.com</span>.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="bg-[#00E0FF] hover:bg-[#02b8cf] text-black font-semibold">
                  <a href="/SPONSORSHIP PACKET 2026.pdf" target="_blank" rel="noopener noreferrer">
                    View Sponsorship Packet (PDF)
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <a href="mailto:awaazeinexec@gmail.com">Email Us</a>
                </Button>
              </div>
            </div>

            {/* Right: donations */}
            <div className={cx("rounded-2xl p-6 border", theme.ring, theme.panel)}>
              <h3 className="text-xl font-bold mb-3">Make a Donation</h3>
              <p className="text-white/90">
                Interested in making a donation? Awaazein&apos;s success comes from the support of its strong
                community. All monetary donations go toward enhancing hospitality and the overall team
                experience. Our executive board thanks you in advance for your generosity!
              </p>
              <div className="mt-5">
                <Button
                  asChild
                  className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_22px_rgba(225,6,0,0.45)]"
                >
                  <a
                    href="https://gofund.me/1bbb82734"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donate on GoFundMe
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* GALLERY — Puzzle collage */}
      <Section id="gallery" title="Previous Show Gallery">
        <FadeIn>
          {/* black gutters like the reference */}
          <div className="rounded-2xl bg-black p-1 sm:p-2">
            {/* 12-col collage on md+, tidy 2-col on mobile */}
            <div className="grid gap-1 sm:gap-2 grid-cols-2 md:grid-cols-12 auto-rows-[10px] md:auto-rows-[12px]">
              {Array.from({ length: 19 }, (_, i) => i + 1).map((n, i) => {
                // carefully chosen spans to mimic the example mosaic
                const pattern = [
                  { c: 8, r: 18 }, // wide hero
                  { c: 4, r: 12 }, // tall right
                  { c: 4, r: 14 },
                  { c: 4, r: 14 },
                  { c: 4, r: 14 },
                  { c: 7, r: 22 }, // large wide center
                  { c: 5, r: 22 }, // large portrait
                  { c: 4, r: 16 },
                  { c: 4, r: 16 },
                  { c: 4, r: 16 },
                  { c: 5, r: 18 },
                  { c: 7, r: 18 },
                  { c: 4, r: 14 },
                  { c: 4, r: 14 },
                  { c: 4, r: 14 },
                  { c: 8, r: 18 },
                  { c: 4, r: 12 },
                  { c: 6, r: 16 },
                  { c: 6, r: 16 },
                ][i % 19];

                const base =
                  "relative overflow-hidden rounded-sm md:rounded-md ring-1 ring-white/10 group cursor-zoom-in";
                const mobileSpan = "col-span-1 row-span-[26]"; // steady height on mobile
                const desktopSpan = `md:col-span-${pattern.c} md:row-span-[${pattern.r}]`;

                return (
                  <div
                    key={n}
                    className={`${base} ${mobileSpan} ${desktopSpan}`}
                    onClick={() => openLightbox(`/stage/Stage${n}.JPG`, `Stage photo ${n}`)}
                  >
                    <Image
                      src={`/stage/Stage${n}.JPG`}
                      alt={`Stage photo ${n}`}
                      fill
                      priority={i < 4}
                      quality={95}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="
                        (min-width:1280px) 20vw,
                        (min-width:1024px) 25vw,
                        (min-width:768px) 33vw,
                        50vw"
                    />
                    {/* neon hover edge */}
                    <div className="pointer-events-none absolute inset-0 rounded-sm md:rounded-md ring-1 ring-transparent group-hover:ring-[#00E0FF]/50 group-hover:shadow-[0_0_22px_rgba(0,224,255,0.25)] transition-all" />
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact Us">
        <FadeIn>
          <div className={cx("rounded-2xl p-8 border", theme.ring, theme.panel)}>
            <p className="text-white/90 mb-6">
              For inquiries, sponsorships, or volunteering, send us a message and we&apos;ll get back quickly.
            </p>

            <form ref={formRef} onSubmit={onSubmit} className="grid gap-4 max-w-2xl">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm text-white/70">Name</span>
                  <input
                    name="name"
                    required
                    className="rounded-md bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#00E0FF]"
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-white/70">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="rounded-md bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#00E0FF]"
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-sm text-white/70">Subject</span>
                <input
                  name="subject"
                  required
                  className="rounded-md bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#00E0FF]"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm text-white/70">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="rounded-md bg-white/10 border border-white/20 px-3 py-2 outline-none focus:ring-2 focus:ring-[#00E0FF] resize-y"
                />
              </label>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={sending}
                  className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_25px_rgba(225,6,0,0.45)] disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send Message"}
                </Button>
                {sent === "ok" && <span className="text-green-400">Sent! We&apos;ll reply soon.</span>}
                {sent === "err" && <span className="text-red-400">Something went wrong. Please try again.</span>}
              </div>
            </form>
          </div>
        </FadeIn>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/70 text-sm">
          <div className="flex items-center gap-3">
            <Image src="/awz-logo.png" alt="Awaazein" width={28} height={28} className="rounded-full" />
            <span>Awaazein 2026 • All rights reserved</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#venue" className="hover:text-white">Venue</a>
            <a href="#lineup" className="hover:text-white">Line Up</a>
            <a href="#volunteer" className="hover:text-white">Volunteer Info</a>
            <a href="#board" className="hover:text-white">Board</a>
            <a href="#sponsorship" className="hover:text-white">Sponsorship</a>
            <a href="#gallery" className="hover:text-white">Gallery</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ComingSoonModal open={ticketsOpen} onClose={() => setTicketsOpen(false)} />
      <Lightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />
    </main>
  );
}
