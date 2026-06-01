import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth";
import LoginPage from "@/pages/login";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import ProfileEditorPage from "@/pages/profile-editor";
import HistoryPage from "@/pages/history";
import ReviewQueuePage from "@/pages/review-queue";
import ReviewerStaffProfilesPage from "@/pages/reviewer-staff-profiles";
import AccountsPage from "@/pages/accounts";
import { StaffLayout } from "@/components/layout";

const queryClient = new QueryClient();

const REVIEWER_ROLES = ["reviewer", "super_admin", "ict_admin", "communications_admin"];
const STAFF_PROFILES_ROLES = ["reviewer", "super_admin", "ict_admin"];
const ADMIN_ROLES = ["super_admin", "ict_admin"];

function AppRoutes() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Redirect to onboarding if needed
  if (!user.first_login_completed || !user.has_consent) {
    return <OnboardingPage />;
  }

  return (
    <StaffLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/profile" component={ProfileEditorPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/review">
          {() => REVIEWER_ROLES.includes(user.role)
            ? <ReviewQueuePage />
            : <div className="text-center py-20 text-gray-400">Access denied.</div>
          }
        </Route>
        <Route path="/staff-profiles">
          {() => STAFF_PROFILES_ROLES.includes(user.role)
            ? <ReviewerStaffProfilesPage />
            : <div className="text-center py-20 text-gray-400">Access denied.</div>
          }
        </Route>
        <Route path="/accounts">
          {() => ADMIN_ROLES.includes(user.role)
            ? <AccountsPage />
            : <div className="text-center py-20 text-gray-400">Access denied.</div>
          }
        </Route>
        <Route>
          <div className="text-center py-20 text-gray-400">Page not found.</div>
        </Route>
      </Switch>
    </StaffLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
