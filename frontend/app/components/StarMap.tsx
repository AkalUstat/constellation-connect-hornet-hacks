import React, { useMemo, useState } from "react";
import spaceTheme from "../../Assets/GalexSpaceImage.jpg";
import Star from "./Star"; // Importing the Star component
import StarModal from "./StarModal";
import clubs from "../../../clubs.json";

const NUM_STARS = 60; // Number of stars to generate

// Small string -> integer hash (deterministic)
const stringToSeed = (str: string) => { 
  let h = 2166136261 >>> 0; 
  for (let i = 0; i < str.length; i++) { 
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0; 
  }
  return h >>> 0;
};


const mulberry32 = (a: number) => { // seed
  return function () {
    let t = (a += 0x6d2b79f5) >>> 0; // unsigned right shift
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // return in [0,1)
  };
};

const StarMap = ({ seed = "constellation-connect-v1" }: { seed?: string }) => {
  // Generate a stable list of random stars per render using a seeded RNG
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const stars = useMemo(() => {
    const arr = [] as {
      id: number;
      x: number;
      y: number;
      size: number; // in px
      color: string; // color of the star
    }[];

    const seedNum = stringToSeed(seed); // Convert seed string to number
    const rand = mulberry32(seedNum);

    const randBetween = (min: number, max: number) => rand() * (max - min) + min; // inclusive min, exclusive max

    for (let i = 0; i < NUM_STARS; i++) { // Generate each star
      const colorRoll = rand();

      arr.push({
        id: i,
        x: randBetween(3, 97), // leave a small margin
        y: randBetween(3, 97),
        size: Math.round(randBetween(2, 8)),
        color: colorRoll > 0.98 ? "#c9f" : colorRoll > 0.96 ? "#9cf" : "#fff9c4",
      });
    }
    return arr;
  }, [seed]);

  return (
    <div
      style={{
        backgroundImage: `url(${spaceTheme})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        position: "relative", // necessary for absolutely positioned stars
        overflow: "hidden",
      }}
    >
      {/* Render many stars spread across the map */}
      {stars.map((s) => (
        <Star
          key={s.id} // Unique key for each star
          x={s.x}
          y={s.y}
          size={s.size} // Size in px
          color={s.color} // Color of the star
          onClick={() => setSelectedId(s.id)} // open modal
        />
      ))}

      {selectedId !== null && (
        <StarModal club={clubs[selectedId % clubs.length]} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
};

export default StarMap; // Exporting the StarMap component
