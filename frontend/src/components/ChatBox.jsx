import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatBox = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    const question = input;
    setInput("");

    try {
      const res = await axios.post("http://localhost:5001/api/chat", {
        userId,
        question,
      });

      setMessages((prev) => [...prev, { type: "bot", text: res.data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Có lỗi xảy ra. Vui lòng thử lại." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[400px] bg-white border rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="bg-blue-500 text-white px-4 py-2 font-bold">
        AI ChatBot
      </div>

      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-[80%] ${
              msg.type === "user"
                ? "bg-blue-100 self-end"
                : "bg-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi..."
          className="flex-1 border rounded px-2 py-1 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
