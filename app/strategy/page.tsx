import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Calendar, Target } from 'lucide-react';

export default async function StrategyPage() {
    const supabase = await createClient();
    const { data: plans } = await supabase.from('strategic_plans').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Strategic Asset Management</h1>
                    <p className="subheading">Group 1: Strategy & Planning (SAMP)</p>
                </div>
                <Link href="/strategy/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    New Plan
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans?.length === 0 ? (
                    <div className="col-span-full dashboard-card text-center py-12">
                        <div className="inline-flex p-3 rounded-full bg-[hsl(var(--muted))] mb-4">
                            <Target className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Strategic Plans Found</h3>
                        <p className="text-[hsl(var(--muted-foreground))] mb-4">Create a SAMP to align your assets with organizational objectives.</p>
                    </div>
                ) : (
                    plans?.map((plan) => (
                        <Link key={plan.id} href={`/strategy/${plan.id}`} className="dashboard-card hover:border-[hsl(var(--primary))] transition-colors group block">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-[hsl(var(--primary))/10] rounded-md text-[hsl(var(--primary))]">
                                    <Target className="h-6 w-6" />
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase border
                      ${plan.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                    {plan.status}
                                </span>
                            </div>

                            <h3 className="font-semibold text-lg mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">{plan.title}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2 mb-4">
                                {plan.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] mt-auto pt-4 border-t border-[hsl(var(--card-border))]">
                                <Calendar className="h-3 w-3" />
                                <span>{plan.period_start} - {plan.period_end}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
