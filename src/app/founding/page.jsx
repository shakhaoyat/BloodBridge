import FundingPage from "@/components/founding/FundingPage";
import TotalFundsCard from "@/components/founding/TotalFundsCard";

const Funding = () => {
      return (
            <main className="relative min-h-screen overflow-hidden bg-[#070D18]">
                  {/* Background Effects */}
                  <div className="absolute inset-0 -z-10">
                        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-red-600/10 blur-[140px]" />
                        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-rose-500/10 blur-[140px]" />
                        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
                  </div>

                  <div className="container mx-auto max-w-7xl px-4 py-10 space-y-8">
                        {/* Summary Card */}
                        <TotalFundsCard />

                        {/* Funding Table */}
                        <FundingPage />
                  </div>
            </main>
      );
};

export default Funding;