
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Package, Layers, Plus, Search } from 'lucide-react';

export default async function WarehousePage() {
    const supabase = await createClient();

    // Fetch Materials with Inventory
    const { data: materials } = await supabase
        .from('materials')
        .select('*, warehouse_inventory(quantity_on_hand, location_bin)')
        .order('code', { ascending: true });

    const { data: kits } = await supabase.from('kits').select('*');

    const totalSKUs = materials?.length || 0;
    const lowStock = materials?.filter(m => {
        const qty = m.warehouse_inventory?.[0]?.quantity_on_hand || 0;
        return qty <= (m.min_stock_level || 0);
    }).length || 0;
    const totalKits = kits?.length || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Warehouse & Logistics</h1>
                    <p className="subheading">Inventory, Kits, and Spare Parts</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/warehouse/kits/new" className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors">
                        <Layers className="h-4 w-4" />
                        New Kit
                    </Link>
                    <Link href="/warehouse/materials/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="h-4 w-4" />
                        New Material
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 mb-1 text-amber-700 dark:text-amber-400">
                        <Package className="h-4 w-4" />
                        <h3 className="font-medium">Total SKUs</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                        {totalSKUs}
                    </p>
                </div>
                <div className="dashboard-card bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-1 text-red-700 dark:text-red-400">
                        <Search className="h-4 w-4" />
                        <h3 className="font-medium">Low Stock Alerts</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-300">
                        {lowStock}
                    </p>
                </div>
                <Link href="/warehouse/kits" className="dashboard-card bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30 hover:opacity-90 transition-opacity cursor-pointer">
                    <div className="flex items-center gap-2 mb-1 text-purple-700 dark:text-purple-400">
                        <Layers className="h-4 w-4" />
                        <h3 className="font-medium">Defined Kits</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-300">
                        {totalKits}
                    </p>
                </Link>
            </div>


            {/* Material List */}
            <div className="dashboard-card overflow-hidden p-0">
                <div className="p-4 border-b border-[hsl(var(--card-border))]">
                    <h3 className="font-semibold text-lg">Inventory Overview</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Code (SKU)</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Description</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Stock</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Unit</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Location</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {materials?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No materials found. Register your first spare part.
                                    </td>
                                </tr>
                            ) : (
                                materials?.map((m) => {
                                    const qty = m.warehouse_inventory?.[0]?.quantity_on_hand || 0;
                                    const location = m.warehouse_inventory?.[0]?.location_bin || '-';
                                    const isLow = qty <= (m.min_stock_level || 0);

                                    return (
                                        <tr key={m.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                            <td className="px-6 py-4 font-mono font-medium">{m.code}</td>
                                            <td className="px-6 py-4">{m.description}</td>
                                            <td className="px-6 py-4 text-right font-bold">{qty}</td>
                                            <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">{m.unit}</td>
                                            <td className="px-6 py-4 text-[hsl(var(--muted-foreground))] font-mono text-xs">{location}</td>
                                            <td className="px-6 py-4 text-right">
                                                {isLow && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                        Low Stock
                                                    </span>
                                                )}
                                                {!isLow && <span className="text-green-600 text-xs font-medium">OK</span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
