'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

import AITextArea from '@/app/components/ui/AITextArea';

export default function NewKitPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [items, setItems] = useState<{ materialId: string, qty: number }[]>([{ materialId: '', qty: 1 }]);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase.from('materials').select('id, code, description, unit');
            if (data) setMaterials(data);
        };
        fetchMaterials();
    }, []);

    const handleAddItem = () => {
        setItems([...items, { materialId: '', qty: 1 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: 'materialId' | 'qty', value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // 1. Create Kit Header
        const kitData = {
            name: formData.get('name'),
            description: formData.get('description'),
        };

        const { data: kit, error: kitError } = await supabase.from('kits').insert([kitData]).select().single();

        if (kitError) {
            alert('Error creating kit: ' + kitError.message);
            setLoading(false);
            return;
        }

        // 2. Create Kit Items
        if (kit) {
            const kitItems = items.filter(i => i.materialId).map(i => ({
                kit_id: kit.id,
                material_id: i.materialId,
                quantity_required: i.qty
            }));

            if (kitItems.length > 0) {
                const { error: itemsError } = await supabase.from('kit_items').insert(kitItems);
                if (itemsError) console.error('Error adding items', itemsError);
            }
        }

        router.push('/warehouse/kits');
        router.refresh();
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">Create New Kit</h1>
                <p className="subheading">Define a standard list of parts for maintenance tasks.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Kit Name</label>
                    <input name="name" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g. Pump 500hr Service Kit" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <AITextArea name="description" context="inventory" className="w-full p-2 border rounded-md bg-transparent min-h-[100px]" placeholder="Details about when to use this kit..." />
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Kit Materials</h3>
                        <button type="button" onClick={handleAddItem} className="text-sm text-[hsl(var(--primary))] flex items-center gap-1 hover:underline">
                            <Plus className="h-4 w-4" /> Add Item
                        </button>
                    </div>

                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <select
                                    required
                                    className="flex-1 p-2 border rounded-md bg-transparent text-sm"
                                    value={item.materialId}
                                    onChange={(e) => handleItemChange(index, 'materialId', e.target.value)}
                                >
                                    <option value="">-- Select Material --</option>
                                    {materials.map(m => (
                                        <option key={m.id} value={m.id}>{m.code} - {m.description} ({m.unit})</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    className="w-20 p-2 border rounded-md bg-transparent text-sm"
                                    value={item.qty}
                                    onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value))}
                                />
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create Kit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
