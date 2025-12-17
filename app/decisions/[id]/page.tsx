
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, Scale, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function DecisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: decision } = await supabase.from('asset_decisions').select('*, assets(*), strategic_plans(*)').eq('id', id).single();

    if (!decision) {
        return <div>Decision not found</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <Link href="/decisions" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors mt-1">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm text-[hsl(var(--primary))] font-medium mb-1 block uppercase tracking-wide">Business Case</span>
                            <h1 className="heading-xl mb-2">{decision.title}</h1>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase border
                      ${decision.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                decision.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                            {decision.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card">
                        <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="p-4 bg-[hsl(var(--muted))/50] rounded-lg text-center">
                                <span className="block text-sm text-[hsl(var(--muted-foreground))] mb-1">Estimated Cost</span>
                                <span className="text-xl font-bold">${decision.estimated_cost?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="p-4 bg-[hsl(var(--muted))/50] rounded-lg text-center">
                                <span className="block text-sm text-[hsl(var(--muted-foreground))] mb-1">Expected Benefit</span>
                                <span className="text-xl font-bold text-green-600">${decision.benefit_value?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="p-4 bg-[hsl(var(--muted))/50] rounded-lg text-center">
                                <span className="block text-sm text-[hsl(var(--muted-foreground))] mb-1">ROI</span>
                                <span className="text-xl font-bold text-[hsl(var(--primary))]">{decision.roi || '0'}%</span>
                            </div>
                        </div>

                        <h4 className="font-medium mb-2">Justification</h4>
                        <p className="text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed bg-[hsl(var(--muted))/20] p-4 rounded-md">
                            {decision.justification || 'No justification provided.'}
                        </p>

                        <h4 className="font-medium mb-2">Scope & Description</h4>
                        <p className="leading-relaxed">
                            {decision.description || 'No description provided.'}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Linked Strategy */}
                    <div className="dashboard-card bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30">
                        <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 uppercase tracking-wide mb-4">Strategic Alignment</h3>
                        {decision.strategic_plans ? (
                            <Link href={`/strategy/${decision.strategic_plan_id}`} className="block group">
                                <h4 className="font-semibold text-purple-900 dark:text-purple-100 group-hover:underline">{decision.strategic_plans.title}</h4>
                                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1 lines-clamp-2">{decision.strategic_plans.mission_statement}</p>
                            </Link>
                        ) : (
                            <p className="text-sm italic text-purple-700">Not aligned to a specific strategic plan.</p>
                        )}
                    </div>

                    {/* Linked Asset */}
                    <div className="dashboard-card">
                        <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-4">Target Asset</h3>
                        {decision.assets ? (
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[hsl(var(--muted))] rounded flex items-center justify-center font-bold text-xs">
                                    {decision.assets.tag.slice(0, 3)}
                                </div>
                                <div>
                                    <Link href={`/assets/${decision.asset_id}`} className="font-medium hover:underline block">{decision.assets.name}</Link>
                                    <span className="text-xs text-[hsl(var(--muted-foreground))]">{decision.assets.tag}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm italic text-[hsl(var(--muted-foreground))]">New Asset / Not Specified</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
