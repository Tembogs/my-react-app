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
  FaCalendarAlt,
  FaMapMarkerAlt,
  
  
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


export default function Dashboard({active, setActive, showModal, setShowModal}){

    const { user,uploadAvatar ,token, updateUser} = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [requests, setRequests] = useState([]);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
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
    const [rejectionReasons, setRejectionReasons] = useState({});
    const [showReasonInput, setShowReasonInput] = useState({});
    const [stay, setStay] = useState({})


  const tabs = [
    { name: "Account & Security", icon: <FaUserLock /> },
    { name: "Notifications", icon: <FaBell /> },
    { name: "Appearance", icon: <FaPalette /> },
    { name: "Privacy", icon: <FaShieldAlt /> },
    { name: "Integrations", icon: <FaPlug /> },
    { name: "Billing", icon: <FaCreditCard /> },
  ];
   
    const [formData, setFormData] = useState({
      name: user?.name || "" ,
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
      if (!user?.collectorAssayId) {
        console.warn("Missing collectorAssayId — skipping fetch");
        return;
      }
      // ✅ Choose endpoint based on active tab
      let endpoint;
      switch (active) {
        case "waste":
          endpoint = `https://waste-management-3-iw0g.onrender.com/api/waste/${user?.collectorAssayId}`;
          break;
        case "recycle":
          endpoint = `https://waste-management-3-iw0g.onrender.com/api/recycle/${user?.collectorAssayId}`;
          break;
        case "illegal":
          endpoint = `https://waste-management-3-iw0g.onrender.com/api/dump/${user?.collectorAssayId}`;
          break;
        default:
          console.warn("Unknown tab:", active);
          return;
      }

      // ✅ API call
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Defensive data check
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setRequests(data);
      // Refresh the list
    } catch (err) {
      console.error("❌ Error fetching requests:", err);

      // ✅ Handle authorization errors gracefully
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload(); // optional — forces re-login
      } else {
        toast.error("Failed to fetch requests. Please try again.");
      }
    }finally {
      setLoading(false);
    } 
  };



useEffect(() => {
    if (!token || !user?.collectorAssayId) return;

    // ✅ Limit to valid tabs only
    if (["waste", "recycle", "illegal"].includes(active)) {
      fetchRequests();
    }
  }, [token, active, user?.collectorAssayId]);

  const handleRoute = async (id) => {
  if (!id) {
    console.error("❌ Missing request ID");
    toast.error("Invalid request ID");
    return;
  }

  if (!window.confirm("Are you sure you want to accept this request?")) return;

  try {
    const token = localStorage.getItem("token");
    const collectorAssayId = user?.collectorAssayId;

    if (!collectorAssayId) {
      throw new Error("Missing collectorAssayId. Are you logged in as a collector?");
    }

    // Determine endpoint based on active tab
    const endpoint =
      active === "waste"
        ? "https://waste-management-3-iw0g.onrender.com/api/waste/route"
        : "https://waste-management-3-iw0g.onrender.com/api/recycle/route"

    // Payload matches backend requirements
    const payload =
      active === "waste"
        ? { wasteId: id, collectorAssayId }
        : active === "recycle"
        ? { recycleId: id, collectorAssayId }
        : { dumpId: id, collectorAssayId };
    await axios.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Request en routed successfully ✅");

    fetchRequests()
    setStay((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), enRoute: true },
    }));

  } catch (err) {
    console.error("Error en routing request:", err.response?.data || err.message);
    toast.error("Failed to enroute request ❌");
  }
};

const handleCollect = async (id) => {
  if (!id) {
    console.error("❌ Missing request ID");
    toast.error("Invalid request ID");
    return;
  }

  if (!window.confirm("Are you sure you want to accept this request?")) return;

  try {
    const token = localStorage.getItem("token");
    const collectorAssayId = user?.collectorAssayId;

    if (!collectorAssayId) {
      throw new Error("Missing collectorAssayId. Are you logged in as a collector?");
    }

    // Determine endpoint based on active tab
    const endpoint =
      active === "waste"
        ? "https://waste-management-3-iw0g.onrender.com/api/waste/collect"
        : active === "recycle"
        ? "https://waste-management-3-iw0g.onrender.com/api/recycle/collect"
        : "https://waste-management-3-iw0g.onrender.com/api/dump/resolve";

    // Payload matches backend requirements
    const payload =
      active === "waste"
        ? { wasteId: id, collectorAssayId }
        : active === "recycle"
        ? { recycleId: id, collectorAssayId }
        : { dumpId: id, collectorAssayId };
    await axios.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Request collected successfully ✅");

    // Refresh the list
    fetchRequests();
    setStay((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), collected: true },
    }));

  } catch (err) {
    console.error("Error collecting request:", err.response?.data || err.message);
    toast.error("Failed to collect request ❌");
  }
};


const handleReject = async (id) => {
  const reason = rejectionReasons[id];

  if (!reason || reason.trim() === "") {
    toast.error("Please provide a rejection reason first.");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    const collectorAssayId = user?.collectorAssayId;

    const endpoint =
      active === "waste"
        ? "http://localhost:3000/api/waste/reject"
        : active === "recycle"
        ? "http://localhost:3000/api/recycle/reject"
        : "http://localhost:3000/api/dump/reject";

    const payload =
      active === "waste"
        ? { wasteId: id, collectorAssayId, rejectionReason: reason }
        : active === "recycle"
        ? { recycleId: id, collectorAssayId, rejectionReason: reason }
        : { dumpId: id, collectorAssayId, rejectionReason: reason };

        console.log("📦 Payload being sent:", payload);

    await axios.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Request rejected successfully 🗑️");

    // Clean up the input & state
    setShowReasonInput((prev) => ({ ...prev, [id]: false }));
    setRejectionReasons((prev) => ({ ...prev, [id]: "" }));
    fetchRequests();
  } catch (err) {
    console.error("Error rejecting request:", err);
    toast.error("Failed to reject request ❌");
  }

  setLoading(false);
};

  const handleAccept = async (id) => { 
  if (!id) {
    console.error("❌ Missing request ID");
    toast.error("Invalid request ID");
    return;
  }

  if (!window.confirm("Are you sure you want to accept this request?")) return;

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    const collectorAssayId = user?.collectorAssayId;

    if (!collectorAssayId) {
      throw new Error("Missing collectorAssayId. Are you logged in as a collector?");
    }

    // Determine endpoint based on active tab
    const endpoint =
      active === "waste"
        ? "https://waste-management-3-iw0g.onrender.com/api/waste/accept"
        : active === "recycle"
        ? "https://waste-management-3-iw0g.onrender.com/api/recycle/accept"
        : "https://waste-management-3-iw0g.onrender.com/api/dump/accept";

    // Payload matches backend requirements
    const payload =
      active === "waste"
        ? { wasteId: id, collectorAssayId }
        : active === "recycle"
        ? { recycleId: id, collectorAssayId }
        : { dumpId: id, collectorAssayId };
    await axios.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Request accepted successfully ✅");

    // Refresh the list
    fetchRequests();
  } catch (err) {
    console.error("Error accepting request:", err.response?.data || err.message);
    toast.error("Failed to accept request ❌");
  } finally {
    setLoading(false);
  }
};



  
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
        const Accepted = requests.filter((r) => r.status === "Accepted").length;
        const Rejected = requests.filter((r) => r.status === "Rejected").length;
        const totalQuantityCollected = requests.filter((r) => r.status === "Collected").length
        const InReview = requests.filter((r) => r.status === "InReview" ).length
        const Resolved = requests.filter((r) => r.status === "Resolved").length
        return { total, Accepted, Rejected, totalQuantityCollected, Resolved, InReview };
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
      className="p-6 sm:p-8 bg-gray-50 dark:bg-slate-900 min-h-screen"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center gap-3">
            <FaTrashAlt className="text-green-600" /> My Sent Waste Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all your submitted waste requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            + New Request
          </button>

          <button
            onClick={() => fetchRequests()}
            title="Refresh"
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm"
          >
            <FaSyncAlt className="text-green-600" />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-800 border border-green-100 dark:border-slate-700 rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Sent</p>
          <p className="text-3xl font-bold text-green-600">{summary.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-yellow-100 dark:border-slate-700 rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-3xl font-bold text-yellow-500">{summary.Pending}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Accepted/In Progress</p>
          <p className="text-3xl font-bold text-blue-500">
            {summary.Accepted + (summary["En Route"] || 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-green-100 dark:border-slate-700 rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Collected</p>
          <p className="text-3xl font-bold text-green-700">{summary.Collected}</p>
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <FaSyncAlt className="w-6 h-6 animate-spin text-green-600 mb-3" />
          Loading requests…
        </div>
      ) : requests.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <FaTrashAlt className="text-green-600 dark:text-green-400 text-2xl" />
          </div>
          <p className="mb-3">You haven’t sent any waste requests yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Send Your First Request
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[...requests].reverse().map((req, index) => {
            let statusColor =
              req.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : req.status === "Accepted" || req.status === "En Route"
                ? "bg-blue-100 text-blue-800"
                : req.status === "Collected"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";

            const canDelete =
              !["Accepted", "Collected", "Rejected", "En Route"].includes(req.status);

            return (
              <motion.article
                key={req.wasteId || `req-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FaTrashAlt className="text-green-700 dark:text-green-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Material</p>
                      <h3 className="font-semibold text-lg text-green-700 dark:text-green-400 truncate">
                        {req.materials?.[0]?.wasteType || "General Waste"}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                  >
                    {req.status}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-500" />
                    <span>{new Date(req.requestDate).toLocaleString()}</span>
                  </div>
                  <p>
                    <strong>Quantity:</strong>{" "}
                    {req.materials?.[0]?.quantity ?? "N/A"}{" "}
                    {req.materials?.[0]?.unit || ""}
                  </p>
                  <p>
                    <strong>Requester:</strong> {req.userName || "Unknown"}
                  </p>
                  <p>
                    <strong>Collector:</strong> {req.collectorName || "Awaiting Assignment"}
                  </p>
                  {req.notes && (
                    <p className="text-xs text-gray-500">Note: {req.notes}</p>
                  )}
                </div>

                {/* Rejection Reason */}
                {showReasonInput[req.wasteId] && (
                  <div className="mt-2">
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
                      Rejection Reason
                    </label>
                    <input
                      type="text"
                      placeholder="Enter reason"
                      value={rejectionReasons[req.wasteId] || ""}
                      onChange={(e) =>
                        setRejectionReasons((prev) => ({
                          ...prev,
                          [req.wasteId]: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 justify-between">
                  {canDelete && (
                    <>
                      <button
                        onClick={() => handleAccept(req.wasteId)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition"
                      >
                        {loading ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        onClick={() => {
                          if (showReasonInput[req.wasteId]) handleReject(req.wasteId);
                          else
                            setShowReasonInput((prev) => ({
                              ...prev,
                              [req.wasteId]: true,
                            }));
                        }}
                        className="flex-1 px-3 py-2 text-sm rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        {showReasonInput[req.wasteId]
                          ? loading
                            ? "Rejecting..."
                            : "Confirm"
                          : "Reject"}
                      </button>
                    </>
                  )}
                </div>

                {/* Route + Collect */}
                {["Accepted", "En Route", "Collected"].includes(req.status) && (
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleRoute(req.wasteId)}
                      disabled={stay[req.wasteId]?.enRoute}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg font-semibold border transition ${
                        stay[req.wasteId]?.enRoute ||
                        ["En Route", "Collected"].includes(req.status)
                          ? "bg-blue-100 text-blue-800 cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {stay[req.wasteId]?.enRoute ||
                      ["En Route", "Collected"].includes(req.status)
                        ? "Routed"
                        : "En Route"}
                    </button>

                    <button
                      onClick={() => handleCollect(req.wasteId)}
                      disabled={
                        stay[req.wasteId]?.collected ||
                        req.status === "Collected" ||
                        !(stay[req.wasteId]?.enRoute ||
                          req.status === "En Route")
                      }
                      className={`flex-1 px-3 py-2 text-sm rounded-lg font-semibold border transition ${
                        stay[req.wasteId]?.collected ||
                        req.status === "Collected"
                          ? "bg-green-100 text-green-800 cursor-default"
                          : !(stay[req.wasteId]?.enRoute ||
                              req.status === "En Route")
                          ? "opacity-60 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {stay[req.wasteId]?.collected || req.status === "Collected"
                        ? "Collected"
                        : "Collect"}
                    </button>
                  </div>
                )}
              </motion.article>
            );
          })}
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
              </div>
            </div>

            {/* Summary widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Total Requests</p>
                <p className="text-2xl font-bold text-green-700">{summary.total}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Accepted</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.Accepted}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-gray-700">
                <p className="text-sm text-gray-300">Rejected</p>
                <p className="text-2xl font-bold text-green-600">{summary.Rejected}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-gray-700">
                <p className="text-sm text-gray-300">Quantity Collected</p>
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
                  No recycle request has been sent yet
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...requests].reverse().map((req, index) =>{
                  let statusClass;
                   if (req.status === "Pending") {
                      statusClass = "bg-yellow-700 text-white";
                    } else if (
                      req.status === "Accepted" ||
                      req.status === "En Route"
                    ) {
                      statusClass = "bg-teal-800 text-gray-50";
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
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-300">Materials</div>
                        <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
                          <FaRecycle />
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
                        <strong className="text-green-700">Requester-Name:</strong> <span className="text-gray-300">{req.userName || "N/A"}</span>
                      </div>
                      {req.notes && (
                        <div className="text-xs text-gray-500 mt-2">
                          Notes: {req.notes}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Collector: {req.collectorName || "Unassigned"}
                      </div>
                    </div>
                    {!Class && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAccept(req.recycleId)}
                      className="mt-3 border px-3 py-1 rounded-xl bg-green-300 hover:bg-transparent text-black shadow-2xl font-bold hover:text-green-500 transition-transform duration-200 hover:scale-110"
                      title="Accept request"
                    >
                      {loading ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      onClick={() => {
                        if (showReasonInput[req.recycleId]) {
                          handleReject(req.recycleId);
                        } else {
                          setShowReasonInput((prev) => ({
                            ...prev,
                            [req.recycleId]: true,
                          }));
                        }
                      }}
                      className="mt-3 border px-3 py-1 rounded-xl bg-red-500 hover:bg-transparent text-black shadow-2xl font-bold hover:text-red-500 transition-transform duration-200 hover:scale-110"
                      title="Reject request"
                    >
                      {showReasonInput[req.recycleId]
                        ? loading
                          ? "Rejecting..."
                          : "Confirm Reject"
                        : "Reject"}
                    </button>
                  </div>
                )}

                {showReasonInput[req.recycleId] && (
                  <div className="mt-3">
                    <label className="block text-sm font-semibold mb-1 text-gray-50">
                      Rejection Reason
                    </label>
                    <input
                      type="text"
                      placeholder="Enter reason"
                      value={rejectionReasons[req.recycleId] || ""}
                      onChange={(e) =>
                        setRejectionReasons((prev) => ({
                          ...prev,
                          [req.recycleId]: e.target.value,
                        }))
                      }
                      className="w-full text-white border rounded-lg px-3 py-2 dark:bg-gray-800"
                    />
                  </div>
                )}

                 {["Accepted", "En Route", "Collected"].includes(req.status) && (
                  <div className="flex justify-between items-center">
                    {/* 🚚 EN ROUTE BUTTON */}
                    <button
                      onClick={() => handleRoute(req.recycleId)}
                      disabled={stay[req.recycleId]?.enRoute}
                      className={`mt-3 border px-3 py-1 rounded-xl shadow-2xl font-bold transition-transform duration-200 hover:scale-110
                        ${
                          stay[req.recycleId]?.enRoute ||["En Route", "Collected"].includes(req.status)
                            ? "bg-green-500 text-black cursor-default border-green-600"
                            : "bg-green-300 hover:bg-transparent text-black hover:text-green-500"
                        }`}
                      title="En route request"
                    >
                      {stay[req.recycleId]?.enRoute || ["En Route", "Collected"].includes(req.status)
                      ? "Routed"
                      : "En Route"}
                    </button>

                    <button
                      onClick={() => handleCollect(req.recycleId)}
                      disabled={
                        stay[req.recycleId]?.collected || 
                        req.status === "Collected" || 
                        !(stay[req.recycleId]?.enRoute || req.status === "En Route") 
                      }
                      className={`mt-3 border px-3 py-1 rounded-xl shadow-2xl font-bold transition-transform duration-200 hover:scale-110
                        ${
                          stay[req.recycleId]?.collected || req.status === "Collected"
                            ? "bg-blue-600 text-white cursor-default border-blue-600"
                            : !(stay[req.recycleId]?.enRoute || req.status === "En Route")
                            ? "opacity-60 cursor-not-allowed bg-blue-400 text-black"
                            : "bg-blue-600 hover:bg-transparent border-none text-white hover:text-green-500"
                        }`}
                      title="Collect request"
                    >
                      {stay[req.recycleId]?.collected || req.status === "Collected"
                        ? "Collected"
                        : "Collect"}
                    </button>
                  </div>
                )}
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
              </div>
            </div>

            {/* Summary widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">Total Requests</p>
                <p className="text-2xl font-bold text-green-700">{summary.total}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-yellow-100 dark:border-gray-700">
                <p className="text-sm text-gray-300">InReview</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.InReview}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-gray-700">
                <p className="text-sm text-gray-300">Rejected</p>
                <p className="text-2xl font-bold text-green-600">{summary.Rejected}</p>
              </motion.div>
              <motion.div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-200 dark:border-gray-700">
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
                  No dump request has been sent yet
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...requests].reverse().map((req, index) =>{
                   let statusClass = "";
                  if (req.status === "Pending") {
                      statusClass = "bg-yellow-700 text-white";
                    } else if (
                      req.status === "InReview" 
                    ) {
                      statusClass = "bg-teal-800 text-gray-50";
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

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-300">Materials</div>
                        <h3 className="font-semibold text-lg text-green-700 flex items-center gap-2">
                          <FaRecycle />
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
                        <strong className="text-green-700">Requester-Name:</strong> <span className="text-gray-300">{req.userName || "N/A"}</span>
                      </div>
                      {req.description && (
                        <div className="text-xs text-gray-500 mt-2">
                          Notes: {req.description}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Collector: {req.collectorName || "Unassigned"}
                      </div>
                    </div>
                    {!Class && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAccept(req.dumpId || req._id)}
                      className="mt-3 border px-3 py-1 rounded-xl bg-green-300 hover:bg-transparent text-black shadow-2xl font-bold hover:text-green-500 transition-transform duration-200 hover:scale-110"
                      title="Accept request"
                    >
                      {loading ? "Accepting..." : "Accept"}
                    </button>

                    <button
                      onClick={() => {
                        const id = req.dumpId || req._id;
                        if (showReasonInput[id]) {
                          handleReject(id);
                        } else {
                          setShowReasonInput((prev) => ({
                            ...prev,
                            [id]: true,
                          }));
                        }
                      }}
                      className="mt-3 border px-3 py-1 rounded-xl bg-red-500 hover:bg-transparent text-black shadow-2xl font-bold hover:text-red-500 transition-transform duration-200 hover:scale-110"
                      title="Reject request"
                    >
                      {showReasonInput[req.dumpId || req._id]
                        ? loading
                          ? "Rejecting..."
                          : "Confirm Reject"
                        : "Reject"}
                    </button>
                  </div>
                )}

                {showReasonInput[req.dumpId || req._id] && (
                  <div className="mt-3">
                    <label className="block text-sm font-semibold mb-1 text-gray-50">
                      Rejection Reason
                    </label>
                    <input
                      type="text"
                      placeholder="Enter reason"
                      value={rejectionReasons[req.dumpId || req._id] || ""}
                      onChange={(e) =>
                        setRejectionReasons((prev) => ({
                          ...prev,
                          [req.dumpId || req._id]: e.target.value,
                        }))
                      }
                      className="w-full text-white border rounded-lg px-3 py-2 dark:bg-gray-800"
                    />
                  </div>
                )}
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
          className={`flex min-h-screen transition-all duration-500 ${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
          }`}
        >
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col bg-gray-800/60 border-r border-gray-700 backdrop-blur-md p-6">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
              <FaCog className="text-green-400" /> Settings
            </h2>

            <nav className="space-y-3">
              {tabs.map((tab) => (
                <button
                  key={`tab-${tab.name}`}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.name
                      ? "bg-green-600 text-white shadow-md"
                      : "hover:bg-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">{renderActiveTab(activeTab)}</AnimatePresence>
          </main>
        </div>
      );

// 🔸 Helper Function for Switch-Case
      function renderActiveTab(activeTab) {
        switch (activeTab) {
          case "Account & Security":
            return (
              <AnimatedPanel key="account">
                <h2 className="text-2xl font-semibold mb-4">Account & Security</h2>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-4">
                  <Input label="Full Name" placeholder="John Doe" />
                  <Input label="Email" placeholder="john@example.com" />
                  <Input label="Password" type="password" placeholder="••••••••" />
                  <button className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold mt-4">
                    Save Changes
                  </button>
                </div>
              </AnimatedPanel>
            );

          case "Notifications":
            return (
              <AnimatedPanel key="notifications">
                <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-4">
                  <ToggleItem label="Email Alerts" value={emailAlerts} setValue={setEmailAlerts} />
                  <ToggleItem label="Push Notifications" value={pushNotifications} setValue={setPushNotifications} />
                  <ToggleItem label="SMS Opt-In" value={smsOptIn} setValue={setSmsOptIn} />
                </div>
              </AnimatedPanel>
            );

          case "Appearance":
            return (
              <AnimatedPanel key="appearance">
                <h2 className="text-2xl font-semibold mb-4">Appearance</h2>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-6">
                  <div className="flex items-center justify-between">
                    <p>Dark Mode</p>
                    <ToggleSwitch value={darkMode} setValue={setDarkMode} />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">Font Size</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full accent-green-500"
                    />
                    <span className="text-sm text-gray-400">Current: {fontSize}px</span>
                  </div>
                </div>
              </AnimatedPanel>
            );

          case "Privacy":
            return (
              <AnimatedPanel key="privacy">
                <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-4">
                  <p className="text-gray-400">Control who can see your data and manage permissions.</p>
                  <ToggleItem label="Show Profile Publicly" />
                  <ToggleItem label="Allow Data Sharing" />
                  <button className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold mt-4">
                    Save Preferences
                  </button>
                </div>
              </AnimatedPanel>
            );

          case "Integrations":
            return (
              <AnimatedPanel key="integrations">
                <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-4">
                  <IntegrationItem name="Google" connected />
                  <IntegrationItem name="Slack" />
                  <IntegrationItem name="Zapier" />
                </div>
              </AnimatedPanel>
            );

    case "Billing":
      return (
        <AnimatedPanel key="billing">
          <h2 className="text-2xl font-semibold mb-4">Billing</h2>
          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-4">
            <p className="text-gray-400">Manage your subscription and payment details.</p>
            <div className="flex justify-between items-center">
              <p>Plan</p>
              <span className="bg-green-600 px-3 py-1 rounded-lg text-sm">Premium</span>
            </div>
            <div className="flex justify-between items-center">
              <p>Next Billing</p>
              <span>Nov 20, 2025</span>
            </div>
            <button className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold mt-4">
              Manage Billing
            </button>
          </div>
        </AnimatedPanel>
      );

      

    default:
      return (
        <AnimatedPanel key="default">
          <p className="text-gray-400">Select a settings category from the sidebar.</p>
        </AnimatedPanel>
      );
  }
}


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
    </div>
  )
}
