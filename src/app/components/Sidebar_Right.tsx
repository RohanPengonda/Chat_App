import React from "react";
import { LuSquareChevronLeft } from "react-icons/lu";
import { MdImage, MdChecklist } from "react-icons/md";
import { RiMenu3Line } from "react-icons/ri";
import { HiOutlineViewGrid } from "react-icons/hi";
import { TbHierarchy } from "react-icons/tb";
import { FaUsers, FaAt } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { TfiReload } from "react-icons/tfi";

const Sidebar_Right = () => {
  return (
    <div>
      <div className="flex flex-col items-center space-y-6 p-4 text-gray-500 text-2xl">
        <LuSquareChevronLeft size={20} />
        <TfiReload size={20} />
        <LuPenLine size={20} />
        <RiMenu3Line size={20} />
        <HiOutlineViewGrid size={20} />
        <TbHierarchy size={20} />
        <FaUsers size={20} />
        <FaAt size={20} />
        <MdImage size={20} />
        <MdChecklist size={20} />
      </div>
    </div>
  );
};

export default Sidebar_Right;
