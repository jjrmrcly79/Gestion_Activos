'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import AITextArea from '@/app/components/ui/AITextArea';

export default function NewEventPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('assets').select('id, tag, name');
            if (data) setAssets(data);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase.from('lifecycle_events').insert([data]);

        if (error) {
            alert('Error logging event: ' + error.message);
            setLoading(false);
        } else {
            router.push('/lifecycle');
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">Log Lifecycle Event</h1>
                <p className="subheading">Record maintenance, failures, disposal, or other asset events.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Event Type</label>
                        <select name="event_type" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="maintenance">Maintenance (PM/CM)</option>
                            <option value="failure">Failure / Breakdown</option>
                            <option value="inspection">Inspection / Audit</option>
                            <option value="upgrade">Upgrade / Capital Work</option>
                            <option value="disposal">Disposal</option>
                            <option value="operation">Operational Event</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <input name="date" type="date" required className="w-full p-2 border rounded-md bg-transparent" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Asset</label>
                    <select name="asset_id" required className="w-full p-2 border rounded-md bg-transparent">
                        <option value="">-- Select Asset --</option>
                        {assets.map(a => (
                            <option key={a.id} value={a.id}>{a.tag} - {a.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Summary</label>
                    <AITextArea name="summary" context="lifecycle" className="w-full p-2 border rounded-md bg-transparent min-h-[80px]" placeholder="Brief description of the event" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cost ($)</label>
                        <input name="cost" type="number" step="0.01" className="w-full p-2 border rounded-md bg-transparent" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Performed By</label>
                        <input name="performed_by" className="w-full p-2 border rounded-md bg-transparent" placeholder="Technician or Vendor Name" />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Logging...' : 'Log Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}
