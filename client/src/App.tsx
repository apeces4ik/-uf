import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import TeamPage from "@/pages/team-page";
import MatchesPage from "@/pages/matches-page";
import NewsPage from "@/pages/news-page";
import MediaPage from "@/pages/media-page";
import BlogPage from "@/pages/blog-page";
import ContactsPage from "@/pages/contacts-page";
import HistoryPage from "@/pages/history-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import "@/lib/fonts";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/matches" component={MatchesPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/media" component={MediaPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/contacts" component={ContactsPage} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/admin/:section" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
