import { FiHelpCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { AiFillMessage } from "react-icons/ai";
import { IoIosNotificationsOff } from "react-icons/io";
import { VscDesktopDownload } from "react-icons/vsc";
import { IoSparklesSharp } from "react-icons/io5";
import { LuChevronsUpDown } from "react-icons/lu";

import { IoListOutline } from "react-icons/io5";
import { LuRefreshCcwDot } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center shadow-md h-10 p-1 bg-white">
      {/* Left - Title */}
      <div className="flex items-center space-x-2 pl-5 text-gray-600 font-semibold text-sm">
        <AiFillMessage size={18} />
        <span className="text-gray-500 text-[17px]">chats</span>
      </div>
      {/* Right - Action icons */}
      <div className="flex items-center space-x-3 text-gray-600 text-sm">
        <button
          className="flex items-center px-2 py-1 border border-gray-500 rounded-md hover:bg-gray-100 bg-red-400"
          onClick={() => router.push("/logout")}
        >
          <p className="text-[13px] text-gray-900">Logout</p>
        </button>
        <button className="flex items-center px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100">
          <LuRefreshCcwDot className="mr-1" size={14} />
          <p className="text-[12px]">Refresh</p>
        </button>

        <button className="flex items-center px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-100">
          <FiHelpCircle className="mr-1" size={14} />
          <p className="text-[12px]">Help</p>
        </button>

        <div className="flex items-center px-2 py-1 border border-gray-200 rounded-md">
          <FaRegCircle size={8} className="text-yellow-400 mr-1" />{" "}
          <p className="text-[12px]">5 / 6 phones</p>
          <LuChevronsUpDown size={12} />
        </div>

        <button className="p-1 border border-gray-200 rounded-md hover:bg-gray-100">
          <VscDesktopDownload size={14} />
        </button>

        <button className="p-1 border border-gray-200 rounded-md hover:bg-gray-100">
          <IoIosNotificationsOff size={14} />
        </button>

        <button className="flex justify-center p-2 border border-gray-200 rounded-md hover:bg-gray-100">
          <IoSparklesSharp size={12} className="text-yellow-400 mr-1" />
          <IoListOutline size={14} />
        </button>
      </div>
    </div>
  );
}
