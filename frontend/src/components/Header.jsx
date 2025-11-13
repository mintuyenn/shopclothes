import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Phone,
  Shield,
  Building,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Store,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const dynamicPlaceholders = [
  "Tìm kiếm áo khoác, áo thun, ví...",
  "Tìm kiếm sản phẩm Nike, Adidas...",
  "Tìm kiếm theo quần jean, áo sơ mi...",
];

// Dropdown đa cấp
const HeaderDropdown = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [activeChildMenu, setActiveChildMenu] = useState(null);
  const [hideTimer, setHideTimer] = useState(null);
  const buttonRef = useRef(null);
  const [buttonPos, setButtonPos] = useState({ top: 0, left: 0 });

  // Lấy vị trí button
  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPos({ top: rect.bottom + window.scrollY, left: rect.left });
    }
  }, [buttonRef.current]);

  const clearHideTimer = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
  };

  const startHideTimer = () => {
    clearHideTimer();
    setHideTimer(
      setTimeout(() => {
        setOpen(false);
        setActiveMenu(null);
        setActiveSubMenu(null);
        setActiveChildMenu(null);
      }, 1000) // delay 1s
    );
  };

  return (
    <div
      ref={buttonRef}
      className="relative"
      onMouseEnter={() => {
        clearHideTimer();
        setOpen(true);
      }}
      onMouseLeave={startHideTimer}
    >
      {/* Nút mở dropdown */}
      <button className="flex items-center bg-red-800 text-white px-4 py-2 rounded hover:bg-yellow-500 transition">
        ☰ <span className="ml-2 font-semibold">Danh mục sản phẩm</span>
      </button>

      {/* Menu chính */}
      {open && categories.length > 0 && (
        <div
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl"
          style={{ top: buttonPos.top, left: buttonPos.left }}
        >
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="relative group"
              onMouseEnter={() => setActiveMenu(cat._id)}
            >
              <Link
                to={`/category/${cat._id}`}
                className="flex justify-between items-center w-56 px-4 py-2 
                           bg-white hover:bg-red-50 rounded transition 
                           text-gray-700 hover:text-red-600"
              >
                {cat.name}
                {cat.children?.length > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                )}
              </Link>

              {/* Submenu con */}
              {cat.children?.length > 0 && activeMenu === cat._id && (
                <div
                  className="absolute top-0 left-full ml-1 bg-white border border-gray-200 
                             rounded-lg shadow-xl z-[9999] p-1"
                >
                  {cat.children.map((sub) => (
                    <div
                      key={sub._id}
                      className="relative group/sub"
                      onMouseEnter={() => setActiveSubMenu(sub._id)}
                    >
                      <Link
                        to={`/category/${sub._id}`}
                        className="flex justify-between items-center w-56 px-4 py-2 
                                   hover:bg-red-50 hover:text-red-600 rounded transition text-gray-700"
                      >
                        {sub.name}
                        {sub.children?.length > 0 && (
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover/sub:text-red-500" />
                        )}
                      </Link>

                      {/* Submenu cháu */}
                      {sub.children?.length > 0 &&
                        activeSubMenu === sub._id && (
                          <div
                            className="absolute top-0 left-full ml-1 bg-white border border-gray-200 
                                       rounded-lg shadow-xl z-[9999] p-1"
                          >
                            {sub.children.map((child) => (
                              <Link
                                key={child._id}
                                to={`/category/${child._id}`}
                                className={`block w-56 px-4 py-2 text-gray-700 rounded 
                                           hover:bg-red-50 hover:text-red-600 transition ${
                                             activeChildMenu === child._id
                                               ? "bg-red-100 text-red-600 font-semibold"
                                               : ""
                                           }`}
                                onMouseEnter={() =>
                                  setActiveChildMenu(child._id)
                                }
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Header chính
const Header = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const headerHeight = 112;
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // Typing effect cho input search
  useEffect(() => {
    const currentWord = dynamicPlaceholders[wordIndex];
    let timeout;

    if (!deleting) {
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 120);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1000);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50);
      } else {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % dynamicPlaceholders.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex]);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5001/api/categories?tree=true")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50 font-sans shadow-md bg-gray-100">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-3 px-6 border-b border-gray-300 flex-wrap">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-red-600 hover:text-red-700 transition-colors duration-300"
          >
            SHOPCLOTHES
          </Link>

          {/* Search */}
          <div className="flex-grow max-w-lg mx-4 relative hidden md:flex">
            <input
              type="text"
              placeholder={displayedText}
              className="w-full px-12 py-2 rounded-full border border-red-600 focus:outline-none bg-blue-50 placeholder-gray-500"
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/search?q=${e.target.value}`)
              }
            />
            <button
              onClick={() => {
                const value = document.querySelector("input[type=text]").value;
                if (value) navigate(`/search?q=${value}`);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-yellow-400 transition shadow-md"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Hỗ trợ + Địa chỉ + Account + Cart */}
          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            {/* Phone */}
            <div className="hidden lg:flex items-center border border-red-600 bg-blue-50 rounded-lg px-3 py-1 shadow-sm hover:bg-blue-100 hover:text-red-600 transition">
              <Phone className="h-4 w-4 text-red-600 mr-1" />
              <div className="leading-tight text-sm">
                <span className="block text-gray-500 text-xs">
                  Hỗ trợ khách hàng
                </span>
                <a
                  href="tel:0862347170"
                  className="font-extrabold text-red-600"
                >
                  0862347170
                </a>
              </div>
            </div>

            {/* Địa chỉ */}
            <a
              href="https://www.google.com/maps/place/112+Hồ+Văn+Huê,+Phường+9,+Phú+Nhuận,+TP.HCM"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center border border-red-600 bg-blue-50 rounded-lg px-3 py-1 shadow-sm hover:bg-blue-100 hover:text-red-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-600 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v7m0 0s-4-4.686-4-7a4 4 0 118 0c0 2.314-4 7-4 7z"
                />
              </svg>
              <div className="leading-tight text-sm">
                <span className="block text-gray-500 text-xs">
                  Địa chỉ cửa hàng
                </span>
                <span className="font-extrabold text-red-600">
                  112 Hồ Văn Huê, Đức Nhuận, TPHCM
                </span>
              </div>
            </a>

            {/* Account */}
            {!loading && isAuthenticated ? (
              <div className="relative group">
                <button className="flex flex-col justify-center items-center text-right border border-red-600 bg-blue-50 rounded-lg px-3 py-1 shadow-sm hover:bg-blue-100 transition">
                  <span className="font-semibold text-sm text-gray-800">
                    {user.username}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-300 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[9999]">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-800">
                      {user.fullName}
                    </p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Thông tin tài khoản
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Lịch sử mua hàng
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : !loading ? (
              <Link
                to="/login"
                className="flex items-center border border-red-600 bg-blue-50 rounded-lg px-3 py-1 shadow-sm text-gray-600 hover:bg-blue-100 hover:text-red-600 transition"
              >
                <User className="h-4 w-4 mr-1 text-red-600" />
                <div className="leading-tight">
                  <span className="block text-xs">Tài khoản</span>
                  <span className="block font-semibold text-sm">Đăng nhập</span>
                </div>
              </Link>
            ) : (
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            )}

            {/* Giỏ hàng */}
            <Link to="/cart" className="relative">
              <button className="flex items-center bg-red-600 text-white border border-yellow-400 font-semibold py-2 px-5 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition shadow-md relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="text-sm">Giỏ hàng</span>

                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-0 -translate-x-1/3 -translate-y-1/3 
                   bg-white text-red-600 font-bold rounded-full text-xs 
                   w-5 h-5 flex items-center justify-center border border-red-600"
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="bg-red-700 shadow-inner">
          <nav className="flex items-center h-12 text-sm font-medium overflow-x-auto px-6">
            {/* Dropdown danh mục */}
            <HeaderDropdown categories={categories} />

            {/* Menu khác */}
            <div className="flex items-center ml-6 space-x-1 flex-grow overflow-x-auto">
              {[
                {
                  icon: <Shield className="h-4 w-4 mr-1" />,
                  label: "Chính sách bảo hành",
                  path: "/warrant-policy",
                },
                {
                  icon: <Store className="h-4 w-4 mr-1" />,
                  label: "Gian hàng sản phẩm",
                  path: "/products",
                },
                {
                  icon: <Building className="h-4 w-4 mr-1" />,
                  label: "Hệ thống cửa hàng",
                  path: "/store-system",
                },
                {
                  icon: <BookOpen className="h-4 w-4 mr-1" />,
                  label: "Hướng dẫn sử dụng",
                  path: "/user-guide-pro",
                },
                {
                  icon: <CheckCircle className="h-4 w-4 mr-1" />,
                  label: "Chính sách thành viên",
                  path: "/member-policy",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center px-4 py-2 h-full text-white transition-colors duration-300 hover:bg-yellow-400 hover:text-gray-900 rounded whitespace-nowrap"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Padding để nội dung không bị che */}
      <div style={{ height: `${headerHeight}px` }}></div>
    </>
  );
};

export default Header;
