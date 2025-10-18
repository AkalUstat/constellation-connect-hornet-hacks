import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
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

export default function StarMap({ seed = "constellation-connect-v1" }: { seed?: string }) {
  const minScale = Math.max(
    window.innerWidth / ((MAP_SCALE_VW / 100) * window.innerWidth),
    window.innerHeight / ((MAP_SCALE_VW / 100) * window.innerHeight)
  );

  const [scale, setScale] = useState(minScale);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasMoved, setHasMoved] = useState(false);

  const dragging = useRef(false);
  const mouseMoved = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

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

  // 🖱️ Pan + inertia
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

  return (
    <div
      onWheel={handleWheel}
      className="fixed inset-0 select-none bg-black overflow-hidden"
      style={{
        cursor: dragging.current ? "grabbing" : "grab",
      }}
    >
      {/* 🌌 Zoomable + pannable starfield */}
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
        {stars.map((s) => (
          <Star
            key={s.id}
            x={s.x}
            y={s.y}
            size={Math.max(s.size * scale, 4)}
            color={s.color}
            onClick={() => {
              if (!mouseMoved.current) setSelectedId(s.id);
            }}
          />
        ))}
      </div>

      {/* 🌠 Modal */}
      {selectedId !== null &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <StarModal
            club={clubs[selectedId % clubs.length]}
            onClose={() => setSelectedId(null)}
          />,
          document.body
        )}

      {/* 🔁 Reset View */}
      {hasMoved && (
        <button
          onClick={resetView}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 shadow hover:bg-white/20 transition"
        >
          Reset View
        </button>
      )}
    </div>
  );
}
