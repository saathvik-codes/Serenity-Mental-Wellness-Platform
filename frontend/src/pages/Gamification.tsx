import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { doc, updateDoc, increment, onSnapshot, arrayUnion } from "firebase/firestore";
import { 
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  TrendingUp,
  Heart,
  Brain,
  Flame,
  Crown,
  Shield,
  Sparkles,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Gift,
  Calendar,
  Users,
  BookOpen,
  Palette,
  Rocket
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: "streak" | "assessment" | "mindfulness" | "community" | "special";
  requirement: number;
  xpReward: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  progress: number;
  target: number;
  xpReward: number;
  icon: any;
  expiresAt: Date;
  completed: boolean;
}

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  rank: string;
  unlockedAchievements: string[];
  completedChallenges: string[];
}

const achievementsList: Achievement[] = [
  {
    id: "first-step",
    title: "First Step",
    description: "Complete your first assessment",
    icon: Star,
    category: "assessment",
    requirement: 1,
    xpReward: 50,
    unlocked: false,
    rarity: "common"
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    category: "streak",
    requirement: 7,
    xpReward: 200,
    unlocked: false,
    rarity: "rare"
  },
  {
    id: "mindful-master",
    title: "Mindful Master",
    description: "Complete 50 mindfulness sessions",
    icon: Brain,
    category: "mindfulness",
    requirement: 50,
    xpReward: 500,
    unlocked: false,
    rarity: "epic"
  },
  {
    id: "wellness-champion",
    title: "Wellness Champion",
    description: "Reach wellness score of 90%",
    icon: Trophy,
    category: "special",
    requirement: 90,
    xpReward: 1000,
    unlocked: false,
    rarity: "legendary"
  },
  {
    id: "community-helper",
    title: "Community Helper",
    description: "Help 10 community members",
    icon: Heart,
    category: "community",
    requirement: 10,
    xpReward: 300,
    unlocked: false,
    rarity: "rare"
  },
  {
    id: "assessment-ace",
    title: "Assessment Ace",
    description: "Complete 25 assessments",
    icon: Target,
    category: "assessment",
    requirement: 25,
    xpReward: 400,
    unlocked: false,
    rarity: "epic"
  },
  {
    id: "month-master",
    title: "Month Master",
    description: "Maintain a 30-day streak",
    icon: Crown,
    category: "streak",
    requirement: 30,
    xpReward: 1500,
    unlocked: false,
    rarity: "legendary"
  },
  {
    id: "zen-seeker",
    title: "Zen Seeker",
    description: "Complete 100 hours of mindfulness",
    icon: Sparkles,
    category: "mindfulness",
    requirement: 6000,
    xpReward: 2000,
    unlocked: false,
    rarity: "legendary"
  }
];

const dailyChallenges: Challenge[] = [
  {
    id: "daily-mood",
    title: "Daily Mood Check",
    description: "Log your mood for today",
    type: "daily",
    progress: 0,
    target: 1,
    xpReward: 25,
    icon: Heart,
    expiresAt: new Date(new Date().setHours(23, 59, 59)),
    completed: false
  },
  {
    id: "daily-mindfulness",
    title: "Mindful Moment",
    description: "Complete a 5-minute mindfulness session",
    type: "daily",
    progress: 0,
    target: 1,
    xpReward: 30,
    icon: Brain,
    expiresAt: new Date(new Date().setHours(23, 59, 59)),
    completed: false
  },
  {
    id: "daily-gratitude",
    title: "Gratitude Practice",
    description: "Write 3 things you're grateful for",
    type: "daily",
    progress: 0,
    target: 3,
    xpReward: 20,
    icon: Sparkles,
    expiresAt: new Date(new Date().setHours(23, 59, 59)),
    completed: false
  }
];

const weeklyChallenges: Challenge[] = [
  {
    id: "weekly-assessments",
    title: "Weekly Wellness Check",
    description: "Complete 3 assessments this week",
    type: "weekly",
    progress: 0,
    target: 3,
    xpReward: 150,
    icon: Target,
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false
  },
  {
    id: "weekly-mindfulness",
    title: "Mindfulness Marathon",
    description: "Complete 60 minutes of mindfulness",
    type: "weekly",
    progress: 0,
    target: 60,
    xpReward: 200,
    icon: Calendar,
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false
  },
  {
    id: "weekly-community",
    title: "Community Contributor",
    description: "Engage with community 5 times",
    type: "weekly",
    progress: 0,
    target: 5,
    xpReward: 100,
    icon: Users,
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    completed: false
  }
];

const levelRewards = [
  { level: 5, title: "New App Icon", description: "Unlock a new exclusive app icon to customize your home screen.", icon: Sparkles },
  { level: 10, title: "Mindful Master Theme", description: "Access a new calming theme for the entire application.", icon: Palette },
  { level: 20, title: "Early Feature Access", description: "Get a sneak peek at new features before anyone else.", icon: Rocket },
  { level: 30, title: "Premium Meditation Pack", description: "Unlock a pack of premium guided meditation sessions.", icon: Brain },
  { level: 50, title: "Legendary Profile Badge", description: "Display a prestigious 'Legendary' badge on your profile.", icon: Crown },
];

const RewardItem = ({
  reward,
  userLevel,
  isClaimed,
  onClaim,
  isClaiming,
}: {
  reward: typeof levelRewards[0];
  userLevel: number;
  isClaimed: boolean;
  onClaim: (level: number) => void;
  isClaiming: boolean;
}) => {
  const isUnlocked = userLevel >= reward.level;
  const Icon = reward.icon;
  return (
    <div className={cn("flex items-center gap-4 rounded-[1.4rem] border p-4", isUnlocked ? "border-primary/30 bg-primary/5" : "border-border bg-muted/50 opacity-60")}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", isUnlocked ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground")}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold">{reward.title}</p>
        <p className="text-sm text-muted-foreground">{reward.description}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Lvl</p>
        <p className="font-bold text-lg">{reward.level}</p>
      </div>
      {isUnlocked ? (
        <Button
          size="sm"
          variant={isClaimed ? "outline" : "default"}
          className="rounded-full"
          disabled={isClaimed || isClaiming}
          onClick={() => onClaim(reward.level)}
        >
          {isClaimed ? "Claimed" : "Claim reward"}
        </Button>
      ) : (
        <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      )}
    </div>
  );
};

const RewardsDialog = ({
  open,
  onOpenChange,
  userLevel,
  claimedRewards,
  onClaimReward,
  claimingRewardLevel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userLevel: number;
  claimedRewards: number[];
  onClaimReward: (level: number) => void;
  claimingRewardLevel: number | null;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="border-primary/15 bg-background/95 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle>Level Rewards</DialogTitle>
        <DialogDescription>Here are the rewards you can unlock as you progress on your wellness journey.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        {levelRewards.map((reward) => (
          <RewardItem
            key={reward.level}
            reward={reward}
            userLevel={userLevel}
            isClaimed={claimedRewards.includes(reward.level)}
            onClaim={onClaimReward}
            isClaiming={claimingRewardLevel === reward.level}
          />
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

const Gamification = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    rank: "Beginner",
    unlockedAchievements: [],
    completedChallenges: []
  });
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsList);
  const [challenges, setChallenges] = useState<Challenge[]>([...dailyChallenges, ...weeklyChallenges]);
  const [showRewards, setShowRewards] = useState(false);
  const [user, setUser] = useState<any>(null); // Store current user object
  const [userDBData, setUserDBData] = useState<any>(null);
  const [claimingRewardLevel, setClaimingRewardLevel] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user); // Store the user object
      
      // Use onSnapshot for real-time updates
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribeUser = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserDBData(data); // Store original data
          
          // Calculate level from XP
          const totalXP = data.xp || 0;
          const level = Math.floor(totalXP / 100) + 1;
          const xpInCurrentLevel = totalXP % 100;
          const xpToNextLevel = 100;
          
          // Determine rank
          let rank = "Beginner";
          if (level >= 50) rank = "Legendary";
          else if (level >= 30) rank = "Master";
          else if (level >= 20) rank = "Expert";
          else if (level >= 10) rank = "Advanced";
          else if (level >= 5) rank = "Intermediate";

          // Check for newly unlocked rewards and achievements
          checkForUnlocks(level, data);

          setUserStats({
            level,
            xp: xpInCurrentLevel,
            xpToNextLevel,
            totalXP,
            rank,
            unlockedAchievements: data.unlockedAchievements || [],
            completedChallenges: data.completedChallenges || []
          });

          // Update achievements unlock status
          const updatedAchievements = achievementsList.map(achievement => ({
            ...achievement,
            unlocked: (data.unlockedAchievements || []).includes(achievement.id)
          }));
          setAchievements(updatedAchievements);

          // Update challenges progress
          const updatedChallenges = [...dailyChallenges, ...weeklyChallenges].map(challenge => ({
            ...challenge,
            completed: (data.completedChallenges || []).includes(challenge.id),
            progress: calculateChallengeProgress(challenge, data)
          }));
          setChallenges(updatedChallenges);
        }
      }, (error) => {
        console.error("Error loading user stats:", error);
      });

      return () => unsubscribeUser();
    });

    return () => unsubscribe();
  }, [navigate]); // Removed dependencies that might cause re-runs

  const checkForUnlocks = async (currentLevel: number, currentData: any) => {
    if (!user) return;

    const unlockedRewards = currentData.unlockedRewards || {};
    const currentUnlockedAchievements = currentData.unlockedAchievements || [];
    const updates: any = {};
    let xpGainedFromUnlocks = 0;
    const newlyUnlockedAchievementIds: string[] = [];

    // 1. Check for Level Rewards
    levelRewards.forEach(reward => {
      if (currentLevel >= reward.level && !unlockedRewards[reward.level]) {
        unlockedRewards[reward.level] = true;
        updates['unlockedRewards'] = unlockedRewards; // Update the whole object

        // Add specific flags for each reward
        if (reward.title.includes("New App Icon")) {
          updates['unlocked_app_icons'] = [...(currentData.unlocked_app_icons || []), 'neon'];
        }
        if (reward.title.includes("Theme")) {
          updates['unlocked_themes'] = [...(currentData.unlocked_themes || []), 'mindful_master'];
        }
        if (reward.title.includes("Early Feature Access")) {
          updates['earlyAccess'] = true;
        }
        if (reward.title.includes("Premium Meditation")) {
          updates['premiumMeditationUnlocked'] = true;
        }
        if (reward.title.includes("Legendary Profile Badge")) {
          updates['legendaryBadge'] = true;
        }
        
        toast({
          title: `🎉 Reward Unlocked: ${reward.title}!`,
          description: `You've reached Level ${reward.level}. ${reward.description}`,
          duration: 5000,
        });
      }
    });

    // 2. Check for Achievements
    achievementsList.forEach(achievement => {
      if (currentUnlockedAchievements.includes(achievement.id)) return; // Already unlocked

      let unlockedThisAchievement = false;

      switch (achievement.category) {
        case "assessment":
          if (currentData.assessments_count >= achievement.requirement) unlockedThisAchievement = true;
          break;
        case "streak":
          if (currentData.streak >= achievement.requirement) unlockedThisAchievement = true;
          break;
        case "mindfulness":
          if (currentData.totalMindfulnessMinutes >= achievement.requirement) unlockedThisAchievement = true;
          break;
        case "special": // For Wellness Champion
          if (achievement.id === "wellness-champion" && currentData.wellness_score >= achievement.requirement) unlockedThisAchievement = true;
          break;
        case "community": // Community Helper - requires community interaction count
          // This achievement will remain locked until community interaction tracking is implemented
          break;
      }

      if (unlockedThisAchievement) {
        newlyUnlockedAchievementIds.push(achievement.id);
        xpGainedFromUnlocks += achievement.xpReward;
        toast({
          title: `🏆 Achievement Unlocked: ${achievement.title}!`,
          description: achievement.description,
          duration: 5000,
        });
      }
    });

    if (newlyUnlockedAchievementIds.length > 0) {
      updates['unlockedAchievements'] = [...currentUnlockedAchievements, ...newlyUnlockedAchievementIds];
      updates['xp'] = increment(xpGainedFromUnlocks);
      updates['totalXP'] = increment(xpGainedFromUnlocks);
    }

    // Only update if there are actual changes to be made
    if (Object.keys(updates).length > 0) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          ...updates
        });
      } catch (error) {
        console.error("Error saving new rewards:", error);
      }
    }
  };

  const calculateChallengeProgress = (challenge: Challenge, userData: any): number => {
    switch (challenge.id) {
      case "daily-mood":
        return userData.moods?.some((m: any) => 
          new Date(m.date).toDateString() === new Date().toDateString()
        ) ? 1 : 0;
      case "daily-mindfulness":
        return userData.totalMindfulnessMinutes >= 5 ? 1 : 0;
      case "weekly-assessments":
        return userData.assessments_count || 0;
      case "weekly-mindfulness":
        return userData.totalMindfulnessMinutes || 0;
      default:
        return 0;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-500 border-yellow-500";
      case "epic": return "text-purple-500 border-purple-500";
      case "rare": return "text-blue-500 border-blue-500";
      default: return "text-gray-500 border-gray-500";
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-yellow-500/10";
      case "epic": return "bg-purple-500/10";
      case "rare": return "bg-blue-500/10";
      default: return "bg-gray-500/10";
    }
  };

  const formatTimeRemaining = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleClaimReward = async (level: number) => {
    if (!user) return;
    if ((userDBData?.claimedRewards || []).includes(level)) return;

    try {
      setClaimingRewardLevel(level);
      await updateDoc(doc(db, "users", user.uid), {
        claimedRewards: arrayUnion(level),
      });
      toast({
        title: "Reward claimed",
        description: `Level ${level} reward has been added to your claimed rewards.`,
      });
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Claim failed",
        description: "Unable to claim this reward right now.",
        variant: "destructive",
      });
    } finally {
      setClaimingRewardLevel(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,hsl(var(--background)),hsl(var(--background)),hsl(var(--primary)/0.06))] pb-16 lg:pb-0">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-energy/10 blur-3xl" />
      </div>
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="premium-panel mb-8 overflow-hidden rounded-[2rem] border border-primary/15 p-5 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="flex items-start space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="rounded-full border-primary/15 bg-background/70"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Badge className="mb-3 rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-primary">
                Level system
              </Badge>
              <h1 className="font-display text-3xl font-semibold flex items-center gap-3 sm:text-4xl lg:text-5xl">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                Achievements & Challenges
              </h1>
              <p className="mt-3 max-w-2xl font-body text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Track levels, unlock achievements, and claim milestone rewards in a cleaner progression space.
              </p>
            </div>
          </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-primary/10 bg-background/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">Current level</div>
                <div className="mt-3 text-3xl font-semibold text-foreground">{userStats.level}</div>
                <p className="mt-2 text-sm text-muted-foreground">{userStats.rank} rank</p>
              </div>
              <div className="rounded-[1.5rem] border border-primary/10 bg-background/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">Claimed rewards</div>
                <div className="mt-3 text-3xl font-semibold text-foreground">{(userDBData?.claimedRewards || []).length}</div>
                <p className="mt-2 text-sm text-muted-foreground">Reward milestones you have already collected.</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats Card */}
        <Card className="premium-panel mb-8 rounded-[1.8rem] border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 shadow-medium">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-3xl font-bold text-primary">{userStats.level}</p>
                <Badge className="mt-2 bg-gradient-primary text-white">
                  {userStats.rank}
                </Badge>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Experience Points</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.xp} / {userStats.xpToNextLevel} XP
                    </span>
                  </div>
                  <Progress value={(userStats.xp / userStats.xpToNextLevel) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {userStats.xpToNextLevel - userStats.xp} XP until level {userStats.level + 1}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-lg font-bold">{userStats.unlockedAchievements.length}</p>
                      <p className="text-xs text-muted-foreground">Achievements</p>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <Target className="w-5 h-5 mx-auto mb-1 text-wellness" />
                      <p className="text-lg font-bold">{userStats.completedChallenges.length}</p>
                      <p className="text-xs text-muted-foreground">Challenges</p>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-energy" />
                      <p className="text-lg font-bold">{userStats.totalXP}</p>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Gift className="w-16 h-16 mx-auto mb-3 text-primary/50" />
                <p className="text-sm text-muted-foreground mb-2">Next Reward</p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => setShowRewards(true)}>
                  <Shield className="w-4 h-4 mr-2" />
                  View Rewards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <RewardsDialog
          open={showRewards}
          onOpenChange={setShowRewards}
          userLevel={userStats.level}
          claimedRewards={userDBData?.claimedRewards || []}
          onClaimReward={handleClaimReward}
          claimingRewardLevel={claimingRewardLevel}
        />

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 rounded-[1.4rem] bg-background/80">
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            {/* Daily Challenges */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Daily Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {challenges.filter(c => c.type === "daily").map(challenge => {
                  const Icon = challenge.icon;
                  const progressPercent = (challenge.progress / challenge.target) * 100;

                  return (
                    <Card 
                      key={challenge.id}
                      className={cn(
                        "premium-panel rounded-[1.6rem] border border-primary/10 shadow-medium",
                        challenge.completed && "bg-primary/5 border-primary/30"
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              challenge.completed ? "bg-primary" : "bg-primary/10"
                            )}>
                              <Icon className={cn(
                                "w-5 h-5",
                                challenge.completed ? "text-white" : "text-primary"
                              )} />
                            </div>
                            <div>
                              <CardTitle className="text-base">{challenge.title}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {challenge.description}
                              </CardDescription>
                            </div>
                          </div>
                          {challenge.completed && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="text-muted-foreground">
                                {challenge.progress}/{challenge.target}
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              +{challenge.xpReward} XP
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeRemaining(challenge.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Weekly Challenges */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-wellness" />
                Weekly Challenges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {challenges.filter(c => c.type === "weekly").map(challenge => {
                  const Icon = challenge.icon;
                  const progressPercent = (challenge.progress / challenge.target) * 100;

                  return (
                    <Card 
                      key={challenge.id}
                      className={cn(
                        "premium-panel rounded-[1.6rem] border border-primary/10 shadow-medium",
                        challenge.completed && "bg-wellness/5 border-wellness/30"
                      )}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              challenge.completed ? "bg-wellness" : "bg-wellness/10"
                            )}>
                              <Icon className={cn(
                                "w-5 h-5",
                                challenge.completed ? "text-white" : "text-wellness"
                              )} />
                            </div>
                            <div>
                              <CardTitle className="text-base">{challenge.title}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {challenge.description}
                              </CardDescription>
                            </div>
                          </div>
                          {challenge.completed && (
                            <CheckCircle2 className="w-5 h-5 text-wellness" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="text-muted-foreground">
                                {challenge.progress}/{challenge.target}
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              +{challenge.xpReward} XP
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeRemaining(challenge.expiresAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => {
                const Icon = achievement.icon;
                
                return (
                  <Card 
                    key={achievement.id}
                    className={cn(
                      "premium-panel rounded-[1.6rem] border-2 shadow-medium transition-all",
                      achievement.unlocked 
                        ? `${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}`
                        : "border-muted opacity-60"
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            achievement.unlocked 
                              ? `bg-gradient-primary shadow-glow`
                              : "bg-muted"
                          )}>
                            {achievement.unlocked ? (
                              <Icon className="w-6 h-6 text-white" />
                            ) : (
                              <Lock className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {achievement.title}
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs", getRarityColor(achievement.rarity))}
                              >
                                {achievement.rarity}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {achievement.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {achievement.xpReward} XP
                        </Badge>
                        {achievement.unlocked && achievement.unlockedDate && (
                          <span className="text-xs text-muted-foreground">
                            Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default Gamification;
