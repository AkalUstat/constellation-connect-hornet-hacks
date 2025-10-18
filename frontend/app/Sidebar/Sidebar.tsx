import React, { useState } from 'react';
import { IoFilterSharp } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
  <>
      {/* 🌌 Sidebar Panel */}
      <div
        className={`fixed flex flex-col min-h-[80%] max-h-[80%] mt-[2vh]
        w-[25vw] rounded-xl backdrop-blur-md
        
        bg-[color:theme('colors.solar.surface')]
        border border-[color:theme('colors.solar.line')]
        shadow-glow overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-5 opacity-100' : '-translate-x-full opacity-0'}`}
      >
        <div className="flex-1 p-4 overflow-y-auto">
          {/* 🔍 Input */}
          <input
            placeholder="Search..."
            className="w-full h-12 mb-4 px-4 rounded-lg
            text-[color:theme('colors.solar.text.DEFAULT')]
            placeholder:text-[color:theme('colors.solar.text.secondary')]
            bg-[color:theme('colors.solar.surface')]
            border border-[color:theme('colors.solar.line')]
            focus:ring-2 focus:ring-[color:theme('colors.solar.rose')]
            outline-none transition-all duration-300"
          />

          {/* 📄 Content Card */}
          <div
            className="p-4 rounded-lg border
            border-[color:theme('colors.solar.line')]
            bg-[color:theme('colors.solar.surface')]
            text-[color:theme('colors.solar.text.secondary')]
            text-sm leading-relaxed shadow-glow-soft"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            ut blandit justo. Donec congue mattis metus quis convallis. Mauris
            vel imperdiet massa, sed pulvinar ligula. Suspendisse potenti.
          </div>
        </div>
      </div>

      {/* 🧭 Toggle Button (always visible) */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-[calc(10vh+25px)]
        z-50 w-10 h-10 right-[-calc(10vw+25)] flex items-center justify-center rounded-full
        backdrop-blur-md
        bg-[color:theme('colors.solar.surface')]
        border border-[color:theme('colors.solar.line')]
        hover:bg-[color:theme('colors.solar.glow')]
        hover:shadow-glow-soft active:scale-95 transition-all duration-300
        ${isOpen ? 'left-[calc(25vw+1rem)]' : 'left-5'}`}
      >
        <IoFilterSharp
          className="text-xl text-[color:theme('colors.solar.amber')]
          transition-transform duration-300
          ${isOpen ? 'rotate-90' : 'rotate-0'}"
        />
      </button>
    </>
  );
};

export default Sidebar;
