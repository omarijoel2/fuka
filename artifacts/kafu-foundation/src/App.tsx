import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAnalyticsInit } from "@/lib/use-analytics";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import Home from "@/pages/home";
import About from "@/pages/about";
import Schools from "@/pages/schools";
import SchoolDetails from "@/pages/school-details";
import Programmes from "@/pages/programmes";
import ProgrammeDetail from "@/pages/programme-detail";
import StaffDirectory from "@/pages/staff-directory";
import StaffProfilePage from "@/pages/staff-profile";
import Admissions from "@/pages/admissions";
import KuccpsVerify from "@/pages/kuccps-verify";
import AdmissionsEligibility from "@/pages/admissions-eligibility";
import AdmissionsFees from "@/pages/admissions-fees";
import ProgrammeCompare from "@/pages/programme-compare";
import StudentServices from "@/pages/student-services";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import Events from "@/pages/events";
import EventDetail from "@/pages/event-detail";
import Announcements from "@/pages/announcements";
import AnnouncementDetail from "@/pages/announcement-detail";
import Opportunities from "@/pages/opportunities";
import OpportunityDetail from "@/pages/opportunity-detail";
import Contact from "@/pages/contact";
import Campuses from "@/pages/campuses";
import CampusDetail from "@/pages/campus-detail";
import Offices from "@/pages/offices";
import OfficeDetail from "@/pages/office-detail";
import Research from "@/pages/research";
import ResearchProjects from "@/pages/research-projects";
import ResearchProjectDetail from "@/pages/research-project-detail";
import ResearchPublications from "@/pages/research-publications";
import ResearchPublicationDetail from "@/pages/research-publication-detail";
import ResearchPartnerships from "@/pages/research-partnerships";
import InternationalPage from "@/pages/international";
import InternationalStudy from "@/pages/international-study";
import InternationalVisa from "@/pages/international-visa";
import InternationalPartnerships from "@/pages/international-partnerships";
import InternationalExchange from "@/pages/international-exchange";
import RepositoryPage from "@/pages/repository";
import RepositoryBrowse from "@/pages/repository-browse";
import RepositoryItem from "@/pages/repository-item";
import CouncilPage from "@/pages/council";
import ManagementPage from "@/pages/management";
import StrategicPlan from "@/pages/about-strategic-plan";
import AboutPolicies from "@/pages/about-policies";
import ServiceCharter from "@/pages/about-service-charter";
import AboutComplaints from "@/pages/about-complaints";
import AboutLegal from "@/pages/about-legal";
import AboutCSR from "@/pages/about-csr";
import Archives from "@/pages/archives";
import AdmissionsApply from "@/pages/admissions-apply";
import AdmissionsTrack from "@/pages/admissions-track";
import AdmissionsCalendar from "@/pages/admissions-calendar";
import AdmissionsFunding from "@/pages/admissions-funding";
import AdmissionsJoiningInstructions from "@/pages/admissions-joining-instructions";
import AdmissionsTimetables from "@/pages/admissions-timetables";
import ResearchEthics from "@/pages/research-ethics";
import SearchPage from "@/pages/search";
import DirectoratesPage from "@/pages/directorates";
import DirectorateDetail from "@/pages/directorate-detail";
import GalleryPage from "@/pages/gallery";
import GalleryAlbumPage from "@/pages/gallery-album";
import DepartmentDetail from "@/pages/department-detail";
import MediaPage from "@/pages/media";
import MediaVideosPage from "@/pages/media-videos";
import MediaPressReleasesPage from "@/pages/media-press-releases";
import MediaPublicationsPage from "@/pages/media-publications";
import MediaDownloadsPage from "@/pages/media-downloads";
import MediaBrandingPage from "@/pages/media-branding";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function Router() {
  useAnalyticsInit();
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
          <Route path="/programmes/compare" component={ProgrammeCompare} />
          <Route path="/programmes/:school/:code" component={ProgrammeDetail} />
          <Route path="/staff" component={StaffDirectory} />
          <Route path="/staff/:slug" component={StaffProfilePage} />
          <Route path="/admissions" component={Admissions} />
          <Route path="/kuccps-verify" component={KuccpsVerify} />
          <Route path="/admissions/eligibility" component={AdmissionsEligibility} />
          <Route path="/admissions/fees" component={AdmissionsFees} />
          <Route path="/student-services" component={StudentServices} />
          <Route path="/news" component={News} />
          <Route path="/news/:slug" component={NewsDetail} />
          <Route path="/events" component={Events} />
          <Route path="/events/:slug" component={EventDetail} />
          <Route path="/announcements" component={Announcements} />
          <Route path="/announcements/:slug" component={AnnouncementDetail} />
          <Route path="/opportunities" component={Opportunities} />
          <Route path="/opportunities/:slug" component={OpportunityDetail} />
          <Route path="/contact" component={Contact} />
          <Route path="/campuses" component={Campuses} />
          <Route path="/campuses/:slug" component={CampusDetail} />
          <Route path="/offices" component={Offices} />
          <Route path="/offices/:slug" component={OfficeDetail} />
          <Route path="/research" component={Research} />
          <Route path="/research/projects" component={ResearchProjects} />
          <Route path="/research/projects/:slug">
            {(params) => <ResearchProjectDetail slug={params.slug ?? ""} />}
          </Route>
          <Route path="/research/publications" component={ResearchPublications} />
          <Route path="/research/publications/:slug">
            {(params) => <ResearchPublicationDetail slug={params.slug ?? ""} />}
          </Route>
          <Route path="/research/partnerships" component={ResearchPartnerships} />
          <Route path="/international" component={InternationalPage} />
          <Route path="/international/study" component={InternationalStudy} />
          <Route path="/international/visa" component={InternationalVisa} />
          <Route path="/international/partnerships" component={InternationalPartnerships} />
          <Route path="/international/exchange" component={InternationalExchange} />
          <Route path="/repository" component={RepositoryPage} />
          <Route path="/repository/browse" component={RepositoryBrowse} />
          <Route path="/repository/items/:slug" component={RepositoryItem} />
          <Route path="/about/council" component={CouncilPage} />
          <Route path="/about/management" component={ManagementPage} />
          <Route path="/about/strategic-plan" component={StrategicPlan} />
          <Route path="/about/policies" component={AboutPolicies} />
          <Route path="/about/service-charter" component={ServiceCharter} />
          <Route path="/about/complaints" component={AboutComplaints} />
          <Route path="/about/legal" component={AboutLegal} />
          <Route path="/about/csr" component={AboutCSR} />
          <Route path="/archives" component={Archives} />
          <Route path="/admissions/apply" component={AdmissionsApply} />
          <Route path="/admissions/track" component={AdmissionsTrack} />
          <Route path="/admissions/calendar" component={AdmissionsCalendar} />
          <Route path="/admissions/funding" component={AdmissionsFunding} />
          <Route path="/admissions/joining-instructions" component={AdmissionsJoiningInstructions} />
          <Route path="/admissions/timetables" component={AdmissionsTimetables} />
          <Route path="/research/ethics" component={ResearchEthics} />
          <Route path="/search" component={SearchPage} />
          <Route path="/directorates" component={DirectoratesPage} />
          <Route path="/directorates/:slug">
            {(params) => <DirectorateDetail slug={params.slug ?? ""} />}
          </Route>
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/gallery/:slug" component={GalleryAlbumPage} />
          <Route path="/media" component={MediaPage} />
          <Route path="/media/videos" component={MediaVideosPage} />
          <Route path="/media/press-releases" component={MediaPressReleasesPage} />
          <Route path="/media/publications" component={MediaPublicationsPage} />
          <Route path="/media/downloads" component={MediaDownloadsPage} />
          <Route path="/media/branding" component={MediaBrandingPage} />
          <Route path="/departments/:slug" component={DepartmentDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
