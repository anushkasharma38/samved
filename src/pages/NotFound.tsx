import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mb-8">
        <AlertTriangle className="w-10 h-10 text-accent" />
      </div>
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The road you're looking for seems to be under construction or doesn't exist.
      </p>
      <Button onClick={() => navigate('/')} className="bg-accent text-accent-foreground h-12 px-8 rounded-xl">
        Back to Safety
      </Button>
    </div>
  );
}
