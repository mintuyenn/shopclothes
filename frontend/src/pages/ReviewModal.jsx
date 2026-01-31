import React, { useState } from "react";
import axios from "axios";
import { Star, X, Send } from "lucide-react";
import Swal from "sweetalert2";

const ReviewModal = ({ item, orderId, token, onClose, onReviewSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/reviews`;

  const handleSubmit = async () => {
    if (!comment.trim() || comment.length < 10) {
      return Swal.fire(
        "Thông báo",
        "Vui lòng nhập đánh giá ít nhất 10 ký tự nhé!",
        "info",
      );
    }

    setLoading(true);
    try {
      await axios.post(
        API_URL,
        {
          productId: item.productId, // Lấy từ orderItemSchema
          orderId: orderId,
          rating,
          comment,
          color: item.color,
          size: item.size,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire({
        title: "Cảm ơn bạn!",
        text: "Đánh giá của bạn đã được đăng tải thành công.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      onReviewSuccess(item.productId); // Thông báo cho cha để ẩn nút
      onClose();
    } catch (error) {
      Swal.fire(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi đánh giá",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Viết đánh giá</h3>
            <p className="text-sm text-gray-500">
              Chia sẻ trải nghiệm của bạn về sản phẩm
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          {/* Thông tin sản phẩm cụ thể (Màu/Size) */}
          <div className="flex gap-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <img
              src={item.image || "/no-image.png"}
              alt={item.name}
              className="w-20 h-24 object-cover rounded-xl shadow-sm bg-white"
            />
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-gray-800 line-clamp-1 text-lg">
                {item.name}
              </h4>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-white border border-gray-200 text-xs font-semibold rounded-full text-gray-600">
                  Màu: {item.color}
                </span>
                <span className="px-3 py-1 bg-white border border-gray-200 text-xs font-semibold rounded-full text-gray-600">
                  Size: {item.size}
                </span>
              </div>
            </div>
          </div>

          {/* Chọn số sao */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-all transform hover:scale-125 active:scale-95"
                >
                  <Star
                    size={42}
                    fill={(hover || rating) >= star ? "#fbbf24" : "none"}
                    color={(hover || rating) >= star ? "#fbbf24" : "#d1d5db"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm font-bold text-amber-600 uppercase tracking-wider">
              {rating === 5
                ? "Rất hài lòng"
                : rating === 4
                  ? "Hài lòng"
                  : rating === 3
                    ? "Bình thường"
                    : rating === 2
                      ? "Không tốt"
                      : "Rất tệ"}
            </p>
          </div>

          {/* Nội dung bình luận */}
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Sản phẩm vải đẹp, form chuẩn, giao hàng nhanh..."
              className="w-full border-2 border-gray-100 rounded-2xl p-5 text-base focus:border-black transition-all outline-none min-h-[150px] resize-none shadow-inner"
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
              {comment.length} ký tự
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-2xl mt-8 font-black text-white flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-2xl active:translate-y-1 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-zinc-800"
            }`}
          >
            {loading ? (
              "Đang xử lý..."
            ) : (
              <>
                GỬI ĐÁNH GIÁ <Send size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
