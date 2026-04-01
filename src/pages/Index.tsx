import { useCovidData } from "@/hooks/useCovidData";
import CovidTable from "@/components/CovidTable";
import CovidChart from "@/components/CovidChart";
import { useState } from "react";

const Index = () => {
  const { data, isLoading, error } = useCovidData();
  const [activeTab, setActiveTab] = useState<"chart" | "table">("table");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">
            Failed to load data. Please try again later.
          </div>
        )}

        {data && (
          <>
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("table")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "table"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setActiveTab("chart")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "chart"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Chart View
              </button>
            </div>

            {activeTab === "chart" && <CovidChart data={data} />}
            {activeTab === "table" && <CovidTable data={data} />}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
