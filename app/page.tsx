"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, MapPin, Users, X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Orbitron } from "next/font/google";

/* ────────────────────────────────────────────────────────────────
   Awaazein F1 — Site
   Home • About • Venue • Line Up • Volunteer • Sponsorship • Gallery • Board • Contact
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

/* ── BIG + BRIGHT (inverted) NEON BACKGROUND ── */
const Streak: React.FC<{
  top: string;
  rotate: number;
  hue: "red" | "cyan";
  delay?: number;
  duration?: number;
  widthVW?: number;
  thick?: number;
  opacity?: number;
}> = ({ top, rotate, hue, delay = 0, duration = 10.8, widthVW = 120, thick = 8, opacity = 1 }) => {
  const rgb = hue === "red" ? "225,6,0" : "0,224,255";
  const common: React.CSSProperties = {
    position: "absolute",
    top,
    left: "-35%",
    width: `${widthVW}vw`,
    transform: `rotate(${rotate}deg)`,
    borderRadius: 9999,
    opacity,
    pointerEvents: "none",
  };
  return (
    <>
      <motion.div
        initial={{ x: "-30%" }}
        animate={{ x: "140%" }}
        transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        style={{
          ...common,
          height: thick * 3,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},0.85), transparent)`,
          filter: "blur(18px) saturate(160%)",
        }}
        className="mix-blend-screen"
      />
      <motion.div
        initial={{ x: "-30%" }}
        animate={{ x: "140%" }}
        transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        style={{
          ...common,
          height: thick,
          background: `linear-gradient(90deg, transparent, rgba(${rgb},1), transparent)`,
          boxShadow: `0 0 26px rgba(${rgb},0.9), 0 0 64px rgba(${rgb},0.65)`,
          filter: "blur(1px)",
        }}
        className="mix-blend-screen"
      />
    </>
  );
};

const SpeedLines: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute -inset-48"
      style={{
        background: [
          "radial-gradient(1500px 900px at 12% -4%, rgba(225,6,0,0.55), transparent 70%)",
          "radial-gradient(1400px 820px at 92% 8%, rgba(0,224,255,0.45), transparent 68%)",
          "radial-gradient(1300px 900px at 18% 78%, rgba(225,6,0,0.18), transparent 66%)",
          "radial-gradient(1300px 900px at 85% 82%, rgba(0,224,255,0.18), transparent 66%)",
        ].join(","),
        filter: "saturate(200%) blur(0.4px)",
      }}
    />
    <div
      className="absolute left-[-20%] top-[8%] w-[160%] h-[180px] mix-blend-screen"
      style={{
        transform: "rotate(10deg)",
        background:
          "linear-gradient(90deg, transparent, rgba(225,6,0,0.4), rgba(225,6,0,0.85), rgba(225,6,0,0.4), transparent)",
        filter: "blur(14px) saturate(180%)",
      }}
    />
    <div
      className="absolute left-[-20%] top-[18%] w-[160%] h-[180px] mix-blend-screen"
      style={{
        transform: "rotate(-10deg)",
        background:
          "linear-gradient(90deg, transparent, rgba(0,224,255,0.4), rgba(0,224,255,0.9), rgba(0,224,255,0.4), transparent)",
        filter: "blur(14px) saturate(180%)",
      }}
    />
    <div
      className="absolute -right-1/3 -top-24 h-[150%] w-[85%] rotate-[18deg] opacity-90"
      style={{ background: "linear-gradient(90deg, transparent, rgba(225,6,0,0.75), transparent)", filter: "saturate(180%)" }}
    />
    <div
      className="absolute -left-1/3 top-1/3 h-[130%] w-[75%] -rotate-[12deg] opacity-90"
      style={{ background: "linear-gradient(90deg, transparent, rgba(0,224,255,0.7), transparent)", filter: "saturate(180%)" }}
    />
    <Streak top="9%" rotate={9} hue="red" delay={0.0} duration={10.6} thick={8} />
    <Streak top="13%" rotate={-8} hue="cyan" delay={0.6} duration={11.2} thick={8} />
    <Streak top="17%" rotate={7} hue="red" delay={1.2} duration={10.0} thick={8} />
    <Streak top="22%" rotate={-6} hue="cyan" delay={1.8} duration={10.4} thick={8} />
    <Streak top="28%" rotate={5} hue="red" delay={2.4} duration={9.8} thick={8} opacity={0.9} />
    <Streak top="34%" rotate={-5} hue="cyan" delay={3.0} duration={10.2} thick={8} opacity={0.9} />
    <Streak top="64%" rotate={10} hue="red" delay={1.1} duration={12.2} thick={7} opacity={0.85} />
    <Streak top="70%" rotate={-10} hue="cyan" delay={1.9} duration={12.6} thick={7} opacity={0.85} />
  </div>
);

/* ── Parallax track lines ── */
const TrackParallax: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.45, 0.2, 0]);

  return (
    <motion.svg
      style={{ y, opacity }}
      className="pointer-events-none absolute inset-0 -z-10"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trackGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#00E0FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#E10600" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M50,700 C200,650 350,620 500,650 C650,680 800,760 990,710"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        d="M120,620 C300,570 450,560 620,590 C780,615 950,660 1100,640"
        fill="none"
        stroke="url(#trackGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
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
    className="h-3 w-full my-12 rounded [background:repeating-linear-gradient(45deg,#fff_0_10px,#000_10px_20px)] opacity-40"
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
      <div className="text-white/70 text-xs uppercase tracking-widest">{label}</div>
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
        <p className="text-white/90">
          Tickets for Awaazein (Feb 21, 2026 &bull; Irving, TX) will be released soon. Check back here or follow our socials.
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
        <Image src={src!} alt={alt} fill className="object-contain select-none" priority />
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
      <div
        className="absolute -top-16 -right-24 h-60 w-96 rotate-12 opacity-80"
        style={{
          background: "linear-gradient(90deg, rgba(0,224,255,0.95), rgba(225,6,0,0.95))",
          filter: "blur(18px)",
        }}
      />
      <div className="absolute top-0 left-0 h-20 w-20 opacity-30 [background:repeating-linear-gradient(45deg,#fff_0_8px,#000_8px_16px)] rounded-br-3xl" />
      <div className="relative aspect-[4/5]">
        <Image
          src={driver.img}
          alt={`${driver.name} headshot`}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(min-width: 768px) 360px, 100vw"
        />
      </div>
      {BOARD_LABEL_POSITION === "below" && (
        <div className="relative px-4 py-3 md:px-5 md:py-4 bg-black/30 backdrop-blur rounded-b-3xl border-t border-white/10">
          <div className="text-xs text-white/70 uppercase tracking-widest">{driver.title}</div>
          <div className="mt-1 text-xl md:text-2xl font-extrabold [font-family:var(--font-orbitron)] tracking-wide">
            {driver.name}
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-[#00E0FF]/60 group-hover:shadow-[0_0_40px_rgba(0,224,255,0.45)] transition-all duration-300" />
    </motion.div>
  );
};

/* ── Collage item for the Gallery ── */
const CollageItem: React.FC<{
  src: string;
  alt: string;
  cls: string;
  onOpen: (src: string, alt: string) => void;
}> = ({ src, alt, cls, onOpen }) => (
  <div
    className={cx(
      "relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-black/20 cursor-zoom-in group",
      "shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
      cls
    )}
    onClick={() => onOpen(src, alt)}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, (min-width:640px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
    />
  </div>
);

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
    { name: "Arya Biju",  title: "Advisor", img: "/board/advisors/arya.jpeg" },
  ];

  // Logistics
  const logistics: Driver[] = [
    { name: "Hima Patel", title: "Logistics", img: "/board/logistics/hima.jpeg" },
    { name: "Shreya Bhat", title: "Logistics", img: "/board/logistics/shreyab.jpeg" },
    { name: "Mrinalika Ampagowni", title: "Logistics", img: "/board/logistics/mrinalika.jpeg" },
  ];

  // Finance
  const finance: Driver[] = [
    { name: "Khushi Patel",   title: "Finance", img: "/board/finance/khuship.jpeg" },
    { name: "Jay Vellanki",   title: "Finance", img: "/board/finance/jay.jpeg" },
    { name: "Manvitha Edara", title: "Finance", img: "/board/finance/manvi.jpeg" },
  ];

  // Tech
  const tech: Driver[] = [
    { name: "Misha Patel", title: "Tech", img: "/board/tech/misha.jpeg" },
    { name: "Lahek Patel", title: "Tech", img: "/board/tech/lahek.jpeg" },
  ];

  // Liaison Coordinators
  const liaisonCoordinators: Driver[] = [
    { name: "Mahak Rawal",         title: "Liaison Coordinator", img: "/board/lc/mahak.jpg" },
    { name: "Prakrit Sinha",       title: "Liaison Coordinator", img: "/board/lc/prakrit.jpg" },
    { name: "Tamanna Vijay",       title: "Liaison Coordinator", img: "/board/lc/tamanna.jpg" },
    { name: "Mahintha Karthik",    title: "Liaison Coordinator", img: "/board/lc/mahintha.jpg" },
  ];

  // After Party
  const afterParty: Driver[] = [
    { name: "Anika Kallam", title: "After Party", img: "/board/ap/anika.jpg" },
    { name: "Riya Indukuri", title: "After Party", img: "/board/ap/riya.jpg" },
  ];

  // Mixer
  const mixer: Driver[] = [
    { name: "Sarvani Nookala",  title: "Mixer", img: "/board/mixer/sarvani.jpeg" },
    { name: "Sathvika Seeram",  title: "Mixer", img: "/board/mixer/sathvika.jpeg" },
    { name: "Samarth Bikki",    title: "Mixer", img: "/board/mixer/samarth.jpeg" },
  ];

  // Registration
  const registration: Driver[] = [
    { name: "Aarya Chipalkatti", title: "Registration", img: "/board/reg/aarya.jpg" },
    { name: "Sai Mariappan",     title: "Registration", img: "/board/reg/sai.jpg" },
  ];

  // Hospitality
  const hospitality: Driver[] = [
    { name: "Olivia Riju",        title: "Hospitality", img: "/board/hosp/olivia.jpg" },
    { name: "Saloni Janorkar",    title: "Hospitality", img: "/board/hosp/saloni.jpg" },
    { name: "Tarana Nagarajan",   title: "Hospitality", img: "/board/hosp/tarana.jpg" },
  ];

  // Marketing
  const marketing: Driver[] = [
    { name: "Khushi Aggarwal", title: "Marketing", img: "/board/marketing/khushia.jpg" },
    { name: "Sai Manchikanti", title: "Marketing", img: "/board/marketing/saij.jpg" },
    { name: "Giana Abraham",   title: "Marketing", img: "/board/marketing/giana.jpg" },
  ];

  // Graphics
  const graphics: Driver[] = [
    { name: "Pranav Cherala",   title: "Graphics", img: "/board/graphics/pranav.jpg" },
    { name: "Shreya Sil",       title: "Graphics", img: "/board/graphics/shreyas.jpg" },
    { name: "Drshika Chenna",   title: "Graphics", img: "/board/graphics/drshika.jpg" },
  ];

  // Gallery sources
  const stageImages = Array.from({ length: 19 }, (_, i) => `/stage/Stage${i + 1}.JPG`);

  // Collage pattern
  const collageClasses: string[] = [
    "col-span-2 sm:col-span-6 lg:col-span-8 [grid-row:span_28]",
    "col-span-2 sm:col-span-6 lg:col-span-4 [grid-row:span_28]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-2 sm:col-span-6 lg:col-span-4 [grid-row:span_18]",
    "col-span-2 sm:col-span-6 lg:col-span-12 [grid-row:span_16]",
    "col-span-1 sm:col-span-3 lg:col-span-6 [grid-row:span_20]",
    "col-span-1 sm:col-span-3 lg:col-span-6 [grid-row:span_20]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-2 sm:col-span-6 lg:col-span-8 [grid-row:span_22]",
    "col-span-2 sm:col-span-6 lg:col-span-4 [grid-row:span_22]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-1 sm:col-span-3 lg:col-span-8 [grid-row:span_18]",
    "col-span-1 sm:col-span-3 lg:col-span-6 [grid-row:span_20]",
    "col-span-1 sm:col-span-3 lg:col-span-6 [grid-row:span_20]",
    "col-span-1 sm:col-span-3 lg:col-span-4 [grid-row:span_18]",
    "col-span-1 sm:col-span-3 lg:col-span-8 [grid-row:span_18]",
  ].slice(0, stageImages.length);

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
          "radial-gradient(1400px 860px at 12% -4%, rgba(225,6,0,0.30), transparent 68%)," +
          "radial-gradient(1400px 820px at 92% 6%, rgba(0,224,255,0.28), transparent 68%)," +
          "radial-gradient(1200px 780px at 20% 85%, rgba(225,6,0,0.12), transparent 62%)," +
          "radial-gradient(1200px 780px at 85% 88%, rgba(0,224,255,0.12), transparent 62%)," +
          "#0F1E33",
      }}
    >
      <SpeedLines />
      <TrackParallax />

      {/* NAV + HUD */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/25 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full ring-1 ring-white/40 overflow-hidden shadow-[0_0_18px_rgba(0,224,255,0.45)]">
              <Image src="/awz-logo.png" alt="Awaazein" fill sizes="36px" className="object-cover" />
            </div>
            <span className="font-bold tracking-wider">Awaazein 2026</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
            <a href="#home" className="hover:text-white">Home</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#venue" className="hover:text-white">Venue</a>
            <a href="#lineup" className="hover:text-white">Line Up</a>
            <a href="#volunteer" className="hover:text-white">Volunteer Info</a>
            <a href="#sponsorship" className="hover:text-white">Sponsorship</a>
            <a href="#gallery" className="hover:text-white">Photo Gallery</a>
            <a href="#board" className="hover:text-white">Board</a>
            <a href="#contact" className="hover:text-white">Contact Us</a>
            <Button
              onClick={() => setTicketsOpen(true)}
              className="ml-2 bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_24px_rgba(225,6,0,0.55)]"
            >
              Tickets
            </Button>
          </nav>
        </div>

        {/* HUD countdown bar */}
        <div className="sticky top-14 z-20">
          <div className="mx-auto max-w-6xl px-6 pb-2">
            <div className="rounded-xl bg-black/45 border border-white/15 backdrop-blur grid grid-flow-col auto-cols-max gap-4 px-4 py-2">
              {["Days", "Hours", "Minutes", "Seconds"].map((lbl, idx) => (
                <div key={lbl} className="flex items-baseline gap-2">
                  <span className="text-xs uppercase text-white/70 tracking-widest">{lbl}</span>
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
              <span className="text-[#00E0FF] drop-shadow-[0_0_24px_rgba(0,224,255,0.7)]">F1 Edition</span>
            </motion.h1>

            <p className="mt-4 max-w-prose text-white/95">
              South Asian a-capella like you&rsquo;ve never seen it &mdash; speed, precision, and harmony.
              Join us for a night where voices race to victory.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => setTicketsOpen(true)}
                className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_30px_rgba(225,6,0,0.6)]"
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
          <div className="relative rounded-2xl border border-white/20 bg-black/30 p-6 md:p-8">
            <div className="relative h-80 w-80 md:h-[26rem] md:w-[26rem] rounded-full overflow-hidden ring-2 ring-white/25 shadow-[0_0_100px_rgba(0,224,255,0.45)] mx-auto">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" title="About Awaazein">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div className="order-2 md:order-1">
              <p className="text-white/95 text-lg md:text-xl leading-relaxed md:leading-8">
                Awaazein is DFW&rsquo;s premier South Asian a-capella competition. Translating to
                &ldquo;The Voices&rdquo; in Hindi, Awaazein is a bid competition under the Association of
                South Asian A-Capella (ASA). Teams from across the nation participate in Awaazein,
                hoping for a chance to win the coveted award and advance to the prestigious national
                competition: All American Awaaz.
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
            <a href="https://maps.google.com/?q=Irving+Arts+Center" target="_blank" rel="noopener noreferrer">
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
              <div className="text-white text-3xl md:text-5xl font-extrabold [text-shadow:_0_0_34px_rgba(0,224,255,0.45)]">
                Coming Soon — Winter 2025
              </div>
            </div>

            <div className="order-1 md:order-2 md:-mt-20 lg:-mt-28 xl:-mt-36">
              <div
                className="group relative w-full aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in shadow-[0_0_46px_rgba(0,224,255,0.25)]"
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
              <p className="text-white/95 text-lg md:text-xl leading-relaxed md:leading-8">
                Be a part of our Awaazein Family and see the behind-the-scenes of our competition!
                Volunteers help with the major parts of the weekend and are the backbone of Awaazein.
                This is the perfect way to get involved with the circuit without a heavy time commitment.
                Click the link below to submit an application&mdash;we look forward to working with you!
              </p>

              <p className="mt-3 text-white/80 italic">— Awaazein Executive Board</p>

              <div className="mt-5">
                <Button
                  asChild
                  className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_28px_rgba(225,6,0,0.55)]"
                >
                  <a href="https://forms.gle/Wzbsfnw4m7oLzJiQ6" target="_blank" rel="noopener noreferrer">
                    Apply to Volunteer
                  </a>
                </Button>
              </div>
            </div>

            {/* Image (clickable) */}
            <div className="order-1 md:order-2 md:-mt-10 lg:-mt-16">
              <div
                className="group relative w-full aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-white/15 cursor-zoom-in"
                onClick={() => openLightbox("/Volunteer.JPG", "Awaazein volunteers and liaisons at the venue")}
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

      {/* SPONSORSHIP & DONATIONS */}
      <Section id="sponsorship" title="Sponsorship & Donations">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
            {/* Sponsorship */}
            <div className={cx("rounded-2xl p-6 md:p-7", theme.ring, theme.panel)}>
              <h3 className="text-xl md:text-2xl font-extrabold mb-3">Sponsor Awaazein</h3>
              <p className="text-white/95">
                Interested in supporting our show and promoting your brand? Awaazein brings together a
                diverse audience from across the nation&mdash;an ideal place to advertise your business.
                Click below to view our sponsorship packet for more information. If you&rsquo;re interested,
                please email <a className="underline" href="mailto:awaazeinexec@gmail.com">awaazeinexec@gmail.com</a>.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="bg-[#E10600] hover:bg-[#c70500]">
                  <a href="/SPONSORSHIP%20PACKET%202026.pdf" target="_blank" rel="noreferrer">
                    View Sponsorship Packet (PDF)
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <a href="mailto:awaazeinexec@gmail.com?subject=Sponsorship%20Inquiry">Email Us</a>
                </Button>
              </div>
            </div>

            {/* Donations */}
            <div className={cx("rounded-2xl p-6 md:p-7", theme.ring, theme.panel)}>
              <h3 className="text-xl md:text-2xl font-extrabold mb-3">Make a Donation</h3>
              <p className="text-white/95">
                Interested in making a donation? Awaazein&rsquo;s success comes from the support of its strong
                community. All monetary donations go toward boosting hospitality and the overall
                experience for competing teams. Our executive board thanks you in advance for your support!
              </p>

              <div className="mt-5">
                <Button
                  asChild
                  className="bg-[#00E0FF] hover:bg-[#01b8d1] text-black font-semibold shadow-[0_0_24px_rgba(0,224,255,0.5)]"
                >
                  <a href="https://gofund.me/1bbb82734" target="_blank" rel="noreferrer">
                    Donate on GoFundMe
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* BOARD — BEFORE Gallery */}
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

        {/* Logistics */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Logistics</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {logistics.map((l) => (
              <DriverCard key={l.name} driver={l} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Finance */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Finance</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {finance.map((f) => (
              <DriverCard key={f.name} driver={f} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Tech */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Tech</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {tech.map((t) => (
              <DriverCard key={t.name} driver={t} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Liaison Coordinators */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Liaison Coordinators</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {liaisonCoordinators.map((lc) => (
              <DriverCard key={lc.name} driver={lc} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* After Party */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">After Party</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {afterParty.map((ap) => (
              <DriverCard key={ap.name} driver={ap} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Mixer */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Mixer</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mixer.map((mx) => (
              <DriverCard key={mx.name} driver={mx} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Registration */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Registration</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {registration.map((r) => (
              <DriverCard key={r.name} driver={r} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Hospitality */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Hospitality</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {hospitality.map((h) => (
              <DriverCard key={h.name} driver={h} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Marketing */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Marketing</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {marketing.map((m) => (
              <DriverCard key={m.name} driver={m} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        {/* Graphics */}
        <div className="mt-10 mb-4">
          <h3 className="text-2xl md:text-3xl font-extrabold">Graphics</h3>
        </div>
        <FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {graphics.map((g) => (
              <DriverCard key={g.name} driver={g} onOpen={openLightbox} />
            ))}
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* GALLERY — AFTER Board */}
      <Section id="gallery" title="Previous Show Gallery">
        <FadeIn>
          <div
            className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-3"
            style={{ gridAutoRows: "8px" }}
          >
            {stageImages.map((src, i) => (
              <CollageItem
                key={src}
                src={src}
                alt={`Previous show photo ${i + 1}`}
                cls={collageClasses[i % collageClasses.length]}
                onOpen={openLightbox}
              />
            ))}
          </div>
        </FadeIn>

        <CheckeredDivider />
      </Section>

      {/* CONTACT — inline state and safe reset */}
      <Section id="contact" title="Contact Us">
        <FadeIn>
          {(() => {
            const [status, setStatus] = React.useState<{ ok?: string; error?: string }>({});
            const [loading, setLoading] = React.useState(false);
            const formRef = React.useRef<HTMLFormElement>(null);

            async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
              e.preventDefault();
              setStatus({});
              setLoading(true);

              const fd = new FormData(e.currentTarget);
              const payload = {
                name: String(fd.get("name") || "").trim(),
                email: String(fd.get("email") || "").trim(),
                subject: String(fd.get("subject") || "").trim(),
                message: String(fd.get("message") || "").trim(),
              };

              try {
                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                let data: any = null;
                try { data = await res.json(); } catch {}

                if (!res.ok || (data && data.error)) {
                  throw new Error(data?.error || "Something went wrong. Please try again.");
                }

                setStatus({ ok: "Thanks! Your message was sent." });
                formRef.current?.reset();
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
                setStatus({ error: msg });
              } finally {
                setLoading(false);
              }
            }

            return (
              <div className={cx("rounded-2xl p-8 border", theme.ring, theme.panel)}>
                <p className="text-white/95 mb-6">
                  For inquiries, sponsorships, or volunteering, reach out and we&rsquo;ll get back quickly.
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-sm text-white/80">Name</span>
                      <input
                        name="name"
                        required
                        className="rounded-md bg-black/30 border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#00E0FF]"
                        placeholder="Your name"
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-sm text-white/80">Email</span>
                      <input
                        name="email"
                        type="email"
                        required
                        className="rounded-md bg-black/30 border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#00E0FF]"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>

                  <label className="grid gap-1">
                    <span className="text-sm text-white/80">Subject</span>
                    <input
                      name="subject"
                      required
                      className="rounded-md bg-black/30 border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#00E0FF]"
                      placeholder="What’s this about?"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-sm text-white/80">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className="rounded-md bg-black/30 border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-[#00E0FF] resize-vertical"
                      placeholder="Say hello!"
                    />
                  </label>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#E10600] hover:bg-[#c70500] shadow-[0_0_30px_rgba(225,6,0,0.6)]"
                    >
                      {loading ? "Sending…" : "Send Message"}
                    </Button>

                    {status.ok && <span className="text-sm text-emerald-300">{status.ok}</span>}
                    {status.error && <span className="text-sm text-red-300">{status.error}</span>}
                  </div>
                </form>
              </div>
            );
          })()}
        </FadeIn>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/80 text-sm">
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
            <a href="#sponsorship" className="hover:text-white">Sponsorship</a>
            <a href="#gallery" className="hover:text-white">Photo Gallery</a>
            <a href="#board" className="hover:text-white">Board</a>
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
