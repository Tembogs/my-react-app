import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation,} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence, motion} from "framer-motion";
import axios from "axios";
import {
  FaRecycle,
  FaTrashAlt,
  FaMapMarkedAlt,
  FaCamera,
  FaPlus,
  FaMars,
  FaUserEdit,
  FaSyncAlt,
  FaClock,
  FaBell,
  FaUserLock,
  FaPalette,
  FaShieldAlt,
  FaPlug,
  FaCreditCard,
  FaCog,
  FaMapMarkerAlt,
  FaCalendarAlt,
  
  
} from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";
import RequestModal from "../context/Request";


export default function RenderContent({active, setActive, showModal, setShowModal}){

    const { user,uploadAvatar ,token, updateUser} = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [requests, setRequests] = useState([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [removeBin, setRemoveBin] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const name = user?.name || "Guest User";
    const initials = name.charAt(0).toUpperCase();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Account & Security");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [smsOptIn, setSmsOptIn] = useState(true);

  const tabs = [
    { name: "Account & Security", icon: <FaUserLock /> },
    { name: "Notifications", icon: <FaBell /> },
    { name: "Appearance", icon: <FaPalette /> },
    { name: "Privacy", icon: <FaShieldAlt /> },
    { name: "Integrations", icon: <FaPlug /> },
    { name: "Billing", icon: <FaCreditCard /> },
  ];
  

  
  
   
    const [formData, setFormData] = useState({
      name: user?.name || "",
      bio: user?.bio || "" 
    });
    const fileInputRef = useRef(null);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      await uploadAvatar(file);
      toast.success("Profile picture updated!");
    };
  
    const handleSave = async () => {
      setLoading(true)
      try {
        const res = await axios.put(
          `https://waste-management-3-iw0g.onrender.com/api/users/${user._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateUser(res.data);
        toast.success("Profile updated successfully!");
        setLoading(false)
        setEditMode(false);
      } catch (err) {
        toast.error("Failed to update profile");
        console.error(err);
      }
    };
  
  
    useEffect(() => {
      if (!user?._id || !token) return;
  
      const fetchUser = async () => {
        try {
          const res = await fetch(`https://waste-management-3-iw0g.onrender.com/api/users/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (!res.ok) throw new Error("Failed to fetch user");
  
          const data = await res.json();
          setFormData({ name: data.name, email: data.email });
        } catch (err) {
          console.error("Error fetching user:", err);
          // setMessage("Failed to load user data.");
        }
      };
  
      fetchUser();
  
    }, [user?._id, token]);
  
    const handleDelete = async (id) => {
  if (!id) {
    console.error("❌ Missing ID in handleDelete()");
    toast.error("Invalid request ID");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this request?")) return;

  try {
    const token = localStorage.getItem("token");
    const deleted =
      active === "waste"
        ? `https://waste-management-3-iw0g.onrender.com/api/waste/${id}`
        : active === "recycle"
        ? `https://waste-management-3-iw0g.onrender.com/api/recycle/${id}`
        : `https://waste-management-3-iw0g.onrender.com/api/dump/${id}`;

    await axios.delete(deleted, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Request deleted successfully 🗑️");
    fetchRequests();
  } catch (err) {
    console.error("Error deleting request:", err);
    toast.error("Failed to delete request ❌");
  }
};

  
  
  const handleCancel = () => {
      // revert to last saved user values
      setFormData({ username: user?.username || "", email: user?.email || "" });
      setEditMode(false);
      setDirty(false);
    };
  
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
    const token = localStorage.getItem("token");
    let endpoint;

    if (active === "waste") {
      endpoint = `https://waste-management-3-iw0g.onrender.com/api/waste/status-v2`;
    } else if (active === "recycle") {
      endpoint = `https://waste-management-3-iw0g.onrender.com/api/recycle/status-v2`;
    } else {
      endpoint = `https://waste-management-3-iw0g.onrender.com/api/dump/status-v2`;
    }

    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setRequests(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Error fetching requests:", err);
    toast.error("Failed to fetch requests");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // No need for user?._id anymore, just fetch when `active` changes
  if (token && active === "waste" || active === "recycle" || active === "illegal" ) {
    fetchRequests();
  }
}, [active]);

  

  
    // --- logout
    
    function AnimatedPanel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      {children}
    </motion.div>
  );
}

function ToggleSwitch({ value, setValue }) {
  return (
    <button
      onClick={() => setValue(!value)}
      className={`relative w-12 h-6 rounded-full transition-all ${
        value ? "bg-green-500" : "bg-gray-500"
      }`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          value ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ToggleItem({ label, value, setValue }) {
  return (
    <div className="flex justify-between items-center">
      <p>{label}</p>
      <ToggleSwitch value={value} setValue={setValue} />
    </div>
  );
}

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="block mb-1 text-sm text-gray-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
    </div>
  );
}

function IntegrationItem({ name, connected }) {
  return (
    <div className="flex justify-between items-center">
      <p>{name}</p>
      <span
        className={`text-sm font-medium px-3 py-1 rounded-lg ${
          connected
            ? "bg-green-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white cursor-pointer"
        }`}
      >
        {connected ? "Connected" : "Connect"}
      </span>
    </div>
  );
}

     const summary = useMemo(() => {
        const total = requests.length;
        const pending = requests.filter((r) => r.status === "Pending").length;
        const Rejected = requests.filter((r) => r.status === "Rejected").length;
        const totalQuantityCollected = requests.filter((r) => r.status === "Collected").length
        const InReview = requests.filter((r) => r.status === "InReview" ).length
        const Resolved = requests.filter((r) => r.status === "Resolved").length
        return { total, pending, Rejected, totalQuantityCollected, Resolved, InReview };
      }, [requests]);
  
  
    
  
      const COLORS = ["#16a34a", "#facc15", "#ef4444"];
      const chartData = [
        { name: "Recycled", value: 65 },
        { name: "Waste", value: 25 },
        { name: "Illegal Dumps", value: 10 },
      ];
  const renderView = () => {
    switch (active) {
      case "profile":
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">

        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-green-600 to-blue-600 relative">
          <div className="absolute -bottom-14 left-10">
            <motion.img
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={user?.profilePicture || "/default-avatar.png"}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 shadow-lg object-cover"
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 transition"
              title="Change avatar"
            >
              <FaCamera />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Profile Info Header */}
        <div className="pt-20 pb-6 px-10 border-b border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-start flex-wrap">
            <div>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-2xl font-bold border-b border-green-400 focus:outline-none bg-transparent text-gray-800 dark:text-white"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {user?.name || "Your Name"}
                </h1>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-2">
                <FaMapMarkerAlt className="text-green-500" />
                {user?.location || "Your City, Country"}
                <FaCalendarAlt className="ml-3 text-green-500" />
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </p>

              {editMode ? (
                <textarea
                type="text"
                  name="bio" // 👈 must match key in state
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell me about yourself"
                  rows="2"
                  className="mt-2 w-full p-2 rounded-md border border-green-400 text-sm bg-transparent text-gray-700 dark:text-gray-200"
                />
              ) : (
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 italic">
                  {user?.bio || "Wildlife enthusiast passionate about conservation. Every species matters!"}
                </p>
              )}

            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                >
                  <FaUserEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 text-center p-6 gap-4">
          <div className="bg-green-50 dark:bg-slate-700 rounded-xl p-4">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm">Badges Earned🏆</h3>
            <p className="text-2xl font-bold text-green-600">{user?.Reward ?? 0}</p>
          </div>
          <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-4">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm">Waste Submitted🗑️</h3>
            <p className="text-2xl font-bold text-blue-600">{user?.Waste ?? 0}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-slate-700 rounded-xl p-4">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm">Recycle Requested♻️</h3>
            <p className="text-2xl font-bold text-yellow-600">{user?.Recycling ?? 3}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-slate-700 rounded-xl p-4">
            <h3 className="text-gray-600 dark:text-gray-300 text-sm">Dumping Reported🚮</h3>
            <p className="text-2xl font-bold text-emerald-600">{user?.Dump ?? 87}</p>
          </div>
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          {/* Left: Profile Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><strong>UserName:</strong> {user?.name || "Alex Thompson"}</p>
              <p><strong>Email:</strong> {user?.email || "alexthompson@email.com"}</p>
              <p><strong>Location:</strong> {user?.location || "San Francisco, CA"}</p>
              <p><strong>Bio:</strong> {user?.bio || "Wildlife enthusiast passionate about conservation. Every species matters!"}</p>
            </div>
          </div>

          {/* Right: Impact */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Waste Impact</h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Eco Contributor</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 dark:bg-slate-700">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">35% to reach Green Hero level</p>

            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Achievements</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">First Recycle</span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">100kg Waste Processed</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Community Cleaner</span>
            </div>

            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Activity</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>♻️ Recycled 15kg of Plastic Waste <span className="text-xs text-gray-400">(2 days ago)</span></li>
              <li>🗑️ Reported Illegal Dump Site <span className="text-xs text-gray-400">(1 week ago)</span></li>
              <li>🌿 Collected 25kg of Organic Waste <span className="text-xs text-gray-400">(2 weeks ago)</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );




      // Waste management section
      case "waste":
        return (
          <motion.div
            key="waste"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center gap-3">
                <FaTrashAlt /> My Waste Requests
              </h1>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                  <span className="font-semibold">{summary.total}</span>{" "}
                  <span className="">requests</span>
                </div>

                <button
                  onClick={() => fetchRequests()}
                  title="Refresh"
                  className="inline-flex text-gray-200 items-center gap-2 bg-white/10 px-3 py-2 rounded-md hover:bg-white/20 transition"
                >
                  <FaSyncAlt />
                  <span className="hidden md:inline text-sm">Refresh</span>
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md shadow"
                >
                  <FaPlus /> New Request
                </button>
              </div>
            </div>

            {/* Summary widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Total Requests</p>
                <p className="text-2xl font-bold text-green-700">{summary.total}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Rejected</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.Rejected}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-gray-700">
                <p className="text-sm text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summary.totalQuantityCollected}</p>
              </motion.div>
            </div>

            {/* Requests grid */}
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading requests…</div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <div className="mb-3">♻️ You have no requests yet.</div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Create your first request
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...requests].reverse().map((req, index) =>{
                   let statusClass = "";
                  if (req.status === "Pending") {
                    statusClass = "bg-yellow-500 text-black";
                  } else if (
                    req.status === "Accepted" ||
                    req.status === "En Route"
                  ) {
                    statusClass = "bg-teal-100 text-green-900";
                  } else if (req.status === "Collected"){
                      statusClass = "bg-blue-700 text-white"
                  }else {
                    statusClass = "bg-red-700 text-white";
                  }
                  const Class = req.status === "Accepted" || req.status === "Collected" || req.status === "Rejected" || req.status === "En Route"
                 return (
                  <motion.article
                    key={req._id || `req-${index}`}
                    whileHover={{ translateY: -6 }}
                    layout
                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-green-100 dark:border-gray-700 group"
                  >
                    {/* 🗑️ Delete Button */}
                   {!Class && !removeBin && 
                   (
                     <button
                       onClick={() => {handleDelete(req.id) }} 
                      className="absolute mt-1 right-3 -mx-2 text-blue-600 font-bold hover:text-red-500 transition-transform duration-200 hover:scale-110"
                      title="Delete request"
                    >
                      <FaTrashAlt />
                    </button>
                   )}

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-300">Materials</div>
                        <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
                          <FaTrashAlt />
                          {req.materials?.[0]?.wasteType || "General Waste"}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block text-xs px-2 py-1 mx-2 rounded-full font-semibold ${
                            statusClass
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-3">
                      <FaClock />
                      <span>{new Date(req.requestDate).toLocaleString()}</span>
                    </div>

                    <div className="mt-4 text-sm space-y-2 ">
                      <div className="">
                        <strong className="text-green-700">Quantity:</strong>{" "}
                       <span className="text-gray-300"> {req.materials?.[0]?.quantity ?? "N/A"}{" "}</span>
                        <span className="text-xs text-gray-300">
                          {req.materials?.[0]?.unit || ""}
                        </span>
                      </div>
                      <div>
                        <strong className="text-green-700">Pickup:</strong> <span className="text-gray-300">{req.location || "N/A"}</span>
                      </div>
                      {req.notes && (
                        <div className="text-xs text-gray-500 mt-2">
                          Notes: {req.notes}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Collector:<span className="text-gray-200"> {req.collectorName || "Unassigned"}</span> 
                      </div>
                      <button
                        onClick={() => navigator.clipboard?.writeText(req._id)}
                        title="Copy request ID"
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Copy ID
                      </button>
                    </div>
                  </motion.article>
                )})}
              </div>

            )}
          </motion.div>
        );
        
        //  {Recycle section} 
        case "recycle":
        return (
          <motion.div
            key="recycle"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center gap-3">
                <FaRecycle /> My Recycle Requests
              </h1>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                  <span className="font-semibold">{summary.total}</span>{" "}
                  <span className="">requests</span>
                </div>

                <button
                  onClick={() => fetchRequests()}
                  title="Refresh"
                  className="inline-flex text-gray-200 items-center gap-2 bg-white/10 px-3 py-2 rounded-md hover:bg-white/20 transition"
                >
                  <FaSyncAlt />
                  <span className="hidden md:inline text-sm">Refresh</span>
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md shadow"
                >
                  <FaPlus /> New Request
                </button>
              </div>
            </div>

            {/* Summary widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Total Requests</p>
                <p className="text-2xl font-bold text-green-700">{summary.total}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Rejected</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.Rejected}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-gray-700">
                <p className="text-sm text-gray-300">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summary.totalQuantityCollected}</p>
              </motion.div>
            </div>

            {/* Requests grid */}
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading requests…</div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <div className="mb-3">♻️ You have no requests yet.</div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Create your first request
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...requests].reverse().map((req, index) =>{
                   let statusClass = "";
                  if (req.status === "Pending") {
                    statusClass = "bg-yellow-500 text-black";
                  } else if (
                    req.status === "Accepted" ||
                    req.status === "En Route"
                  ) {
                    statusClass = "bg-teal-100 text-green-900";
                  } else if (req.status === "Collected"){
                      statusClass = "bg-blue-700 text-white"
                  }else {
                    statusClass = "bg-red-700 text-white";
                  }
                  const Class = req.status === "Accepted" || req.status === "Collected" || req.status === "Rejected" || req.status === "En Route"
                return (
                  <motion.article
                    key={req._id || `req-${index}`}
                    whileHover={{ translateY: -6 }}
                    layout
                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-green-100 dark:border-gray-700 group"
                  >
                    {/* 🗑️ Delete Button */}
                   {!Class && !removeBin && 
                   (
                     <button
                      onClick={() => handleDelete(req.id)}
                      className="absolute mt-1 right-3 -mx-2 text-black font-bold hover:text-red-500 transition-transform duration-200 hover:scale-110"
                      title="Delete request"
                    >
                      <FaTrashAlt />
                    </button>
                   )}

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-300">Materials</div>
                        <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
                          <FaRecycle/>
                          {req.materials?.[0]?.recycleType || "General Waste"}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block text-xs px-2 py-1 mx-2 rounded-full font-semibold ${
                            statusClass
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-3">
                      <FaClock />
                      <span>
                        {new Date(req.recyclingDate).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-4 text-sm space-y-2 ">
                      <div className="">
                        <strong className="text-green-700">Quantity:</strong>{" "}
                       <span className="text-gray-300"> {req.materials?.[0]?.quantity ?? "N/A"}{" "}</span>
                        <span className="text-xs text-gray-300">
                          {req.materials?.[0]?.unit || ""}
                        </span>
                      </div>
                      <div>
                        <strong className="text-green-700">Pickup:</strong> <span className="text-gray-300">{req.location || "N/A"}</span>
                      </div>
                      {req.notes && (
                        <div className="text-xs text-gray-500 mt-2">
                          Notes: {req.notes}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Collector:<span className="text-gray-200"> {req.collectorName || "Unassigned"}</span> 
                      </div>
                      <button
                        onClick={() => navigator.clipboard?.writeText(req._id)}
                        title="Copy request ID"
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Copy ID
                      </button>
                    </div>
                  </motion.article>
                )})}
              </div>

            )}
          </motion.div>
        );

        
        // illegal dumps section
      case "illegal":
        return (
          <motion.div
            key="illegal"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 sm:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center gap-3">
                <FaMapMarkedAlt /> My Illegal Dumps Requests
              </h1>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
                  <span className="font-semibold">{summary.total}</span>{" "}
                  <span className="">requests</span>
                </div>

                <button
                  onClick={() => fetchRequests()}
                  title="Refresh"
                  className="inline-flex text-gray-200 items-center gap-2 bg-white/10 px-3 py-2 rounded-md hover:bg-white/20 transition"
                >
                  <FaSyncAlt />
                  <span className="hidden md:inline text-sm">Refresh</span>
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md shadow"
                >
                  <FaPlus /> New Request
                </button>
              </div>
            </div>

            {/* Summary widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Total Requests</p>
                <p className="text-2xl font-bold text-green-700">{summary.total}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700" >
                <p className="text-sm text-gray-300">InReview</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.InReview}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Rejected</p>
                <p className="text-2xl font-bold text-green-600">{summary.Rejected}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{summary.Resolved}</p>
              </motion.div>
            </div>

            {/* Requests grid */}
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading requests…</div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <div className="mb-3">♻️ You have no requests yet.</div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Create your first request
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...requests].reverse().map((req, index) =>{
                   let statusClass = "";
                  if (req.status === "Pending") {
                    statusClass = "bg-yellow-500 text-black";
                  } else if (
                    req.status === "InReview"
                  ) {
                    statusClass = "bg-teal-100 text-green-900";
                  } else if (req.status === "Resolved"){
                      statusClass = "bg-blue-700 text-white"
                  }else {
                    statusClass = "bg-red-700 text-white";
                  }
                  const Class = req.status === "InReview" || req.status === "Resolved" || req.status === "Rejected"
                 return (
                  <motion.article
                    key={req._id || `req-${index}`}
                    whileHover={{ translateY: -6 }}
                    layout
                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-green-100 dark:border-gray-700 group"
                  >
                    {/* 🗑️ Delete Button */}
                   {!Class && !removeBin && 
                   (
                     <button
                      onClick={() => handleDelete(req.id)}
                      className="absolute mt-1 right-3 -mx-2  font-bold text-red-700 transition-transform duration-200 hover:scale-110"
                      title="Delete request"
                    >
                      <FaTrashAlt />
                    </button>
                   )}

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-300">Materials</div>
                        <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
                          <FaMapMarkedAlt />
                          {req.materials?.[0]?.dumpType || "General Waste"}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block text-xs px-2 py-1 mx-2 rounded-full font-semibold ${
                            statusClass
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-3">
                      <FaClock />
                      <span>{new Date(req.reportDate).toLocaleString()}</span>
                    </div>

                    <div className="mt-4 text-sm space-y-2 ">
                      <div className="">
                        <strong className="text-green-700">Quantity:</strong>{" "}
                       <span className="text-gray-300"> {req.materials?.[0]?.quantity ?? "N/A"}{" "}</span>
                        <span className="text-xs text-gray-300">
                          {req.materials?.[0]?.unit || ""}
                        </span>
                      </div>
                      <div>
                        <strong className="text-green-700">Pickup:</strong> <span className="text-gray-300">{req.location || "N/A"}</span>
                      </div>
                      {req.description && (
                        <div className="text-xs text-gray-500 mt-2">
                          Notes: {req.description}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Collector:<span className="text-gray-200"> {req.collectorName || "Unassigned"}</span> 
                      </div>
                      <button
                        onClick={() => navigator.clipboard?.writeText(req._id)}
                        title="Copy request ID"
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Copy ID
                      </button>
                    </div>
                  </motion.article>
                )})}
              </div>

            )}
          </motion.div>
        );
      
        // Rewards points section
      case "points":
        return (
          <motion.div
            key="points"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 sm:p-8"
          >
            <h2 className="text-2xl font-extrabold mb-4 text-green-700">Points & Rewards</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-green-100">
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold text-green-700">240</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-yellow-100">
                <p className="text-sm text-gray-500">Pending Points</p>
                <p className="text-2xl font-bold text-yellow-600">30</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-green-200">
                <p className="text-sm text-gray-500">Redeemed</p>
                <p className="text-2xl font-bold text-green-600">210</p>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-gray-800 rounded-xl shadow p-6 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-4">Recycle Activity Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
      
      //  Settings section
      case "settings":
        return (
          <div
            className={`min-h-screen p-6 md:p-10 transition-all duration-500 ${
              darkMode
                ? "bg-gray-900 text-gray-100"
                : "bg-gradient-to-b from-gray-100 to-white text-gray-900"
            }`}
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-extrabold text-green-500 mb-8 text-center"
            >
              Organization Settings ⚙️
            </motion.h1>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Organization Profile */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3">
                  Organization Profile
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Update your organization’s identity and public details.
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold">
                  Edit Profile
                </button>
              </motion.div>

              {/* Team Management */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3">
                  Team Management
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Add, remove, or assign roles to organization members.
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold">
                  Manage Members
                </button>
              </motion.div>

              {/* Projects */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3">
                  Projects & Campaigns
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Create and manage your active and completed environmental projects.
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold">
                  View Projects
                </button>
              </motion.div>

              {/* Permissions */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3">
                  Permissions & Access
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Define who can edit or view organization data.
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold">
                  Adjust Access
                </button>
              </motion.div>

              {/* Reports */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/70 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3">
                  Reports & Analytics
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Track organization growth, impact, and performance metrics.
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold">
                  View Reports
                </button>
              </motion.div>

              {/* Donations */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/70 dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg backdrop-blur-md"
              >
                <h2 className="text-xl font-semibold text-green-400 mb-3">
                  Donations & Sponsors
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  View donors, manage funding campaigns, and track contributions.
                </p>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold">
                  Manage Donations
                </button>
              </motion.div>
            </div>
          </div>
        );



      default:
        return (
          <motion.div
            key="profile"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 sm:p-8 flex flex-col items-center text-center"
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-28 h-28 rounded-full border-4 border-green-600 mb-4 object-cover shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-green-700 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                {initials}
              </div>
            )}

            <h2 className="text-2xl font-bold text-green-700 mb-1">{name}</h2>
            <p className="text-sm text-gray-500 mb-2">{user?.email || "guest@example.com"}</p>
            <p className="text-gray-600 italic">“Let’s make the planet cleaner 🌍”</p>
          </motion.div>
        );
    }
 
    
 
  }

   return (
    <div>
      {renderView()}
      {showModal && (
        <RequestModal
          showModal={showModal}
          setShowModal={setShowModal}
          active={active}
          setActive={setActive}
          onRequestCreated={() => {
            fetchRequests();
            toast.success("Request created — refreshing list");
          }}
        />
      )}
    </div>
  )
}
