import { useState } from "react";
import { CovidCountry } from "@/hooks/useCovidData";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ROWS_PER_PAGE = 15;

interface Props {
  data: CovidCountry[];
}

const fmt = (n: number) => n.toLocaleString();

const CovidTable = ({ data }: Props) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const pageData = data.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-12 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Country</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Cases</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Deaths</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Recovered</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Active</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Critical</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Tests</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {pageData.map((c, i) => (
              <tr key={c.country} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {page * ROWS_PER_PAGE + i + 1}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.countryInfo.flag}
                      alt={c.country}
                      className="w-6 h-4 rounded-sm object-cover shadow-sm"
                    />
                    <span className="font-medium text-foreground">{c.country}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono text-chart-cases">{fmt(c.cases)}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-chart-deaths">{fmt(c.deaths)}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-chart-recovered">{fmt(c.recovered)}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-chart-active">{fmt(c.active)}</td>
                <td className="px-4 py-3 text-sm text-right font-mono">{fmt(c.critical)}</td>
                <td className="px-4 py-3 text-sm text-right font-mono text-muted-foreground">{fmt(c.tests)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages} ({data.length} countries)
        </span>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-border rounded-md bg-background text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-border rounded-md bg-background text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CovidTable;
