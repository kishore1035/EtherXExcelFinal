import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";

interface LoginPageProps {
  onLogin: (emailOrPhone: string) => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginPage({ onLogin, onSwitchToSignup, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Login with password verification
  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      // Retrieve stored credentials from localStorage
      const storedPassword = localStorage.getItem(`user_password_${email}`);
      
      if (storedPassword) {
        // Verify password
        if (storedPassword === password) {
          const userName = localStorage.getItem(`user_name_${email}`) || email;
          toast.success(`Welcome back, ${userName}!`);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('isAuthenticated', 'true');
          await new Promise((resolve) => setTimeout(resolve, 500));
          onLogin(email);
        } else {
          toast.error("Incorrect password. Please try again.");
          setIsLoading(false);
        }
      } else {
        // No account found
        toast.error("No account found. Please sign up first.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto bg-card p-2">
                <img src={logoImage} alt="EtherX Excel" className="w-full h-full object-contain" />
              </div>
            </motion.div>
            <h1 className="text-3xl mb-2 text-foreground">EtherX Excel</h1>
            <p className="text-foreground/80">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="reshmabanu2328@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-foreground"
                    style={{ color: '#000000' }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 text-foreground"
                    style={{ color: '#000000' }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  onClick={onForgotPassword}
                  style={{
                    color: "#FFFFFF !important",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    padding: "8px 0",
                    background: "transparent",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "14px",
                    textDecoration: "none",
                    outline: "none",
                    letterSpacing: "0.3px",
                    WebkitTextFillColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background =
                      "linear-gradient(135deg, #FFFFFF 0%, #FFFACD 15%, #FFD700 30%, #FFF5B8 45%, #FFD700 60%, #FFFACD 75%, #FFFFFF 90%, #FFD700 100%)";
                    el.style.backgroundSize = "300% 100%";
                    el.style.webkitBackgroundClip = "text";
                    el.style.webkitTextFillColor = "transparent";
                    el.style.backgroundClip = "text";
                    el.style.animation = "shine 2.5s ease-in-out infinite";
                    el.style.color = "transparent";
                    el.style.transform = "scale(1.05)";
                    el.style.textShadow = "0 0 20px rgba(255, 215, 0, 0.5)";
                    el.style.backgroundColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "transparent";
                    el.style.webkitBackgroundClip = "";
                    el.style.webkitTextFillColor = "";
                    el.style.backgroundClip = "";
                    el.style.animation = "";
                    el.style.color = "#FFFFFF";
                    el.style.transform = "scale(1)";
                    el.style.textShadow = "";
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* OR Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #FFFFFF, transparent)' }}></div>
                <span className="px-4 text-white font-semibold text-sm">OR</span>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #FFFFFF, transparent)' }}></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <button
                  onClick={onSwitchToSignup}
                  style={{
                    color: "#FFFFFF !important",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    padding: "8px 0",
                    background: "transparent",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    fontSize: "14px",
                    textDecoration: "none",
                    outline: "none",
                    letterSpacing: "0.3px",
                    WebkitTextFillColor: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;

                    // Apply beautiful white-gold gradient text
                    el.style.background =
                      "linear-gradient(135deg, #FFFFFF 0%, #FFFACD 15%, #FFD700 30%, #FFF5B8 45%, #FFD700 60%, #FFFACD 75%, #FFFFFF 90%, #FFD700 100%)";
                    el.style.backgroundSize = "300% 100%";
                    el.style.webkitBackgroundClip = "text";
                    el.style.webkitTextFillColor = "transparent";
                    el.style.backgroundClip = "text";
                    el.style.animation = "shine 2.5s ease-in-out infinite";
                    el.style.color = "transparent";
                    el.style.transform = "scale(1.05)";
                    el.style.textShadow = "0 0 20px rgba(255, 215, 0, 0.5)";

                    // Ensure NO rectangle background
                    el.style.backgroundColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;

                    // Go back to normal white text
                    el.style.background = "transparent";
                    el.style.webkitBackgroundClip = "";
                    el.style.webkitTextFillColor = "";
                    el.style.backgroundClip = "";
                    el.style.animation = "";
                    el.style.color = "#FFFFFF";
                    el.style.transform = "scale(1)";
                    el.style.textShadow = "";
                  }}
                >
                  Don't have an account? Sign up
                </button>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
