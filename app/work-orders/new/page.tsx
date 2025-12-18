'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AITextArea from '@/components/ui/AITextArea';

export default function NewWorkOrderPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: assetsData } = await supabase.from('assets').select('id, tag, name');
            const { data: profilesData } = await supabase.from('profiles').select('id, full_name, role'); // Assuming profiles exist or we fallback
            if (assetsData) setAssets(assetsData);
            if (profilesData) setProfiles(profilesData);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        // Create the payload and filter out empty strings for UUID/optional fields
        const insertData: any = {};
        for (const [key, value] of formData.entries()) {
            if (value === '' && (key === 'assignee_id' || key === 'scheduled_date')) {
                insertData[key] = null;
            } else {
                insertData[key] = value;
            }
        }

        if (!insertData.asset_id) {
            alert('Please select an asset');
            setLoading(false);
            return;
        }

        const { error } = await supabase.from('work_orders').insert([insertData]);

        if (error) {
            alert('Error creating Work Order: ' + error.message);
            setLoading(false);
        } else {
            router.push('/work-orders');
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">Create Work Order</h1>
                <p className="subheading">Initiate a customized maintenance or repair task.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title / Short Description</label>
                    <input name="title" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g. Pump Vibration Analysis" />
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                        <label className="text-sm font-medium">Type</label>
                        <select name="type" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="preventive">Preventive</option>
                            <option value="corrective">Corrective</option>
                            <option value="inspection">Inspection</option>
                            <option value="project">Project</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <select name="priority" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Assign To (Optional)</label>
                        <select name="assignee_id" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">-- Unassigned --</option>
                            {profiles.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Scheduled Date</label>
                        <input name="scheduled_date" type="date" className="w-full p-2 border rounded-md bg-transparent" />
                    </div>
                </div>

                <div className="space-y-2">
                    <AITextArea
                        name="description"
                        context="work-order"
                        label="Problem Description / Scope of Work"
                        id="description"
                        placeholder="Describe the issue... (e.g. 'Pump leaking oil')"
                        required
                        rows={4}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Work Order'}
                    </button>
                </div>
            </form>
        </div>
    );
}
