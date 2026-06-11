import React, { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { AuthProvider, useAuth } from "@/lib/auth";
import { CmsLayout } from "@/components/layout";
import { AccessDenied } from "@/components/access-denied";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ContentLibraryPage from "@/pages/content-library";
import ContentEditorPage from "@/pages/content-editor";
import ReviewQueuePage from "@/pages/review-queue";
import MediaLibraryPage from "@/pages/media-library";
import UsersPage from "@/pages/users";
import PermissionsMatrixPage from "@/pages/permissions-matrix";
import AdmissionsFeesAdminPage from "@/pages/admissions-fees-cms";
import TaxonomyPage from "@/pages/taxonomy";
import AuditLogPage from "@/pages/audit-log";
import SettingsPage from "@/pages/settings";
import SiteSettingsPage from "@/pages/site-settings";
import ResearchThemesPage from "@/pages/research-themes";
import ResearchProjectsCmsPage from "@/pages/research-projects-cms";
import AlumniCmsPage from "@/pages/alumni-cms";
import AlumniStoriesCmsPage from "@/pages/alumni-stories-cms";
import EmployerPartnersCmsPage from "@/pages/employer-partners-cms";
import GraduateOutcomesCmsPage from "@/pages/graduate-outcomes-cms";
import InstitutionalKpisCmsPage from "@/pages/institutional-kpis-cms";
import RankingsCmsPage from "@/pages/rankings-cms";
import InstitutionalReportsCmsPage from "@/pages/institutional-reports-cms";
import AccreditationsCmsPage from "@/pages/accreditations-cms";
import ResearchPublicationsCmsPage from "@/pages/research-publications-cms";
import ResearchGrantsCmsPage from "@/pages/research-grants-cms";
import ResearchPartnersCmsPage from "@/pages/research-partners-cms";
import InternationalPartnershipsCmsPage from "@/pages/international-partnerships-cms";
import ExchangeProgrammesCmsPage from "@/pages/exchange-programmes-cms";
import RepositoryCmsPage from "@/pages/repository-cms";
import StaffProfilesCmsPage from "@/pages/staff-profiles-cms";
import CampusesCmsPage from "@/pages/campuses-cms";
import OfficesCmsPage from "@/pages/offices-cms";
import StaffReviewCmsPage from "@/pages/staff-review-cms";
import StaffAccountsCmsPage from "@/pages/staff-accounts-cms";
import HomepageManagerPage from "@/pages/homepage-manager";
import HeroSlidesCmsPage from "@/pages/hero-slides-cms";
import NavigationManagerPage from "@/pages/navigation-manager";
import SiteControlsPage from "@/pages/site-controls";
import RedirectsCmsPage from "@/pages/redirects-cms";
import AboutCmsPage from "@/pages/about-cms";
import StudentServicesCmsPage from "@/pages/student-services-cms";
import CouncilMembersCmsPage from "@/pages/council-members-cms";
import ManagementProfilesCmsPage from "@/pages/management-profiles-cms";
import VcOfficeProfilesCmsPage from "@/pages/vc-office-profiles-cms";
import DirectoratesCmsPage from "@/pages/directorates-cms";
import GalleryCmsPage from "@/pages/gallery-cms";
import DepartmentsCmsPage from "@/pages/departments-cms";
import SchoolsCmsPage from "@/pages/schools-cms";
import ProgrammesCmsPage from "@/pages/programmes-cms";
import ContentHealthPage from "@/pages/content-health";
import WorkflowConsolePage from "@/pages/workflow-console";
import AdmissionsCmsPage from "@/pages/admissions-cms";
import KuccpsImportWizard from "@/pages/kuccps-import-wizard";
import MediaHubCmsPage from "@/pages/media-hub-cms";
import PagesManagerCmsPage from "@/pages/pages-manager-cms";
import BrandingSettingsPage from "@/pages/branding-settings";
import GovernanceStrategicPlanPage from "@/pages/governance-strategic-plan";
import GovernancePoliciesPage from "@/pages/governance-policies";
import GovernanceServiceCharterPage from "@/pages/governance-service-charter";
import ArticlesCmsPage from "@/pages/articles-cms";
import WebmasterGovernancePage from "@/pages/webmaster-governance";
import ContentFreshnessPage from "@/pages/content-freshness";
import WebmasterTasksPage from "@/pages/webmaster-tasks";
import GovernanceReportsPage from "@/pages/governance-reports";
const NoticesManagerPage = lazy(() => import("./pages/notices-manager"));

// ─── Role constants ───────────────────────────────────────────────────────────
const ADMIN_ROLES    = ["super_admin", "ict_admin", "communications_admin"];
const REVIEWER_ROLES = [...ADMIN_ROLES, "reviewer"];
const WEBMASTER_ROLES = [...ADMIN_ROLES, "webmaster"];

// ─── Route-level RBAC guard ───────────────────────────────────────────────────
function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  if (user && !roles.includes(user.role)) {
    return (
      <AccessDenied
        message="You do not have permission to access this section."
        requiredRole={
          roles.includes("super_admin") && roles.length === 1
            ? "Super Admin"
            : roles.includes("reviewer")
            ? "Reviewer or above"
            : "Administrator"
        }
      />
    );
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <CmsLayout>
      <Switch>
        {/* ── Open to all authenticated CMS users ── */}
        <Route path="/" component={DashboardPage} />
        <Route path="/content" component={ContentLibraryPage} />
        <Route path="/content/new">{() => <ContentEditorPage />}</Route>
        <Route path="/content/:id">{(params: { id: string }) => <ContentEditorPage id={params.id} />}</Route>
        <Route path="/articles" component={ArticlesCmsPage} />
        <Route path="/media" component={MediaLibraryPage} />

        {/* ── Reviewer + Admin ── */}
        <Route path="/review-queue">
          {() => (
            <RequireRole roles={REVIEWER_ROLES}>
              <ReviewQueuePage />
            </RequireRole>
          )}
        </Route>
        <Route path="/audit">
          {() => (
            <RequireRole roles={REVIEWER_ROLES}>
              <AuditLogPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/workflow">
          {() => (
            <RequireRole roles={REVIEWER_ROLES}>
              <WorkflowConsolePage />
            </RequireRole>
          )}
        </Route>
        <Route path="/content-health">
          {() => (
            <RequireRole roles={REVIEWER_ROLES}>
              <ContentHealthPage />
            </RequireRole>
          )}
        </Route>

        {/* ── Admin only ── */}
        <Route path="/users">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <UsersPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/permissions">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <PermissionsMatrixPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/fees">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsFeesAdminPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/taxonomy">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <TaxonomyPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/settings">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <SettingsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/site-settings">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <SiteSettingsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/branding-settings">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <BrandingSettingsPage />
            </RequireRole>
          )}
        </Route>

        {/* Webmaster Operations Console */}
        <Route path="/webmaster/governance">
          {() => (
            <RequireRole roles={WEBMASTER_ROLES}>
              <WebmasterGovernancePage />
            </RequireRole>
          )}
        </Route>
        <Route path="/webmaster/freshness">
          {() => (
            <RequireRole roles={WEBMASTER_ROLES}>
              <ContentFreshnessPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/webmaster/tasks">
          {() => (
            <RequireRole roles={WEBMASTER_ROLES}>
              <WebmasterTasksPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/webmaster/reports">
          {() => (
            <RequireRole roles={WEBMASTER_ROLES}>
              <GovernanceReportsPage />
            </RequireRole>
          )}
        </Route>

        {/* Research Office */}
        <Route path="/research/themes">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ResearchThemesPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/research/projects">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ResearchProjectsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/research/publications">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ResearchPublicationsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/research/grants">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ResearchGrantsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/research/partners">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ResearchPartnersCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* International Office */}
        <Route path="/international/partnerships">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <InternationalPartnershipsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/international/exchange">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ExchangeProgrammesCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Alumni & Graduate Outcomes */}
        <Route path="/alumni/profiles">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AlumniCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/alumni/stories">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AlumniStoriesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/alumni/employers">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <EmployerPartnersCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/alumni/outcomes">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <GraduateOutcomesCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Institutional Data & Transparency */}
        <Route path="/institutional/kpis">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <InstitutionalKpisCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/institutional/rankings">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <RankingsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/institutional/reports">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <InstitutionalReportsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/institutional/accreditations">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AccreditationsCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Repository */}
        <Route path="/repository">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <RepositoryCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Academic Profiles */}
        <Route path="/staff-profiles">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <StaffProfilesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/staff-review">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <StaffReviewCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/staff-accounts">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <StaffAccountsCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Academic Structure */}
        <Route path="/academic/schools">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <SchoolsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/academic/programmes">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ProgrammesCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Contact & Campus */}
        <Route path="/campuses">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <CampusesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/offices">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <OfficesCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Site Controls */}
        <Route path="/homepage">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <HomepageManagerPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/hero-slides">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <HeroSlidesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/site/about">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AboutCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/site/student-services">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <StudentServicesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/council">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <CouncilMembersCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/vc-office">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <VcOfficeProfilesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/management">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <ManagementProfilesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/directorates">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <DirectoratesCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/strategic-plan">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <GovernanceStrategicPlanPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/policies">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <GovernancePoliciesPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/governance/service-charter">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <GovernanceServiceCharterPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/media/gallery">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <GalleryCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/departments">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <DepartmentsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/navigation">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <NavigationManagerPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/site-controls">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <SiteControlsPage />
            </RequireRole>
          )}
        </Route>

        {/* SEO & Redirects */}
        <Route path="/redirects">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <RedirectsCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Admissions */}
        <Route path="/admissions">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/programmes">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/settings">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/applications">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/kuccps/wizard/:batchId?">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <KuccpsImportWizard />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/kuccps">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/admissions/uploads">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <AdmissionsCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Media Hub */}
        <Route path="/media-hub">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <MediaHubCmsPage />
            </RequireRole>
          )}
        </Route>
        <Route path="/media-hub/:tab">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <MediaHubCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Pages Manager */}
        <Route path="/pages-manager">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <PagesManagerCmsPage />
            </RequireRole>
          )}
        </Route>

        {/* Notices & Memos */}
        <Route path="/notices">
          {() => (
            <RequireRole roles={ADMIN_ROLES}>
              <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
                <NoticesManagerPage />
              </Suspense>
            </RequireRole>
          )}
        </Route>

        <Route>{() => <DashboardPage />}</Route>
      </Switch>
    </CmsLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <AppRoutes />
      </WouterRouter>
    </AuthProvider>
  );
}
