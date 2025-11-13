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
  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-center items-center bg-red-50 p-4 rounded-lg shadow-md border border-red-200">
      {/* Giá Filter */}
      <div className="flex flex-col w-[180px]">
        <span className="text-sm font-medium text-gray-700 mb-1">Giá</span>
        <Menu as="div" className="relative w-full">
          <Menu.Button className="inline-flex justify-between items-center w-full px-4 py-2 bg-white border rounded shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm">
            {selectedPrice}
            <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-600" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute mt-2 max-h-52 overflow-y-auto w-full bg-white border border-gray-200 rounded shadow-lg z-50">
              {priceRanges.map((p, idx) => (
                <Menu.Item key={idx}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-100 text-red-700" : "text-gray-700"
                      } block w-full text-left px-4 py-2 text-sm`}
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
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Màu Filter */}
      <div className="flex flex-col w-[150px]">
        <span className="text-sm font-medium text-gray-700 mb-1">Màu</span>
        <Menu as="div" className="relative w-full">
          <Menu.Button className="inline-flex justify-between items-center w-full px-4 py-2 bg-white border rounded shadow-sm hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm">
            {selectedColor}
            <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-600" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute mt-2 max-h-52 overflow-y-auto w-full bg-white border border-gray-200 rounded shadow-lg z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-red-100 text-red-700" : "text-gray-700"
                    } block w-full text-left px-4 py-2 text-sm`}
                    onClick={() =>
                      updateQuery({ color: "" }, setSelectedColor, "Tất cả")
                    }
                  >
                    Tất cả
                  </button>
                )}
              </Menu.Item>
              {colors.map((c) => (
                <Menu.Item key={c}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-red-100 text-red-700" : "text-gray-700"
                      } block w-full text-left px-4 py-2 text-sm`}
                      onClick={() =>
                        updateQuery({ color: c }, setSelectedColor, c)
                      }
                    >
                      {c}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Sắp xếp Filter */}
      <div className="flex flex-col w-[160px]">
        <span className="text-sm font-medium text-gray-700 mb-1">Sắp xếp</span>
        <select
          value={sort}
          onChange={(e) => updateQuery({ sort: e.target.value })}
          className="px-3 py-2 rounded shadow-sm border text-sm hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
        >
          <option value="">Mặc định</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="name_asc">Tên A-Z</option>
          <option value="name_desc">Tên Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
