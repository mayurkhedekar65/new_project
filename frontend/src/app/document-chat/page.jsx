"use client";

import Link from "next/link";
import Loader from "@/components/Loader";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Page() {
  const [pdfChats, setPdfChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadingFileId, setUploadingFileId] = useState(null);

  useEffect(() => {
    currentChatIdRef.current = currentChat?.id ?? null;
  }, [currentChat]);

  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const currentChatIdRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (!storedToken) {
      console.log("No access token found");
      setLoading(false);
      return;
    }

    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    let active = true;

    const wsUrl = `ws://127.0.0.1:8000/chats/document-chat?token=${encodeURIComponent(token)}`;

    console.log("Opening WebSocket:", wsUrl);

    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => {
      if (!active) return;
      console.log("WebSocket OPEN");
    };

    socket.onmessage = (event) => {
      if (!active) return;

      console.log("WebSocket RAW:", event.data);

      let data;

      try {
        data = JSON.parse(event.data);
      } catch {
        data = {
          type: "message",
          ai_msg: event.data,
        };
      }

      console.log("WebSocket DATA:", data);

      if (data?.type === "thinking") {
        setIsGenerating(true);
        return;
      }

      if (data?.type === "error") {
        console.error("WebSocket backend error:", data.message);

        setIsGenerating(false);

        setCurrentChat((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            messages: (prev.messages || []).filter((msg) => !msg.isTyping),
          };
        });

        return;
      }

      if (data?.type === "done") {
        setIsGenerating(false);
        return;
      }

      let aiText = "";

      if (data?.type === "message") {
        aiText = data.ai_msg;
      } else {
        aiText =
          data?.ai_msg ?? data?.answer ?? data?.response ?? data?.content ?? "";
      }

      if (aiText && typeof aiText === "object") {
        aiText = aiText.content ?? aiText.text ?? JSON.stringify(aiText);
      }

      if (!aiText) {
        console.log("No AI response in WebSocket message.");
        return;
      }

      aiText = String(aiText);

      console.log("AI RESPONSE RECEIVED:", aiText);

      setIsGenerating(false);

      setCurrentChat((prev) => {
        if (!prev) return prev;

        const messages = [...(prev.messages || [])];

        let waitingIndex = -1;

        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].sender === "assistant" && messages[i].isTyping) {
            waitingIndex = i;
            break;
          }
        }

        const aiMessage = {
          sender: "assistant",
          text: aiText,
          isTyping: false,
        };

        if (waitingIndex !== -1) {
          messages[waitingIndex] = aiMessage;
        } else {
          messages.push(aiMessage);
        }

        return {
          ...prev,
          messages,
        };
      });

      setPdfChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id !== currentChatIdRef.current) {
            return chat;
          }

          const messages = [...(chat.messages || [])];

          let waitingIndex = -1;

          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].sender === "assistant" && messages[i].isTyping) {
              waitingIndex = i;
              break;
            }
          }

          const aiMessage = {
            sender: "assistant",
            text: aiText,
            isTyping: false,
          };

          if (waitingIndex !== -1) {
            messages[waitingIndex] = aiMessage;
          } else {
            messages.push(aiMessage);
          }

          return {
            ...chat,
            messages,
          };
        }),
      );
    };

    socket.onerror = (event) => {
      if (!active) return;

      console.error("WebSocket ERROR:", event);
    };

    socket.onclose = (event) => {
      if (!active) return;

      console.log("WebSocket CLOSED:", event.code, event.reason);

      setIsGenerating(false);
    };

    return () => {
      active = false;

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close(1000, "Component cleanup");
      }
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const getChatsFiles = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/chats/get-chats-files",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Chat files response:", response.data);

        const chatsFiles = Array.isArray(response.data.chats_files)
          ? response.data.chats_files
          : [];

        const formattedChats = chatsFiles.map((chat) => ({
          id: chat.id,

          name: chat.file_name,

          file_id: chat.id,

          upload_date: chat.upload_date,

          progress: 100,

          uploaded: true,

          messages: [],
        }));

        setPdfChats(formattedChats);
      } catch (error) {
        console.error(
          "Get chat files error:",
          error.response?.data || error.message,
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");

          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getChatsFiles();
  }, [token]);

  const selectChat = async (id) => {
    if (!token) {
      return;
    }

    try {
      console.log("Loading chat:", id);

      const response = await axios.get(
        `http://127.0.0.1:8000/chats/get-chats/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Chat history response:", response.data);

      const history = Array.isArray(response.data.chats_history)
        ? response.data.chats_history
        : [];

      const messages = [];

      history.forEach((item) => {
        if (item.user_msg) {
          messages.push({
            sender: "user",

            text: item.user_msg,

            isTyping: false,
          });
        }

        if (item.ai_msg) {
          messages.push({
            sender: "assistant",

            text: item.ai_msg,

            isTyping: false,
          });
        }
      });

      const existingChat = pdfChats.find((chat) => chat.id === id);

      const selectedChat = {
        id: id,

        name: existingChat?.name || `Document ${id}`,

        file_id: id,

        upload_date: existingChat?.upload_date || null,

        progress: 100,

        uploaded: true,

        messages: messages,
      };

      setCurrentChat(selectedChat);

      setPdfChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === id
            ? {
                ...chat,

                messages: messages,

                uploaded: true,

                progress: 100,
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error(
        "Get chat history error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");

        setToken(null);
      }
    }
  };

  const addFiles = async (selectedFiles) => {
    if (!token) {
      return;
    }

    const supportedFiles = selectedFiles.filter((file) => {
      const name = file.name.toLowerCase();

      return (
        file.type === "application/pdf" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        name.endsWith(".pdf") ||
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png")
      );
    });

    if (supportedFiles.length === 0) {
      alert("Please select a PDF, JPG, JPEG or PNG file.");
      return;
    }

    for (const file of supportedFiles) {
      const tempId = Date.now() + Math.random();

      const tempChat = {
        id: tempId,
        name: file.name,
        file_id: null,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        progress: 0,
        uploaded: false,
        processing: true,
        upload_date: new Date().toISOString().split("T")[0],
        messages: [],
      };

      setPdfChats((prev) => [...prev, tempChat]);

      setCurrentChat((prev) => (prev ? prev : tempChat));

      const formData = new FormData();
      formData.append("file", file);

      setUploadingFileId(tempId);

      try {
        console.log("Uploading document:", file.name);

        const response = await axios.post(
          "http://127.0.0.1:8000/chats/upload-file",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            timeout: 0,

            onUploadProgress: (event) => {
              if (!event.total) {
                return;
              }

              const networkProgress = Math.round(
                (event.loaded * 100) / event.total,
              );

              const progress = Math.min(networkProgress, 95);

              setPdfChats((prev) =>
                prev.map((chat) =>
                  chat.id === tempId
                    ? {
                        ...chat,
                        progress,
                      }
                    : chat,
                ),
              );

              setCurrentChat((prev) =>
                prev?.id === tempId
                  ? {
                      ...prev,
                      progress,
                    }
                  : prev,
              );
            },
          },
        );

        console.log("Upload endpoint response:", response.data);

        const fileId = response.data?.file_id;

        if (!fileId) {
          const backendMessage =
            response.data?.message || "File was not uploaded.";

          alert(backendMessage);

          setPdfChats((prev) => prev.filter((chat) => chat.id !== tempId));

          setCurrentChat((prev) => (prev?.id === tempId ? null : prev));

          continue;
        }

        const uploadedChat = {
          ...tempChat,

          id: fileId,
          file_id: fileId,

          progress: 100,
          uploaded: true,
          processing: false,

          messages: [],
        };

        setPdfChats((prev) =>
          prev.map((chat) => (chat.id === tempId ? uploadedChat : chat)),
        );

        setCurrentChat((prev) => (prev?.id === tempId ? uploadedChat : prev));

        console.log("Document processed successfully:", fileId);
      } catch (error) {
        console.error(
          "Upload/process error:",
          error.response?.data || error.message,
        );

        const status = error.response?.status;

        const backendMessage =
          error.response?.data?.detail || error.response?.data?.message;

        if (status === 401) {
          localStorage.removeItem("access_token");

          setToken(null);

          return;
        }

        alert(backendMessage || `Failed to process ${file.name}.`);

        setPdfChats((prev) => prev.filter((chat) => chat.id !== tempId));

        setCurrentChat((prev) => (prev?.id === tempId ? null : prev));
      } finally {
        setUploadingFileId(null);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);

    if (files.length > 0) {
      addFiles(files);
    }
  };

  const deleteChat = async (id) => {
    if (!token) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/chats/delete-chat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedChats = pdfChats.filter((chat) => chat.id !== id);

      setPdfChats(updatedChats);

      if (currentChat?.id === id) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");

        setToken(null);
      }
    }
  };

  const sendMessage = () => {
    const userText = message.trim();

    if (!userText || !currentChat || !currentChat.uploaded || isGenerating) {
      return;
    }

    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not OPEN");

      return;
    }

    const chatId = currentChat.id;

    const userMessage = {
      sender: "user",
      text: userText,
      isTyping: false,
    };

    const waitingMessage = {
      sender: "assistant",
      text: "",
      isTyping: true,
    };

    setCurrentChat((prev) => {
      if (!prev || prev.id !== chatId) {
        return prev;
      }

      return {
        ...prev,
        messages: [...(prev.messages || []), userMessage, waitingMessage],
      };
    });

    setPdfChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...(chat.messages || []), userMessage, waitingMessage],
            }
          : chat,
      ),
    );

    setMessage("");
    setIsGenerating(true);

    socket.send(
      JSON.stringify({
        file_id: currentChat.file_id,
        message: userText,
      }),
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "backOut" }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800"
          >
            <svg
              className="h-8 w-8 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V7.5a4.5 4.5 0 0 0-9 0v3"
              />

              <rect x="4.5" y="10.5" width="15" height="10" rx="2" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14.5v2"
              />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-2xl font-semibold text-white"
          >
            Authentication Required
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400"
          >
            Your session has expired or you are not authenticated. Please log in
            again to continue using your account.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Link
              href="/signin"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Go to Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-950 text-white flex overflow-hidden"
    >
      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: sidebarOpen ? 288 : 0,
          opacity: sidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`transition-all duration-300 border-r border-slate-700 bg-slate-900 ${
          sidebarOpen ? "w-72" : "w-0"
        } overflow-hidden flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700">
          <h2 className="font-semibold text-lg">Chats History</h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            ✕
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pdfChats.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-400 mt-10"
            >
              No PDFs uploaded
            </motion.div>
          )}

          <AnimatePresence>
            {Array.isArray(pdfChats) &&
              pdfChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ x: 3 }}
                  onClick={() => selectChat(chat.file_id || chat.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    currentChat?.id === chat.id
                      ? "border-cyan-400 bg-slate-800"
                      : "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 min-w-0">
                      <span className="material-symbols-outlined text-cyan-400">
                        description
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate w-40">
                          {chat.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {chat.upload_date}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(event) => {
                        event.stopPropagation();

                        deleteChat(chat.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </motion.button>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${chat.progress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="h-2 rounded-full bg-cyan-400 transition-all"
                    />
                  </div>

                  {chat.processing && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-cyan-400"
                    >
                      {chat.progress < 95
                        ? `Uploading ${chat.progress}%`
                        : "Processing document..."}
                    </motion.p>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-950"
        >
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">menu</span>
              </motion.button>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
                Back to Home
              </Link>
            </motion.div>
          </div>
        </motion.header>

        <div className="flex-1 flex flex-col overflow-hidden">
          {!currentChat ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center justify-center p-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();

                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full max-w-3xl rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition ${
                  isDragging
                    ? "border-cyan-400 bg-slate-900"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    addFiles(Array.from(event.target.files || []))
                  }
                />

                <motion.span
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="material-symbols-outlined text-7xl text-cyan-400"
                >
                  cloud_upload
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-6 text-3xl font-bold"
                >
                  Upload Document
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-3 text-slate-400"
                >
                  Drag & Drop your Document here (PDF, JPG, PNG)
                </motion.p>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  Select Document
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto px-8 py-8 space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 text-sm text-slate-400"
                >
                </motion.div>

                {currentChat.messages?.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center text-slate-500 py-20"
                  >
                    <span className="material-symbols-outlined text-5xl">
                      chat
                    </span>

                    <p className="mt-3">No chat history yet.</p>

                    <p className="text-sm mt-1">
                      Ask a question about this document.
                    </p>
                  </motion.div>
                )}

                <AnimatePresence initial={false}>
                  {Array.isArray(currentChat.messages) &&
                    currentChat.messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          y: 15,
                          scale: 0.98,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className={`flex ${
                          msg.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {msg.sender === "user" && (
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="max-w-3xl rounded-2xl px-5 py-4 bg-cyan-500 text-slate-950"
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </motion.div>
                        )}

                        {msg.sender === "assistant" && (
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="max-w-3xl rounded-2xl px-5 py-4 bg-slate-900 border border-slate-700"
                          >
                            {msg.isTyping ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400">
                                  Thinking
                                </span>

                                <div className="flex gap-1">
                                  <motion.span
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                      duration: 0.6,
                                      repeat: Infinity,
                                      delay: 0,
                                    }}
                                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]"
                                  />

                                  <motion.span
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                      duration: 0.6,
                                      repeat: Infinity,
                                      delay: 0.15,
                                    }}
                                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]"
                                  />

                                  <motion.span
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                      duration: 0.6,
                                      repeat: Infinity,
                                      delay: 0.3,
                                    }}
                                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="border-t border-slate-700 bg-slate-950 p-5"
              >
                <div className="flex items-center gap-3">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();

                        sendMessage();
                      }
                    }}
                    disabled={
                      !currentChat?.uploaded ||
                      isGenerating ||
                      uploadingFileId !== null
                    }
                    placeholder="Ask anything about this document..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 outline-none focus:border-cyan-400 disabled:opacity-50"
                  />

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={
                      !currentChat?.uploaded ||
                      currentChat?.processing ||
                      !message.trim() ||
                      isGenerating ||
                      uploadingFileId !== null
                    }
                    onClick={sendMessage}
                    className="rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-40"
                  >
                    Send
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
