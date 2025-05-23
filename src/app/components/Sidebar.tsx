import React from "react";
import Image from "next/image";
import { TiHome } from "react-icons/ti";
import { AiFillMessage } from "react-icons/ai";
import { IoTicket } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { TfiMenuAlt } from "react-icons/tfi";
import { HiMegaphone } from "react-icons/hi2";
import { TbHierarchy } from "react-icons/tb";

import { RiContactsBookFill } from "react-icons/ri";
import { FaImage } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { GiStarsStack } from "react-icons/gi";
import { LuSquareChevronRight } from "react-icons/lu";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center p-2 space-y-4 text-gray-500">
      <Image
        src="/logo.jpeg"
        alt="logo"
        width={30}
        height={25}
        className="mb-8"
      />

      <TiHome size={20} className="cursor-pointer" />

      <hr className="text-gray-200" />
      <AiFillMessage size={20} className="cursor-pointer" />
      <IoTicket size={20} className="cursor-pointer" />
      <GoGraph size={20} className="cursor-pointer" />
      <hr className="text-gray-200" />

      <TfiMenuAlt size={20} className="cursor-pointer" />
      <HiMegaphone size={20} className="cursor-pointer" />
      <TbHierarchy size={20} className="cursor-pointer" />
      <RiContactsBookFill size={20} className="cursor-pointer" />
      <FaImage size={20} className="cursor-pointer" />
      <hr className="text-gray-200" />

      <MdChecklist size={20} className="cursor-pointer" />
      <IoSettingsSharp size={20} className="cursor-pointer" />
      <div className="flex flex-col gap-4 pt-16">
        <GiStarsStack size={20} className="cursor-pointer" />
        <LuSquareChevronRight size={20} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default Sidebar;
