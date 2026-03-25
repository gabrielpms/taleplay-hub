import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import StoryDetail from "./pages/StoryDetail.tsx";
import EpisodeReader from "./pages/EpisodeReader.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import MyStories from "./pages/dashboard/MyStories.tsx";
import Favorites from "./pages/dashboard/Favorites.tsx";
import Reading from "./pages/dashboard/Reading.tsx";
import Account from "./pages/dashboard/Account.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/read/:storyId/:episodeId" element={<EpisodeReader />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/stories" replace />} />
              <Route path="stories" element={<MyStories />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="reading" element={<Reading />} />
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
