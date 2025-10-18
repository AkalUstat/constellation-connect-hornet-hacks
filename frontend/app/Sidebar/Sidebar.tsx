import React, { useState } from 'react';
import { IoFilterSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
  <>
      {/* 🌌 Sidebar Panel */}
      <AnimatePresence>
  {isOpen && (
    <motion.div
      key="animated-panel"
      initial={{ scale: 0.8, opacity: 0, x: -100 }}
      animate={{ scale: 1, opacity: 1, x: 10 }}
      exit={{ scale: 0.9, opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="fixed z-40 flex flex-col min-h-[80%] max-h-[80%]
                 w-[25vw] rounded-3xl backdrop-blur-md
                 border overflow-hidden
                 top-[calc(var(--header-margin-top)+var(--header-height)+3vh)]
                 bg-gradient-to-br from-indigo-400/40 via-indigo-500/30 to-purple-600/20 
                 ring-2 ring-indigo-400/60 
                 shadow-[0_0_20px_5px_rgba(99,102,241,0.5)]"
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
      </motion.div>
  )}
</AnimatePresence>
      {/* 🧭 Toggle Button (always visible) */}
   <button
  onClick={toggleSidebar}
  className={`fixed z-50 w-10 h-10 flex items-center justify-center rounded-full
  border border-[var(--color-solar-line)]
  hover:shadow-glow-soft 
  duration-300
  top-[calc(var(--header-margin-top)+var(--header-height)+3vh)]
  bg-indigo-500/20 ring-1 ring-indigo-300/40 backdrop-blur-md shadow-[0_0_20px_5px_rgba(99,102,241,0.35)] hover:bg-indigo-500/30 hover:shadow-[0_0_10px_5px_rgba(99,102,241,0.45)] active:scale-95 transition-all duration-200"
  ${isOpen ? 'left-[calc(25vw+2rem)]' : 'left-5'}`}
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

/**
 *  initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="w-full max-w-lg mx-auto 
              rounded-3xl bg-gradient-to-br f
              rom-indigo-400/40 via-indigo-500/30 t
              o-purple-600/20 
              ring-2 
              ring-indigo-400/60 
              shadow-[0_0_80px_20px_rgba(99,102,241,0.5)] 
              
              p-8 
              backdrop-blur-xl text-white
              
              overflow-auto max-h-[80vh]"
  border-[var(--color-solar-line)]
  bg-[var(--color-solar-surface)]
 */