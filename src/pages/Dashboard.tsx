import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { blink } from '@/lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useBlinkAuth();
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [statsData, reportsData] = await Promise.all([
          blink.db.usersStats.list({ where: { userId: user.id }, limit: 1 }),
          blink.db.reports.list({ where: { userId: user.id }, limit: 5, orderBy: { timestamp: 'desc' } })
        ]);
        
        if (statsData.length > 0) {
          setStats(statsData[0]);
        } else {
          // Initialize stats if not found
          const initialStats = {
            userId: user.id,
            points: 0,
            streak: 0,
            reportsCount: 0,
            rank: 'Novice',
            city: 'Mumbai',
            ward: 'West'
          };
          await blink.db.usersStats.create(initialStats);
          setStats(initialStats);
        }
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Namaste, {user?.displayName || 'Citizen'}</h1>
            <p className="text-muted-foreground mt-1">
              Your contribution is making {stats?.city || 'the city'} safer.
            </p>
          </div>
          <Button onClick={() => navigate('/report')} className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 gap-2 rounded-xl shadow-lg shadow-accent/20">
            <Plus className="w-5 h-5" /> Report Issue
          </Button>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={item}>
            <Card className="relative overflow-hidden group border-accent/20">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <Trophy className="w-16 h-16" />
              </div>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Reputation Points</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold">{stats?.points || 0}</h2>
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-none font-bold">LVL {Math.floor((stats?.points || 0) / 100) + 1}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Progress to Next Rank</span>
                        <span>{(stats?.points || 0) % 100}/100</span>
                    </div>
                    <Progress value={(stats?.points || 0) % 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Streak</p>
                    <h2 className="text-3xl font-bold">{stats?.streak || 0} Days</h2>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Keep reporting to maintain your streak and earn bonus points!</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Reports Resolved</p>
                    <h2 className="text-3xl font-bold">{reports.filter(r => r.status === 'Resolved').length}</h2>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Impact: {reports.filter(r => r.status === 'Resolved').length * 5} lives positively affected.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">City Rank</p>
                    <h2 className="text-3xl font-bold">#42</h2>
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto text-accent text-xs font-bold" onClick={() => navigate('/leaderboard')}>
                  View Leaderboard <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Submissions</h3>
              <Button variant="ghost" size="sm" className="text-accent" onClick={() => navigate('/profile')}>View All</Button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 w-full bg-secondary/50 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : reports.length === 0 ? (
                <Card className="bg-secondary/10 border-dashed">
                    <CardContent className="p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-medium">No reports yet</p>
                            <p className="text-sm text-muted-foreground">Your city needs you! Report your first road issue to start earning points.</p>
                        </div>
                        <Button onClick={() => navigate('/report')} variant="outline" className="rounded-xl">Submit First Report</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden group" onClick={() => navigate(`/report/${report.id}`)}>
                            <div className="flex items-stretch">
                                <div className="w-24 bg-secondary flex items-center justify-center overflow-hidden">
                                    {report.images ? (
                                        <img src={JSON.parse(report.images)[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Issue" />
                                    ) : (
                                        <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold">{report.issueType}</h4>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                <span className="truncate max-w-[200px]">{report.address || 'Location detected'}</span>
                                            </div>
                                        </div>
                                        <Badge 
                                            variant={report.status === 'Resolved' ? 'secondary' : 'outline'}
                                            className={cn(
                                                "capitalize",
                                                report.status === 'Resolved' && "bg-green-100 text-green-700 hover:bg-green-100",
                                                report.status === 'In Progress' && "bg-blue-100 text-blue-700 hover:bg-blue-100",
                                                report.status === 'Approved' && "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                            )}
                                        >
                                            {report.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-muted-foreground">{format(new Date(report.timestamp), 'MMM d, yyyy • h:mm a')}</p>
                                        <div className="flex items-center gap-1 text-xs font-medium text-accent">
                                            Details <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
          </motion.div>

          {/* Quick Actions / Achievements */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Badges you've earned</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2">
                {[
                  { name: 'First Responder', icon: '🚨' },
                  { name: 'Eagle Eye', icon: '🦅' },
                  { name: 'City Guard', icon: '🛡️' },
                  { name: 'Pothole Slayer', icon: '⚔️' }
                ].map((badge, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-secondary/50 flex flex-col items-center justify-center group cursor-help relative" title={badge.name}>
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{badge.icon}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-accent text-accent-foreground">
               <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Next Goal: Pothole Week</h4>
                    <p className="text-sm opacity-80">Report 3 potholes this week to earn double reputation points!</p>
                  </div>
                  <Progress value={33} className="bg-white/20 h-2" indicatorClassName="bg-white" />
                  <p className="text-xs font-medium opacity-70 text-right">1 / 3 Completed</p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Community Activity</h4>
                    <Badge variant="outline" className="text-[10px] h-5">Live</Badge>
                  </div>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 items-start">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 50}`} />
                            </Avatar>
                            <div>
                                <p className="text-xs"><span className="font-bold">Arjun S.</span> reported waterlogging in Worli.</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">2 minutes ago</p>
                            </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
