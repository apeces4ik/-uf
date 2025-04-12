import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import './index.css';
import { Router, Switch, Route } from 'wouter';
import HomePage from '@/pages/home-page';
import NewsPage from '@/pages/news-page';
import TeamPage from '@/pages/team-page';
import MatchesPage from '@/pages/matches-page';
import MediaPage from '@/pages/media-page';
import ContactsPage from '@/pages/contacts-page';
import AuthPage from '@/pages/auth-page';
import AdminPage from '@/pages/admin-page';
import BlogPage from '@/pages/blog-page';
import BlogPostPage from '@/pages/blog-post-page';
import NewsDetailPage from '@/pages/news-detail-page';
import HistoryPage from '@/pages/history-page';
import NotFound from '@/pages/not-found';

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/news" component={NewsPage} />
              <Route path="/news/:id" component={NewsDetailPage} />
              <Route path="/team" component={TeamPage} />
              <Route path="/matches" component={MatchesPage} />
              <Route path="/media" component={MediaPage} />
              <Route path="/contacts" component={ContactsPage} />
              <Route path="/auth" component={AuthPage} />
              <Route path="/admin/*" component={AdminPage} />
              <Route path="/blog" component={BlogPage} />
              <Route path="/blog/:id" component={BlogPostPage} />
              <Route path="/history" component={HistoryPage} />
              <Route component={NotFound} />
            </Switch>
          </Router>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}