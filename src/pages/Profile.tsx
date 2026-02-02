import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  MapPin, 
  Trophy, 
  Flame, 
  Settings, 
  ShieldCheck,
  Calendar,
  Mail,
  Phone,
  Edit2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History
} from 'lucide-react';
import AppLayout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { blink } from '@/lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useBlinkAuth();
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [statsData, reportsData] = await Promise.all([
          blink.db.usersStats.list({ where: { userId: user.id }, limit: 1 }),
          blink.db.reports.list({ where: { userId: user.id }, orderBy: { timestamp: 'desc' } })
        ]);
        
        if (statsData.length > 0) setStats(statsData[0]);
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile details updated successfully!');
    setEditing(false);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-48 rounded-3xl bg-gradient-to-r from-primary to-accent overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-30" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          <div className="px-8 -mt-16 relative flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl rounded-3xl">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                <AvatarFallback><UserIcon className="w-12 h-12" /></AvatarFallback>
              </Avatar>
              <div className="mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{user?.displayName || 'Citizen'}</h1>
                <div className="flex items-center gap-3 text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{stats?.ward || 'West Ward'}, {stats?.city || 'Mumbai'}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined Dec 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mb-2 w-full md:w-auto">
              <Button variant="outline" className="rounded-xl flex-1 md:flex-none gap-2" onClick={() => setEditing(!editing)}>
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
              <Button className="rounded-xl flex-1 md:flex-none bg-accent text-accent-foreground gap-2">
                <ShieldCheck className="w-4 h-4" /> Verify ID
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reputation Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-secondary/50 text-center">
                    <p className="text-2xl font-bold">{stats?.points || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Points</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-500/10 text-center">
                    <p className="text-2xl font-bold text-orange-600">{stats?.streak || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-orange-600/70 font-bold">Streak</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-accent" />
                      <span className="font-medium">Rank</span>
                    </div>
                    <Badge className="bg-accent/10 text-accent border-none">{stats?.rank || 'Guardian'}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-accent" />
                      <span className="font-medium">Reports</span>
                    </div>
                    <span className="font-bold">{reports.length} Submissions</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Resolution Rate</span>
                    </div>
                    <span className="font-bold">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">Phone</p>
                    <p className="font-medium">+91 98XXX XXXXX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="history" className="space-y-6">
              <TabsList className="bg-secondary/50 p-1 rounded-xl w-full md:w-auto h-11">
                <TabsTrigger value="history" className="px-8 rounded-lg">Report History</TabsTrigger>
                <TabsTrigger value="badges" className="px-8 rounded-lg">My Badges</TabsTrigger>
                <TabsTrigger value="settings" className="px-8 rounded-lg">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                {reports.length === 0 ? (
                  <div className="p-12 text-center bg-card rounded-3xl border border-dashed">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No history yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">Start reporting issues to build your civic footprint.</p>
                  </div>
                ) : (
                  <div className="relative space-y-4 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-secondary">
                    {reports.map((report, i) => (
                      <div key={report.id} className="relative pl-12">
                        <div className={cn(
                          "absolute left-0 top-1.5 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center shadow-sm z-10",
                          report.status === 'Resolved' ? "bg-green-500" : 
                          report.status === 'In Progress' ? "bg-blue-500" : "bg-orange-500"
                        )}>
                          {report.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5 text-white" /> : 
                           report.status === 'In Progress' ? <Clock className="w-5 h-5 text-white" /> : <AlertTriangle className="w-5 h-5 text-white" />}
                        </div>
                        <Card className="hover:shadow-md transition-shadow group">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-bold text-lg">{report.issueType}</h3>
                                <p className="text-xs text-muted-foreground">{format(new Date(report.timestamp), 'MMMM d, yyyy • h:mm a')}</p>
                              </div>
                              <Badge variant="outline" className="capitalize">{report.status}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{report.address}</span>
                            </div>

                            <div className="flex gap-2">
                               {report.images && JSON.parse(report.images).slice(0, 3).map((img: string, idx: number) => (
                                 <div key={idx} className="w-20 aspect-square rounded-lg overflow-hidden border">
                                    <img src={img} className="w-full h-full object-cover" alt="Report" />
                                 </div>
                               ))}
                            </div>

                            {report.admin_notes && (
                              <div className="mt-4 p-4 rounded-xl bg-accent/5 border border-accent/10">
                                <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Official Response</p>
                                <p className="text-sm italic">"{report.admin_notes}"</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="badges" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: '1', name: 'Safe Streets Hero', desc: 'Reported 10+ issues', icon: '🛡️', date: 'Jan 20, 2025' },
                  { id: '2', name: 'Pothole Hunter', desc: 'Resolved 5 potholes', icon: '🕳️', date: 'Jan 15, 2025' },
                  { id: '3', name: 'Daily Guardian', desc: '7-day reporting streak', icon: '🔥', date: 'Dec 28, 2024' },
                  { id: '4', name: 'Community Leader', desc: 'Most active in ward', icon: '🏆', date: 'Dec 12, 2024' },
                ].map((badge) => (
                  <Card key={badge.id} className="text-center group hover:border-accent transition-colors">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center text-4xl mx-auto group-hover:scale-110 transition-transform">
                        {badge.icon}
                      </div>
                      <div>
                        <p className="font-bold">{badge.name}</p>
                        <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                      </div>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{badge.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                   <CardContent className="p-8">
                     <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <Label>Display Name</Label>
                             <Input defaultValue={user?.displayName || ''} />
                           </div>
                           <div className="space-y-2">
                             <Label>Phone Number</Label>
                             <Input defaultValue="+91 98XXX XXXXX" />
                           </div>
                           <div className="space-y-2">
                             <Label>City</Label>
                             <Input defaultValue={stats?.city || 'Mumbai'} />
                           </div>
                           <div className="space-y-2">
                             <Label>Ward</Label>
                             <Input defaultValue={stats?.ward || 'West'} />
                           </div>
                        </div>
                        <div className="pt-4 border-t flex justify-end gap-3">
                           <Button variant="ghost">Cancel</Button>
                           <Button type="submit" className="bg-accent text-accent-foreground">Save Changes</Button>
                        </div>
                     </form>
                   </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
