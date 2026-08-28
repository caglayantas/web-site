/**
 * Perla Marine / Sessiz Kuvvet: Koyu lacivert mühendislik disiplini ile fildişi boşlukları,
 * rota çizgilerini ve kontrollü altın vurguları birleştiren global sayfa kabuğu.
 */
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import BackToTop from "@/components/BackToTop";
import PageHead from "@/components/PageHead";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ServiceFAQ from "@/components/ServiceFAQ";
import Legal, { Sitemap } from "@/pages/Legal";
const AboutNew = lazy(() => import("@/pages/CorporatePages").then((module) => ({ default: module.AboutNew })));
const ContactNew = lazy(() => import("@/pages/CorporatePages").then((module) => ({ default: module.ContactNew })));
const KnowledgeNew = lazy(() => import("@/pages/CorporatePages").then((module) => ({ default: module.KnowledgeNew })));
const ProjectsNew = lazy(() => import("@/pages/CorporatePages").then((module) => ({ default: module.ProjectsNew })));
const ServicesNew = lazy(() => import("@/pages/CorporatePages").then((module) => ({ default: module.ServicesNew })));
const AdminProjects = lazy(() => import("@/pages/AdminProjects"));
const AdminKnowledge = lazy(() => import("@/pages/AdminKnowledge"));
const AdminFAQ = lazy(() => import("@/pages/AdminFAQ"));
const ProjectDraftPreview = lazy(() => import("@/pages/ProjectDraftPreview"));
const KnowledgePost = lazy(() => import("@/pages/KnowledgePost"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      <Route path={"/yonetim"} component={AdminRedirect} />
      <Route path={"/yonetim/projeler"} component={AdminProjects} />
      <Route path={"/yonetim/projeler/preview/:slug"} component={ProjectDraftPreview} />
      <Route path={"/yonetim/teknik-bilgiler"} component={AdminKnowledge} />
      <Route path={"/yonetim/sss"} component={AdminFAQ} />
      <Route path={"/hakkimizda"} component={AboutNew} />
      <Route path={"/hizmetler"} component={ServicesNew} />
      <Route path={"/projeler/:slug"} component={ProjectDetail} />
      <Route path={"/projeler"} component={ProjectsNew} />
      <Route path={"/teknik-bilgiler/:slug"} component={KnowledgePost} />
      <Route path={"/teknik-bilgiler"} component={KnowledgeNew} />
      <Route path={"/blog"} component={LegacyBlogRedirect} />
      <Route path={"/iletisim"} component={ContactNew} />
      <Route path={"/sss"} component={() => <ServiceFAQ />} />
      <Route path={"/kvkk"} component={() => <Legal type="kvkk" />} />
      <Route path={"/gizlilik"} component={() => <Legal type="gizlilik" />} />
      <Route path={"/cerez"} component={() => <Legal type="cerez" />} />
      <Route path={"/site-haritasi"} component={Sitemap} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/yonetim");
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <PageHead location={location} />
          <div className="app-shell">
            <a className="skip-link" href="#main-content">
              Ana içeriğe geç
            </a>
            {!isAdminRoute && <SiteHeader />}
            <main id="main-content">
              <Suspense fallback={<div className="route-loading" role="status">Sayfa yükleniyor…</div>}><Router /></Suspense>
            </main>
            {!isAdminRoute && <SiteFooter />}
            {!isAdminRoute && <BackToTop />}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
