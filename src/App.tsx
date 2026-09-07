import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { SpecialCampPage } from './pages/SpecialCampPage';
import { GalleryPage } from './pages/GalleryPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ReportsPage } from './pages/ReportsPage';
import { JoinNssPage } from './pages/JoinNssPage';
import { ContactPage } from './pages/ContactPage';
import { TeamPage } from './pages/TeamPage';

import { ArrowUp, HeartPulse } from 'lucide-react';
import { SITE_CONFIG } from './data/config';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentEventSlug, setCurrentEventSlug] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Monitor scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync with browser history and handle route changes
  const handleNavigate = (path: string) => {
    // Check if it's an event detail link like /events/slug
    if (path.startsWith('/events/')) {
      const slug = path.replace('/events/', '');
      setCurrentEventSlug(slug);
      setCurrentPath('/events/[slug]');
    } else {
      setCurrentEventSlug(null);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewEvent = (slug: string) => {
    setCurrentEventSlug(slug);
    setCurrentPath('/events/[slug]');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentPage = () => {
    if (currentPath === '/events/[slug]' && currentEventSlug) {
      return (
        <EventDetailPage
          slug={currentEventSlug}
          onNavigate={handleNavigate}
          onViewEvent={handleViewEvent}
        />
      );
    }

    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={handleNavigate} onViewEvent={handleViewEvent} />;
      case '/about':
        return <AboutPage onNavigate={handleNavigate} />;
      case '/team':
        return <TeamPage onNavigate={handleNavigate} />;
      case '/activities':
        return <ActivitiesPage />;
      case '/events':
        return <EventsPage onViewEvent={handleViewEvent} onNavigate={handleNavigate} />;
      case '/special-camp':
        return <SpecialCampPage onNavigate={handleNavigate} />;
      case '/gallery':
        return <GalleryPage />;
      case '/achievements':
        return <AchievementsPage />;
      case '/reports':
        return <ReportsPage />;
      case '/join-nss':
        return <JoinNssPage />;
      case '/contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} onViewEvent={handleViewEvent} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] text-slate-900 selection:bg-[#E63946] selection:text-white font-sans antialiased">
      {/* Global Top Micro Notification / Blood Helpline Bar */}
      <div className="bg-[#071526] text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-white">NSS Units 04 & 05</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-400">{SITE_CONFIG.collegeFullName}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#FCA5A5]">
              <HeartPulse className="w-3.5 h-3.5 text-[#E63946]" />
              <span className="font-bold">24/7 Blood Donor Helpline:</span>
              <span className="text-white font-mono">{SITE_CONFIG.bloodHelpline}</span>
            </div>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/10"
            >
              <span>Search site</span>
              <kbd className="font-mono bg-black/40 px-1 rounded text-[9px]">⌘K</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sticky Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Primary Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Instant Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#0B1F3A] hover:bg-[#E63946] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
