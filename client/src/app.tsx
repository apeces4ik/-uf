// Assuming a React Router setup.  Replace with your actual routing setup if different.
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from './pages/home-page';
import AboutPage from './pages/about-page';
import TeamPage from './pages/team-page';
import MatchesPage from './pages/matches-page';
import NewsPage from './pages/news-page';


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/team">Team</a></li>
            <li><a href="/matches">Matches</a></li>
            <li><a href="/news">News</a></li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/matches" component={MatchesPage} />
          <Route path="/news" component={NewsPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;