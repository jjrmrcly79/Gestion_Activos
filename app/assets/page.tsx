import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Search, FileText } from 'lucide-react';

export default async function AssetsPage() {
    const supabase = await createClient();
    const { data: assets } = await supabase.from('assets').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Asset Registry</h1>
                    <p className="subheading">Manage your asset portfolio and documentation</p>
                </div>
                <Link href="/assets/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    New Asset
                </Link>
            </div>

            {/* Asset List */}
            <div className="dashboard-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Tag</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Criticality</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Phase</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Value</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {assets?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No assets found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                assets?.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-[hsl(var(--muted))] transition-colors group">
                                        <td className="px-6 py-4 font-medium">
                                            <Link href={`/assets/${asset.id}`} className="hover:text-[hsl(var(--primary))] hover:underline">
                                                {asset.tag}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/assets/${asset.id}`} className="hover:text-[hsl(var(--primary))] hover:underline font-medium">
                                                {asset.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                        ${asset.criticality === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    asset.criticality === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                {asset.criticality}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 capitalize">{asset.lifecycle_phase}</td>
                                        <td className="px-6 py-4 font-mono">${asset.current_value || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/assets/${asset.id}`} className="inline-flex items-center justify-center p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors">
                                                <FileText className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

