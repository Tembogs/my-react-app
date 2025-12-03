import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Globe, Heart, Sparkles, Users } from "lucide-react";
import Navbar from "../component/Nav";
import Footer from "../component/Footer";

// ♻️ Animated Counter component (same as Home)
function Counter({ target, duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString() + "+");

  useEffect(() => {
    const end = parseInt(target.replace(/[^\d]/g, ""), 10);
    const controls = animate(count, end, { duration, ease: "easeOut" });
    return controls.stop;
  }, [target, duration, count]);

  return <motion.span className="font-bold text-green-600 dark:text-green-400">{rounded}</motion.span>;
}

export default function About() {
  const stats = [
    { label: "Communities Reached", num: "45+" },
    { label: "Waste Collected (Tons)", num: "25,000+" },
    { label: "Eco-Volunteers", num: "500+" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-700">
      <Navbar />

      {/* 🌐 Floating Orb Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Orb hoverIntensity={0.4} rotateOnHover hue={90} />
      </div>

      {/* 🪴 Header */}
      <motion.section
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-28 pb-14 px-6"
      >
        <h1 className="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          About CleanCore
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          CleanCore is shaping the future of waste management in Nigeria — building cleaner cities,
          empowering households, and protecting the planet through innovation.
        </p>
      </motion.section>

      {/* 🌍 Story Section */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 py-12"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="https://plus.unsplash.com/premium_photo-1681987448179-4a93b7975018?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VzdGFpbmFiaWxpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
            alt="CleanCore operations"
            className="w-full h-80 object-cover rounded-2xl shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
          <div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Our Story
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              What started as a small community recycling project has grown into a tech-powered
              movement for sustainable living. CleanCore connects households, collectors, and
              organizations through modern digital solutions — turning waste into value and
              awareness into action.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 💚 Mission & Core Values */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-green-50/40 dark:bg-gray-800/30"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-12">
            Our Mission & Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Sustainability",
                desc: "We build eco-conscious communities through education and technology.",
              },
              {
                icon: Heart,
                title: "Care & Integrity",
                desc: "We value every home and ensure trust, transparency, and safety in our services.",
              },
              {
                icon: Sparkles,
                title: "Innovation",
                desc: "Using data-driven solutions to improve waste collection and recycling efficiency.",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.05 }}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-green-200/40 dark:hover:shadow-green-700/20 transition-all"
              >
                <val.icon className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{val.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 📈 Impact Section (animated counter) */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 bg-white dark:bg-gray-900 text-center"
      >
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-10">
          Our Growing Impact
        </h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-green-50 dark:bg-gray-800 px-8 py-6 rounded-xl shadow-md w-48"
            >
              <h3 className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                <Counter target={stat.num} />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 👥 Team Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 px-6 text-center relative"
      >
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-12">
          Meet Our Dedicated Team
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto overflow-hidden">
          {[
            {
              name: "Temmy Ezekiel",
              role: "Founder & CEO",
              img: "/jlot.jpg",
            },
            {
              name: "Sophia A.",
              role: "Operations Lead",
              img: "/gemini-.png",
            },
            {
              name: "David O.",
              role: "Tech & Innovation Head",
              img: "/gemini.png",
            },
          ].map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="p-6 soft-ticker-text bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700 hover:shadow-green-200/30 dark:hover:shadow-green-700/20 transition-all"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
              />
              <h4 className="text-xl font-semibold">{member.name}</h4>
              <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🌿 Footer Gradient Transition */}
      <div className="h-32 w-full bg-gradient-to-b from-transparent to-green-900/90 -mb-32 relative z-10"></div>
      <div className="relative z-20 -mt-24">
        <Footer />
      </div>
    </div>
  );
}
