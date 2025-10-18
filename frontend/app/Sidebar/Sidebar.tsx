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
  className={`fixed z-40 flex flex-col min-h-[80%] max-h-[80%]
  w-[25vw] rounded-xl backdrop-blur-md
  bg-[var(--color-solar-surface)]
  border border-[var(--color-solar-line)]
  shadow-glow overflow-hidden transition-all duration-300 ease-in-out
  top-[calc(var(--header-margin-top)+var(--header-height)+1vh)]
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
  className={`fixed z-50 w-10 h-10 flex items-center justify-center rounded-full
  backdrop-blur-md border border-[var(--color-solar-line)]
  bg-[var(--color-solar-surface)]
  hover:bg-[var(--color-solar-glow)] hover:shadow-glow-soft active:scale-95
  transition-all duration-300
  top-[calc(var(--header-margin-top)+var(--header-height)+2vh)]
  ${isOpen ? 'left-[calc(25vw+1rem)]' : 'left-5'}`}
>
  <IoFilterSharp
    className={`text-xl text-[var(--color-solar-amber)]
    transition-transform duration-300
    ${isOpen ? 'rotate-90' : 'rotate-0'}`}
  />
</button>

    </>
  );
};

export default Sidebar;
