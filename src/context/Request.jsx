import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaTrash, FaRecycle, FaExclamationTriangle } from "react-icons/fa";
import CustomSelect from "../animations/Custom-select";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // adjust path as needed
import { useNavigate } from "react-router-dom";
import "../App.css"


export default function RequestModal({ showModal, setShowModal, active, setActive}) {
  const { user, token, requestEvents } = useContext(AuthContext);

  // const [category, setCategory] = useState("waste");
  // const [loading, setLoading] = useState(false);
  const [wasteType, setWasteType] = useState("General");
  const [recycleType, setRecycleType] = useState("General");
  const [dumpType, setDumpType] = useState("General");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [location, setLocation] = useState("Ibadan");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [requestDate] = useState(new Date().toLocaleString());
  const [status] = useState("Pending");
  const [loading, setLoading]= useState(false)
 const navigate = useNavigate();

  

   let selectedValue;
if (active === "waste") {
  selectedValue = wasteType;
} else if (active === "recycle") {
  selectedValue = recycleType;
} else if (active === "illegal"){
  selectedValue = dumpType;
}
let selectedNotes;
if(active === "illegal"){
  selectedNotes = description
} else {selectedNotes = notes}

let selectedLabel;
if (active === "waste"){
  selectedLabel = "Waste Type"
} else if (active=== "recycle"){
  selectedLabel = "Recycle Type"
} else if (active === "illegal") {
  selectedLabel = "Dump Type"
}
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!quantity || !location) {
    toast.error("Please fill in all required fields.");
    return; // Stop execution if required fields are missing
  }



  const newRequest = {
    username: user?.name || "Guest",
    userId: user?._id ,
    active,
    Type:selectedValue,
    quantity,
    unit,
    location,
    notes: active === "illegal" ? description : notes,
    images,
    requestDate,
    status,
  };

  const reqWaste = 'https://waste-management-3-iw0g.onrender.com/api/waste';
  const reqRecycle = 'https://waste-management-3-iw0g.onrender.com/api/recycle';
  const reqIlegal  = 'https://waste-management-3-iw0g.onrender.com/api/dump';
  
  
  let endpoint;

if (active === "waste") {
  endpoint = reqWaste;
} else if (active === "recycle") {
  endpoint = reqRecycle;
} else {
  endpoint = reqIlegal;
}


 const endpoints = endpoint

  const payLoad =
    active === "waste"
      ? {
        userId: newRequest.userId,
        materials:[{
          wasteType: newRequest.Type,
          quantity: newRequest.quantity,
          unit: newRequest.unit,
        }
        ],
          location: newRequest.location,
          notes,
          images: newRequest.images,
          requestDate,
          status,
        }

      :active === "recycle"
      ? {
        userId: newRequest.userId,
        materials:[{
        recycleType: newRequest.Type,
          quantity: newRequest.quantity,
          unit: newRequest.unit,
        }
        ],
          location: newRequest.location,
          notes,
          images: newRequest.images,
          requestDate,
          status,
        }
      :{
        userId: newRequest.userId,
        materials:[{
        dumpType: newRequest.Type,
        quantity: newRequest.quantity,
        unit: newRequest.unit,
        }
        ],
        description:newRequest.notes,
        location: newRequest.location,
          images: newRequest.images,
          requestDate,
          status,
        }

        

 if (!token) {
  toast.error("You must be logged in to submit a request.");
  return;
}

try {
  console.log("🪪 User Info:", user);
  console.log("🔐 Token:", token);
  console.log("📦 Payload:", payLoad);
  console.log("🌍 Endpoint:", endpoint);

  const response = await axios.post(endpoints, payLoad, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  requestEvents.emit("newRequest");


  console.log("✅ Response:", response.data);
  toast.success("Waste request submitted successfully!");


    toast.success(`Request successful! 🎉`);

    setTimeout(() => {
    navigate("/houser?waste=true");
    }, 1200);
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong 😢");
  } finally {
    setLoading(false);
    setShowModal(false);
  }
};

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[92vh] hide-scrollbar overflow-y-auto rounded-3xl bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Request Form
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-3xl text-gray-400 hover:text-gray-600 transition"
              >
                &times;
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-around mb-8">
              {[
                { name: "waste", icon: <FaTrash className="text-red-500" /> },
                { name: "recycle", icon: <FaRecycle className="text-green-500" /> },
                { name: "illegal", icon: <FaExclamationTriangle className="text-yellow-500" /> },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  whileHover={{ scale: 1.05 }}
                  className={`flex flex-row items-center md:w-[11rem] sm:w-[8rem] justify-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    active === item.name
                      ? "bg-gray-900 text-white shadow-md cursor-pointer"
                      : "cursor-not-allowed text-gray-700  bg-gray-200"
                  }`}
                >
                  {item.icon}
                  <span className="capitalize">{item.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={user?.name}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Waste Type */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Waste Type
                </label>
                <CustomSelect
                  label={selectedValue}
                  name="Waste Type"
                  value={selectedValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (active === "waste") setWasteType(val);
                    else if (active === "recycle") setRecycleType(val);
                    else setDumpType(val);
                  }}
                  options={[
                    "General",
                    "Paper",
                    "Plastic",
                    "Glass",
                    "Metal",
                    "Organic",
                    "E-waste",
                  ]}
                  className="w-full"
                  selectClassName="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Unit
                </label>
                <CustomSelect
                  label="Unit"
                  name="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  options={["kg", "items", "liters"]}
                  className="w-full"
                  selectClassName="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Location
                </label>
                <CustomSelect
                  label="Location"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  options={["Ilorin", "Lagos", "Abuja", "Ibadan", "Port Harcourt"]}
                  className="w-full"
                  selectClassName="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {active === "illegal" ? "Description" : "Additional Notes"}
                </label>
                <textarea
                  rows="3"
                  placeholder="Add more details..."
                  value={selectedNotes}
                  onChange={(e) =>
                    active === "illegal"
                      ? setDescription(e.target.value)
                      : setNotes(e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 grid md:grid-cols-2 gap-4 text-sm text-gray-500">
              <p>
                📅 <span className="font-bold text-gray-700">Request Date:</span> {requestDate}
              </p>
              <p>
                ⚙️ <span className="font-bold text-gray-700">Status:</span> {status}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end mt-10 gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
