'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { ArrowLeft, Save, Loader2, Package } from 'lucide-react';
import Link from 'next/link';

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [material, setMaterial] = useState<any>(null);

    useEffect(() => {
        const fetchMaterial = async () => {
            const { data, error } = await supabase
                .from('materials')
                .select('*, warehouse_inventory(*)')
                .eq('id', id)
                .single();

            if (error) {
                alert('Error fetching material');
                router.push('/warehouse');
            } else {
                setMaterial(data);
            }
            setLoading(false);
        };
        fetchMaterial();
    }, [id]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData(e.currentTarget);

        const materialUpdate = {
            code: formData.get('code'),
            description: formData.get('description'),
            unit: formData.get('unit'),
            min_stock_level: Number(formData.get('min_stock_level')) || 0,
        };

        const { error: matError } = await supabase
            .from('materials')
            .update(materialUpdate)
            .eq('id', id);

        if (matError) {
            alert('Error updating material: ' + matError.message);
            setSaving(false);
            return;
        }

        const inventoryUpdate = {
            quantity_on_hand: Number(formData.get('quantity_on_hand')) || 0,
            location_bin: formData.get('location_bin'),
        };

        if (material.warehouse_inventory?.[0]) {
            await supabase
                .from('warehouse_inventory')
                .update(inventoryUpdate)
                .eq('id', material.warehouse_inventory[0].id);
        } else {
            await supabase
                .from('warehouse_inventory')
                .insert({ ...inventoryUpdate, material_id: id });
        }

        router.push('/warehouse');
        router.refresh();
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[hsl(var(--primary))]" /></div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/warehouse" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="heading-xl">Edit Material</h1>
                    <p className="subheading">{material.code} - {material.description}</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Material Code (SKU)</label>
                    <input name="code" required defaultValue={material.code} className="w-full p-2 border rounded-md bg-transparent font-mono" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <input name="description" required defaultValue={material.description} className="w-full p-2 border rounded-md bg-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Unit of Measure</label>
                        <select name="unit" required defaultValue={material.unit} className="w-full p-2 border rounded-md bg-transparent">
                            <option value="ea">Each (ea)</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="l">Liter (l)</option>
                            <option value="m">Meter (m)</option>
                            <option value="box">Box</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Min. Stock Level</label>
                        <input name="min_stock_level" type="number" defaultValue={material.min_stock_level} className="w-full p-2 border rounded-md bg-transparent" />
                    </div>
                </div>

                <div className="border-t pt-4 mt-2">
                    <div className="flex items-center gap-2 mb-4 text-[hsl(var(--primary))]">
                        <Package className="h-4 w-4" />
                        <h3 className="font-medium">Current Inventory</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Quantity on Hand</label>
                            <input
                                name="quantity_on_hand"
                                type="number"
                                defaultValue={material.warehouse_inventory?.[0]?.quantity_on_hand || 0}
                                className="w-full p-2 border rounded-md bg-transparent font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location / Bin</label>
                            <input
                                name="location_bin"
                                defaultValue={material.warehouse_inventory?.[0]?.location_bin || ''}
                                className="w-full p-2 border rounded-md bg-transparent"
                                placeholder="A-01-01"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
