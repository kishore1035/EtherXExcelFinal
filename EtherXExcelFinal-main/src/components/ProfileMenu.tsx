import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  User,
  Settings,
  FileSpreadsheet,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface ProfileMenuProps {
  userName: string;
  userEmail: string;
  userPhone?: string;
  isDarkMode: boolean;
  onOpenSettings: () => void;
  onOpenMySheets: () => void;
  onOpenCollaboration: () => void;
  onLogout: () => void;
}

export function ProfileMenu({
  userName,
  userEmail,
  userPhone,
  isDarkMode,
  onOpenSettings,
  onOpenMySheets,
  onOpenCollaboration,
  onLogout,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      onClick: () => {
        onOpenSettings();
        setOpen(false);
      },
    },
    {
      icon: FileSpreadsheet,
      label: "My Sheets",
      onClick: () => {
        onOpenMySheets();
        setOpen(false);
      },
    },
    {
      icon: Users,
      label: "Collaboration",
      onClick: () => {
        onOpenCollaboration();
        setOpen(false);
      },
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full p-0 transition-all duration-300"
          style={{
            border: isDarkMode ? "2px solid #4b5563" : "2px solid #FFD700",
          }}
        >
          <Avatar className="h-full w-full">
            <AvatarFallback
              style={{
                background: isDarkMode
                  ? "linear-gradient(135deg, #374151 0%, #1f2937 100%)"
                  : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: isDarkMode ? "#fbbf24" : "#FFFFFF",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="fixed top-16 right-4 z-50 w-[320px] max-w-full p-0 shadow-2xl"
        style={{
          background: isDarkMode ? "#000000" : "#FFFFFF",
          border: "3px solid transparent",
          backgroundImage: isDarkMode
            ? "linear-gradient(#000000, #000000), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)"
            : "linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
        side="bottom"
        align="end"
        alignOffset={-10}
        sideOffset={8}
      >
        {/* Profile Header */}
        <div
          className="p-6"
          style={{
            background: isDarkMode ? "#000000" : "#FFFFFF",
            borderBottom: "2px solid",
            borderImage: "linear-gradient(90deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%) 1",
          }}
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-lg truncate"
                style={{
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                {userName}
              </h3>
              <p
                className="text-sm truncate"
                style={{
                  color: isDarkMode ? "#FFD700" : "#666666",
                }}
              >
                {userEmail}
              </p>
              {userPhone && (
                <p
                  className="text-xs mt-1"
                  style={{
                    color: isDarkMode ? "#FFD700" : "#888888",
                  }}
                >
                  {userPhone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center justify-between px-6 py-3 transition-all duration-200"
                style={{
                  background: isDarkMode ? "#000000" : "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.1) 100%)";
                  e.currentTarget.style.borderLeft = "3px solid #FFD700";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#000000" : "#FFFFFF";
                  e.currentTarget.style.borderLeft = "none";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                    }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span
                    className="font-medium"
                    style={{
                      color: isDarkMode ? "#FFD700" : "#000000",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <ChevronRight
                  className="w-4 h-4"
                  style={{
                    color: isDarkMode ? "#FFD700" : "#666666",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div
          className="p-3"
          style={{
            borderTop: "2px solid",
            borderImage: "linear-gradient(90deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%) 1",
          }}
        >
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
