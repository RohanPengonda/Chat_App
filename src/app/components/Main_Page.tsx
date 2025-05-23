"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Sidebar_Right from "./Sidebar_Right";
import Header from "./Header";
import ChatCard from "./ChatCard";
import ChatArea from "./ChatArea";
import { supabase } from "../lib/supabaseClient";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  context: string;
  timestamp: string;
  senderName?: string;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_id: string | null; // last_message_id can be null
  updated_at?: string;
}

interface LastMessagePreview {
  id: string;
  context: string;
  sender_id: string;
  timestamp: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  messages: Message[];
  lastMessagePreview?: LastMessagePreview; // Use the more specific interface here
}

interface Main_PageProps {
  loggedInUserId: string;
}

const Main_Page = ({ loggedInUserId }: Main_PageProps) => {
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Get current user
      const { data: userData, error: userError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", loggedInUserId)
        .single();

      if (userError || !userData) {
        console.error("Error fetching current user:", userError?.message);
        setLoading(false);
        return;
      }
      setCurrentUser(userData);

      // 2. Fetch all other clients
      const { data: allClients, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .neq("id", loggedInUserId);

      if (clientsError || !allClients) {
        console.error("Error fetching clients:", clientsError?.message);
        setLoading(false);
        return;
      }

      // 3. Fetch conversations involving the current user
      const { data: conversations, error: convError } = await supabase
        .from("conversations")
        .select("id, user1_id, user2_id, last_message_id")
        .or(`user1_id.eq.${loggedInUserId},user2_id.eq.${loggedInUserId}`);

      if (convError || !conversations) {
        console.error("Error fetching conversations:", convError?.message);
        setLoading(false);
        return;
      }

      const lastMessageIds = conversations
        .filter(
          (conv): conv is Conversation & { last_message_id: string } =>
            conv.last_message_id !== null
        )
        .map((conv) => conv.last_message_id);

      let lastMessages: LastMessagePreview[] | null = null;
      if (lastMessageIds.length > 0) {
        const { data, error: msgError } = await supabase
          .from("messages")
          .select("id, context, sender_id, timestamp")
          .in("id", lastMessageIds);

        if (msgError) {
          console.error("Error fetching last messages:", msgError.message);
        } else {
          lastMessages = data;
        }
      }

      // Map of otherUserId to last message preview
      const convMap = new Map<string, LastMessagePreview>();
      conversations.forEach((conv) => {
        const msg = lastMessages?.find((m) => m.id === conv.last_message_id);
        const otherUserId =
          conv.user1_id === loggedInUserId ? conv.user2_id : conv.user1_id;
        if (msg) {
          convMap.set(otherUserId, msg);
        }
      });

      // Combine client data with their last message preview
      const processedClients: Client[] = allClients.map((client) => ({
        ...client,
        messages: [],
        lastMessagePreview: convMap.get(client.id), // No need for || undefined here
      }));

      setClients(processedClients);
      if (processedClients.length > 0) {
        setSelectedClient(processedClients[0]);
      }

      setLoading(false);
    };

    fetchData();
  }, [loggedInUserId]);

  useEffect(() => {
    if (!selectedClient || !currentUser) return;

    const fetchMessagesAndSubscribe = async () => {
      const user1_id =
        currentUser.id < selectedClient.id ? currentUser.id : selectedClient.id;
      const user2_id =
        currentUser.id < selectedClient.id ? selectedClient.id : currentUser.id;

      let conversation: Conversation | null = null;
      const { data: initialConv, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user1_id", user1_id)
        .eq("user2_id", user2_id)
        .single();

      conversation = initialConv;

      if (error && error.code === "PGRST116") {
        // If conversation not found, create it
        const { data: newConversationData, error: createError } = await supabase
          .from("conversations")
          .insert({ user1_id, user2_id })
          .select()
          .single();
        if (createError) {
          console.error("Error creating conversation:", createError.message);
          return;
        }
        conversation = newConversationData;
      } else if (error) {
        console.error("Error fetching conversation:", error.message);
        return;
      }

      // Ensure conversation is not null before proceeding
      if (!conversation) {
        console.error("Conversation object is null after fetch/create.");
        return;
      }

      const { data: messagesData, error: msgError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("timestamp", { ascending: true });

      if (msgError) {
        console.error("Error fetching messages:", msgError.message);
        return;
      }

      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              messages: messagesData.map((msg) => ({
                ...msg,
                senderName:
                  msg.sender_id === currentUser.id ? "You" : prev.name,
              })),
            }
          : null
      );

      const channel = supabase
        .channel(`conversation_${conversation.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversation.id}`,
          },
          (payload) => {
            const newMessage = payload.new as Message; // Explicitly cast to Message
            setSelectedClient((prev) =>
              prev
                ? {
                    ...prev,
                    messages: [
                      ...prev.messages,
                      {
                        ...newMessage,
                        senderName:
                          newMessage.sender_id === currentUser.id
                            ? "You"
                            : prev.name,
                      },
                    ],
                  }
                : null
            );

            setClients((prevClients) =>
              prevClients.map((client) =>
                client.id === selectedClient.id
                  ? {
                      ...client,
                      lastMessagePreview: {
                        id: newMessage.id,
                        context: newMessage.context,
                        sender_id: newMessage.sender_id,
                        timestamp: newMessage.timestamp,
                      },
                    }
                  : client
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    fetchMessagesAndSubscribe();
  }, [selectedClient, currentUser]);

  const handleSendMessage = async (messageContent: string) => {
    if (!selectedClient || !currentUser || !messageContent.trim()) return;

    const user1_id =
      currentUser.id < selectedClient.id ? currentUser.id : selectedClient.id;
    const user2_id =
      currentUser.id < selectedClient.id ? selectedClient.id : currentUser.id;

    const { data: conv, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("user1_id", user1_id)
      .eq("user2_id", user2_id)
      .single();

    if (error || !conv) {
      console.error("Conversation not found:", error?.message);
      return;
    }

    const { data: msg, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conv.id,
        sender_id: currentUser.id,
        context: messageContent,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (msgError) {
      console.error("Error sending message:", msgError.message);
      return;
    }

    await supabase
      .from("conversations")
      .update({
        last_message_id: msg.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conv.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading chat data...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Authentication error. Please log in again.
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <section className="w-15">
        <Sidebar />
      </section>
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex flex-1">
          <section className="w-1/3 border border-gray-100">
            <ChatCard
              clients={clients}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              loggedInUserId={loggedInUserId}
            />
          </section>
          <section className="flex-1">
            {selectedClient ? (
              <ChatArea
                customer={selectedClient}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a client to start chatting.
              </div>
            )}
          </section>
          <section className="w-14">
            <Sidebar_Right />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Main_Page;
