import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Search, Bell, Activity, User, Menu, X } from "lucide-react";

const navItems = ["Dashboard", "Crypto Radar", "Assets", "Trending", "News", "Backtesting", "Alerts", "AI Insights"];

const Navbar = () => {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-border/30"
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Moon className="text-primary animate-pulse-glow" size={24} />
          <span className="font-heading text-lg font-bold text-primary text-glow-blue tracking-wider">MOONIQ</span>
        </div>

        {/* Center nav - desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                active === item ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
              {active === item && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-primary rounded-full"
                  style={{ boxShadow: "0 0 8px hsl(189 100% 50% / 0.6)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
            <Search size={14} className="text-muted-foreground" />
            <input
              placeholder="Search..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-32"
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse-glow" />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/30">
            <Activity size={14} className="text-primary animate-pulse-glow" />
            <span className="text-xs text-primary hidden sm:inline">AI Active</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <User size={14} className="text-primary-foreground" />
          </div>
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden border-t border-border/30 px-4 py-3 space-y-1"
        >
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => { setActive(item); setMobileOpen(false); }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm ${active === item ? "text-primary bg-muted/50" : "text-muted-foreground"}`}
            >
              {item}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
