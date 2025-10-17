// app/components/Header.tsx
// import { Link } from "@remix-run/react"; // if you're using Remix
// If you're using plain React Router v6/7 data routers, use:
// 
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900/70 text-white shadow">
      <Link to="/" className="text-lg font-bold">Constellation Connect</Link>


    </header>
  );
}
