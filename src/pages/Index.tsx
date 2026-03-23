import ParticleBackground from "@/components/dashboard/ParticleBackground";
import Navbar from "@/components/dashboard/Navbar";
import OverviewCards from "@/components/dashboard/OverviewCards";
import CryptoRadarTable from "@/components/dashboard/CryptoRadarTable";
import TrendingTopics from "@/components/dashboard/TrendingTopics";
import PumpSignals from "@/components/dashboard/PumpSignals";
import NewsFeed from "@/components/dashboard/NewsFeed";
import AIInsights from "@/components/dashboard/AIInsights";
import BotAlerts from "@/components/dashboard/BotAlerts";
import Backtesting from "@/components/dashboard/Backtesting";
import AIActivityPanel from "@/components/dashboard/AIActivityPanel";
import Footer from "@/components/dashboard/Footer";

const Index = () => (
  <div className="min-h-screen bg-background relative">
    <ParticleBackground />
    <div className="relative z-10">
      <Navbar />
      <main className="container py-6 space-y-6">
        <OverviewCards />
        <CryptoRadarTable />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendingTopics />
          <PumpSignals />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NewsFeed />
          <AIInsights />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BotAlerts />
          <Backtesting />
          <AIActivityPanel />
        </div>
      </main>
      <Footer />
    </div>
  </div>
);

export default Index;
