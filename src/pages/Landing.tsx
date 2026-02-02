import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Zap, 
  BarChart3, 
  Users, 
  ArrowRight,
  Camera,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">RoadEye</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#impact" className="hover:text-accent transition-colors">Impact</a>
            <a href="#map" className="hover:text-accent transition-colors">Live Map</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Login</Button>
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(59,130,246,0.05)_0%,rgba(255,255,255,0)_100%)]" />
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Active in 12 Indian Cities
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
                Report Smart. Repair Fast. <br />
                <span className="text-accent italic">Build Safer Roads.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Empowering citizens to report road damage instantly. AI-verified reporting meets transparent government action for a smoother journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/auth')} className="h-14 px-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  Report Now <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/map')} className="h-14 px-8 text-lg gap-2">
                  View Live Map <MapPin className="w-5 h-5 text-accent" />
                </Button>
              </div>
            </motion.div>

            {/* Mock Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-20 relative"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 rounded-full w-2/3 mx-auto h-2/3 top-1/2 -translate-y-1/2" />
              <div className="rounded-2xl border bg-card/50 backdrop-blur shadow-2xl overflow-hidden aspect-[16/9] max-w-5xl mx-auto">
                 <img 
                    src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=2000" 
                    alt="Road repair action" 
                    className="w-full h-full object-cover opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                 <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="text-left">
                        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-1">Impact Highlight</p>
                        <h3 className="text-2xl font-bold text-white">45,000+ Potholes Resolved</h3>
                        <p className="text-white/70">Across Bengaluru, Mumbai & Delhi in Q4 2025</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white">
                            <p className="text-xs opacity-70">Avg. Repair Time</p>
                            <p className="text-xl font-bold">48 Hours</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white">
                            <p className="text-xs opacity-70">Citizen Rating</p>
                            <p className="text-xl font-bold">4.8/5.0</p>
                        </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How RoadEye Works</h2>
              <p className="text-muted-foreground">Smart civic reporting made effortless for everyone.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Camera,
                  title: "Instant Capture",
                  description: "Snap a photo of the damage. Our app auto-tags GPS location and timestamp for verification."
                },
                {
                  icon: Zap,
                  title: "AI Validation",
                  description: "Our AI model analyzes images in real-time to categorize issues and prevent duplicate or fake reports."
                },
                {
                  icon: ShieldCheck,
                  title: "Transparent Tracking",
                  description: "Watch your report move from pending to resolved with live ETA and contractor details."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="text-accent w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section id="impact" className="py-24 border-y">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-accent mb-2">150k</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Reports Verified</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">92%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Resolution Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">45k</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Active Citizens</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-accent mb-2">12</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">City Councils</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="p-12 rounded-3xl bg-primary text-primary-foreground relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent)]" />
              <h2 className="text-4xl font-bold mb-6">Ready to make your city safer?</h2>
              <p className="text-primary-foreground/70 text-lg mb-10">
                Join thousands of citizens helping local authorities build better roads through technology and transparency.
              </p>
              <Button size="lg" onClick={() => navigate('/auth')} className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10">
                Join the Mission
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-accent w-6 h-6" />
              <span className="text-xl font-bold">RoadEye</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Open Data API</a>
              <a href="#" className="hover:text-foreground">Contact Support</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 RoadEye India. Digital Governance Initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
