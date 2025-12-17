
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Layers, Package } from 'lucide-react';

export default async function KitsPage() {
    const supabase = await createClient();
    const { data: kits } = await supabase.from('kits').select('*').order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Kit Management</h1>
                    <p className="subheading">Defined Spare Part Bundles for Tasks</p>
                </div>
                <Link href="/warehouse/kits/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    Create Kit
                </Link>
            </div>

            <div className="dashboard-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Kit Name</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Description</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {kits?.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No kits defined.
                                    </td>
                                </tr>
                            ) : (
                                kits?.map((k) => (
                                    <tr key={k.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                                            <Layers className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                            {k.name}
                                        </td>
                                        <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">{k.description}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[hsl(var(--primary))] hover:underline font-medium text-sm">Edit</button>
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
