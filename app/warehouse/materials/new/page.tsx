'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewMaterialPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // 1. Create Material
        const materialData = {
            code: formData.get('code'),
            description: formData.get('description'),
            unit: formData.get('unit'),
            min_stock_level: formData.get('min_stock_level') || 0
        };

        const { data: mat, error: matError } = await supabase.from('materials').insert([materialData]).select().single();

        if (matError) {
            alert('Error creating material: ' + matError.message);
            setLoading(false);
            return;
        }

        // 2. Initialize Inventory (Optional, but good practice)
        if (mat) {
            const { error: invError } = await supabase.from('warehouse_inventory').insert({
                material_id: mat.id,
                quantity_on_hand: formData.get('initial_stock') || 0,
                location_bin: formData.get('location_bin')
            });

            if (invError) console.error('Error init stock', invError);
        }

        router.push('/warehouse');
        router.refresh();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">Register New Material</h1>
                <p className="subheading">Add a spare part or consumable to the master catalog.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Material Code (SKU)</label>
                    <input name="code" required className="w-full p-2 border rounded-md bg-transparent font-mono" placeholder="BRG-6205-ZZ" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <input name="description" required className="w-full p-2 border rounded-md bg-transparent" placeholder="Ball Bearing 25x52x15mm" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Unit of Measure</label>
                        <select name="unit" required className="w-full p-2 border rounded-md bg-transparent">
                            <option value="ea">Each (ea)</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="l">Liter (l)</option>
                            <option value="m">Meter (m)</option>
                            <option value="box">Box</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Min. Stock Level</label>
                        <input name="min_stock_level" type="number" className="w-full p-2 border rounded-md bg-transparent" defaultValue="0" />
                    </div>
                </div>

                <div className="border-t pt-4 mt-2">
                    <h3 className="font-medium mb-4">Initial Inventory</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Initial Quantity</label>
                            <input name="initial_stock" type="number" className="w-full p-2 border rounded-md bg-transparent" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location / Bin</label>
                            <input name="location_bin" className="w-full p-2 border rounded-md bg-transparent" placeholder="A-01-01" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Material'}
                    </button>
                </div>
            </form>
        </div>
    );
}
