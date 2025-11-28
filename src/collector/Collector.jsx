import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { motion} from "framer-motion";
import {
  FaRecycle,
  FaTrashAlt,
  FaMapMarkedAlt,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaLeaf,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUserCircle,
  FaBell,
  
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";


export default function Collector({ setActive, active, showModal, setShowModal }) {
  const { user, logout ,uploadAvatar ,token, updateUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [showNotifCount, setShowNotifCount] = useState(true); // small UX toggle
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const name = user?.name || "Guest User";
  const initials = name.charAt(0).toUpperCase();


  // --- Theme: follow system (auto)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      if (mq.matches) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    };
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // --- persist sidebar state
  useEffect(() => {
    const stored = localStorage.getItem("sidebarOpen");
    if (stored !== null) setSidebarOpen(stored === "true");
  }, []);
  useEffect(() => localStorage.setItem("sidebarOpen", sidebarOpen), [sidebarOpen]);

  // --- fetch requests
  const fetchRequests = async () => {
  setLoading(true);
  try {
    if (!user?.collectorAssayId) {
      throw new Error("Missing collectorAssayId");
    }

    let endpoint;
    if (active === "waste") {
      endpoint = `https://waste-management-3-iw0g.onrender.com/api/waste/${user?.collectorAssayId}`;
    } else if (active === "recycle") {
      endpoint = `https://waste-management-3-iw0g.onrender.com/api/recycle/${user?.collectorAssayId}`;
    } else {
      endpoint = `https://waste-management-3-iw0g.onrender.com/api/dump/${user?.collectorAssayId}`;
    }

    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRequests(Array.isArray(res.data.data) ? res.data.data : []);
  } catch (err) {
    console.error("Error fetching requests:", err);
    toast.error("Failed to fetch requests");
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  if (token && (active === "waste" || active === "recycle" || active === "illegal") && user?.collectorAssayId ) {
    fetchRequests(); // initial fetch
  }
}, [token, active,user?.collectorAssayId ]);

  // Accept ?waste=true to open waste view
  useEffect(() => {
    if (typeof setActive !== 'function') return;
    if (params.get("waste")) 
      {
      setActive("waste")
    } else if (params.get('recycle')) {
      setActive("recycle")
    } else if (params.get('illegal'))
    {setActive("illegal")}
  }, [location.search, setActive]);

  // --- logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/home");
  };


  // sections
  const sections = [
    { id: "profile", label: "Profile", icon: <FaUserCircle className="text-cyan-400" /> },
    { id: "waste", label: "Waste Requests", icon: <FaTrashAlt className="text-yellow-400" /> },
    { id: "recycle", label: "Recycling Requests", icon: <FaRecycle className="text-lime-400" /> },
    { id: "illegal", label: "Illegal-Dumps Requests", icon: <FaMapMarkedAlt className="text-red-400" /> },
    { id: "points", label: "Points", icon: <FaStar className="text-orange-400" /> },
    { id: "settings", label: "Settings", icon: <FaCog className="text-gray-400" /> },
  ];

   
 
  // --- summary derived from requests
  const summary = useMemo(() => {
  const total = requests.length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const completed = requests.filter((r) =>
    ["Completed", "Resolved"].includes(r.status)
  ).length;
  return { total, pending, completed };
}, [requests]);


  // --- render content
  

  return (
     <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500 overflow-hidden">
      {/* ===== SIDEBAR (STATIC) ===== */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 84 }}
        transition={{ duration: 0.28 }}
        className={`bg-white/10 dark:bg-black/40 text-white p-4 flex fixed left-0 top-0 h-screen flex-col justify-between shadow-lg backdrop-blur-md border-r border-green-700/20 ${showModal ? "z-0" : "z-20"}`}
      >
        <div>
          {/* Logo + Toggle */}
          <div className="flex items-center justify-between mb-6 relative">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-md shadow-sm">
                <FaLeaf className="text-lime-300" />
              </div>
              {sidebarOpen && (
                <h1 className="font-extrabold text-lg tracking-wide">CleanCore</h1>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 bg-green-600 hover:bg-green-500 rounded-full -right-3 top-2 shadow z-10 text-white"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>

          {/* User Info */}
          {sidebarOpen && (
            <div className="mb-4">
              <div className="text-xs text-gray-300">Welcome</div>
              <div className="font-semibold">{name.split(" ")[0]}</div>
              <div className="text-xs text-gray-400">{user?.role || "Houser"}</div>
            </div>
          )}

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">
              {sections.map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                    active === item.id
                      ? "bg-green-700/25 text-white font-semibold"
                      : "text-white/90 hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
           
            
            {sidebarOpen && (
              <div>
                <div className="text-sm font-medium">{name.split(" ")[0]}</div>
                <div className="text-xs text-white/70">{user?.role || "Houser"}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-200 hover:text-white transition"
          >
            <FaSignOutAlt className="text-red-300" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 ml-[84px] md:ml-[260px] relative overflow-y-auto h-screen">
        {/* Top Header */}
        <div className={`sticky top-0 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-white/10 dark:border-black/20  ${showModal ? "z-0" : "z-10"}`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="md:hidden p-2 rounded-md bg-white/5"
              >
                {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
              </button>
              <h3 className="text-lg font-semibold text-white capitalize">
                {active === "profile" ? "Dashboard" : active}
              </h3>
              <NavLink
                to = {"/home"}
                className="hidden md:flex items-center gap-2 text-xs text-gray-200 ml-4">
                <span>Home</span>
                <span className="mx-2">•</span>
                <span>{active}</span>
              </NavLink>
            </div>

            <div className="flex items-center gap-3 text-gray-200">
              <div className="relative">
                <button
                  onClick={() => {
                    setActive("waste");
                    if (!sidebarOpen) setSidebarOpen(true);
                    fetchRequests();
                  }}
                  title="View requests"
                  className="p-2 rounded-md bg-white/10 hover:bg-white/20"
                >
                  {active === "waste" ? (
                    <FaTrashAlt />
                  ) : active === "recycle" ? (
                    <FaRecycle />
                  ) : (
                    <FaMapMarkedAlt />
                  )}
                </button>
                {showNotifCount && summary.total > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {summary.total > 99 ? "99+" : summary.total}
                  </span>
                )}
              </div>

              <button
                onClick={() => setShowNotifCount((s) => !s)}
                title="Toggle notifications"
                className="p-2 rounded-md bg-white/10 hover:bg-white/20"
              >
                <FaBell />
              </button>

              <div className="hidden sm:flex items-center gap-3">
                <div className="text-sm text-gray-300">
                  {user?.email?.split?.("@")?.[0] || name}
                </div>
                <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Dashboard Content */}
        <div className="p-6 overflow-y-auto"><Dashboard 
        active={active}
        showModal={showModal}
        setShowModal={setShowModal}/></div>

        {/* Floating Create Button */}
        {!["profile", "points", "settings"].includes(active) && (
          <motion.button
          whileHover={{ scale: 1.06 }}
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-green-600 to-emerald-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl z-40"
          title="Create request"
        >
          <FaPlus />
        </motion.button>
        )}
      </main>
    </div>
  );
}
