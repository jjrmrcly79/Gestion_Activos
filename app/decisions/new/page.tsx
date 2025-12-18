'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import AITextArea from '@/components/ui/AITextArea';

export default function NewDecisionPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: assetsData } = await supabase.from('assets').select('id, tag, name');
            const { data: plansData } = await supabase.from('strategic_plans').select('id, title');
            if (assetsData) setAssets(assetsData);
            if (plansData) setPlans(plansData);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase.from('asset_decisions').insert([data]);

        if (error) {
            alert('Error creating proposal: ' + error.message);
            setLoading(false);
        } else {
            router.push('/decisions');
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">New Investment Proposal</h1>
                <p className="subheading">Create a business case for Capital Investment, Repair, or Replacement.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title</label>
                    <input name="title" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g., Upgrade of Compressor Station A" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Decision Type</label>
                        <select name="decision_type" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="capex">CAPEX (Capital Expenditure)</option>
                            <option value="opex">OPEX (Major Maintenance)</option>
                            <option value="replacement">Replacement</option>
                            <option value="disposal">Disposal / Decommissioning</option>
                            <option value="expansion">Expansion</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select name="status" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="proposed">Proposed</option>
                            <option value="analyzing">Under Analysis</option>
                            <option value="approved">Approved</option>
                            <option value="deferred">Deferred</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Related Asset (Optional)</label>
                        <select name="asset_id" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">-- None (New Asset) --</option>
                            {assets.map(a => (
                                <option key={a.id} value={a.id}>{a.tag} - {a.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Strategic Plan Alignment</label>
                        <select name="strategic_plan_id" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">-- None --</option>
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description / Scope</label>
                    <AITextArea name="description" context="investment" className="min-h-[100px]" placeholder="Detailed scope of work..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Est. Cost ($)</label>
                        <input name="estimated_cost" type="number" step="0.01" className="w-full p-2 border rounded-md bg-transparent" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Benefit Value ($)</label>
                        <input name="benefit_value" type="number" step="0.01" className="w-full p-2 border rounded-md bg-transparent" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target ROI (%)</label>
                        <input name="roi" type="number" step="0.1" className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g. 15.5" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Justification</label>
                    <AITextArea name="justification" context="investment" className="min-h-[80px]" placeholder="Why is this investment needed?" />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Proposal'}
                    </button>
                </div>
            </form>
        </div>
    );
}
