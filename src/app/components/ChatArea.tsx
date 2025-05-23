// ChatArea.tsx
"use client"; // Keep this directive if it was in your original file.
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoSend } from "react-icons/io5";
import { FiPaperclip, FiSmile, FiClock, FiAlignRight } from "react-icons/fi";
import { PiClockClockwiseFill } from "react-icons/pi";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaMicrophone } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { HiSparkles } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  context: string;
  timestamp: string;
  senderName?: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  messages: Message[];
}

interface ChatAreaProps {
  customer: Client;
  onSendMessage: (message: string) => void;
}

const ChatArea = ({ customer, onSendMessage }: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gray-50 border rounded border-gray-200 h-160 pb-2 overflow-y-scroll">
      <div className="flex justify-between p-3 font-semibold border-b-1 border-gray-300 shadow-md bg-gray-100">
        <div className="flex space-x-2">
          <CgProfile size={25} className="mr-2 text-gray-800" />
          {customer.name}
        </div>
        <div className="flex gap-2 ">
          <HiSparkles size={20} className="" />
          <IoIosSearch size={20} />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide bg-gray-200">
        {/* Add null/undefined check for customer.messages before accessing length */}
        {customer.messages && customer.messages.length > 0 ? (
          customer.messages.map((msg, idx) => (
            <div key={msg.id || idx} className="mb-2">
              <div
                className={`mb-3 flex ${
                  msg.senderName === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs break-all rounded px-3 py-2 shadow-md ${
                    msg.senderName === "You"
                      ? "bg-green-200 text-right"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-bold border-b-1 border-gray-400">
                      {msg.senderName}
                    </span>
                  </div>
                  <div className=" rounded inline-block text-left">
                    {msg.context}
                    <div className=" flex justify-end text-[10px] text-gray-500 ">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // This will be displayed if customer.messages is an empty array or undefined
          <p className="text-gray-400 text-sm text-center">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-100">
        <div className="flex items-center justify-between border-t px-4 py-2 ">
          <input
            type="text"
            placeholder="Message..."
            value={newMessage}
            onKeyDown={handleKeyDown}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 mx-4 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-300"
          />
          <IoSend
            className="w-6 h-6 text-green-600 cursor-pointer"
            onClick={handleSend}
          />
        </div>

        <div className="flex items-center justify-between ">
          <div className="flex space-x-4 text-gray-600 gap-2 px-6">
            <FiPaperclip className="w-5 h-5 cursor-pointer" />
            <FiSmile className="w-5 h-5 cursor-pointer" />
            <FiClock className="w-5 h-5 cursor-pointer" />
            <PiClockClockwiseFill className="w-5 h-5 cursor-pointer" />
            <HiOutlineSparkles className="w-5 h-5 cursor-pointer" />
            <FiAlignRight className="w-5 h-5 cursor-pointer" />
            <FaMicrophone className="w-5 h-5 cursor-pointer" />
          </div>

          <div className="flex  space-x-3">
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
              <Image
                src="/logo.jpeg"
                alt="logo"
                width={15}
                height={15}
                className=""
              />
              Periskope
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
