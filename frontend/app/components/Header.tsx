// app/components/Header.tsx
// import { Link } from "@remix-run/react"; // if you're using Remix
// If you're using plain React Router v6/7 data routers, use:
// 
import spaceTheme from "../../Assets/GalexSpaceImage.jpg";

export default function Header() {
  return (
     <header className="relative m-h-[10vvh] z-10 h-[10vh] flex items-center justify-between px-6 py-3 overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 bg-center bg-cover" 
       style={{
        backgroundImage: `url(${spaceTheme})`}}>
  </div>

    <div className="absolute inset-0 bg-[rgb(32,38,55)]/20"></div>
    <div className="absolute inset-0 bg-[rgb(148,150,161)]/5"></div>

      
      {/* Content layer */}
      <div className="relative z-10 text-white flex items-center justify-between w-full">
        {/* Your content (text, links, etc.) here */}
        <p className="text-lg font-bold">Constellation Connect</p>
      </div>
    </header>
  );
}
