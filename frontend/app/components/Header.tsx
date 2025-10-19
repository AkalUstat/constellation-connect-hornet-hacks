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
         transition-all duration-300 ease-in-out
         bg-gradient-to-br from-indigo-400/40 via-indigo-500/30
               to-purple-600/20 
              ring-2 
              ring-indigo-400/60 
              shadow-[0_0_20px_5px_rgba(99,102,241,0.5)] 
      `}
    >
      <p className="text-lg font-bold text-[color:theme('colors.solar.text.DEFAULT')]">
        Constellation Connect
      </p>
    </header>
  );
}
