import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaArrowUp,
  FaRecycle,
} from "react-icons/fa";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [ecoCount, setEcoCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let start = 0;
    const end = 25420;
    const duration = 3000;
    const increment = (end / duration) * 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setEcoCount(Math.floor(start));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className=" bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white backdrop-blur-xl border-t border-green-800/20 shadow-inner">
      {/* 🌌 Floating Glow Backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-16 left-20 w-48 h-48 bg-green-400/10 blur-3xl rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-24 right-32 w-56 h-56 bg-lime-300/10 blur-3xl rounded-full"
        />
      </div>

      {/* 🌿 Main Footer Content */}
      <div className="relative z-10 max-w-7xl px-6 py-16 flex flex-col md:flex-row justify-between gap-12 text-center md:text-left">
        {/* 🪴 Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 mx-10"
        >
          <div className="flex justify-center md:justify-start items-center  gap-2 mb-3">
            <FaLeaf className="text-green-400 text-3xl drop-shadow-glow animate-pulse" />
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-300 to-lime-200 bg-clip-text text-transparent">
              CleanCore
            </h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
            Empowering communities to recycle smarter and keep the planet thriving 🌍.
          </p>

          <div className="flex justify-center md:justify-start items-center gap-3 mt-6">
            <FaRecycle className="text-green-400 text-2xl animate-spin-slow" />
            <div>
              <p className="font-semibold text-lg">
                {ecoCount.toLocaleString()}+
              </p>
              <p className="text-xs text-gray-400">Tons Recycled by Users</p>
            </div>
          </div>
        </motion.div>

        {/* 🔗 Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1"
        >
          <h3 className="font-semibold text-lg mb-3 text-green-300">
            Explore CleanCore
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              ["Home", "/"],
              ["Our Mission", "/mission"],
              ["Recycle Map", "/recycle"],
              ["Impact Stories", "/impact"],
              ["Contact", "/contact"],
            ].map(([label, href], idx) => (
              <li key={idx}>
                <a
                  href={href}
                  className="hover:text-green-400 transition flex items-center gap-2 justify-center md:justify-start"
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 🌍 Stay Connected */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex-1 -mx-80"
        >
          <h3 className="font-semibold text-lg mb-3 text-green-300">
            Stay Connected
          </h3>
          <div className="flex justify-center md:justify-start gap-5 mb-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaEnvelope].map(
              (Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="text-xl text-white/80 hover:text-green-400 transition"
                >
                  <Icon />
                </motion.a>
              )
            )}
          </div>
          <p className="text-sm text-gray-400">
            📧{" "}
            <a
              href="mailto:support@cleancore.com"
              className="hover:text-green-300"
            >
              support@cleancore.com
            </a>
          </p>
          <p className="text-sm text-gray-400">📞 +234 800 000 0000</p>
        </motion.div>
      </div>

      {/* 🌾 Divider Quote */}
      <motion.div
        className="text-center text-green-200 text-sm italic pb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        “Cleaning the world, one tap at a time.” 🌍
      </motion.div>

      {/* 🪶 Bottom Line */}
      <div className="border-t border-white/10 py-5 text-center text-sm text-gray-400 backdrop-blur-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-green-400 font-semibold">CleanCore</span> — Built
        with ♻️ by <span className="text-green-300">EcoThinkers</span>
      </div>

      {/* ⬆️ Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            onClick={scrollToTop}
            className="fixed z-[9999] bottom-20 right-20 bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-500 hover:to-lime-400 text-white p-3 rounded-full shadow-lg shadow-green-700/40 transition "
          >
            <FaArrowUp />
          </motion.button>
        )}
        
      </AnimatePresence>
    </footer>
  );
}
