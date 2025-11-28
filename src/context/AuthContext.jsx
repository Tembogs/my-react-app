import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🧠 Rehydrate auth data on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);

        // Always restore token + user to keep session alive
        setToken(savedToken);
        setUser(parsedUser);

        // 🧩 If collector but missing collectorAssayId, re-fetch from backend
        if (parsedUser?.role === "Collector" && !parsedUser?.collectorAssayId) {
          axios
            .get(`https://waste-management-3-iw0g.onrender.com/api/users/${parsedUser._id}`, {
              headers: { Authorization: `Bearer ${savedToken}` },
            })
            .then((res) => {
              const updatedUser = {
                ...res.data,
                collectorAssayId: res.data?.collectorAssayId || parsedUser.collectorAssayId,
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUser(updatedUser);
            })
            .catch((err) => {
              console.warn("Failed to refresh collectorAssayId:", err);
            });
        }
      } catch (err) {
        console.error("Failed to rehydrate auth data:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // 🪄 Update user and persist to localStorage
  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const mergedUser = {
        ...prev,
        ...updatedUser,
        collectorAssayId: updatedUser?.collectorAssayId || prev?.collectorAssayId,
      };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      return mergedUser;
    });
  };

  // 🧰 Upload avatar
  const uploadAvatar = async (file) => {
  if (!file) {
    toast.error("No image selected");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    // 1️⃣ Upload to Cloudinary
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    const imageUrl = res.data.secure_url;
    toast.success("Image uploaded successfully 🖼️");

    // 2️⃣ Update backend user profile
    const updateRes = await axios.put(`https://waste-management-3-iw0g.onrender.com/api/users/${user._id}/profile-picture`, {
      avatarUrl: imageUrl
    });


    // 3️⃣ Update your React context
    setUser(updateRes.data.user || updateRes.data);

    toast.success("Profile picture updated!");
    return imageUrl;

  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Image upload failed 😢");
    return null;
  }
};



  // 🗝️ Login
  const login = (newToken, userData) => {
    if (newToken && userData) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } else {
      console.warn("Login failed: token or userData missing");
    }
  };

  // 🧾 Signup
  const signup = async (signupData) => {
    try {
      const res = await fetch("https://waste-management-3-iw0g.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (!res.ok) throw new Error("Signup failed");

      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // 🧩 Fetch latest user profile
  const getUserProfile = async () => {
    if (!token || !user?._id) return;

    try {
      const res = await axios.get(`https://waste-management-3-iw0g.onrender.com/api/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signup,
        uploadAvatar,
        updateUser,
        login,
        logout,
        getUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
