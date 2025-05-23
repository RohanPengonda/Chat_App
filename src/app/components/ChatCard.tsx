"use client";
import React, { useState, useEffect } from "react";
import { MdFilterList } from "react-icons/md";
import { supabase } from "../lib/supabaseClient"; // ✅ Use this instead

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
  mobile?: string;
  messages: Message[];
  lastMessagePreview?: {
    id: string;
    context: string;
    sender_id: string;
    timestamp: string;
  };
}

interface ChatCardProps {
  clients: Client[];
  selectedClient: Client | null;
  setSelectedClient: (client: Client) => void;
  loggedInUserId: string;
}

const ChatCard = ({
  clients,
  selectedClient,
  setSelectedClient,
  loggedInUserId,
}: ChatCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  useEffect(() => {
    const fetchMatchingClients = async () => {
      if (!loggedInUserId) return;

      if (searchTerm.trim() === "") {
        setFilteredClients(clients); // Reset to original
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .select("id, name, email, mobile")
        .ilike("name", `%${searchTerm}%`)
        .neq("id", loggedInUserId); // Don’t include logged-in user

      if (error) {
        console.error("Search error:", error.message);
        return;
      }

      const enriched = data.map((c) => ({
        ...c,
        messages: [],
        lastMessagePreview: undefined,
      })) as Client[];

      setFilteredClients(enriched);
    };

    fetchMatchingClients();
  }, [searchTerm, clients, loggedInUserId]);

  return (
    <div className="h-160 p-1 bg-gray-50 rounded-md shadow-sm">
      {/* Top Actions */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <button className="text-green-600 font-medium text-sm border border-gray-200 rounded w-25 h-7">
            Custom filter
          </button>
          <button className="border border-gray-200 text-sm px-2 py-1 rounded">
            Save
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 px-2 py-1 rounded-md text-sm w-30"
          />
          <button className="flex bg-green-100 text-green-700 text-sm px-2 py-1 rounded gap-1">
            <MdFilterList />
            Filtered
          </button>
        </div>
      </div>
      <hr className="text-gray-200 space-y-2" />

      {/* Chat List */}
      <div className="p-1 space-y-1 bg-gray-50 h-150 rounded overflow-y-auto">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => {
            const lastMessage = client.lastMessagePreview;
            const senderLabel = lastMessage
              ? lastMessage.sender_id === loggedInUserId
                ? "You"
                : client.name
              : "";

            return (
              <div
                key={client.id}
                className={`p-3 rounded cursor-pointer hover:bg-gray-100 border border-gray-200 ${
                  selectedClient?.id === client.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedClient(client)}
              >
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className=" flex justify-between text-sm text-gray-500 truncate">
                    {lastMessage
                      ? `${senderLabel}: ${lastMessage.context}`
                      : "No messages yet."}
                    {lastMessage?.timestamp && (
                      <p className="pl-20">
                        {new Date(lastMessage.timestamp).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm text-center">
            No matching clients.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatCard;
