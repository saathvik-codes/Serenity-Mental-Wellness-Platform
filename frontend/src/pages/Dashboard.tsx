import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import WelcomeGreeting from "@/components/WelcomeGreeting";
import VoiceAssistant from "@/components/VoiceAssistant";
import { auth, db } from "@/firebase";
import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit, onSnapshot, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { 
  Brain, 
  Heart, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Sparkles, 
  Target, 
  User,
  Settings,
  LogOut,
  BarChart3,
  Smile,
  Frown,
  Meh,
  Bell,
  CheckCircle,
  Home,
  LineChart,
  BookOpen,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Music
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import MobileBottomNav from "@/components/MobileBottomNav";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type: string;
}

interface Assessment {
  score: number;
  date: string;
  type: string;
  interpretation: string;
}

interface MoodEntry {
  date: string;
  mood: number;
  timestamp: string;
}

interface UserData {
  name: string;
  wellness_score: number;
  streak: number;
  last_login: string;
  assessments_count: number;
  weekly_progress: any[];
  moods: MoodEntry[];
}

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeStoredDateKey = (value?: string | null) => {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return getLocalDateKey(parsedDate);
};

const getNextStreakState = (lastLogin: string | undefined, currentStreak: number | undefined) => {
  const todayKey = getLocalDateKey();
  const lastLoginKey = normalizeStoredDateKey(lastLogin);
  const safeCurrentStreak = Math.max(currentStreak || 0, 0);

  if (!lastLoginKey) {
    return {
      streak: 1,
      shouldUpdateLogin: true,
      todayKey,
    };
  }

  if (lastLoginKey === todayKey) {
    return {
      streak: Math.max(safeCurrentStreak, 1),
      shouldUpdateLogin: false,
      todayKey,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  return {
    streak: lastLoginKey === yesterdayKey ? safeCurrentStreak + 1 : 1,
    shouldUpdateLogin: true,
    todayKey,
  };
};

const NotificationSystem = ({
  notifications,
  onMarkAsRead,
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Card className="premium-panel overflow-hidden rounded-[1.8rem] border border-primary/10 shadow-medium">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-xl">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>
          )}
        </CardTitle>
        <CardDescription>Recent reminders, streak updates, and supportive nudges.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-2 p-4 transition-colors ${
                    notification.read
                      ? "border-transparent bg-muted/20"
                      : "border-primary/50 bg-primary/5"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="mb-2 text-sm leading-6 text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="hidden">
                    {notification.timestamp.toLocaleDateString()} •{" "}
                    {notification.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.timestamp.toLocaleDateString()} |{" "}
                    {notification.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Sidebar = ({ 
  isCollapsed, 
  onToggle,
  currentPath 
}: { 
  isCollapsed: boolean;
  onToggle: () => void;
  currentPath: string;
}) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart3, label: "Assessment Center", path: "/assessment-center" },
    { icon: LineChart, label: "Progress", path: "/progress" },
    { icon: BookOpen, label: "Resources", path: "/resources" },
    { icon: Users, label: "Community", path: "/community" }, // Assuming this is the correct path
    { icon: Award, label: "Achievements", path: "/gamification" },
  ];

  return (
    <div className={cn(
      "relative hidden flex-col border-r border-primary/10 bg-background/80 backdrop-blur-xl transition-all duration-300 lg:flex",
      isCollapsed ? "w-20" : "w-72"
    )}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_70%)]" />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary/10 px-4 py-5">
        <BrandLogo size="sm" showText={!isCollapsed} subtitle={false} />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-9 w-9 rounded-full border border-primary/10 bg-background/70"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "h-12 w-full justify-start rounded-2xl transition-all duration-200",
                  isCollapsed ? "px-3" : "px-4",
                  isActive
                    ? "border border-primary/20 bg-primary/10 shadow-[0_12px_30px_hsl(var(--primary)/0.10)]"
                    : "hover:bg-primary/5"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                {!isCollapsed && (
                  <span className={cn("ml-3", isActive && "font-semibold text-primary")}>
                    {item.label}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-primary/10 p-4">
        <div className={cn(
          "flex items-center space-x-3 rounded-2xl border border-primary/10 bg-background/60 p-3 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
            <User className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">Welcome back</p>
              <p className="truncate text-xs text-muted-foreground">Your wellness space is ready</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasCheckedWelcome, setHasCheckedWelcome] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Calculate wellness score based on assessments
  const calculateWellnessScore = (assessments: Assessment[]): number => {
    if (assessments.length === 0) return 0;
    
    const totalScore = assessments.reduce((sum, assessment) => sum + assessment.score, 0);
    const averageScore = totalScore / assessments.length;
    
    // Convert to percentage (assuming score is out of 100)
    return Math.round(averageScore);
  };

  // Update weekly progress
  const updateWeeklyProgress = (currentProgress: any[]): any[] => {
    const today = getLocalDateKey();
    const currentWeekProgress = currentProgress || [];
    
    // Check if today is already recorded
    if (!currentWeekProgress.includes(today)) {
      return [...currentWeekProgress, today].slice(-7); // Keep only last 7 days
    }
    
    return currentWeekProgress;
  };

  // Check if welcome should be shown - FIXED VERSION
  const shouldShowWelcome = (userData: UserData | null): boolean => {
    if (!userData) return false;
    
    // Check localStorage for today's welcome
    const today = getLocalDateKey();
    const lastWelcomeDate = localStorage.getItem('lastWelcomeDate');
    
    // Show welcome if we haven't shown it today
    if (lastWelcomeDate !== today) {
      localStorage.setItem('lastWelcomeDate', today);
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        // Fetch assessments from subcollection
        const assessmentsSnapshot = await getDocs(collection(db, "users", user.uid, "assessments"));
        const assessmentsList = assessmentsSnapshot.docs.map(doc => doc.data() as Assessment);
        setAssessmentHistory(Array.isArray(assessmentsList) ? assessmentsList : []);

        // Calculate wellness score from assessments
        const wellnessScore = calculateWellnessScore(assessmentsList);

        if (userDoc.exists()) {
          const existingData = userDoc.data();
          const lastLogin = existingData.last_login;
          const streakState = getNextStreakState(lastLogin, existingData.streak);
          
          // Update weekly progress
          const weeklyProgress = streakState.shouldUpdateLogin
            ? updateWeeklyProgress(existingData.weekly_progress)
            : (existingData.weekly_progress || []);
          
          const updatedUserData: UserData = {
            name: existingData.name || user.displayName || "User",
            wellness_score: wellnessScore,
            streak: streakState.streak,
            last_login: streakState.shouldUpdateLogin
              ? streakState.todayKey
              : normalizeStoredDateKey(lastLogin) || streakState.todayKey,
            assessments_count: assessmentsList.length,
            weekly_progress: weeklyProgress,
            moods: existingData.moods || [],
          };

          const shouldPersistUserData =
            streakState.shouldUpdateLogin ||
            existingData.name !== updatedUserData.name ||
            existingData.wellness_score !== updatedUserData.wellness_score ||
            existingData.assessments_count !== updatedUserData.assessments_count;

          if (shouldPersistUserData) {
            await setDoc(
              doc(db, "users", user.uid),
              updatedUserData,
              { merge: true }
            );
          }

          setUserData(updatedUserData);

          // Show welcome greeting based on fixed logic
          if (!hasCheckedWelcome) {
            const shouldShow = shouldShowWelcome(updatedUserData);
            setShowWelcome(shouldShow);
            setHasCheckedWelcome(true);
          }

          // Show streak celebration if applicable
          if (
            streakState.shouldUpdateLogin &&
            streakState.streak > (existingData.streak || 0) &&
            streakState.streak > 1
          ) {
            toast({
              title: "Streak Updated!",
              description: `You're on a ${streakState.streak} day streak! Keep it up!`,
            });
          }
        } else {
          // New user, create initial data
          const initialUserData: UserData = {
            name: user.displayName || "User",
            wellness_score: wellnessScore,
            streak: 1,
            last_login: getLocalDateKey(),
            assessments_count: assessmentsList.length,
            weekly_progress: [getLocalDateKey()],
            moods: [],
          };

          await setDoc(doc(db, "users", user.uid), initialUserData);
          setUserData(initialUserData);

          // Show welcome for new users
          if (!hasCheckedWelcome) {
            setShowWelcome(true);
            setHasCheckedWelcome(true);
            localStorage.setItem('lastWelcomeDate', getLocalDateKey());
          }

          toast({
            title: "Welcome to Serenity!",
            description: "Your wellness journey starts now!",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    });

    // Real-time notifications from Firebase
    const user = auth.currentUser;
    if (user) {
      const notificationsRef = collection(db, "users", user.uid, "notifications");
      const notificationsQuery = query(notificationsRef, orderBy("timestamp", "desc"), limit(10));
      
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          message: doc.data().message,
          read: doc.data().read || false,
          timestamp: doc.data().timestamp?.toDate() || new Date(),
          type: doc.data().type || "info",
        }));
        setNotifications(notifs);
      });

      return () => {
        unsubscribe();
        unsubscribeNotifications();
      };
    }

    return () => unsubscribe();
  }, [navigate, toast, hasCheckedWelcome]);

  const handleLogout = async () => {
    await auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "Thank you for using Serenity. See you next time!",
    });
    navigate("/");
  };

  const handleMarkAsRead = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      // Update in Firebase
      const notificationRef = doc(db, "users", user.uid, "notifications", id);
      await updateDoc(notificationRef, { read: true });
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMoodSelection = async (mood: number) => {
    setCurrentMood(mood);
    // Store mood entry in Firestore
    const user = auth.currentUser;
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const today = getLocalDateKey();
      const newMood = {
        date: today,
        mood,
        timestamp: new Date().toISOString(),
      };
      const updatedMoods = [...(userData?.moods || []), newMood];
      await setDoc(
        doc(db, "users", user.uid),
        {
          moods: updatedMoods,
        },
        { merge: true }
      );
      setUserData((prev: any) => ({
        ...prev,
        moods: updatedMoods,
      }));
      toast({
        title: "Mood recorded!",
        description: "Thanks for sharing how you're feeling today.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record mood.",
        variant: "destructive",
      });
    }
  };

  const getMoodIcon = (mood: number) => {
    if (mood <= 2) return <Frown className="w-8 h-8" />;
    if (mood <= 3) return <Meh className="w-8 h-8" />;
    return <Smile className="w-8 h-8" />;
  };

  const getMoodLabel = (mood: number) => {
    const labels = ["Awful", "Bad", "Okay", "Good", "Excellent"];
    return labels[mood - 1] || "Unknown";
  };

  // Recent assessments (if any)
  const recentAssessments = assessmentHistory
    ? assessmentHistory.slice(-3).reverse()
    : [];

  const firstName = userData?.name?.split(" ")[0] || "User";
  const weeklyCheckIns = userData?.weekly_progress?.length || 0;
  const weeklyGoalPercent = Math.min((weeklyCheckIns / 7) * 100, 100);
  const moodEntries = userData?.moods?.length || 0;
  const moodLoggedToday = Boolean(
    userData?.moods?.some((entry) => entry.date === new Date().toISOString().split("T")[0])
  );

  const dashboardStats = [
    {
      title: "Wellness Score",
      icon: Heart,
      value: `${userData?.wellness_score || 0}%`,
      subtitle:
        (userData?.wellness_score || 0) >= 80
          ? "Strong overall rhythm"
          : (userData?.wellness_score || 0) >= 50
            ? "Steady momentum"
            : "A good time to reset gently",
      color: "text-energy",
      progress: userData?.wellness_score || 0,
    },
    {
      title: "Current Streak",
      icon: Target,
      value: `${userData?.streak || 0}`,
      subtitle: "Consecutive active days",
      color: "text-focus",
      progress: Math.min((userData?.streak || 0) * 10, 100),
    },
    {
      title: "Assessments",
      icon: Brain,
      value: `${assessmentHistory.length}`,
      subtitle: assessmentHistory.length > 0 ? "Completed reflections" : "Your first check-in is waiting",
      color: "text-primary",
      progress: Math.min(assessmentHistory.length * 20, 100),
    },
    {
      title: "Mood Entries",
      icon: Calendar,
      value: `${moodEntries}`,
      subtitle: moodLoggedToday ? "Mood logged today" : "No mood log yet today",
      color: "text-wellness",
      progress: Math.min(moodEntries * 10, 100),
    },
  ] as const;

  const quickActions = [
    {
      title: "Mood Tracker",
      description: "Log how today feels in under a minute.",
      icon: Heart,
      path: "/mood-tracker",
      iconColor: "text-energy",
      accent: "from-energy/18 via-energy/8 to-transparent",
    },
    {
      title: "Mindfulness",
      description: "Step into a quieter guided session.",
      icon: Sparkles,
      path: "/mindfulness",
      iconColor: "text-wellness",
      accent: "from-wellness/18 via-wellness/8 to-transparent",
    },
    {
      title: "Achievements",
      description: "Review your streaks, levels, and rewards.",
      icon: Target,
      path: "/gamification",
      iconColor: "text-focus",
      accent: "from-focus/18 via-focus/8 to-transparent",
    },
    {
      title: "Assessments",
      description: "Start a deeper check-in when you need clarity.",
      icon: BarChart3,
      path: "/assessment-center",
      iconColor: "text-primary",
      accent: "from-primary/18 via-primary/8 to-transparent",
    },
    {
      title: "Focus Games",
      description: "Reset attention with lighter mental workouts.",
      icon: Target,
      path: "/wellness-games",
      iconColor: "text-green-600",
      accent: "from-green-500/18 via-green-500/8 to-transparent",
    },
    {
      title: "Spotify Wellness",
      description: "Shift the mood with supportive listening.",
      icon: Music,
      path: "/spotify-wellness",
      iconColor: "text-green-500",
      accent: "from-green-500/20 via-green-500/10 to-transparent",
    },
    {
      title: "Need Help?",
      description: "Jump quickly to urgent support options.",
      icon: Heart,
      path: "/emergency-help",
      iconColor: "text-red-500",
      accent: "from-red-500/18 via-red-500/8 to-transparent",
    },
    {
      title: "AI Companion",
      description: "Talk through your next step with guided support.",
      icon: Brain,
      path: "/ai-therapist",
      iconColor: "text-primary",
      accent: "from-secondary/18 via-primary/8 to-transparent",
    },
  ] as const;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[linear-gradient(135deg,hsl(var(--background)),hsl(var(--background)),hsl(var(--primary)/0.05))] pb-16 lg:pb-0">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-secondary/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-wellness/10 blur-3xl" />
      </div>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath={location.pathname}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Welcome Greeting - Shows once per day */}
        {showWelcome && userData && (
          <WelcomeGreeting
            userName={userData.name}
            onDismiss={() => {
              setShowWelcome(false);
            }}
          />
        )}

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
            {/* Legacy Header */}
            <div className="hidden">
              {/* Mobile Header */}
              <div className="lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <BrandLogo size="sm" showText={false} />
                    <div>
                      <h1 className="text-lg font-bold">
                        Hi, <span className="text-primary font-cursive">{userData?.name || "User"}</span>!
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        {userData?.streak > 0 ? `${userData.streak} day streak 🔥` : "Start your journey"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      Welcome back,{" "}
                      <span className="text-primary font-cursive">
                        {userData?.name || "User"}
                      </span>
                      !
                    </h1>
                    <p className="text-muted-foreground font-body">
                      {userData?.streak > 0
                        ? `You're on a ${userData.streak} day streak! Keep it up.`
                        : "Ready to start your wellness journey?"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="premium-panel relative overflow-hidden rounded-[2rem] border border-primary/15 p-5 sm:p-8"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.12),transparent_36%)]" />
                <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-primary">
                        Personal dashboard
                      </Badge>
                      <Badge className="rounded-full border-secondary/20 bg-secondary/10 px-4 py-1.5 text-secondary">
                        {moodLoggedToday ? "Mood checked in today" : "Mood check-in waiting"}
                      </Badge>
                    </div>

                    <h1 className="mt-5 font-display text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
                      Good to see you, <span className="font-cursive text-primary">{firstName}</span>.
                    </h1>
                    <p className="mt-4 max-w-2xl font-body text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                      Track your momentum, revisit recent reflections, and step into the next wellness action without
                      hunting through the interface.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button className="btn-enhanced" onClick={() => navigate("/assessment-center")}>
                        Start an assessment
                      </Button>
                      <Button variant="outline" className="btn-enhanced" onClick={() => navigate("/progress")}>
                        Open progress report
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <ThemeToggle />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full border border-primary/10 bg-background/70"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full border border-primary/10 bg-background/70"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-primary/10 bg-background/65 p-4 backdrop-blur-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">Current streak</div>
                    <div className="mt-3 text-3xl font-semibold text-foreground">{userData?.streak || 0}</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {userData?.streak ? "Consistency is compounding." : "Start a rhythm one day at a time."}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-primary/10 bg-background/65 p-4 backdrop-blur-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">Weekly rhythm</div>
                    <div className="mt-3 text-3xl font-semibold text-foreground">{weeklyCheckIns}/7</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {weeklyGoalPercent >= 70 ? "Your week already has momentum." : "A few small check-ins can shift the week."}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-primary/10 bg-background/65 p-4 backdrop-blur-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">Today</div>
                    <div className="mt-3 text-2xl font-semibold text-foreground">
                      {moodLoggedToday ? "Checked in" : "Needs a reset"}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {recentAssessments.length > 0
                        ? `${recentAssessments.length} recent reflections are ready to review.`
                        : "Your first reflection will appear here once you begin."}
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Stats Grid */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-5 xl:grid-cols-4">
              {dashboardStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <Card className="premium-panel h-full rounded-[1.6rem] border border-primary/10 shadow-medium transition-transform duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 sm:p-5">
                      <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/55 sm:text-sm">
                        {stat.title}
                      </CardTitle>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/8">
                        <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
                      <motion.div className={`text-2xl font-semibold sm:text-3xl ${stat.color}`}>
                        {stat.value}
                      </motion.div>
                      <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">{stat.subtitle}</p>
                      <Progress value={stat.progress} className="mt-4 h-1.5" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions - Enhanced */}
                <Card className="premium-panel rounded-[1.8rem] border border-primary/10 shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-2xl">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      High-visibility shortcuts to the parts of Serenity people return to most often.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;

                        return (
                          <motion.button
                            key={action.title}
                            type="button"
                            onClick={() => navigate(action.path)}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: index * 0.04 }}
                            className={`group relative overflow-hidden rounded-[1.5rem] border border-primary/10 bg-background/80 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_40px_hsl(var(--primary)/0.10)]`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} />
                            <div className="relative z-10">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-background/90 ${action.iconColor}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{action.title}</h3>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Mood Check */}
                <Card className="premium-panel rounded-[1.8rem] border border-primary/10 shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-2xl">
                      <Heart className="w-5 h-5 text-energy" />
                      Daily Mood Check
                    </CardTitle>
                    <CardDescription>How are you feeling today?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 grid grid-cols-5 gap-3 sm:gap-4">
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <button
                          key={mood}
                          onClick={() => handleMoodSelection(mood)}
                          className={`rounded-[1.3rem] border p-4 transition-all duration-300 hover:-translate-y-1 ${
                            currentMood === mood
                              ? "border-primary bg-primary/10 shadow-glow"
                              : "border-border/70 bg-background/75 hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div
                              className={
                                mood <= 2
                                  ? "text-destructive"
                                  : mood <= 3
                                  ? "text-energy"
                                  : "text-wellness"
                              }
                            >
                              {getMoodIcon(mood)}
                            </div>
                            <span className="text-xs font-medium">
                              {getMoodLabel(mood)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {currentMood && (
                      <div className="rounded-[1.3rem] bg-primary/5 p-4">
                        <p className="text-sm text-muted-foreground">
                          Thanks for sharing! You selected:{" "}
                          <strong>{getMoodLabel(currentMood)}</strong>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>


                {/* Recent Assessments */}
                <Card className="premium-panel rounded-[1.8rem] border border-primary/10 shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-2xl">
                      <Activity className="w-5 h-5 text-focus" />
                      Recent Assessments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentAssessments.length === 0 ? (
                      <div className="py-10 text-center">
                        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No assessments completed yet
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => navigate("/assessment-center")}
                        >
                          Take Your First Assessment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentAssessments.map((assessment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-[1.3rem] border border-border/70 bg-background/70 p-4"
                          >
                            <div>
                              <h4 className="font-medium">
                                {assessment.type?.toUpperCase() || "Assessment"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(assessment.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                Score: {assessment.score}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {assessment.interpretation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <NotificationSystem
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                />

                {/* Progress Overview */}
                <Card className="premium-panel rounded-[1.8rem] border border-primary/10 shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-xl">
                      <TrendingUp className="w-5 h-5 text-wellness" />
                      Progress Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Weekly Goal</span>
                        <span className="text-sm text-muted-foreground">
                          {weeklyCheckIns}/7 days
                        </span>
                      </div>
                      <Progress value={weeklyGoalPercent} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Wellness Score</span>
                        <span className="text-sm text-muted-foreground">
                          {userData?.wellness_score || 0}%
                        </span>
                      </div>
                      <Progress
                        value={userData?.wellness_score || 0}
                        className="h-2"
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full btn-enhanced"
                        onClick={() => navigate("/progress")}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        View Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <VoiceAssistant />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Dashboard;
