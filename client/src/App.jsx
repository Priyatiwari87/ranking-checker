import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import CheckRanking from './pages/CheckRanking';
import History from './pages/History';
import Settings from './pages/Settings';

const pageTitles = {
  '/': { title: 'Overview', subtitle: 'Search ranking performance metrics & summary' },
  '/check': { title: 'Check Ranking', subtitle: 'Inspect search engine SERP ranking for any business' },
  '/history': { title: 'Search History', subtitle: 'Review historical position logs & snapshot data' },
  '/settings': { title: 'Settings', subtitle: 'Configure ranking search providers & API parameters' },
};

const AppLayout = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage = pageTitles[location.pathname] || {
    title: 'RankCheck',
    subtitle: 'Business Search Ranking Checker'
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onMobileMenuToggle={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/check" element={<CheckRanking />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
