import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { TokenEasyHeader } from '@/components/TokenEasyHeader';
import { Wizard } from '@/components/Wizard';
import { DeployPlan } from '@/core/types';
import './index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const { toast } = useToast();

  const handleDeployComplete = (plan: DeployPlan) => {
    toast({
      title: "Deployment Plan Ready",
      description: `Your ${plan.stack} ${plan.standard} token is ready for deployment on ${plan.network}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TokenEasyHeader />
      <main className="container mx-auto py-8">
        <Wizard onComplete={handleDeployComplete} />
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
