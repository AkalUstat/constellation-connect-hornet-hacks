// app/components/Header.tsx
// import { Link } from "@remix-run/react"; // if you're using Remix
// If you're using plain React Router v6/7 data routers, use:
// 
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-10 h-[10vh] flex items-center justify-between px-6 py-3 bg-slate-700/50 text-white ">
      <Link to="/" className="text-2xl font-bold">Constellation Connect</Link>
    </header>
  );
}
