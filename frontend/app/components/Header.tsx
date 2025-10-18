// app/components/Header.tsx
// import { Link } from "@remix-run/react"; // if you're using Remix
// If you're using plain React Router v6/7 data routers, use:
// 

// app/components/Header.tsx
export default function Header() {
  return (
    <header
      className={`
        relative z-50 flex items-center justify-center
        my-[var(--header-margin-top)] mx-[4vw]
        h-[var(--header-height)]
        rounded-xl backdrop-blur-md
        bg-[var(--color-solar-surface)]
        border border-[var(--color-solar-line)]
        shadow-glow transition-all duration-300 ease-in-out
      `}
    >
      <p className="text-lg font-bold text-[var(--color-solar-amber)]">
        Constellation Connect
      </p>
    </header>
  );
}

