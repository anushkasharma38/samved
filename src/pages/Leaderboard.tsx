import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Search,
  ChevronRight,
  User as UserIcon,
  Crown,
  Star
} from 'lucide-react';
import AppLayout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { blink } from '@/lib/blink';
import { cn } from '@/lib/utils';
import { useBlinkAuth } from '@blinkdotnew/react';

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('city');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useBlinkAuth();

  useEffect(() => {
    async function fetchLeaders() {
      setLoading(true);
      try {
        const data = await blink.db.usersStats.list({
          orderBy: { points: 'desc' },
          limit: 10
        });
        setLeaders(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, [activeTab]);

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Wall of Heroes</h1>
          <p className="text-muted-foreground">Recognizing citizens who go the extra mile for a safer city.</p>
        </div>

        <Tabs defaultValue="city" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <TabsList className="bg-secondary/50 p-1 h-11 rounded-xl">
              <TabsTrigger value="city" className="rounded-lg px-6 h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm">City-wide</TabsTrigger>
              <TabsTrigger value="ward" className="rounded-lg px-6 h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm">My Ward</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-lg px-6 h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm">Monthly</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Find citizen..." className="pl-10 h-10 rounded-xl" />
            </div>
          </div>
        </Tabs>

        {/* Top 3 Podiums */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topThree.length > 0 && (
            <>
              {/* 2nd Place */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="order-2 md:order-1 flex flex-col items-center justify-end"
              >
                <div className="relative mb-4">
                  <Avatar className="w-20 h-20 border-4 border-slate-300">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1]?.userId}`} />
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-800 shadow-lg">2</div>
                </div>
                <Card className="w-full text-center bg-card/50 backdrop-blur border-slate-200">
                  <CardContent className="pt-6">
                    <h3 className="font-bold truncate">{topThree[1]?.displayName || 'Citizen'}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{topThree[1]?.ward || 'East Ward'}</p>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">{topThree[1]?.points || 0} pts</Badge>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 1st Place */}
              <motion.div 
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                className="order-1 md:order-2 flex flex-col items-center justify-end"
              >
                <div className="relative mb-6">
                  <Crown className="w-10 h-10 text-yellow-500 absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce" />
                  <Avatar className="w-32 h-32 border-4 border-yellow-500 ring-4 ring-yellow-500/20 shadow-2xl">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0]?.userId}`} />
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-yellow-900 shadow-lg ring-4 ring-background">1</div>
                </div>
                <Card className="w-full text-center bg-gradient-to-b from-yellow-50 to-white border-yellow-200 shadow-xl shadow-yellow-500/10">
                  <CardContent className="pt-8 pb-6">
                    <h3 className="text-xl font-bold truncate">{topThree[0]?.displayName || 'Top Contributor'}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{topThree[0]?.ward || 'Central Ward'}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500 text-yellow-900 font-black text-lg">
                       <Star className="w-5 h-5 fill-current" />
                       {topThree[0]?.points || 0} PTS
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 3rd Place */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-3 flex flex-col items-center justify-end"
              >
                <div className="relative mb-4">
                  <Avatar className="w-20 h-20 border-4 border-orange-400">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2]?.userId}`} />
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center font-bold text-orange-900 shadow-lg">3</div>
                </div>
                <Card className="w-full text-center bg-card/50 backdrop-blur border-orange-200">
                  <CardContent className="pt-6">
                    <h3 className="font-bold truncate">{topThree[2]?.displayName || 'Citizen'}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{topThree[2]?.ward || 'West Ward'}</p>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">{topThree[2]?.points || 0} pts</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Other Rankings List */}
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur">
          <CardContent className="p-0">
            {loading ? (
                <div className="p-8 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-secondary animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="divide-y">
                    {others.map((leader, i) => {
                        const isCurrentUser = leader.userId === user?.id;
                        return (
                            <div 
                                key={leader.id} 
                                className={cn(
                                    "flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors",
                                    isCurrentUser && "bg-accent/5 ring-1 ring-inset ring-accent/20"
                                )}
                            >
                                <span className="w-8 text-center font-bold text-muted-foreground">#{i + 4}</span>
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.userId}`} />
                                    <AvatarFallback><UserIcon className="w-5 h-5" /></AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">
                                        {leader.displayName || 'Anonymous Citizen'}
                                        {isCurrentUser && <span className="ml-2 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest font-black">You</span>}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{leader.ward || 'Unknown Ward'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-accent">{leader.points || 0}</p>
                                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Points</p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
          </CardContent>
        </Card>

        {/* User Rank Quick View */}
        {!loading && !leaders.find(l => l.userId === user?.id) && (
            <div className="p-6 rounded-2xl bg-primary text-primary-foreground flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">#142</div>
                    <div>
                        <p className="font-bold">Your Rank</p>
                        <p className="text-xs opacity-70">You need 45 more points to enter Top 100!</p>
                    </div>
                </div>
                <Button variant="outline" className="bg-transparent border-white/20 hover:bg-white/10 text-white" onClick={() => navigate('/report')}>
                    Report to Rank Up
                </Button>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
