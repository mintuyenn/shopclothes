// src/components/FilterBar.jsx
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const FilterBar = ({
  selectedPrice,
  setSelectedPrice,
  selectedColor,
  setSelectedColor,
  sort,
  updateQuery,
  colors,
  priceRanges,
}) => {
  // Danh sách tùy chọn sắp xếp để map vào Menu
  const sortOptions = [
    { value: "", label: "Mặc định" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
    { value: "name_asc", label: "Tên A-Z" },
    { value: "name_desc", label: "Tên Z-A" },
  ];

  // Tìm label hiện tại của sort để hiển thị lên nút
  const currentSortLabel =
    sortOptions.find((o) => o.value === sort)?.label || "Mặc định";

  // Class chung cho các nút dropdown để đồng bộ
  const buttonClass =
    "inline-flex justify-between items-center w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all shadow-sm";

  // Class chung cho các item trong dropdown
  const itemClass = (active, isSelected) =>
    `${active ? "bg-gray-100 text-gray-900" : "text-gray-600"} ${
      isSelected ? "font-bold text-gray-900 bg-gray-50" : ""
    } block w-full text-left px-4 py-2 text-sm transition-colors`;

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
      {/* 1. FILTER: GIÁ */}
      <div className="flex flex-col w-full md:w-[180px]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
          Khoảng giá
        </span>
        <Menu as="div" className="relative w-full">
          <Menu.Button className={buttonClass}>
            <span className="truncate">{selectedPrice}</span>
            <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-400" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-full origin-top-right bg-white border border-gray-100 rounded-lg shadow-xl focus:outline-none z-50 overflow-hidden">
              <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                {priceRanges.map((p, idx) => (
                  <Menu.Item key={idx}>
                    {({ active }) => (
                      <button
                        className={itemClass(active, selectedPrice === p.label)}
                        onClick={() =>
                          updateQuery(
                            { minPrice: p.min, maxPrice: p.max },
                            setSelectedPrice,
                            p.label
                          )
                        }
                      >
                        {p.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* 2. FILTER: MÀU SẮC */}
      <div className="flex flex-col w-full md:w-[160px]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
          Màu sắc
        </span>
        <Menu as="div" className="relative w-full">
          <Menu.Button className={buttonClass}>
            <span className="truncate">{selectedColor}</span>
            <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-400" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-full origin-top-right bg-white border border-gray-100 rounded-lg shadow-xl focus:outline-none z-50 overflow-hidden">
              <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={itemClass(active, selectedColor === "TẤT CẢ")}
                      onClick={() =>
                        updateQuery({ color: "" }, setSelectedColor, "TẤT CẢ")
                      }
                    >
                      TẤT CẢ
                    </button>
                  )}
                </Menu.Item>
                {colors.map((c) => (
                  <Menu.Item key={c}>
                    {({ active }) => (
                      <button
                        className={itemClass(active, selectedColor === c)}
                        onClick={() =>
                          updateQuery({ color: c }, setSelectedColor, c)
                        }
                      >
                        {c}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* 3. FILTER: SẮP XẾP (Đã chuyển sang HeadlessUI Menu) */}
      <div className="flex flex-col w-full md:w-[180px]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
          Sắp xếp
        </span>
        <Menu as="div" className="relative w-full">
          <Menu.Button className={buttonClass}>
            <span className="truncate">{currentSortLabel}</span>
            <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-400" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 md:left-auto mt-2 w-full origin-top-right bg-white border border-gray-100 rounded-lg shadow-xl focus:outline-none z-50 overflow-hidden">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        className={itemClass(active, sort === option.value)}
                        onClick={() => updateQuery({ sort: option.value })}
                      >
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default FilterBar;
