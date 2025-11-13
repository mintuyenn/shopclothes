import MarqueeText from "./MarqueeText";

export default function DemoPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Demo Marquee Component</h1>

      <MarqueeText
        speed={12}
        className="bg-gray-900 text-white py-2 px-4 rounded"
      >
        🔥 Flash Sale hôm nay giảm 50% tất cả sản phẩm!
      </MarqueeText>

      <MarqueeText
        speed={20}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        🎶 Đây là dòng chữ chạy chậm hơn một chút 🎶
      </MarqueeText>

      <MarqueeText
        speed={8}
        className="bg-green-700 text-white py-2 px-4 rounded"
      >
        🚀 Chữ chạy nhanh hơn 🚀
      </MarqueeText>
    </div>
  );
}
