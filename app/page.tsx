import { ArrowUpRight, BarChart3, CheckCircle, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl">Dashboard</h1>
          <p className="subheading">Line of Sight: Corporate Objectives to Asset Performance</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--card-border))] rounded-md text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            New Assessment
          </button>
        </div>
      </div>

      {/* Top Level: Strategic Objectives */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card border-l-4 border-l-[hsl(var(--accent))]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Corporate Objective</p>
              <h3 className="text-lg font-semibold mt-1">Reduce Carbon Footprint</h3>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">-12%</span>
              <span className="text-sm text-[hsl(var(--accent))] bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">On Track</span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">Target: -15% by Q4</p>
          </div>
        </div>

        <div className="dashboard-card border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Corporate Objective</p>
              <h3 className="text-lg font-semibold mt-1">Operational Availability</h3>
            </div>
            <BarChart3 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">98.5%</span>
              <span className="text-sm text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Stable</span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">Target: &gt;99%</p>
          </div>
        </div>

        <div className="dashboard-card border-l-4 border-l-orange-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Risk Management</p>
              <h3 className="text-lg font-semibold mt-1">Critical Risks</h3>
            </div>
            <AlertTriangle className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">3</span>
              <span className="text-sm text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">Requires Action</span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">High criticality risks identified</p>
          </div>
        </div>
      </section>

      {/* Middle Level: Asset Portfolio Health */}
      <section>
        <h2 className="text-xl font-bold mb-4">Asset Portfolio Health</h2>
        <div className="dashboard-card">
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-[hsl(var(--card-border))] rounded-lg">
            <p className="text-[hsl(var(--muted-foreground))]">Chart Placeholder: Portfolio Value vs Risk</p>
          </div>
        </div>
      </section>
    </div>
  );
}
