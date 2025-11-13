import React from "react";

export default function MarqueeText({ children, speed = 15, className = "" }) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-black text-white flex items-center ${className}`}
      style={{ minHeight: "50px" }} // chỉnh chiều cao
    >
      <div
        className="marquee-text whitespace-nowrap px-6 text-sm md:text-base font-medium"
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>

      {/* CSS animation riêng biệt */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .marquee-text {
          display: inline-block;
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}
