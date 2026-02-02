import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search,
  Filter,
  Eye,
  Check,
  X,
  Send,
  Calendar,
  MoreHorizontal,
  MapPin,
  TrendingUp,
  Loader2
} from 'lucide-react';
import AppLayout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { blink } from '@/lib/blink';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Admin() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [eta, setEta] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const data = await blink.db.reports.list({ orderBy: { timestamp: 'desc' } });
      setReports(data);
    } catch (error) {
      console.error('Error fetching admin reports:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (status: string) => {
    if (!selectedReport) return;
    setActionLoading(true);
    try {
      await blink.db.reports.update(selectedReport.id, {
        status,
        adminNotes,
        eta: eta || selectedReport.eta,
        resolvedAt: status === 'Resolved' ? new Date().toISOString() : null
      });

      // Notify user (mock)
      await blink.db.notifications.create({
        userId: selectedReport.userId,
        title: `Report ${status}`,
        message: `Your report for ${selectedReport.issueType} has been ${status.toLowerCase()}.`,
        type: 'status_update',
        createdAt: new Date().toISOString()
      });

      toast.success(`Report ${status.toLowerCase()} successfully`);
      fetchReports();
      setSelectedReport(null);
      setAdminNotes('');
      setEta('');
    } catch (error: any) {
      toast.error('Failed to update report status');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = [
    { label: 'Pending', value: reports.filter(r => r.status === 'Pending').length, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'In Progress', value: reports.filter(r => r.status === 'In Progress').length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Resolved', value: reports.filter(r => r.status === 'Resolved').length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Citizens Active', value: 452, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-muted-foreground mt-1">Manage civic complaints and monitor repair performance.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="w-4 h-4" /> Performance Reports
            </Button>
            <Button className="bg-accent text-accent-foreground gap-2">
              <Send className="w-4 h-4" /> Broadcast Alert
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main List */}
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Complaint Queue</CardTitle>
              <CardDescription>Review and assign road damage reports</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search reports..." className="pl-9 h-10 w-64 rounded-xl" />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl"><Filter className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Citizen</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="h-16"><div className="w-full h-4 bg-secondary animate-pulse rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : reports.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="w-12 h-12 opacity-20" />
                                <p>Queue is empty. Great job!</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : reports.map((report) => (
                  <TableRow key={report.id} className="group">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                          {report.userId.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-xs">Citizen #{report.userId.slice(0, 6)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{report.issueType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        report.severity === 'High' ? "border-red-500 text-red-500" : 
                        report.severity === 'Medium' ? "border-orange-500 text-orange-500" : "border-green-500 text-green-500"
                      )}>
                        {report.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[150px]">{report.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "capitalize",
                        report.status === 'Resolved' && "bg-green-100 text-green-700",
                        report.status === 'In Progress' && "bg-blue-100 text-blue-700",
                        report.status === 'Approved' && "bg-orange-100 text-orange-700"
                      )}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(report.timestamp), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setSelectedReport(report)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Review Complaint</DialogTitle>
                            <DialogDescription>ID: {report.id}</DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Evidence</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {report.images && JSON.parse(report.images).map((img: string, idx: number) => (
                                    <img key={idx} src={img} className="rounded-lg border aspect-square object-cover" />
                                  ))}
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-accent/5 space-y-2">
                                <p className="text-xs font-bold text-accent uppercase tracking-widest">AI Validation Result</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Confidence Score</span>
                                  <span className="font-bold">{(report.verificationScore * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Duplicate Check</span>
                                  <span className="text-green-500 font-bold">Unique Report</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Department Feedback / Internal Notes</Label>
                                <Textarea 
                                  placeholder="Type notes for the citizen or contractor..." 
                                  className="min-h-[100px]"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Expected Resolution (ETA)</Label>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                  <Input 
                                    type="date" 
                                    className="pl-10" 
                                    value={eta}
                                    onChange={(e) => setEta(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" className="flex-1 text-red-500 hover:bg-red-50" onClick={() => handleUpdateStatus('Rejected')}>
                              <X className="w-4 h-4 mr-2" /> Reject Report
                            </Button>
                            <Button variant="outline" className="flex-1 text-blue-500" onClick={() => handleUpdateStatus('In Progress')}>
                              <Clock className="w-4 h-4 mr-2" /> Start Repair
                            </Button>
                            <Button className="flex-1 bg-green-600 text-white" onClick={() => handleUpdateStatus('Resolved')}>
                              <Check className="w-4 h-4 mr-2" /> Mark Resolved
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
