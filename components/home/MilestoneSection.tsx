"use client";

import { useEffect, useRef, useState } from "react";
import { Package, Tag, Users, Store } from "lucide-react";

interface Milestone {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

const milestones: Milestone[] = [
  {
    icon: <Package className="w-6 h-6 sm:w-7 sm:h-7" />,
    value: 500,
    suffix: "+",
    label: "Produk Tersedia",
  },
  {
    icon: <Tag className="w-6 h-6 sm:w-7 sm:h-7" />,
    value: 40,
    suffix: "+",
    label: "Brand Ternama",
  },
  {
    icon: <Users className="w-6 h-6 sm:w-7 sm:h-7" />,
    value: 2000,
    suffix: "+",
    label: "Pelanggan Puas",
  },
  {
    icon: <Store className="w-6 h-6 sm:w-7 sm:h-7" />,
    value: 10,
    suffix: "+ Tahun",
    label: "Pengalaman",
  },
];

function useCountUp(
  target: number,
  duration: number = 1800,
  start: boolean = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

function MilestoneCard({
  milestone,
  shouldCount,
  isVisible,
  index,
}: {
  milestone: Milestone;
  shouldCount: boolean;
  isVisible: boolean;
  index: number;
}) {
  const count = useCountUp(milestone.value, 1600 + index * 100, shouldCount);

  return (
    <div
      className="group flex flex-col items-center gap-3 px-4 py-6 sm:px-6 sm:py-8 
                 rounded-2xl bg-white/5 border border-white/10 
                 hover:border-yellow-400/40 hover:bg-white/10 
                 transition-colors duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${index * 120}ms, transform 0.55s ease ${index * 120}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 
                      rounded-xl bg-yellow-400/10 text-yellow-400 
                      group-hover:bg-yellow-400/20 group-hover:scale-110 
                      transition-all duration-300"
      >
        {milestone.icon}
      </div>

      {/* Number */}
      <div className="flex items-end gap-0.5">
        <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums leading-none">
          {count.toLocaleString("id-ID")}
        </span>
        <span className="text-lg sm:text-xl font-semibold text-yellow-400 leading-tight pb-0.5">
          {milestone.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="text-xs sm:text-sm font-medium text-white/50 text-center tracking-wide uppercase">
        {milestone.label}
      </p>
    </div>
  );
}

export default function MilestoneSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-20 px-4 bg-[#0a0a0a]" // sesuaikan bg dengan tema lo
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div
          className="text-center mb-10 sm:mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0px)" : "translateY(20px)",
            transition: "opacity 0.5s ease 0ms, transform 0.5s ease 0ms",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-400 mb-3">
            Kepercayaan Pelanggan
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Angka yang{" "}
            <span className="text-yellow-400">Bicara Sendiri</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-white/40 text-sm max-w-md mx-auto">
            Kami hadir untuk semua musisi — dari pemula sampai profesional.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.label}
              milestone={milestone}
              shouldCount={hasAnimated}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}