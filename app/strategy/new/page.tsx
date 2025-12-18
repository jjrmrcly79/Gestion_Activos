'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AITextArea from '@/components/ui/AITextArea';

export default function NewStrategyPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { data: newPlan, error } = await supabase
            .from('strategic_plans')
            .insert([data])
            .select()
            .single();

        if (error) {
            alert('Error creating plan: ' + error.message);
            setLoading(false);
        } else {
            router.push(`/strategy/${newPlan.id}`);
            router.refresh();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">New Strategic Plan</h1>
                <p className="subheading">Define the Strategic Asset Management Plan (SAMP).</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Plan Title (PEGA)</label>
                    <input name="title" required className="w-full p-2 border rounded-md bg-transparent text-lg font-semibold" placeholder="e.g., Strategic Asset Management Plan 2025-2030" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Executive Summary</label>
                    <AITextArea name="description" context="strategy" className="min-h-[100px]" placeholder="Brief overview of the strategic objectives..." />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Mission Statement</label>
                        <AITextArea name="mission_statement" context="strategy" className="min-h-[100px]" placeholder="Our mission regarding asset management is..." />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Vision Statement</label>
                        <AITextArea name="vision_statement" context="strategy" className="min-h-[100px]" placeholder="To be the leader in..." />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Period Start</label>
                        <input name="period_start" type="date" required className="w-full p-2 border rounded-md bg-transparent" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Period End</label>
                        <input name="period_end" type="date" required className="w-full p-2 border rounded-md bg-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select name="status" className="w-full p-2 border rounded-md bg-transparent">
                        <option value="draft">Draft</option>
                        <option value="review">Under Review</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="pt-6 flex justify-end gap-2 border-t border-[hsl(var(--card-border))]">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Creating Plan...' : 'Create Strategic Plan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
