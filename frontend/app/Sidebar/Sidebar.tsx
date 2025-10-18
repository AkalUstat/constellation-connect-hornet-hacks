import React, { useState } from 'react';
import { IoFilterSharp } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
 <div
      className={`fixed flex flex-col min-h-[80%] max-h-[80%] mt-[2vh] rounded-[20px] bg-blue-500/20 ring-1 ring-blue-300/40 shadow-[0_0_40px_4px_rgba(99,102,241,0.35)] hover:bg-blue-500/30  active:scale-95 transition-all duration-300 ease-in-out w-[25vw] ${
        isOpen ? 'translate-x-5' : '-translate-x-full '

      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-[15px] right-[-60px] border-none cursor-pointer rounded-r-[5px]  ring-blue-300/40  bg-blue-500/20  shadow-[0_0_40px_4px_rgba(99,102,241,0.35)] hover:bg-blue-500/30  active:scale-95 z-50"
      >
        <IoFilterSharp color='white' className='text-3xl'/>
      </button>
      <div className={`p-[15px] flex-1 ${isOpen ? 'flex flex-col m-h-[100%] h-full w-full overflow-y-scroll overflow-x-hidden' : 'hidden'}`}>
        <input className="m-[2vh] p-[2vh] w-full bg-slate-300 rounded-[20px] m-h-[3rem] h-[3rem] text-gray-500 self-center"/>
        <div className="m-[2vh] p-[2vh] w-full bg-slate-300 rounded-[20px] m-h-[3rem] text-gray-500 self-center">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut blandit justo. Donec congue mattis metus quis convallis. Mauris vel imperdiet massa, sed pulvinar ligula. Suspendisse potenti. Ut faucibus finibus lacus non porttitor. Nullam sed felis et erat fermentum molestie suscipit id nulla. Mauris tincidunt tellus ut ornare luctus. Proin eget pharetra est, in ultrices nulla. Vestibulum nec viverra neque, nec tincidunt velit. Duis vestibulum eleifend lacus, vitae aliquam mi ultricies eget. Donec felis enim, ultrices et orci sed, fermentum accumsan diam. In gravida augue non neque lacinia, quis maximus orci interdum.

Sed sit amet elementum nisi, at tristique nulla. Nam vel justo vel libero mollis sodales vitae id velit. Maecenas nisl metus, porta quis elementum in, scelerisque sit amet augue. Proin tempus tellus id pretium congue. Quisque nec auctor nisl. Phasellus lacinia ipsum mi, efficitur sodales metus vulputate at. Aenean consequat tincidunt sem vel suscipit. Donec vehicula ligula ipsum, ac lacinia turpis dictum a. Ut fermentum neque nec leo blandit, sit amet volutpat mauris pellentesque. Integer commodo placerat quam, vitae malesuada orci molestie eu. Aenean pretium, tortor iaculis suscipit mattis, nisl leo maximus sapien, vitae viverra tortor lacus eu nisi. Cras ullamcorper congue leo.


          </div>
      </div>

      

    </div> 
  );
};

export default Sidebar;
