
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AMP from "./pages/AMP";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";
import CookiePolicy from "./pages/CookiePolicy";
import Articles from "./pages/Articles";
import Article2025 from "./pages/Article2025";
import Article2026 from "./pages/Article2026";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/amp" element={<AMP />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/maxa-semester-2025" element={<Article2025 />} />
          <Route path="/articles/optimera-ledighet-2026" element={<Article2026 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
