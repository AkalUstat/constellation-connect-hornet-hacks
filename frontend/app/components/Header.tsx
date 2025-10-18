// app/components/Header.tsx
// import { Link } from "@remix-run/react"; // if you're using Remix
// If you're using plain React Router v6/7 data routers, use:
// 

export default function Header() {
  return (
    <div
        className={
        `flex flex-col my-[2vh] mx-[4vh] min-h-[10%] max-h-[10%]
        rounded-xl backdrop-blur-md z-50 justify-center-safe
        bg-[color:theme('colors.solar.surface')]
        border border-[color:theme('colors.solar.line')]
        shadow-glow overflow-hidden transition-all duration-300 ease-in-out
        `}
      >
        <div className="flex flex-row self-center">
        <p className="text-lg font-bold">Constellation Connect</p>
        </div>
      </div>
  );
}
