
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default async function RiskDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: risk } = await supabase.from('risks').select('*, assets(*), strategic_plans(*)').eq('id', id).single();

    if (!risk) {
        return <div>Risk not found</div>;
    }

    // Calculate color
    const score = risk.risk_score;
    const colorClass = score >= 15 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' :
        score >= 8 ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' :
            'text-green-600 bg-green-100 dark:bg-green-900/30';

    return (
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <Link href="/risk" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors mt-1">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="heading-xl mb-1">{risk.title}</h1>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
                            Level {score}
                        </span>
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            Likelihood: <span className="font-medium text-[hsl(var(--foreground))]">{risk.likelihood}</span> x
                            Impact: <span className="font-medium text-[hsl(var(--foreground))]">{risk.impact}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="dashboard-card space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-2">Details</h3>
                        <p className="leading-relaxed">{risk.description || 'No description.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[hsl(var(--card-border))]">
                        <div>
                            <span className="block text-xs text-[hsl(var(--muted-foreground))]">Category</span>
                            <span className="font-medium capitalize">{risk.category}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-[hsl(var(--muted-foreground))]">Created</span>
                            <span className="font-medium">{new Date(risk.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Linked Entities */}
                    <div className="dashboard-card bg-[hsl(var(--muted))/30]">
                        <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-4">Line of Sight</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">Related Asset</span>
                                {risk.assets ? (
                                    <Link href={`/assets/${risk.asset_id}`} className="flex items-center gap-2 p-2 bg-[hsl(var(--card))] border rounded-md hover:border-[hsl(var(--primary))] transition-colors">
                                        <div className="bg-gray-200 dark:bg-gray-800 p-1.5 rounded">
                                            <span className="text-xs font-bold font-mono">{risk.assets.tag}</span>
                                        </div>
                                        <span className="text-sm font-medium">{risk.assets.name}</span>
                                    </Link>
                                ) : (
                                    <span className="text-sm italic text-[hsl(var(--muted-foreground))]">Not linked to specific asset</span>
                                )}
                            </div>

                            <div>
                                <span className="block text-xs text-[hsl(var(--muted-foreground))] mb-1">Impacted Strategy</span>
                                {risk.strategic_plans ? (
                                    <Link href={`/strategy/${risk.strategic_plan_id}`} className="flex items-center gap-2 p-2 bg-[hsl(var(--card))] border rounded-md hover:border-[hsl(var(--primary))] transition-colors">
                                        <ShieldAlert className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                        <span className="text-sm font-medium truncate">{risk.strategic_plans.title}</span>
                                    </Link>
                                ) : (
                                    <span className="text-sm italic text-[hsl(var(--muted-foreground))]">Not linked to strategic plan</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mitigation */}
                    <div className="dashboard-card border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10">
                        <h3 className="text-sm font-medium text-green-800 dark:text-green-400 uppercase tracking-wide mb-2">Mitigation Strategy</h3>
                        <p className="text-sm text-green-900 dark:text-green-100">{risk.mitigation_strategy || 'No mitigation strategy defined yet.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
