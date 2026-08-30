/**
 * Perla Marine / Sessiz Kuvvet
 * Global page shell and application routing.
 */

import { lazy, Suspense, useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import BackToTop from "@/components/BackToTop";
import PageHead from "@/components/PageHead";
import CookieConsent from "@/components/CookieConsent";

import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ServiceFAQ from "@/components/ServiceFAQ";
import Legal, { Sitemap } from "@/pages/Legal";

import { Route, Switch, useLocation } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// ============================================================
// Lazy loaded pages
// ============================================================

const AboutNew = lazy(() =>
  import("@/pages/CorporatePages").then((module) => ({
    default: module.AboutNew,
  }))
);

const ContactNew = lazy(() =>
  import("@/pages/CorporatePages").then((module) => ({
    default: module.ContactNew,
  }))
);

const KnowledgeNew = lazy(() =>
  import("@/pages/CorporatePages").then((module) => ({
    default: module.KnowledgeNew,
  }))
);

const ProjectsNew = lazy(() =>
  import("@/pages/CorporatePages").then((module) => ({
    default: module.ProjectsNew,
  }))
);

const ServicesNew = lazy(() =>
  import("@/pages/CorporatePages").then((module) => ({
    default: module.ServicesNew,
  }))
);

const AdminProjects = lazy(() => import("@/pages/AdminProjects"));

const AdminKnowledge = lazy(() => import("@/pages/AdminKnowledge"));

const AdminFAQ = lazy(() => import("@/pages/AdminFAQ"));
const AdminServices = lazy(() => import("@/pages/AdminServices"));
const AdminPartners = lazy(() => import("@/pages/AdminPartners"));
const ServiceRegions = lazy(() => import("@/pages/ServiceRegions"));

const ProjectDraftPreview = lazy(() =>
  import("@/pages/ProjectDraftPreview")
);

const KnowledgePost = lazy(() =>
  import("@/pages/KnowledgePost")
);

const ProjectDetail = lazy(() =>
  import("@/pages/ProjectDetail")
);

// ============================================================
// Admin redirect
// ============================================================

function AdminRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/yonetim/projeler", { replace: true });
  }, [navigate]);

  return (
    <div className="route-loading" role="status">
      Yönetim paneline yönlendiriliyorsunuz…
    </div>
  );
}

// ============================================================
// Legacy blog redirect
// ============================================================

function LegacyBlogRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/teknik-bilgiler", { replace: true });
  }, [navigate]);

  return (
    <div className="route-loading" role="status">
      Teknik Bilgiler’e yönlendiriliyorsunuz…
    </div>
  );
}

// ============================================================
// Router
// ============================================================

function Router() {
  return (
    <Switch>

      {/* ======================================================
          MAIN WEBSITE
         ====================================================== */}

      <Route path="/" component={Home} />

      <Route path="/hakkimizda" component={AboutNew} />
      <Route path="/hizmet-bolgelerimiz" component={ServiceRegions} />

      <Route path="/hizmetler" component={ServicesNew} />

      <Route path="/projeler/:slug" component={ProjectDetail} />

      <Route path="/projeler" component={ProjectsNew} />

      <Route
        path="/teknik-bilgiler/:slug"
        component={KnowledgePost}
      />

      <Route
        path="/teknik-bilgiler"
        component={KnowledgeNew}
      />

      <Route
        path="/blog"
        component={LegacyBlogRedirect}
      />

      <Route path="/iletisim" component={ContactNew} />

      <Route
        path="/sss"
        component={() => <ServiceFAQ />}
      />

      {/* ======================================================
          LEGAL
         ====================================================== */}

      <Route
        path="/kvkk"
        component={() => <Legal type="kvkk" />}
      />

      <Route
        path="/gizlilik"
        component={() => <Legal type="gizlilik" />}
      />

      <Route
        path="/cerez"
        component={() => <Legal type="cerez" />}
      />

      <Route
        path="/site-haritasi"
        component={Sitemap}
      />

      {/* ======================================================
          ADMIN PANEL
         ====================================================== */}

      <Route
        path="/yonetim"
        component={AdminRedirect}
      />

      <Route
        path="/yonetim/projeler"
        component={AdminProjects}
      />

      <Route
        path="/yonetim/projeler/preview/:slug"
        component={ProjectDraftPreview}
      />

      <Route
        path="/yonetim/teknik-bilgiler"
        component={AdminKnowledge}
      />

      <Route
        path="/yonetim/sss"
        component={AdminFAQ}
      />

      <Route
        path="/yonetim/hizmetler"
        component={AdminServices}
      />

      <Route
        path="/yonetim/is-ortaklari"
        component={AdminPartners}
      />

      {/* ======================================================
          404
         ====================================================== */}

      <Route
        path="/404"
        component={NotFound}
      />

      <Route component={NotFound} />

    </Switch>
  );
}

// ============================================================
// App
// ============================================================

function App() {
  const [location] = useLocation();

  const isAdminRoute = location.startsWith("/yonetim");

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>

          <Toaster />

          <PageHead location={location} />

          <div className="app-shell">

            {/* Accessibility */}
            <a
              className="skip-link"
              href="#main-content"
            >
              Ana içeriğe geç
            </a>

            {/* Public website header */}
            {!isAdminRoute && <SiteHeader />}

            {/* Main content */}
            <main id="main-content">

              <Suspense
                fallback={
                  <div
                    className="route-loading"
                    role="status"
                  >
                    Sayfa yükleniyor…
                  </div>
                }
              >
                <Router />
              </Suspense>

            </main>

            {/* Public website footer */}
            {!isAdminRoute && <SiteFooter />}

            {!isAdminRoute && <BackToTop />}

            {!isAdminRoute && <CookieConsent />}

          </div>

        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
