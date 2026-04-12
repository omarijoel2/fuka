import { Switch, Route, Router as WouterRouter } from "wouter";
import { AuthProvider, useAuth } from "@/lib/auth";
import { CmsLayout } from "@/components/layout";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import ContentLibraryPage from "@/pages/content-library";
import ContentEditorPage from "@/pages/content-editor";
import ReviewQueuePage from "@/pages/review-queue";
import MediaLibraryPage from "@/pages/media-library";
import UsersPage from "@/pages/users";
import TaxonomyPage from "@/pages/taxonomy";
import AuditLogPage from "@/pages/audit-log";
import SettingsPage from "@/pages/settings";
import SiteSettingsPage from "@/pages/site-settings";
import ResearchThemesPage from "@/pages/research-themes";
import ResearchProjectsCmsPage from "@/pages/research-projects-cms";
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

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <CmsLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/content" component={ContentLibraryPage} />
        <Route path="/content/new">{() => <ContentEditorPage />}</Route>
        <Route path="/content/:id">{(params: { id: string }) => <ContentEditorPage id={params.id} />}</Route>
        <Route path="/review-queue" component={ReviewQueuePage} />
        <Route path="/media" component={MediaLibraryPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/taxonomy" component={TaxonomyPage} />
        <Route path="/audit" component={AuditLogPage} />
        <Route path="/site-settings" component={SiteSettingsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/research/themes" component={ResearchThemesPage} />
        <Route path="/research/projects" component={ResearchProjectsCmsPage} />
        <Route path="/research/publications" component={ResearchPublicationsCmsPage} />
        <Route path="/research/grants" component={ResearchGrantsCmsPage} />
        <Route path="/research/partners" component={ResearchPartnersCmsPage} />
        <Route path="/international/partnerships" component={InternationalPartnershipsCmsPage} />
        <Route path="/international/exchange" component={ExchangeProgrammesCmsPage} />
        <Route path="/repository" component={RepositoryCmsPage} />
        <Route path="/staff-profiles" component={StaffProfilesCmsPage} />
        <Route path="/campuses" component={CampusesCmsPage} />
        <Route path="/offices" component={OfficesCmsPage} />
        <Route path="/staff-review" component={StaffReviewCmsPage} />
        <Route path="/staff-accounts" component={StaffAccountsCmsPage} />
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
