import { useState, useContext } from "react";
import {
  FaHome,
  FaUsers,
  FaPhone,
  FaLeaf,
  FaBars,
  FaTimes,
  FaTh,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout, uploadAvatar } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.profilePic || null);
  const navigate = useNavigate();

  // 🧩 Upload new avatar using context
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const tempPreview = URL.createObjectURL(file);
  setPreview(tempPreview);

  setLoading(true);
  const uploadedUrl = await uploadAvatar(file);
  if (uploadedUrl) setPreview(uploadedUrl); 
  setLoading(false);
};

  // 🚪 Logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/home");
  };

  // 🧠 Avatar fallback initials
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0].charAt(0).toUpperCase()
      : words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  };

  // 🎨 Dynamic color for initials
  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";
    const colors = [
      "bg-green-700",
      "bg-blue-700",
      "bg-purple-700",
      "bg-pink-700",
      "bg-yellow-600",
      "bg-teal-700",
      "bg-red-700",
      "bg-indigo-700",
    ];
    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 shadow-lg relative z-50">
      <div className="flex justify-between items-center">
        {/* 🌿 Logo */}
        <div className="flex items-center space-x-2">
          <FaLeaf className="text-white text-2xl" />
          <h1 className="text-xl font-bold tracking-wide">CleanCore Waste</h1>
        </div>

        {/* 🧭 Desktop Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium items-center">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center gap-1 transition ${
                  isActive
                    ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                    : "hover:text-green-300"
                }`
              }
            >
              <FaHome /> Home
            </NavLink>
          </li>

          {user && (
            <>
              {/* Other Links */}
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `flex items-center gap-1 transition ${
                      isActive
                        ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                        : "hover:text-green-300"
                    }`
                  }
                >
                  <FaUsers /> About
                </NavLink>
              </li>

              <li>
                <NavLink
                  to={user.role === "Houser"? "/houser" : "/zip"}
                  className={({ isActive }) =>
                    `flex items-center gap-1 transition ${
                      isActive
                        ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                        : "hover:text-green-300"
                    }`
                  }
                >
                  < FaTh /> Dashboard
                </NavLink>
              </li>
            </>
          )}

          {/* 🔐 Login / Logout */}
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:text-red-300 transition font-semibold"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-yellow-300" : "hover:text-green-300"
                }
              >
                Login
              </NavLink>
            )}
          </li>

          {/* 👤 Profile Picture / Avatar */}
          {user && (
            <div className="relative">
              <label htmlFor="avatar-upload" className="cursor-pointer group">
                {preview || user?.profilePicture ? (
                  <img
                    src={preview || user?.profilePicture}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md hover:shadow-green-400/40 transition duration-300"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white shadow-md hover:shadow-green-400/40 transition duration-300 ${getAvatarColor(
                      user?.name
                    )}`}
                  >
                    {getInitials(user?.name)}
                  </div>
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white text-xs">
                    Uploading...
                  </div>
                )}
              </label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </ul>

        {/* 📱 Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className="text-2xl transition-transform duration-300" />
          ) : (
            <FaBars className="text-2xl transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* 📲 Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></motion.div>

            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-green-700 text-white p-6 z-50 rounded-b-2xl shadow-lg md:hidden"
            >
              <ul className="space-y-4 text-base font-medium">
                <li>
                  <NavLink
                    to="/home"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 ${
                        isActive ? "text-yellow-300" : ""
                      }`
                    }
                  >
                    <FaHome /> Home
                  </NavLink>
                </li>
                {user && (
                  <>
                    <li>
                      <NavLink
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2 ${
                            isActive ? "text-yellow-300" : ""
                          }`
                        }
                      >
                        <FaUsers /> About
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={user.role === "Houser"? "/houser" : "/zip"}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2 ${
                            isActive ? "text-yellow-300" : ""
                          }`
                        }
                      >
                        <FaPhone /> Dashboard
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="hover:text-red-300 transition font-semibold"
                    >
                      Logout
                    </button>
                  ) : (
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive ? "text-yellow-300" : "hover:text-green-300"
                      }
                    >
                      Login
                    </NavLink>
                  )}
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
