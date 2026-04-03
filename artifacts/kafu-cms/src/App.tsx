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
