import React from "react";

// Đây là component chính của ứng dụng
export default function WarrantyPolicyPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 sm:p-8 font-['Inter',_sans-serif]">
      {/* Container chính cho nội dung
        - max-w-3xl: Giới hạn chiều rộng tối đa
        - bg-white: Nền trắng
        - shadow-lg: Đổ bóng lớn
        - rounded-xl: Bo góc lớn
        - overflow-hidden: Ẩn nội dung tràn viền (quan trọng khi dùng border-l)
      */}
      <div className="w-full max-w-3xl overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Phần viền đen bên trái
          - border-l-8: Tạo viền trái dày 8px
          - border-black: Màu viền đen
          - p-8 sm:p-12: Padding cho nội dung bên trong
        */}
        <div className="p-8 border-l-8 border-black sm:p-12">
          {/* Tiêu đề chính */}
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 sm:text-5xl">
            Chính sách bảo hành
          </h1>

          {/* Đoạn giới thiệu */}
          <p className="mb-8 text-base text-gray-700">
            Chính sách bảo hành được áp dụng cho các sản phẩm chính hãng của
            ShopClothes mà không yêu cầu hóa đơn.
          </p>

          {/* Phần: Thời gian và địa điểm */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Thời gian và địa điểm:
            </h2>
            <ul className="pl-5 text-gray-700 list-disc list-outside space-y-3">
              <li className="pl-2">
                <strong className="font-semibold text-gray-800">
                  Thời gian xử lý:
                </strong>{" "}
                Tối đa 14 ngày làm việc. Nhân viên sẽ liên hệ nếu hoàn thành
                sớm.
              </li>
              <li className="pl-2">
                <strong className="font-semibold text-gray-800">
                  Địa điểm:
                </strong>
                {/* Các địa điểm con */}
                <p className="mt-2 text-gray-600">
                  - Tại bất kỳ chi nhánh ShopClothes nào trên toàn quốc.
                </p>
                <p className="mt-2 text-gray-600">
                  - Hoặc gửi hàng về địa chỉ: 112 Đức Nhuận HCM+ SĐT: 0862347170
                </p>
              </li>
              <li className="pl-2">
                <strong className="font-semibold text-gray-800">
                  Giờ nhận bảo hành:
                </strong>{" "}
                8h30 - 21h45.
              </li>
            </ul>
          </section>

          {/* Phần: Nội dung bảo hành */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Nội dung bảo hành:
            </h2>
            <ul className="pl-5 text-gray-700 list-disc list-outside space-y-3">
              <li className="pl-2">
                <strong className="font-semibold text-gray-800">
                  Chỉnh sửa sản phẩm theo yêu cầu:
                </strong>{" "}
                Lên lai, bóp eo.
              </li>
              <li className="pl-2">
                <strong className="font-semibold text-gray-800">
                  Sửa lỗi kỹ thuật sản xuất:
                </strong>{" "}
                Bung chỉ, bung keo, hư dây kéo, đứt nút.
              </li>
            </ul>
          </section>

          {/* Phần: Lưu ý quan trọng */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Lưu ý quan trọng:
            </h2>
            <ul className="pl-5 text-gray-700 list-disc list-outside space-y-3">
              <li className="pl-2">
                Các sản phẩm không hỗ trợ bảo hành bao gồm: Nước hoa, khẩu
                trang, quần lót, vớ.
              </li>
              <li className="pl-2">
                Trong 30 ngày đầu tiên, nếu lỗi được xác nhận do ShopClothes,
                khách hàng sẽ được đổi sản phẩm mới.
              </li>
              <li className="pl-2">
                Nếu phụ kiện (như nút, dây kéo) cần thay thế không còn,
                ShopClothes sẽ sử dụng phụ kiện tương đương và thông báo trước
                cho khách hàng.
              </li>
              <li className="pl-2">
                ShopClothes có thể từ chối bảo hành đối với các trường hợp sản
                phẩm hư hỏng do quá trình sử dụng lâu dài hoặc hao mòn tự nhiên
                mà không thể sửa chữa.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
