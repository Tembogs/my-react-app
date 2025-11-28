import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence  } from "framer-motion"
import {
  FaRecycle,
  FaMapMarkerAlt,
  FaHandsHelping,
  FaLeaf,
  FaUserPlus,
  FaBell,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Nav";
import Footer from "../component/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Show a random notification every 8 seconds
    const notifications = [
      "🌿 New cleanup event in Lagos Mainland!",
      "♻ 5 households scheduled pickups today!",
      "🚛 Recycling truck en route to Lekki Center.",
      "🌍 You helped divert 20kg of plastic this week!",
    ];
    const interval = setInterval(() => {
      setNotification(notifications[Math.floor(Math.random() * notifications.length)]);
      setTimeout(() => setNotification(null), 4000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
 function Counter({ target, duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString() + "+");

  useEffect(() => {
    const end = parseInt(target.replace(/[^\d]/g, ""), 10);
    const controls = animate(count, end, { duration, ease: "easeOut" });
    return controls.stop;
  }, [target, duration, count]);

  return <motion.span>{rounded}</motion.span>;
}


  const stats = [
    { num: "5200+", label: "Pickups Completed" },
    { num: "1300+", label: "Active Users" },
    { num: "87", label: "Recycling Centers" },
  ]

const testimonials = [
  {
    name: "Aisha B.",
    location: "Lagos, Nigeria",
    text: "CleanCore made it easy for my family to schedule waste pickups. Our street is cleaner than ever!",
  },
  {
    name: "Emeka O.",
    location: "Abuja, Nigeria",
    text: "I earn points every month for recycling. Great initiative — it motivates me to stay consistent.",
  },
  {
    name: "Ngozi E.",
    location: "Port Harcourt, Nigeria",
    text: "Our neighborhood cleanup was supported by CleanCore — amazing community support!",
  },
  {
    name: "Tunde K.",
    location: "Ibadan, Nigeria",
    text: "Easy to use, visually clean, and I love seeing how my recycling efforts contribute to the community.",
  },
];

// Auto slide every 6 seconds
useEffect(() => {
  const timer = setInterval(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, 6000);
  return () => clearInterval(timer);
}, [testimonials.length]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-800 relative">
      <Navbar />

      {/* 🔔 Floating notification animation */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="fixed top-20 right-6 bg-green-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-50"
          >
            <FaBell />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌱 Hero Section */}
      <section
        className="relative h-[70vh] flex items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1672575659188-e7dd57652db3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZW5lciUyMHBhc3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-white max-w-3xl px-4"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Together for a Cleaner Nigeria 🌍
          </h1>
          <p className="text-lg mb-6">
            Empowering communities through responsible waste management, recycling, and education.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
          >
            Get Started
          </button>
        </motion.div>
      </section>

      {/* 💚 Mission Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
          Our Purpose
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[
            {
              icon: <FaRecycle className="text-green-600 text-3xl" />,
              title: "Reduce Waste",
              desc: "We encourage smart disposal and recycling of plastics, glass, and e-waste to keep our environment clean.",
              img: "https://images.unsplash.com/photo-1574974671999-24b7dfbb0d53?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FzdGUlMjBtYW5hZ2VtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
            },
            {
              icon: <FaHandsHelping className="text-green-600 text-3xl" />,
              title: "Empower Communities",
              desc: "We collaborate with households and collectors to create a sustainable waste management system.",
              img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
            },
            {
              icon: <FaLeaf className="text-green-600 text-3xl" />,
              title: "Protect Nature",
              desc: "By reducing landfill pressure, we protect ecosystems and promote a greener, cleaner Nigeria.",
              img: "https://images.unsplash.com/photo-1686742553079-64fd424ce081?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb3RlY3QlMjBuYXR1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <img src={item.img} alt={item.title} className="h-40 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📊 Statistics */}
      <section className="py-14 bg-green-50">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-8">
          Impact in Numbers
        </h2>
        <div className="flex justify-center gap-10 flex-wrap text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-white px-6 py-6 rounded-xl shadow-lg w-40"
            >
              <h3 className="text-3xl font-bold text-green-700">
                <Counter target={stat.num} />
              </h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* 🧍 Testimonials */}
<section className="py-16 bg-white overflow-hidden">
  <h2 className="text-2xl font-bold text-center text-green-800 mb-8">
    What People Say
  </h2>

  <div className="relative max-w-3xl mx-auto px-6">
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="bg-green-50 rounded-xl p-8 shadow-lg text-center"
      >
        <p className="text-gray-700 italic mb-5 text-lg leading-relaxed">
          “{testimonials[activeIndex].text}”
        </p>
        <h4 className="font-semibold text-green-700 text-base">
          — {testimonials[activeIndex].name}
        </h4>
        <p className="text-sm text-gray-500">{testimonials[activeIndex].location}</p>
      </motion.div>
    </AnimatePresence>

    {/* Navigation dots */}
    <div className="flex justify-center gap-2 mt-6">
      {testimonials.map((_, i) => (
        <button
          key={i}
          onClick={() => setActiveIndex(i)}
          className={`w-3 h-3 rounded-full ${
            i === activeIndex ? "bg-green-600" : "bg-gray-300"
          } transition`}
        />
      ))}
    </div>
  </div>
</section>


      <Footer />
    </div>
  );
}
