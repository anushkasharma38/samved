import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2,
  X,
  Navigation,
  Info
} from 'lucide-react';
import AppLayout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { blink } from '@/lib/blink';
import { useBlinkAuth } from '@blinkdotnew/react';
import { cn } from '@/lib/utils';

const ISSUE_TYPES = [
  { id: 'Pothole', label: 'Pothole', icon: '🕳️' },
  { id: 'Broken Road', label: 'Broken Road', icon: '🛣️' },
  { id: 'Waterlogging', label: 'Waterlogging', icon: '🌊' },
  { id: 'Open Manhole', label: 'Open Manhole', icon: '⭕' },
  { id: 'Accident Prone', label: 'Accident-prone Zone', icon: '⚠️' }
];

const SEVERITY_LEVELS = [
  { id: 'Low', label: 'Low', color: 'bg-green-500' },
  { id: 'Medium', label: 'Medium', color: 'bg-orange-500' },
  { id: 'High', label: 'High', color: 'bg-red-500' }
];

export default function Report() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [issueType, setIssueType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();
  const { user } = useBlinkAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Mock geocoding for demo
        setLocation({
          lat: latitude,
          lng: longitude,
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Auto-detected)`
        });
        setLoading(false);
        toast.success('Location detected!');
      },
      (error) => {
        setLoading(false);
        toast.error('Failed to detect location. Please enter manually.');
      }
    );
  };

  const handleSubmit = async () => {
    if (!issueType || !severity || !location || images.length === 0) {
      toast.error('Please complete all steps');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload images
      const uploadResults = await Promise.all(
        images.map(file => blink.storage.upload(file, `reports/${Date.now()}-${file.name}`))
      );
      const uploadedUrls = uploadResults.map(res => res.publicUrl);

      // 2. Create report
      const report = await blink.db.reports.create({
        userId: user?.id,
        issueType,
        severity,
        locationLat: location.lat,
        locationLng: location.lng,
        address: location.address,
        timestamp: new Date().toISOString(),
        images: JSON.stringify(uploadedUrls),
        status: 'Pending',
        verificationScore: 0.85 // Mock AI score
      });

      // 3. Update user points
      const stats = await blink.db.usersStats.list({ where: { userId: user?.id }, limit: 1 });
      if (stats.length > 0) {
        await blink.db.usersStats.update(stats[0].id, {
          points: (stats[0].points || 0) + 10,
          reportsCount: (stats[0].reportsCount || 0) + 1
        });
      }

      toast.success('Report submitted successfully! AI verification in progress.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Report Road Damage</h1>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "h-1.5 w-12 rounded-full transition-all duration-300",
                  step >= s ? "bg-accent" : "bg-secondary"
                )} 
              />
            ))}
          </div>
        </div>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Step 1: Evidence Capture</Label>
                    <p className="text-sm text-muted-foreground">Upload clear photos of the damage. Multiple angles help AI verify better.</p>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">Click to Upload</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB (Max 5)</p>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full h-12 rounded-xl bg-accent text-accent-foreground" 
                    disabled={images.length === 0}
                    onClick={() => setStep(2)}
                  >
                    Next Step <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Step 2: Location Details</Label>
                    <p className="text-sm text-muted-foreground">Where exactly is the damage located?</p>
                    
                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full h-14 rounded-xl gap-2 text-accent border-accent/20 hover:bg-accent/5"
                        onClick={detectLocation}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                        {location ? 'Relocate GPS' : 'Use Current Location'}
                      </Button>

                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <Input 
                          placeholder="Or enter landmark/address manually" 
                          className="h-12 pl-10 rounded-xl"
                          value={location?.address || ''}
                          onChange={(e) => setLocation(prev => ({ ...prev!, address: e.target.value }))}
                        />
                      </div>

                      {location && (
                        <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold">Location Verified</p>
                            <p className="text-xs text-muted-foreground">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="ghost" className="flex-1 h-12" onClick={() => setStep(1)}>
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button 
                      className="flex-[2] h-12 bg-accent text-accent-foreground" 
                      disabled={!location}
                      onClick={() => setStep(3)}
                    >
                      Next Step <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Step 3: Issue Details</Label>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Issue Type</p>
                        <div className="grid grid-cols-2 gap-2">
                          {ISSUE_TYPES.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setIssueType(type.id)}
                              className={cn(
                                "p-4 rounded-xl border text-left transition-all",
                                issueType === type.id 
                                  ? "border-accent bg-accent/5 shadow-inner" 
                                  : "bg-card hover:border-muted-foreground/30"
                              )}
                            >
                              <span className="text-xl mb-1 block">{type.icon}</span>
                              <span className="text-sm font-bold">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium">Severity Level</p>
                        <div className="flex gap-2">
                          {SEVERITY_LEVELS.map((lvl) => (
                            <button
                              key={lvl.id}
                              onClick={() => setSeverity(lvl.id)}
                              className={cn(
                                "flex-1 py-3 rounded-xl border text-sm font-bold transition-all",
                                severity === lvl.id 
                                  ? "border-accent bg-accent/5 ring-1 ring-accent" 
                                  : "bg-card"
                              )}
                            >
                              <div className={cn("w-2 h-2 rounded-full mx-auto mb-1", lvl.color)} />
                              {lvl.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium">Additional Context (Optional)</p>
                        <Input 
                          placeholder="e.g. Near the metro pillar #142" 
                          className="h-12 rounded-xl"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="ghost" className="flex-1 h-12" onClick={() => setStep(2)}>
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button 
                      className="flex-[2] h-12 bg-accent text-accent-foreground" 
                      disabled={!issueType || !severity || loading}
                      onClick={handleSubmit}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="mr-2 w-5 h-5" />}
                      Submit Report
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Safety Tips Card */}
        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-6 flex gap-4 items-start">
            <Info className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="font-bold text-orange-700">Reporting Safely</p>
              <p className="text-sm text-orange-600/80">Never stop your vehicle in the middle of traffic to take photos. Safety first, reporting second.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
