import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import Home from "@/pages/home";
import About from "@/pages/about";
import Schools from "@/pages/schools";
import SchoolDetails from "@/pages/school-details";
import Programmes from "@/pages/programmes";
import ProgrammeDetail from "@/pages/programme-detail";
import Admissions from "@/pages/admissions";
import StudentServices from "@/pages/student-services";
import News from "@/pages/news";
import Events from "@/pages/events";
import Opportunities from "@/pages/opportunities";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/schools" component={Schools} />
          <Route path="/schools/:code" component={SchoolDetails} />
          <Route path="/programmes" component={Programmes} />
          <Route path="/programmes/:school/:code" component={ProgrammeDetail} />
          <Route path="/admissions" component={Admissions} />
          <Route path="/student-services" component={StudentServices} />
          <Route path="/news" component={News} />
          <Route path="/events" component={Events} />
          <Route path="/opportunities" component={Opportunities} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
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
