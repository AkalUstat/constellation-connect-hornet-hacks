/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import { AnimatePresence } from "framer-motion";
import spaceTheme from "../../Assets/GalexSpaceImage.jpg";
import Star from "./Star";
import StarModal from "./StarModal";
import clubs from "../data/clubs.json";

const NUM_STARS = 400;
const DRAG_THRESHOLD = 5;
const MAP_SCALE_VW = 150;

const stringToSeed = (str: string) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0;
  }
  return h >>> 0;
};

const mulberry32 = (a: number) => {
  return function () {
    let t = (a += 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const clampOffset = (offset: { x: number; y: number }, scale: number) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mapW = (MAP_SCALE_VW / 100) * vw;
  const mapH = (MAP_SCALE_VW / 100) * vh;
  const scaledW = mapW * scale;
  const scaledH = mapH * scale;
  const halfX = (scaledW - vw) / 2;
  const halfY = (scaledH - vh) / 2;
  return {
    x: clamp(offset.x, -halfX, halfX),
    y: clamp(offset.y, -halfY, halfY),
  };
};

export default function StarMap({ seed = "constellation-connect-v3" }: { seed?: string }) {
  const minScale = Math.max(
    window.innerWidth / ((MAP_SCALE_VW / 100) * window.innerWidth),
    window.innerHeight / ((MAP_SCALE_VW / 100) * window.innerHeight)
  );

  const [scale, setScale] = useState(minScale);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredStarId, setHoveredStarId] = useState<number | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const dragging = useRef(false);
  const mouseMoved = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [svgSize, setSvgSize] = useState<{ width: number; height: number } | null>(null);

  // ⭐ Generate stars
  const stars = useMemo(() => {
    const arr: { id: number; x: number; y: number; size: number; color: string }[] = [];
    const seedNum = stringToSeed(seed);
    const rand = mulberry32(seedNum);
    const r = (min: number, max: number) => rand() * (max - min) + min;
    for (let i = 0; i < NUM_STARS; i++) {
      const colorRoll = rand();
      arr.push({
        id: i,
        x: r(0, MAP_SCALE_VW),
        y: r(0, MAP_SCALE_VW),
        size: Math.round(r(2, 8)),
        color: colorRoll > 0.98 ? "#c9f" : colorRoll > 0.96 ? "#9cf" : "#fff9c4",
      });
    }
    return arr;
  }, [seed]);

  // 🎚️ Panning
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      mouseMoved.current = false;
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        mouseMoved.current = true;
        setHasMoved(true);
      }
      setOffset((prev) => clampOffset({ x: prev.x + dx, y: prev.y + dy }, scale));
      velocity.current = { x: dx, y: dy };
      last.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      dragging.current = false;
      const friction = 0.95;
      const step = () => {
        setOffset((prev) => {
          const vx = velocity.current.x * friction;
          const vy = velocity.current.y * friction;
          velocity.current = { x: vx, y: vy };
          const moving = Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2;
          if (moving) {
            raf.current = requestAnimationFrame(step);
            return clampOffset({ x: prev.x + vx, y: prev.y + vy }, scale);
          } else {
            cancelAnimationFrame(raf.current!);
            return prev;
          }
        });
      };
      raf.current = requestAnimationFrame(step);
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [scale]);

  // 🔍 Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale((prev) => {
      const next = clamp(prev + delta, minScale, 2.5);
      setOffset((prevOffset) => clampOffset(prevOffset, next));
      setHasMoved(true);
      return next;
    });
  };

  // Reset view
  const resetView = () => {
    const steps = 20;
    const stepTime = 10;
    const startScale = scale;
    const startOffset = offset;
    for (let i = 1; i <= steps; i++) {
      setTimeout(() => {
        const t = i / steps;
        setScale(startScale + (1 - startScale) * t);
        setOffset({
          x: startOffset.x * (1 - t),
          y: startOffset.y * (1 - t),
        });
        if (i === steps) setHasMoved(false);
      }, i * stepTime);
    }
  };

  // 📏 SVG size for constellations
  useEffect(() => {
    const node = svgRef.current;
    if (!node) return;
    const update = () => {
      const r = node.getBoundingClientRect();
      setSvgSize({ width: r.width, height: r.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 🧭 Map clubs to stars
  const clubPositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; starIndex: number }>();
    for (let i = 0; i < clubs.length; i++) {
      const star = stars[i % stars.length];
      map.set(clubs[i].name, { x: star.x, y: star.y, starIndex: i % stars.length });
    }
    return map;
  }, [clubs, stars]);

  const starIndexToClubIndex = useMemo(() => {
    const m = new Map<number, number>();
    for (let i = 0; i < clubs.length; i++) {
      const starIndex = i % stars.length;
      if (!m.has(starIndex)) m.set(starIndex, i);
    }
    return m;
  }, [clubs, stars]);

  // 🪐 Compute constellation lines
  const constellations = useMemo(() => {
    if (!svgSize) return [] as any[];
    const rectW = svgSize.width;
    const rectH = svgSize.height;
    const toPx = (p: { x: number; y: number }) => [
      ((p.x || 0) / 100) * rectW,
      ((p.y || 0) / 100) * rectH,
    ] as [number, number];
    const csClubs = clubs
      .map((c, i) => ({ club: c, index: i }))
      .filter((c) => c.club.category && c.club.category.toLowerCase().includes("computer"));
    const lineGen = d3
      .line<[number, number]>()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => d[0])
      .y((d) => d[1]);
    const paths: {
      id: string;
      d: string;
      srcStarIndex: number;
      dstStarIndex: number;
      srcName: string;
      dstName: string;
    }[] = [];
    csClubs.forEach((entry) => {
      const src = clubPositions.get(entry.club.name);
      if (!src || !entry.club.related) return;
      entry.club.related.forEach((relName) => {
        const dst = clubPositions.get(relName);
        if (!dst) return;
        const p1 = toPx(src);
        const p2 = toPx(dst);
        const mid: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - 30];
        const d = lineGen([p1, mid, p2]);
        if (!d) return;
        const id = `${src.starIndex}-${dst.starIndex}`;
        paths.push({
          id,
          d,
          srcStarIndex: src.starIndex,
          dstStarIndex: dst.starIndex,
          srcName: entry.club.name,
          dstName: relName,
        });
      });
    });
    return paths;
  }, [clubs, clubPositions, svgSize]);

  const constellationStarSet = useMemo(() => {
    const s = new Set<number>();
    for (const c of constellations) {
      if (typeof c.srcStarIndex === "number") s.add(c.srcStarIndex);
      if (typeof c.dstStarIndex === "number") s.add(c.dstStarIndex);
    }
    return s;
  }, [constellations]);

  return (
    <div
      onWheel={handleWheel}
      className="fixed inset-0 select-none bg-black overflow-hidden"
      style={{ cursor: dragging.current ? "grabbing" : "grab" }}
    >
      <div
        style={{
          width: `${MAP_SCALE_VW}vw`,
          height: `${MAP_SCALE_VW}vh`,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center",
          backgroundImage: `url(${spaceTheme})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* 🌠 Stars */}
        {stars.map((s) => {
          const clubIndex = starIndexToClubIndex.get(s.id);
          const isHighlighted = constellationStarSet.has(s.id);
          return (
            <Star
              key={s.id}
              id={s.id}
              x={s.x}
              y={s.y}
              size={Math.max(s.size * scale * (isHighlighted ? 1.8 : 1), 10)}
              color={s.color}
              onClick={() => {
                if (!mouseMoved.current) setSelectedId(s.id);
              }}
              onMouseEnter={() => setHoveredStarId(s.id)}
              onMouseLeave={() => setHoveredStarId(null)}
              highlighted={hoveredStarId === s.id}
            />
          );
        })}

        {/* ✨ SVG overlay */}
        <svg ref={svgRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <g>
            {constellations.map((p, idx) => (
              <path
                key={p.id}
                d={p.d}
                fill="none"
                strokeOpacity={hoveredLineId === null || hoveredLineId === p.id ? 0.95 : 0.12}
                stroke={hoveredLineId === p.id ? "#7fb1ff" : "rgba(100,140,255,0.7)"}
                strokeWidth={hoveredLineId === p.id ? 3 : 1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: "stroke 160ms, stroke-opacity 160ms, stroke-width 160ms",
                  opacity: 0,
                  animation: `fadeIn 360ms ease ${idx * 20}ms forwards`,
                }}
                onMouseEnter={(e) => {
                  setHoveredLineId(p.id);
                  setTooltip({
                    x: e.clientX + 10,
                    y: e.clientY + 6,
                    text: `${p.dstName} → ${p.srcName}`,
                  });
                }}
                onMouseMove={(e) =>
                  setTooltip((t) =>
                    t ? { x: e.clientX + 10, y: e.clientY + 6, text: t.text } : null
                  )
                }
                onMouseLeave={() => {
                  setHoveredLineId(null);
                  setTooltip(null);
                }}
                onClick={() => {
                  const srcIndex = clubs.findIndex((c) => c.name === p.srcName);
                  setSelectedId(srcIndex !== -1 ? srcIndex : p.srcStarIndex);
                }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* 🪐 Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateY(-50%)",
            background: "rgba(8,12,20,0.85)",
            color: "#cfe",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 50,
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* 🌌 Modal */}
      <AnimatePresence>
        {selectedId !== null &&
          typeof document !== "undefined" &&
          ReactDOM.createPortal(
            <StarModal
              key={selectedId}
              club={clubs[selectedId % clubs.length]}
              onClose={() => setSelectedId(null)}
            />,
            document.body
          )}
      </AnimatePresence>

      {/* 🔁 Reset View */}
      {hasMoved && (
        <button
          onClick={resetView}
          className="fixed bottom-4 left-4 z-50 px-4 py-2 rounded-[20px] border border-[var(--color-solar-line)]
            hover:shadow-glow-soft duration-300
            bg-indigo-500/20 ring-1 ring-indigo-300/40 backdrop-blur-md shadow-[0_0_20px_5px_rgba(99,102,241,0.35)]
            hover:bg-indigo-500/30 hover:shadow-[0_0_10px_5px_rgba(99,102,241,0.45)] active:scale-95 transition-all"
        >
          Reset View
        </button>
      )}
    </div>
  );
}
