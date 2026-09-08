import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login, addMockUser } from "../../store/slices/authSlice";
import { v4 as uuidv4 } from "uuid";

export const AuthSwitch = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const mockUsers = useAppSelector(state => state.auth.mockUsers);

  // Initialize with some mock users if none exist
  React.useEffect(() => {
    if (mockUsers.length === 0) {
      const defaultUsers = [
        { id: uuidv4(), name: "Alex Chen", email: "alex@kanbalt.app", avatar: "AC" },
        { id: uuidv4(), name: "Sam Taylor", email: "sam@kanbalt.app", avatar: "ST" }
      ];
      defaultUsers.forEach(u => dispatch(addMockUser(u)));
    }
  }, [dispatch, mockUsers.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (mode === "login") {
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        dispatch(login(existingUser));
      } else {
        // Enforce account check
        setError("No account found with this email.");
      }
    } else {
      // Mock signup validation
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        setError("An account with this email already exists.");
        return;
      }
      const newUser = { id: uuidv4(), name: name || "New User", email };
      dispatch(addMockUser(newUser));
      dispatch(login(newUser));
    }
  };

  const handleQuickLogin = (user: any) => {
    dispatch(login(user));
  };

  const handleModeSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        layout
        className="bg-paper-2 border border-line rounded-[10px] shadow-sm overflow-hidden"
      >
        {/* Header Tabs */}
        <div className="flex border-b border-line">
          <button
            onClick={() => handleModeSwitch("login")}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-colors relative",
              mode === "login" ? "text-ink" : "text-ink-soft hover:text-ink"
            )}
          >
            Sign In
            {mode === "login" && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-cobalt" 
              />
            )}
          </button>
          <button
            onClick={() => handleModeSwitch("signup")}
            className={cn(
              "flex-1 py-4 text-sm font-medium transition-colors relative",
              mode === "signup" ? "text-ink" : "text-ink-soft hover:text-ink"
            )}
          >
            Create Account
            {mode === "signup" && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-cobalt" 
              />
            )}
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-1 mb-6">
                <h2 className="font-heading text-2xl font-bold text-ink">
                  {mode === "login" ? "Welcome back" : "Join Kanbalt"}
                </h2>
                <p className="text-sm text-ink-soft">
                  {mode === "login" 
                    ? "Enter your details to access your workspaces." 
                    : "Create a new account to start managing your projects."}
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-amber/10 border border-amber/20 rounded-md flex items-start gap-2 mb-4"
                >
                  <AlertCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                  <p className="text-sm text-ink-soft leading-tight">{error}</p>
                </motion.div>
              )}

              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-ink">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(null); }}
                      className="w-full bg-paper border border-line rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full bg-paper border border-line rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full bg-paper border border-line rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-cobalt hover:bg-cobalt-dark text-white font-medium py-2.5 rounded-md text-sm transition-colors mt-6 flex items-center justify-center gap-2"
              >
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Quick Login for Prototype Testing */}
          {mode === "login" && mockUsers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line">
              <p className="text-xs font-medium text-ink-soft uppercase tracking-wider mb-3">
                Quick switch (Prototype)
              </p>
              <div className="flex flex-wrap gap-2">
                {mockUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-paper hover:bg-stone/20 border border-line rounded-md text-sm transition-colors"
                  >
                    <div className="w-5 h-5 rounded-sm bg-cobalt/10 text-cobalt flex items-center justify-center text-[10px] font-bold">
                      {u.avatar || u.name.charAt(0)}
                    </div>
                    <span className="text-ink font-medium">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthSwitch;
