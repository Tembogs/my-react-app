import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import CustomSelect from '../animations/Custom-select';
import { div } from 'framer-motion/client';

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Access Auth Context here (top level)
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    role: 'Houser',
    password: '',
    gender: 'Male'
  });

  // ----- Form Handlers -----
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckedBox = () => setClicked((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin
      ? 'https://waste-management-3-iw0g.onrender.com/api/auth/login'
      : 'https://waste-management-3-iw0g.onrender.com/api/auth/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
          role: formData.role,
          location: formData.location,
          gender: formData.gender
        };

    try {
      const { data } = await axios.post(endpoint, payload);

      console.log({data})

      // ✅ Update global auth state
      login(data.token, data.user);


      toast.success(`${isLogin ? "Login" : "Signup"} successful! 🎉`);

      // ✅ Redirect to home
      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong 😢");
    } finally {
      setLoading(false);
    }
  };

  // ----- UI -----
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 overflow-hidden px-4">
      {/* Subtle moving shapes */}
      <motion.div
        className="absolute w-96 h-96 bg-green-300/20 rounded-full blur-3xl -top-24 -left-24"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-green-400/10 rounded-full blur-3xl bottom-0 right-0"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      />

      <AnimatePresence mode="wait">
        <motion.form
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onSubmit={handleSubmit}
          className="relative bg-white/90 backdrop-blur-lg border border-green-200 shadow-xl rounded-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-green-700 tracking-tight">
            {isLogin ? 'Welcome Back 👋' : 'Create Account 🌿'}
          </h2>

          {/* Sign-up only fields */}
          {!isLogin && (
            <>
              {/* Personal Info */}
              <div className="bg-white/70 rounded-lg border border-green-100 p-4 shadow-sm mb-5">
                <h3 className="text-sm font-semibold text-green-600 mb-3 border-b border-green-100 pb-1">
                  Personal Information
                </h3>

                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                  required
                  maxLength={13}
                />
                <CustomSelect
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={["Male", "Female", "Other"]}
                />
              </div>

              {/* Role & Location */}
              <div className="bg-white/70 rounded-lg border border-green-100 p-4 shadow-sm mb-6">
                <h3 className="text-sm font-semibold text-green-600 mb-3 border-b border-green-100 pb-1">
                  Role & Location
                </h3>

                <CustomSelect
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={["Collector", "Houser", "Community_admin"]}
                />
                <CustomSelect
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  options={["Ilorin", "Lagos", "Abuja", "Ibadan", "Port Harcourt"]}
                  
                />
              </div>
            </>
          )}

          {/* Common login/signup fields */}
          <div className="bg-white/70 rounded-lg border border-green-100 p-4 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-green-600 mb-3 border-b border-green-100 pb-1">
              Account Details
            </h3>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-3 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>
          {/* Terms */}
          {!isLogin && (
            <div className="flex items-start mb-5 mt-3">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 mr-2 accent-green-600"
                onClick={handleCheckedBox}
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-600 leading-tight">
                I agree to the{' '}
                <a href="#" className="underline text-green-700 hover:text-green-900">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline text-green-700 hover:text-green-900">
                  Privacy Policy
                </a>
              </label>
            </div>
          )}

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            disabled={!isLogin && !clicked}
            type="submit"
            className={`w-full text-white py-3 font-semibold rounded-lg shadow-md transition-all ${
              isLogin || clicked
                ? 'bg-green-600 hover:bg-green-700'
                : 'opacity-60 bg-green-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </motion.button>

          {/* Toggle between login/signup */}
          <div className="mt-5 text-center">
            <span className="text-green-600">
              {isLogin ? "Need an account?" : "Already have an account?"}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-700 font-medium px-1 hover:text-green-900"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </motion.button>
          </div>

          <ToastContainer position="top-center" autoClose={2500} />
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default SignupLogin;
