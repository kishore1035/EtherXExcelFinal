import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { SettingsPage } from "./components/SettingsPage";
import { StartupSplash } from "./components/StartupSplash";
import { WelcomeSplash } from "./components/WelcomeSplash";
import { Dashboard } from "./components/Dashboard";
import { ExcelSpreadsheet } from "./components/ExcelSpreadsheet";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { User } from "./types/spreadsheet";
import { generateSpreadsheetId, loadSpreadsheet, clearNewSpreadsheetCache, type SpreadsheetData } from "./utils/spreadsheetStorage";
import { trackActivity } from "./utils/notificationSystem";
import { parseCollaborationLink, getCollaborationLink, addCollaborator } from "./utils/collaborationSystem";

type Screen = "login" | "signup" | "welcome" | "dashboard" | "app" | "forgotPassword" | "resetPassword" | "settings";

export default function App() {
  const [showStartupSplash, setShowStartupSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<User | null>(null);
  const [showDemoOnStart, setShowDemoOnStart] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [currentSpreadsheet, setCurrentSpreadsheet] = useState<SpreadsheetData | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    // Always use dark mode for auth pages (login, signup, forgot password, etc.)
    const authScreens = ["login", "signup", "forgotPassword", "resetPassword"];
    if (authScreens.includes(screen) || theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, screen]);

  // Handle collaboration link on mount
  useEffect(() => {
    const linkId = parseCollaborationLink();
    if (linkId && user) {
      const link = getCollaborationLink(linkId);
      if (link) {
        // Add user as collaborator
        addCollaborator(linkId, user.email, user.name);
        
        // Load the shared spreadsheet
        const sheet = loadSpreadsheet(link.spreadsheetId);
        if (sheet) {
          setCurrentSpreadsheet(sheet);
          setScreen("app");
          toast.success(`Joined collaboration on "${link.spreadsheetTitle}"`);
          
          // Clear the URL parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          toast.error("Could not load shared spreadsheet");
        }
      } else {
        toast.error("Invalid collaboration link");
      }
    }
  }, [user]);

  const handleLogin = (emailOrPhone: string) => {
    // Retrieve stored user data from localStorage
    const storedName = localStorage.getItem(`user_name_${emailOrPhone}`);
    const storedPhone = localStorage.getItem(`user_phone_${emailOrPhone}`);
    
    const newUser: User = {
      name: storedName || (emailOrPhone.includes("@") ? emailOrPhone.split("@")[0].charAt(0).toUpperCase() + emailOrPhone.split("@")[0].slice(1) : "User"),
      email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone}@example.com`,
      phone: storedPhone || (emailOrPhone.includes("@") ? undefined : emailOrPhone),
    };
    setUser(newUser);
    setScreen("welcome");
  };

  const handleSignup = (name: string, email: string, phone: string) => {
    const newUser: User = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      phone: phone || undefined,
    };
    setUser(newUser);
    setScreen("welcome");
  };

  const handleLogout = () => {
    setUser(null);
    setScreen("login");
  };

  const handleBackToHome = () => {
    setScreen("dashboard");
    setShowDemoOnStart(false);
    setImportedData(null);
    setCurrentSpreadsheet(null);
  };

  const handleForgotPassword = () => {
    setScreen("forgotPassword");
  };

  const handleOtpVerified = (email: string) => {
    setResetEmail(email);
    setScreen("resetPassword");
  };

  const handlePasswordReset = () => {
    setResetEmail("");
    setScreen("login");
  };

  const handleUpdateProfile = (name: string, email: string, phone: string) => {
    if (user) {
      setUser({
        ...user,
        name,
        email,
        phone: phone || undefined,
      });
    }
  };

  const handleImportFile = (data: any) => {
    setImportedData(data);
    setCurrentSpreadsheet(null);
    setScreen("app");
    // Track import activity
    if (user?.email) {
      trackActivity(user.email, 'import', undefined, data?.fileName || 'Imported file');
    }
  };

  const handleOpenSheet = (sheetId: string) => {
    const sheet = loadSpreadsheet(sheetId);
    if (sheet) {
      setCurrentSpreadsheet(sheet);
      setImportedData(null);
      setScreen("app");
      // Track open activity
      if (user?.email) {
        trackActivity(user.email, 'open', sheet.id, sheet.title);
      }
    }
  };

  const handleNewSheet = () => {
    // Clear any existing data first
    setCurrentSpreadsheet(null);
    setImportedData(null);
    
    // Create a completely new spreadsheet with unique ID
    const uniqueId = generateSpreadsheetId();
    
    // Clear any cached data for this new ID
    clearNewSpreadsheetCache(uniqueId);
    
    const newSheet: SpreadsheetData = {
      id: uniqueId,
      title: "Untitled",
      userEmail: user?.email || "",
      cellData: {},
      cellFormats: {},
      lastModified: new Date().toISOString(),
      created: new Date().toISOString(),
    };
    
    // Small delay to ensure state is cleared
    setTimeout(() => {
      setCurrentSpreadsheet(newSheet);
      setScreen("app");
      
      // Track create activity
      if (user?.email) {
        trackActivity(user.email, 'create', newSheet.id, newSheet.title);
      }
    }, 50);
  };

  // Listen for dashboard navigation event from Header
  useEffect(() => {
    const handleNavigateToDashboard = () => {
      handleBackToHome();
    };
    
    window.addEventListener('navigateToDashboard', handleNavigateToDashboard);
    return () => window.removeEventListener('navigateToDashboard', handleNavigateToDashboard);
  }, []);

  return (
    <>
      {showStartupSplash && (
        <StartupSplash onComplete={() => setShowStartupSplash(false)} />
      )}

      {!showStartupSplash && screen === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setScreen("signup")}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {screen === "signup" && (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setScreen("login")}
        />
      )}

      {screen === "forgotPassword" && (
        <ForgotPasswordPage
          onBackToLogin={() => setScreen("login")}
          onOtpVerified={handleOtpVerified}
        />
      )}

      {screen === "resetPassword" && (
        <ResetPasswordPage
          email={resetEmail}
          onPasswordReset={handlePasswordReset}
        />
      )}

      {screen === "settings" && user && (
        <SettingsPage
          userName={user.name}
          userEmail={user.email}
          userPhone={user.phone}
          isDarkMode={theme === "dark"}
          onBack={() => setScreen("dashboard")}
          onSaveProfile={handleUpdateProfile}
        />
      )}

      {screen === "welcome" && user && (
        <WelcomeSplash user={user} onComplete={() => setScreen("dashboard")} />
      )}

      {screen === "dashboard" && user && (
        <Dashboard
          userName={user.name}
          userEmail={user.email}
          userPhone={user.phone}
          onNewSheet={handleNewSheet}
          onLoadTemplates={() => {
            setCurrentSpreadsheet(null);
            setScreen("app");
            setShowDemoOnStart(true);
          }}
          onImportFile={handleImportFile}
          onOpenSheet={handleOpenSheet}
          onOpenSettings={() => setScreen("settings")}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {screen === "app" && user && (
        <ExcelSpreadsheet 
          user={user} 
          onLogout={handleLogout}
          onBackToHome={handleBackToHome}
          importedData={importedData}
          currentSpreadsheet={currentSpreadsheet}
        />
      )}

      <Toaster />
    </>
  );
}
