import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, AlertTriangle, ShieldAlert } from 'lucide-react';

export default async function RiskPage() {
    const supabase = await createClient();
    const { data: risks } = await supabase.from('risks').select('*, assets(tag, name), strategic_plans(title)').order('risk_score', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Risk Management</h1>
                    <p className="subheading">Group 6: Risk & Review (ISO 31000)</p>
                </div>
                <Link href="/risk/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    New Risk Assessment
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <div className="dashboard-card bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <h3 className="text-red-700 dark:text-red-400 font-medium mb-1">Critical Risks</h3>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-300">
                        {risks?.filter(r => r.risk_score >= 15).length || 0}
                    </p>
                </div>
                <div className="dashboard-card bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
                    <h3 className="text-orange-700 dark:text-orange-400 font-medium mb-1">High/Medium Risks</h3>
                    <p className="text-3xl font-bold text-orange-800 dark:text-orange-300">
                        {risks?.filter(r => r.risk_score >= 8 && r.risk_score < 15).length || 0}
                    </p>
                </div>
                <div className="dashboard-card bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
                    <h3 className="text-green-700 dark:text-green-400 font-medium mb-1">Low Risks</h3>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-300">
                        {risks?.filter(r => r.risk_score < 8).length || 0}
                    </p>
                </div>
            </div>

            <div className="dashboard-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Title</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Related Asset</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Category</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Score (LxI)</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {risks?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No risks recorded. Start an assessment.
                                    </td>
                                </tr>
                            ) : (
                                risks?.map((risk) => (
                                    <tr key={risk.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                        <td className="px-6 py-4 font-medium">{risk.title}</td>
                                        <td className="px-6 py-4">
                                            {risk.assets ? (
                                                <Link href={`/assets/${risk.asset_id}`} className="hover:underline text-[hsl(var(--primary))]">
                                                    {risk.assets.tag}
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 capitalize">{risk.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${risk.risk_score >= 15 ? 'bg-red-100 text-red-800' :
                                                    risk.risk_score >= 8 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                                {risk.risk_score}
                                                <span className="ml-1 opacity-75">({risk.likelihood}x{risk.impact})</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/risk/${risk.id}`} className="text-[hsl(var(--primary))] hover:underline">View</Link>
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
