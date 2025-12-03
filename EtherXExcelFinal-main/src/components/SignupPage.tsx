import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';
import logoImage from "figma:asset/14bd33c00fb18a1e46e6fbec8038e908490efbfd.png";

interface SignupPageProps {
  onSignup: (name: string, email: string, phone: string) => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
      console.log('EmailJS initialized successfully');
    }
  }, []);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if email already exists
      const existingPassword = localStorage.getItem(`user_password_${email}`);
      if (existingPassword) {
        toast.error("Account already exists. Please login.");
        setIsLoading(false);
        return;
      }

      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      console.log('Sending OTP to:', email);
      console.log('Generated OTP:', otpCode);

      // Send OTP via EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      console.log('EmailJS Config:', { serviceId, templateId });

      const templateParams = {
        to_email: email,
        to_name: name,
        otp_code: otpCode,
        from_name: "EtherX Excel",
        message: `Your OTP code is: ${otpCode}. This code will expire in 10 minutes.`
      };

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams
      );

      console.log('EmailJS Response:', response);
      toast.success("OTP sent to your email! Please check your inbox.");
      setShowOtpScreen(true);
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      console.error('Error details:', error.text || error.message);
      toast.error(`Failed to send OTP: ${error.text || error.message || 'Please try again.'}`);
    }
    
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Save user data to localStorage after OTP verification
      localStorage.setItem(`user_password_${email}`, password);
      localStorage.setItem(`user_name_${email}`, name);
      localStorage.setItem(`user_phone_${email}`, phone);
      
      toast.success("Account created successfully! Please login.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSwitchToLogin();
    } catch (error) {
      console.error('Failed to create account:', error);
      toast.error('Failed to create account. Please try again.');
    }

    setIsLoading(false);
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
              {showOtpScreen ? "Verify OTP" : "Create Account"}
            </h1>
            <p className="text-foreground/80">
              {showOtpScreen ? `Enter the OTP sent to ${email}` : "Join today"}
            </p>
          </div>

          {showOtpScreen ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP *</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10"
                    maxLength={6}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  />
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <Button
                onClick={() => setShowOtpScreen(false)}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Back to Signup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#000000' }} />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  style={{ color: '#000000' }}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
              </div>
            </div>

            <Button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

              <div className="text-center">
                <button
                  onClick={onSwitchToLogin}
                  style={{
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                    background: "transparent",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "linear-gradient(135deg, #FFFACD 0%, #FFD700 25%, #FFFACD 50%, #FFD700 75%, #FFFACD 100%)";
                    el.style.webkitBackgroundClip = "text";
                    el.style.webkitTextFillColor = "transparent";
                    el.style.backgroundColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "transparent";
                    el.style.webkitBackgroundClip = "";
                    el.style.webkitTextFillColor = "white";
                  }}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
