import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Insights from "./pages/Insights";
import ConnectData from "./pages/ConnectData";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

// Simple event emitter for opening modal
export const openLoggingModal = () => {
  window.dispatchEvent(new CustomEvent('openLoggingModal'));
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAddClick = () => {
    // Navigate to home if not already there, then trigger modal
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => openLoggingModal(), 100);
    } else {
      openLoggingModal();
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/connect" element={<ConnectData />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav onAddClick={handleAddClick} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
