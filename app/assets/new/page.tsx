'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import AITextArea from '@/components/ui/AITextArea';

export default function NewAssetPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { data: string, error } = await supabase
            .from('assets')
            .insert([data])
            .select()
            .single();

        if (error) {
            alert('Error creating asset: ' + error.message);
            setLoading(false);
        } else {
            router.push(`/assets/${string.id}`); // Redirect to key detail page
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">Create New Asset</h1>
                <p className="subheading">Register a new asset into the system.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tag ID</label>
                        <input name="tag" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g., PUMP-001" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input name="name" required className="w-full p-2 border rounded-md bg-transparent" placeholder="Asset Name" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <AITextArea name="description" context="asset" className="w-full p-2 border rounded-md bg-transparent min-h-[100px]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Criticality</label>
                        <select name="criticality" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lifecycle Phase</label>
                        <select name="lifecycle_phase" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="planning">Planning</option>
                            <option value="acquisition">Acquisition</option>
                            <option value="operation">Operation</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="disposal">Disposal</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Value ($)</label>
                        <input name="current_value" type="number" className="w-full p-2 border rounded-md bg-transparent" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <input name="location" className="w-full p-2 border rounded-md bg-transparent" placeholder="Site / Room" />
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Asset'}
                    </button>
                </div>
            </form>
        </div>
    );
}
