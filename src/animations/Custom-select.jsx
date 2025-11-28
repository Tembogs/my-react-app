import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ label, name, value, onChange, options, className = "", selectClassName = "", text = "",
 }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } });
    setOpen(false);
  };

  return (
    <div className={`relative mb-4 ${className}`}>
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-4 py-2 border rounded-md  cursor-pointer transition-all duration-300 hover:shadow-md ${
          open ? "ring-2 ring-green-400" : "border-green-200"
        } ${selectClassName}`}
      >
        <span className={`${text}`}>{value || `Select ${label}`}</span>
        <ChevronDown
          className={`text-green-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white border border-green-200 rounded-md shadow-lg overflow-hidden"
          >
            {options.map((option, index) => (
              <motion.li
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 text-sm cursor-pointer ${
                  value === option
                    ? "bg-green-100 text-green-800 font-semibold"
                    : "hover:bg-green-50 text-gray-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect