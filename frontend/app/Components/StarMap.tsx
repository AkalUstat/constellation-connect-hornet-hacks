import React, { useMemo, useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import spaceTheme from "../../Assets/GalexSpaceImage.jpg";
import Star from "./Star"; // Importing the Star component
import StarModal from "./StarModal";
import { AnimatePresence } from "framer-motion";
import clubs from "../data/clubs.json";

const NUM_STARS = 60; // Number of stars to generate baseline can be adjusted

// Small string -> integer hash (deterministic)
const stringToSeed = (str: string) => { 
  let h = 2166136261 >>> 0; 
  for (let i = 0; i < str.length; i++) { 
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0; 
  }
  return h >>> 0;
};


const mulberry32 = (a: number) => { // this allows us to create a seeded PRNG for star positions
  return function () {
    let t = (a += 0x6d2b79f5) >>> 0; // unsigned right shift
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // return in [0,1)
  };
};

const StarMap = ({ seed = "beautiful-constellation-v2" }: { seed?: string }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredStarId, setHoveredStarId] = useState<number | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const stars = useMemo(() => { //we use useMemo to only recaculate stars when seeds are changed
    const arr: { id: number; x: number; y: number; size: number; color: string }[] = [];
    const seedNum = stringToSeed(seed);
    const rand = mulberry32(seedNum);
    const randBetween = (min: number, max: number) => rand() * (max - min) + min;
    for (let i = 0; i < NUM_STARS; i++) {
      const colorRoll = rand();
      arr.push({ id: i, x: randBetween(15, 85), y: randBetween(15, 85), size: Math.round(randBetween(3, 9)), color: colorRoll > 0.95 ? "#c9f" : colorRoll > 0.90 ? "#9cf" : colorRoll > 0.80 ? "#aaf" : "#fff9c4" });
    }
    return arr;
  }, [seed]);

  const clubPositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; starIndex: number }>();
    for (let i = 0; i < clubs.length; i++) {
      const star = stars[i % stars.length];
      map.set(clubs[i].name, { x: star.x, y: star.y, starIndex: i % stars.length });
    }
    return map;
  }, [clubs, stars]);

  // map from starIndex -> club index (first club that maps to that star)
  const starIndexToClubIndex = useMemo(() => {
    const m = new Map<number, number>();
    for (let i = 0; i < clubs.length; i++) {
      const starIndex = i % stars.length;
      if (!m.has(starIndex)) m.set(starIndex, i);
    }
    return m;
  }, [clubs, stars]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [svgSize, setSvgSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => { //this effect sets up the svg size and updates on window resize
    const node = svgRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect(); //we use this to get the size of the svg
    setSvgSize({ width: rect.width, height: rect.height });
    const onResize = () => {
      const r = node.getBoundingClientRect();
      setSvgSize({ width: r.width, height: r.height });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const constellations = useMemo(() => { //this calculates the constellation paths between computer science clubs
    if (!svgSize) return [] as any[];
    const rectW = svgSize.width;
    const rectH = svgSize.height;
    const toPx = (p: { x: number; y: number }) => [((p.x || 0) / 100) * rectW, ((p.y || 0) / 100) * rectH] as [number, number];
    const csClubs = clubs.map((c, i) => ({ club: c, index: i })).filter((c) => c.club.category && c.club.category.toLowerCase().includes("computer"));
    const lineGen = d3.line<[number, number]>().curve(d3.curveCatmullRom.alpha(0.5)).x((d) => d[0]).y((d) => d[1]);
    const paths: { id: string; d: string; srcStarIndex: number; dstStarIndex: number; srcName: string; dstName: string }[] = [];
    csClubs.forEach((entry) => { //this creates the paths for each constellation line
      const src = clubPositions.get(entry.club.name); //we use this to get the star position for the source clubs
      if (!src || !entry.club.related) return; //skip if no position or no related clubs
      entry.club.related.forEach((relName) => { //we iterate over each related club to create a line
        const dst = clubPositions.get(relName);
        if (!dst) return;
        const p1 = toPx(src);
        const p2 = toPx(dst);
        const mid: [number, number] = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - 30];
        const d = lineGen([p1, mid, p2]);
        if (!d) return;
        const id = `${src.starIndex}-${dst.starIndex}`;
        paths.push({ id, d, srcStarIndex: src.starIndex, dstStarIndex: dst.starIndex, srcName: entry.club.name, dstName: relName });
      });
    });
    return paths;
  }, [clubs, clubPositions, svgSize]);

  // set of star ids that are part of any constellation (so we can emphasize them a bit)
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
      style={{ //the style for the star map background
        backgroundImage: `url(${spaceTheme})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",   
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: -10,         
      }}
    >
    
      {/* animation for constellation fade-ins*/}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>

      {stars.filter((s) => constellationStarSet.has(s.id)).map((s) => {
        // Find which club this star represents
        const clubIndex = starIndexToClubIndex.get(s.id);
        const isACM = clubIndex !== undefined && clubs[clubIndex]?.name === "Association for Computing Machinery";
        
        return (
          <Star
            key={s.id}
            id={s.id}
            x={s.x}
            y={s.y}
            size={Math.round(s.size * (isACM ? 2.5 : 1.8))}
            color={s.color}
            onClick={() => setSelectedId(s.id)}
            onMouseEnter={() => setHoveredStarId(s.id)}
            onMouseLeave={() => setHoveredStarId(null)}
            highlighted={hoveredStarId === s.id || (hoveredLineId !== null && hoveredLineId.startsWith(`${s.id}-`))}
          />
        );
      })}

      {/* SVG overlay for constellations */}
      <svg ref={svgRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
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
              style={{ transition: "stroke 160ms, stroke-opacity 160ms, stroke-width 160ms", pointerEvents: "stroke", opacity: 0, animation: `fadeIn 360ms ease ${idx * 20}ms forwards` }}
              onMouseEnter={(e) => {
                setHoveredLineId(p.id);
                setHoveredStarId(p.srcStarIndex);
                setTooltip({ x: e.clientX + 10, y: e.clientY + 6, text: `${p.dstName} → ${p.srcName}` });
              }}
              onMouseMove={(e) => {
                setTooltip((t) => (t ? { x: e.clientX + 10, y: e.clientY + 6, text: `${p.dstName} → ${p.srcName}` } : null));
              }}
              onMouseLeave={() => {
                setHoveredLineId(null);
                setHoveredStarId(null);
                setTooltip(null);
              }}
              onClick={() => {
                // Open the club on the right side of the arrow (as shown in tooltip)
                // Tooltip shows: dstName → srcName, so we want to open srcName
                console.log('Constellation clicked:', p.srcName, '->', p.dstName);
                const srcIndex = clubs.findIndex((c) => c.name === p.srcName);
                const srcViaStar = starIndexToClubIndex.get(p.srcStarIndex);
                const target = srcIndex !== -1 ? srcIndex : srcViaStar ?? p.srcStarIndex;
                console.log('Opening club at index:', target, 'name:', clubs[target]?.name);
                setSelectedId(target);
              }}
            />
          ))}
        </g>
      </svg>

      {/* Tooltip for hovered constellation line */}
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

      
      <AnimatePresence>
        {selectedId !== null && (
          <StarModal
            key={selectedId}
            club={clubs[selectedId % clubs.length]}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


export default StarMap; // Exporting the StarMap component
