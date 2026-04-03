import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Overview from "@/pages/overview";
import DesignSystem from "@/pages/design-system";
import ComponentInventory from "@/pages/components";
import CMSGovernance from "@/pages/cms-governance";
import RolesPermissions from "@/pages/roles-permissions";
import Security from "@/pages/security";
import SEO from "@/pages/seo";
import Accessibility from "@/pages/accessibility";
import Analytics from "@/pages/analytics";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Overview} />
        <Route path="/design-system" component={DesignSystem} />
        <Route path="/components" component={ComponentInventory} />
        <Route path="/cms-governance" component={CMSGovernance} />
        <Route path="/roles-permissions" component={RolesPermissions} />
        <Route path="/security" component={Security} />
        <Route path="/seo" component={SEO} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/analytics" component={Analytics} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
