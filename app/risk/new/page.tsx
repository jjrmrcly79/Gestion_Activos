'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import AITextArea from '@/components/ui/AITextArea';

export default function NewRiskPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);

    // Fetch options for dropdowns
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

        // Convert string 'likelihood' and 'impact' to integers if needed by DB, although form sends strings normally handled by PG logic if type matches. But let's be safe.
        // However, basic FormData entries are fine if schema allows casting.

        const { error } = await supabase.from('risks').insert([data]);

        if (error) {
            alert('Error creating risk: ' + error.message);
            setLoading(false);
        } else {
            router.push('/risk');
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">New Risk Assessment</h1>
                <p className="subheading">Identify and evaluate risks related to assets or strategies (ISO 31000).</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Risk Title</label>
                    <input name="title" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g., Pump Failure due to Vibration" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <AITextArea name="description" context="risk" className="min-h-[100px]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Related Asset (Optional)</label>
                        <select name="asset_id" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">-- None --</option>
                            {assets.map(a => (
                                <option key={a.id} value={a.id}>{a.tag} - {a.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Strategic Plan (Optional)</label>
                        <select name="strategic_plan_id" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">-- None --</option>
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select name="category" className="w-full p-2 border rounded-md bg-transparent">
                        <option value="financial">Financial</option>
                        <option value="safety">Safety / HSE</option>
                        <option value="operational">Operational</option>
                        <option value="compliance">Compliance</option>
                        <option value="reputation">Reputation</option>
                    </select>
                </div>

                <div className="p-4 bg-[hsl(var(--muted))] rounded-md grid grid-cols-2 gap-6 border border-[hsl(var(--card-border))]">
                    <div className="space-y-2">
                        <label className="text-sm font-medium block">Likelihood (1-5)</label>
                        <input name="likelihood" type="range" min="1" max="5" defaultValue="3" className="w-full accent-[hsl(var(--primary))]" />
                        <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
                            <span>Rare</span>
                            <span>Possible</span>
                            <span>Almost Certain</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium block">Impact (1-5)</label>
                        <input name="impact" type="range" min="1" max="5" defaultValue="3" className="w-full accent-[hsl(var(--primary))]" />
                        <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
                            <span>Negligible</span>
                            <span>Moderate</span>
                            <span>Catastrophic</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Mitigation Strategy</label>
                    <AITextArea name="mitigation_strategy" context="risk" className="min-h-[80px]" placeholder="Proposed actions to reduce risk..." />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Analyzing...' : 'Save Assessment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
