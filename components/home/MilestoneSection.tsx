"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Tag, Users, Star } from "lucide-react";

interface Milestone {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  animate?: boolean;
}

const milestones: Milestone[] = [
  {
    icon: <Package className="h-5 w-5 md:h-6 md:w-6" />,
    value: 10000,
    suffix: "+",
    label: "Produk Tersedia",
  },
  {
    icon: <Tag className="h-5 w-5 md:h-6 md:w-6" />,
    value: 300,
    suffix: "+",
    label: "Brand Ternama",
  },
  {
    icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
    value: 34000,
    suffix: "+",
    label: "Pelanggan Puas",
  },
  {
    icon: <Star className="h-5 w-5 md:h-6 md:w-6" />,
    value: 5,
    suffix: "",
    label: "Penilaian Toko",
    decimals: 1,
    animate: false,
  },
];

function useCountUp(
  target: number,
  duration: number,
  start: boolean,
  enabled: boolean
) {
  const [count, setCount] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) {
      setCount(target);
      return;
    }
    if (!start) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(progress === 1 ? target : eased * target);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration, enabled]);

  return count;
}

function MilestoneCell({
  milestone,
  shouldCount,
  isVisible,
  index,
  total,
}: {
  milestone: Milestone;
  shouldCount: boolean;
  isVisible: boolean;
  index: number;
  total: number;
}) {
  const decimals = milestone.decimals ?? 0;
  const count = useCountUp(
    milestone.value,
    1600 + index * 100,
    shouldCount,
    milestone.animate !== false
  );

  const formatted = (decimals > 0 ? count : Math.floor(count)).toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const isLast = index === total - 1;
  const isOddCol = index % 2 === 0;

  return (
    <div
      className={`group relative flex flex-col gap-4 overflow-hidden border-dashed border-third/25 p-5 md:gap-5 md:p-7
        ${isOddCol ? "border-r" : "md:border-r"}
        ${index < 2 ? "border-b md:border-b-0" : ""}
        ${isLast ? "md:border-r-0" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${index * 110}ms, transform 0.55s ease ${index * 110}ms`,
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-third/5 text-third transition-colors duration-300 group-hover:bg-second md:h-12 md:w-12">
        {milestone.icon}
      </div>

      <div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-poppins text-[clamp(26px,3.4vw,44px)] font-black leading-none tabular-nums text-third">
            {formatted}
          </span>
          {milestone.suffix && (
            <span className="font-poppins text-[clamp(18px,2.2vw,28px)] font-black leading-none text-second">
              {milestone.suffix}
            </span>
          )}
        </div>
        <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-third/50 md:text-[12px]">
          {milestone.label}
        </p>
      </div>

      <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-second transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}

export default function MilestoneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-bg-site px-4 py-10 sm:px-8 sm:py-16 md:px-14"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div
          className="mb-6 flex flex-col gap-3 sm:mb-8 md:flex-row md:items-end md:justify-between md:gap-10"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0px)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-third/50">
              Mengapa Bandar Musik Jakarta?
            </p>
            <h2 className="font-boldonse text-[clamp(22px,3.5vw,42px)] font-bold uppercase leading-[1.25] text-third">
              Kepercayaan Menjadi <em className="not-italic text-second">Unggulan</em>
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-third/60 md:text-[14px]">
            Kami hadir untuk memenuhi kebutuhan musik anda.
          </p>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-third/10 md:grid-cols-4">
          {milestones.map((milestone, index) => (
            <MilestoneCell
              key={milestone.label}
              milestone={milestone}
              shouldCount={hasAnimated}
              isVisible={isVisible}
              index={index}
              total={milestones.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}