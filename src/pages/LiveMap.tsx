import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Search, 
  Filter, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  MapPin,
  Navigation,
  Loader2
} from 'lucide-react';
import AppLayout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { blink } from '@/lib/blink';
import { cn } from '@/lib/utils';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for severity
const getMarkerIcon = (severity: string, status: string) => {
  let color = '#3B82F6'; // Default Blue
  if (status === 'Resolved') color = '#22C55E'; // Green
  else if (severity === 'High') color = '#EF4444'; // Red
  else if (severity === 'Medium') color = '#F97316'; // Orange

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.7C17.3 17.1 20 13.1 20 9.7C20 5.2 16.4 1.7 12 1.7C7.6 1.7 4 5.2 4 9.7C4 13.1 6.7 17.1 12 21.7Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="9.7" r="3" fill="white"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

function MapView({ center, reports }: { center: [number, number], reports: any[] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return (
    <>
      {reports.map((report) => (
        <Marker 
          key={report.id} 
          position={[report.locationLat, report.locationLng]}
          icon={getMarkerIcon(report.severity, report.status)}
        >
          <Popup className="report-popup">
            <div className="p-1 space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-bold text-sm">{report.issueType}</h4>
                <Badge className={cn(
                  "text-[10px] px-1.5 py-0",
                  report.status === 'Resolved' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {report.status}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{report.address}</p>
              {report.images && (
                <img 
                  src={JSON.parse(report.images)[0]} 
                  alt="Issue" 
                  className="w-full aspect-video object-cover rounded-md"
                />
              )}
              <div className="flex justify-between items-center text-[10px] font-medium">
                <span className="text-muted-foreground">Severity: <span className={cn(
                  report.severity === 'High' ? 'text-red-500' : 
                  report.severity === 'Medium' ? 'text-orange-500' : 'text-green-500'
                )}>{report.severity}</span></span>
                <span className="text-accent cursor-pointer">Details →</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function LiveMap() {
  const [center, setCenter] = useState<[number, number]>([19.0760, 72.8777]); // Mumbai
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    High: true,
    Medium: true,
    Low: true,
    Resolved: true
  });

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await blink.db.reports.list({ limit: 100 });
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => {
    if (r.status === 'Resolved' && !filters.Resolved) return false;
    if (r.status !== 'Resolved' && !filters[r.severity as keyof typeof filters]) return false;
    return true;
  });

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-160px)] flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search area or landmark..." className="pl-10 h-10 rounded-xl" />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Filter className="w-4 h-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem 
                  checked={filters.High} 
                  onCheckedChange={(v) => setFilters(f => ({ ...f, High: v }))}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2" /> High Severity
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.Medium} 
                  onCheckedChange={(v) => setFilters(f => ({ ...f, Medium: v }))}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500 mr-2" /> Medium Severity
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.Low} 
                  onCheckedChange={(v) => setFilters(f => ({ ...f, Low: v }))}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Low Severity
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={filters.Resolved} 
                  onCheckedChange={(v) => setFilters(f => ({ ...f, Resolved: v }))}
                >
                  <CheckCircle2 className="w-3 h-3 text-green-500 mr-2" /> Resolved
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" className="rounded-xl" onClick={handleLocateMe}>
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden border bg-card relative z-0">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
                <p className="text-sm font-medium">Loading map data...</p>
              </div>
            </div>
          ) : null}
          
          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapView center={center} reports={filteredReports} />
            
            {/* Legend Overlay */}
            <div className="absolute bottom-6 right-6 z-[1000] bg-background/90 backdrop-blur p-4 rounded-xl border shadow-lg space-y-2 pointer-events-none">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Live Status</p>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded-full bg-[#EF4444] border border-white" />
                <span>Urgent Repair</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded-full bg-[#F97316] border border-white" />
                <span>Medium Damage</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <div className="w-3 h-3 rounded-full bg-[#22C55E] border border-white" />
                <span>Resolved</span>
              </div>
            </div>
          </MapContainer>
        </div>

        {/* Floating Action Tip */}
        <div className="hidden md:flex items-center gap-2 bg-accent/10 border border-accent/20 p-3 rounded-xl">
          <Info className="w-4 h-4 text-accent" />
          <p className="text-xs font-medium text-accent">Click on markers to see before/after images and live repair progress.</p>
        </div>
      </div>
    </AppLayout>
  );
}
