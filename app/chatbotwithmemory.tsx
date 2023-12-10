"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "./types/message";
import { Send } from "react-feather";
import LoadingDots from "./components/LoadingDots";

import Image from 'next/image'

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Ask me question Indian Penal Code",
    },
  ]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = () => {
    if (message == "") return;
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: message },
    ]);
    setMessage("");
    setLoading(true);
    const messageJSON =  JSON.stringify({ query: message, history: history })
    console.log(messageJSON);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: messageJSON,
    })
      .then(async (res) => {
        const r = await res.json();
        setHistory((oldHistory) => [...oldHistory, r]);
        setLoading(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const formatPageName = (url: string) => {
    // Split the URL by "/" and get the last segment
    const pageName = url.split("/").pop();

    // Split by "-" and then join with space
    if (pageName) {
      const formattedName = pageName.split("-").join(" ");

      // Capitalize only the first letter of the entire string
      return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    }
  };

  //scroll to bottom of chat
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <main className="h-screen bg-[#111B21] sm:bg-[#0B141A] p-4 sm:p-6 flex flex-col">
      <div className="flex flex-col gap-6 w-full items-center flex-grow max-h-full">
        <div className="flex flex-col self-start sm:self-center items-start sm:items-center">
          <h1 className=" text-3xl sm:text-4xl font-semibold text-white bg-clip-text py-2 ">
            Law Chatbot Prototype
          </h1>
          <h2 className="text-sm sm:text-md font-normal text-gray-400">
            Get your queries solved
          </h2>
        </div>
        
        <form
          className="rounded-2xl   flex-grow flex flex-col bg-[#111B21] max-h-full overflow-clip"
          onSubmit={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <div className="overflow-y-scroll no-scrollbar flex flex-col sm:w-[450px] md:w-[700px] gap-5 p-4 sm:p-6 h-full">
            {history.map((message: Message, idx) => {
              const isLastMessage = idx === history.length - 1;
              switch (message.role) {
                case "assistant":
                  return (
                    <div
                      ref={isLastMessage ? lastMessageRef : null}
                      key={idx}
                      className="flex gap-2"
                    >
                      <Image
                        src=""
                        className="h-8 w-8 sm:h-12 sm:w-12 rounded-full"
                        alt="image"
                      />
                      <div className="w-auto max-w-xl break-words bg-[#202C33] rounded-b-xl rounded-tr-xl text-white p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                        <p className="text-sm font-medium text-[#53BDEB] mb-2">
                          AI assistant
                        </p>
                        {message.content}
                        {message.links && (
                          <div className="mt-4 flex flex-col gap-2">
                            <p className="text-sm font-medium text-slate-500">
                              Sources:
                            </p>

                            {message.links?.map((link) => {
                              return (
                                <a
                                  href={link}
                                  key={link}
                                  className="block w-fit px-2 py-1 text-sm  text-violet-700 bg-violet-100 rounded"
                                >
                                  {formatPageName(link)}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                case "user":
                  return (
                    <div
                      className="w-auto max-w-xl break-words bg-[#202C33] rounded-b-xl rounded-tl-xl text-white p-6 self-end shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                      key={idx}
                      ref={isLastMessage ? lastMessageRef : null}
                    >
                      <p className="text-sm font-medium text-[#06CF9C] mb-2">
                        You
                        {/* #af6dda */}
                      </p>
                      {message.content}
                    </div>
                  );
              }
            })}
            {loading && (
              <div ref={lastMessageRef} className="flex gap-2">
                <Image
                  src=""
                  className="h-12 w-12 rounded-full"
                  alt=""
                />
                <div className="w-auto max-w-xl break-words bg-[#202C33] rounded-b-xl rounded-tr-xl text-white p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                  <p className="text-sm font-medium text-violet-500 mb-4">
                    AI assistant
                  </p>
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>

          {/* input area */}
          <div className="flex sticky justify-center bottom-0 w-full px-2 sm:px-6 pb-2 sm:pb-6 h-20">
            <div className="w-full relative ">
              <textarea
                aria-label="chat input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="w-full h-full no-scrollbar text-white resize-none rounded-lg border border-slate-900/10 bg-[#2A3942] pl-6 pr-24 py-3 pt-4 text-base placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10  shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleClick();
                  }
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                }}
                className="flex w-11 h-11 items-center justify-center rounded-full px-3 text-sm   bg-slate-100 font-semibold text-gray-700 hover:bg-slate-200 active:bg-slate-300 absolute right-2 bottom-2 disabled:bg-slate-50 disabled:text-gray-500"
                type="submit"
                aria-label="Send"
                disabled={!message || loading}
              >
                <Send />
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
