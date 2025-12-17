
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, Calendar, Target, Flag } from 'lucide-react';
import Link from 'next/link';

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: plan } = await supabase.from('strategic_plans').select('*').eq('id', id).single();

    if (!plan) {
        return <div>Plan not found</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/strategy" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors mt-1">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm text-[hsl(var(--primary))] font-medium mb-1 block">SAMP - Strategic Asset Management Plan</span>
                            <h1 className="heading-xl mb-2">{plan.title}</h1>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase border
                      ${plan.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {plan.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))] mt-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Period: {plan.period_start} to {plan.period_end}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card">
                        <h3 className="text-lg font-semibold mb-4">Executive Summary</h3>
                        <p className="leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="dashboard-card bg-[hsl(var(--primary))/5] border-[hsl(var(--primary))/10]">
                            <div className="flex items-center gap-2 mb-3 text-[hsl(var(--primary))]">
                                <Target className="h-5 w-5" />
                                <h3 className="font-semibold">Mission</h3>
                            </div>
                            <p className="text-sm italic">"{plan.mission_statement}"</p>
                        </div>
                        <div className="dashboard-card bg-[hsl(var(--primary))/5] border-[hsl(var(--primary))/10]">
                            <div className="flex items-center gap-2 mb-3 text-[hsl(var(--primary))]">
                                <Flag className="h-5 w-5" />
                                <h3 className="font-semibold">Vision</h3>
                            </div>
                            <p className="text-sm italic">"{plan.vision_statement}"</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Related Info */}
                <div className="space-y-6">
                    <div className="dashboard-card">
                        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Linked Objectives</h3>
                        <div className="py-8 text-center border border-dashed rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                            No asset objectives linked yet.
                            <button className="block mx-auto mt-2 text-[hsl(var(--primary))] hover:underline">Add Objective</button>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Key Risks</h3>
                        <div className="py-8 text-center border border-dashed rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                            No risks assessed for this plan.
                            <button className="block mx-auto mt-2 text-[hsl(var(--primary))] hover:underline">Assess Risks</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
