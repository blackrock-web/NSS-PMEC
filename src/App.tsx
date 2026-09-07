import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { LoginModal } from './components/auth/LoginModal';
import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';

import { ArrowUp } from 'lucide-react';
import { SITE_CONFIG } from './data/config';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [currentEventSlug, setCurrentEventSlug] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const { config } = useTenant();

  const activeConfig = config || SITE_CONFIG;

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
      case '/auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case '/admin':
        return <AdminDashboard />;
      default:
        return <HomePage onNavigate={handleNavigate} onViewEvent={handleViewEvent} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] text-slate-900 selection:bg-[#E63946] selection:text-white font-sans antialiased">
      {/* Primary Sticky Unified Header */}
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

      {/* Authentication Modal */}
      <LoginModal onLoginSuccess={() => handleNavigate('/admin')} />

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

export default function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <AppContent />
      </TenantProvider>
    </AuthProvider>
  );
}
