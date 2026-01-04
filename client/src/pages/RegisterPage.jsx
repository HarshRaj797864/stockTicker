import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import { api } from "../shared/lib/api";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        name: username,
        email,
        password,
      });

      const { user, token } = response.data;

      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration failed", err);
      const serverError =
        err.response?.data?.message || err.response?.data?.error;
      if (serverError === "Duplicate Email") {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(serverError || "Failed to create account. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#ffaa00]/10 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#00cc88]/10 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-md bg-[#385a94]/15 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
            Create{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-[#00cc88]">
              Account
            </span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium tracking-wide text-sm md:text-base">
            Join StockTicker Pro today
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-in fade-in slide-in-from-top-2">
            <p className="uppercase tracking-widest mb-1">Error</p>
            <p className="font-medium normal-case">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1"
            >
              Full Name
            </label>
            <input
              id="username"
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-6 py-3 bg-black/20 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffaa00]/40 transition-all font-medium text-sm md:text-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-6 py-3 bg-black/20 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00cc88]/40 transition-all font-medium text-sm md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Min 6 characters"
              minLength={6}
              className="w-full px-6 py-3 bg-black/20 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffaa00]/40 transition-all font-medium text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full py-4 bg-gradient-to-r from-[#ffaa00] to-[#00cc88] text-black font-black uppercase text-xs tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#ffaa00]/20 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-black text-[#00cc88] hover:text-[#00ffaa] transition-colors uppercase text-xs tracking-widest ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
