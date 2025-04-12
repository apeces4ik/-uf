
import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/hooks/use-auth';
import { AdminProtectedRoute } from '@/lib/admin-protected-route';

// Pages
import HomePage from '@/pages/home-page';
import TeamPage from '@/pages/team-page';
import MatchesPage from '@/pages/matches-page';
import NewsPage from '@/pages/news-page';
import NewsDetailPage from '@/pages/news-detail-page';
import BlogPage from '@/pages/blog-page';
import BlogPostPage from '@/pages/blog-post-page';
import MediaPage from '@/pages/media-page';
import HistoryPage from '@/pages/history-page';
import ContactsPage from '@/pages/contacts-page';
import AuthPage from '@/pages/auth-page';
import AdminPage from '@/pages/admin-page';
import NotFound from '@/pages/not-found';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/matches" component={MatchesPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/news/:id" component={NewsDetailPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:id" component={BlogPostPage} />
          <Route path="/media" component={MediaPage} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/contacts" component={ContactsPage} />
          <Route path="/auth" component={AuthPage} />
          <AdminProtectedRoute path="/admin/:section?" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
