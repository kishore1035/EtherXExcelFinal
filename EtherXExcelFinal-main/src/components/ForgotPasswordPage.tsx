import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
  onOtpVerified: (email: string) => void;
}

export function ForgotPasswordPage({ onBackToLogin, onOtpVerified }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Check if account exists
    const storedPassword = localStorage.getItem(`user_password_${email}`);
    if (!storedPassword) {
      toast.error("No account found with this email address");
      return;
    }

    setIsLoading(true);

    // Generate OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // Send OTP via EmailJS
    try {
      const templateParams = {
        to_email: email,
        to_name: email.split('@')[0],
        otp_code: newOtp,
        from_name: 'EtherX Excel',
        message: 'Use this OTP to reset your password. This OTP is valid for 10 minutes.',
      };

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      await emailjs.send(serviceId, templateId, templateParams);
      
      toast.success("OTP sent to your email!");
      setShowOtpScreen(true);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp === generatedOtp) {
      toast.success("OTP verified successfully!");
      onOtpVerified(email);
    } else {
      toast.error("Invalid OTP. Please try again.");
      setOtp("");
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
            <h1 className="text-3xl mb-2 text-foreground">
              {showOtpScreen ? 'Verify OTP' : 'Forgot Password'}
            </h1>
            <p className="text-foreground/80">
              {showOtpScreen ? 'Enter the OTP sent to your email' : 'Enter your email to reset password'}
            </p>
          </div>

          {!showOtpScreen ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
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
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-foreground">Enter OTP</Label>
                <div className="relative mt-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest text-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                Verify OTP
              </Button>

              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={() => handleSendOtp({ preventDefault: () => {} } as React.FormEvent)}
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
                  Resend OTP
                </button>

                <button
                  type="button"
                  onClick={onBackToLogin}
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
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
