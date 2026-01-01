import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import { api } from "../shared/lib/api";

export const LoginPage = () => {
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
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] overflow-hidden px-4">
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Main Container: Using 385a94 with translucency and no top accent line */}
      <div className="w-full max-w-md bg-[#385a94]/15 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">Back</span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium tracking-wide">Enter your credentials to access the market</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-in fade-in slide-in-from-top-2">
            <p className="uppercase tracking-widest mb-1">Access Denied</p>
            <p className="font-medium normal-case">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-6 py-3 bg-black/20 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-6 py-3 bg-black/20 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="cursor-pointer w-full py-4 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login to Ticker"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            New to the platform?{" "}
            <Link
              to="/register"
              className="font-black text-blue-400 hover:text-blue-300 transition-colors uppercase text-xs tracking-widest ml-1"
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
