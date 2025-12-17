
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Scale, TrendingUp, DollarSign } from 'lucide-react';

export default async function DecisionsPage() {
    const supabase = await createClient();
    const { data: decisions } = await supabase.from('asset_decisions').select('*, assets(tag, name)').order('created_at', { ascending: false });

    const totalCapex = decisions?.filter(d => d.decision_type === 'capex').length || 0;
    const approvedValue = decisions?.filter(d => d.status === 'approved').reduce((sum, d) => sum + (d.estimated_cost || 0), 0) || 0;
    const pendingCount = decisions?.filter(d => d.status === 'proposed' || d.status === 'analyzing').length || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Decision Making</h1>
                    <p className="subheading">Group 2: Asset Decision-Making (Capital Planning)</p>
                </div>
                <Link href="/decisions/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    New Proposal
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-2 mb-1 text-purple-700 dark:text-purple-400">
                        <Scale className="h-4 w-4" />
                        <h3 className="font-medium">Total Proposals</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">
                        {decisions?.length || 0}
                        <span className="text-sm font-normal text-purple-600 dark:text-purple-400 ml-2">({totalCapex} CAPEX)</span>
                    </p>
                </div>
                <div className="dashboard-card bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 mb-1 text-amber-700 dark:text-amber-400">
                        <TrendingUp className="h-4 w-4" />
                        <h3 className="font-medium">Pending Decisions</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                        {pendingCount}
                    </p>
                </div>
                <div className="dashboard-card bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-2 mb-1 text-emerald-700 dark:text-emerald-400">
                        <DollarSign className="h-4 w-4" />
                        <h3 className="font-medium">Approved Value</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                        ${approvedValue.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="dashboard-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Project Title</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Type</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Est. Cost</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">ROI</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {decisions?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No decisions or projects found. Create a proposal.
                                    </td>
                                </tr>
                            ) : (
                                decisions?.map((d) => (
                                    <tr key={d.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            {d.title}
                                            {d.assets && <span className="block text-xs text-[hsl(var(--muted-foreground))] font-normal">{d.assets.tag}</span>}
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--card))] border">
                                                {d.decision_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase
                            ${d.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    d.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono">${d.estimated_cost?.toLocaleString() || '0'}</td>
                                        <td className="px-6 py-4 font-mono text-green-600">{d.roi ? `${d.roi}%` : '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/decisions/${d.id}`} className="text-[hsl(var(--primary))] hover:underline">Analyze</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
