import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Bell,
  FileEdit,
  Share2,
  Check,
  CheckCheck,
  X,
  FilePlus,
  FolderOpen,
  Save,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  formatNotificationTime,
  type NotificationData,
} from "../utils/notificationSystem";

interface NotificationCenterProps {
  userEmail: string;
  isDarkMode: boolean;
}

export function NotificationCenter({
  userEmail,
  isDarkMode,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load notifications on mount and when popup opens
  useEffect(() => {
    loadNotifications();
  }, [userEmail, open]);

  // Set button color with !important
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.setProperty('color', isDarkMode ? '#FFFFFF' : '#FFD700', 'important');
    }
  }, [isDarkMode]);

  const loadNotifications = () => {
    const notifs = getNotifications(userEmail);
    setNotifications(notifs);
    setUnreadCount(getUnreadCount(userEmail));
  };

  const getNotificationIcon = (type: NotificationData['type']) => {
    const iconClass = "w-5 h-5 text-white";
    switch (type) {
      case "create":
        return <FilePlus className={iconClass} />;
      case "edit":
        return <FileEdit className={iconClass} />;
      case "open":
        return <FolderOpen className={iconClass} />;
      case "save":
        return <Save className={iconClass} />;
      case "share":
        return <Share2 className={iconClass} />;
      case "delete":
        return <Trash2 className={iconClass} />;
      case "import":
        return <Upload className={iconClass} />;
      case "export":
        return <Download className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.read) {
      markAsRead(userEmail, notification.id);
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(userEmail);
    loadNotifications();
  };

  const handleDeleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(userEmail, notificationId);
    loadNotifications();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-12 h-12 rounded-full transition-all duration-300 border-2"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
              : 'linear-gradient(135deg, #FFFEF5 0%, #FFF9E6 100%)',
            borderColor: isDarkMode ? '#4b5563' : '#FFD700',
            zIndex: 100,
          }}
        >
          <Bell 
            className="w-6 h-6" 
            style={{ 
              color: isDarkMode ? '#fbbf24' : '#000000',
              stroke: isDarkMode ? '#fbbf24' : '#000000',
            }} 
          />
          {unreadCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-lg animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                zIndex: 101,
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="fixed top-16 right-6 z-50 w-[360px] max-w-full p-0 shadow-2xl"
        style={{
          background: isDarkMode ? '#000000' : '#FFFFFF',
          border: '3px solid transparent',
          backgroundImage: isDarkMode 
            ? 'linear-gradient(#000000, #000000), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)'
            : 'linear-gradient(#FFFFFF, #FFFFFF), linear-gradient(135deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
        side="bottom"
        align="end"
        alignOffset={-10}
        sideOffset={8}
      >
        {/* Header */}
        <div 
          className="p-4"
          style={{
            background: isDarkMode ? '#000000' : '#FFFFFF',
            borderBottom: '2px solid',
            borderImage: 'linear-gradient(90deg, #FFFFFF 0%, #FFD700 50%, #FFFFFF 100%) 1',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="p-2 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                }}
              >
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 
                className="font-bold text-lg"
                style={{
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                  textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
                }}
              >
                Notifications
              </h3>
            </div>
            {unreadCount > 0 && (
              <Button
                ref={buttonRef}
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold"
                style={{
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.setProperty('background', 'rgba(255, 215, 0, 0.2)', 'important');
                  e.currentTarget.style.setProperty('color', '#FFD700', 'important');
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) (icon as HTMLElement).style.setProperty('color', '#FFD700', 'important');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.setProperty('background', 'transparent', 'important');
                  e.currentTarget.style.setProperty('color', isDarkMode ? '#FFFFFF' : '#FFD700', 'important');
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) (icon as HTMLElement).style.setProperty('color', isDarkMode ? '#FFFFFF' : '#FFD700', 'important');
                }}
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                className="text-white font-semibold shadow-md"
                style={{
                  background: 'linear-gradient(to right, #FFD700, #FFA500)',
                }}
              >
                {unreadCount} new
              </Badge>
              <p className="text-xs" style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}>
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        <div 
          className="overflow-y-scroll overflow-x-hidden" 
          style={{ 
            background: isDarkMode ? '#000000' : '#FFFFFF',
            maxHeight: '450px',
            minHeight: '200px',
            overscrollBehavior: 'contain',
          }}
          onWheel={(e) => {
            // Avoid calling preventDefault on wheel; passive listeners can trigger errors.
            // Use overscrollBehavior CSS and stop propagation to reduce scroll chaining.
            e.stopPropagation();
          }}
        >
          {notifications.length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center py-16 text-center px-4"
              style={{
                background: isDarkMode ? '#000000' : '#FFFFFF',
              }}
            >
              <div 
                className="p-6 rounded-full mb-4"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  boxShadow: '0 8px 16px rgba(255, 215, 0, 0.3)',
                }}
              >
                <Bell className="w-12 h-12 text-white" />
              </div>
              <p className="text-base font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
                No notifications
              </p>
              <p className="text-sm mt-2" style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}>
                You're all caught up! 🎉
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="p-4 cursor-pointer relative transition-all duration-200"
                  style={{
                    background: !notification.read
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.1) 100%)'
                      : (isDarkMode ? '#000000' : '#FFFFFF'),
                    borderBottom: index < notifications.length - 1 ? '1px solid rgba(255, 215, 0, 0.2)' : 'none',
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 215, 0, 0.25) 100%)';
                    e.currentTarget.style.borderLeft = '3px solid #FFD700';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = !notification.read
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 165, 0, 0.1) 100%)'
                      : (isDarkMode ? '#000000' : '#FFFFFF');
                    e.currentTarget.style.borderLeft = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2.5 rounded-lg shadow-md flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        boxShadow: '0 4px 8px rgba(255, 215, 0, 0.3)',
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p 
                          className="font-semibold text-sm"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div 
                            className="w-2.5 h-2.5 rounded-full mt-1 animate-pulse shadow-md"
                            style={{
                              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            }}
                          />
                        )}
                      </div>
                      <p 
                        className="text-sm line-clamp-2"
                        style={{ color: isDarkMode ? '#CCCCCC' : '#666666' }}
                      >
                        {notification.message}
                      </p>
                      {notification.sheetTitle && (
                        <Badge 
                          className="mt-2 text-xs"
                          variant="secondary"
                          style={{
                            background: 'rgba(255, 215, 0, 0.2)',
                            color: '#FFD700',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                          }}
                        >
                          {notification.sheetTitle}
                        </Badge>
                      )}
                      <p 
                        className="text-xs mt-2 font-medium"
                        style={{ color: isDarkMode ? '#999999' : '#888888' }}
                      >
                        {formatNotificationTime(notification.timestamp)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
                      style={{ color: '#FFD700' }}
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#FFD700';
                      }}
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}