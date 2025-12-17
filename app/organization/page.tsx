
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Users, Building2, Award } from 'lucide-react';

export default async function OrganizationPage() {
    const supabase = await createClient();
    const { data: personnel } = await supabase.from('personnel').select('*, departments(name)').order('full_name', { ascending: true });
    const { data: departments } = await supabase.from('departments').select('*');

    const totalPersonnel = personnel?.length || 0;
    const activePersonnel = personnel?.filter(p => p.status === 'active').length || 0;
    const totalDepts = departments?.length || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Organization & People</h1>
                    <p className="subheading">Group 5: Roles, Competencies, and Culture</p>
                </div>
                <Link href="/organization/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    Add Personnel
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/30">
                    <div className="flex items-center gap-2 mb-1 text-pink-700 dark:text-pink-400">
                        <Users className="h-4 w-4" />
                        <h3 className="font-medium">Total Personnel</h3>
                    </div>
                    <p className="text-3xl font-bold text-pink-800 dark:text-pink-300">
                        {totalPersonnel}
                        <span className="text-sm font-normal text-pink-600 dark:text-pink-400 ml-2">({activePersonnel} Active)</span>
                    </p>
                </div>
                <div className="dashboard-card bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-900/30">
                    <div className="flex items-center gap-2 mb-1 text-cyan-700 dark:text-cyan-400">
                        <Building2 className="h-4 w-4" />
                        <h3 className="font-medium">Departments</h3>
                    </div>
                    <p className="text-3xl font-bold text-cyan-800 dark:text-cyan-300">
                        {totalDepts}
                    </p>
                </div>
                <div className="dashboard-card bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-2 mb-1 text-indigo-700 dark:text-indigo-400">
                        <Award className="h-4 w-4" />
                        <h3 className="font-medium">Competency Areas</h3>
                    </div>
                    <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">
                        5+
                        <span className="text-sm font-normal text-indigo-600 dark:text-indigo-400 ml-2">Defined</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Departments List */}
                <div className="dashboard-card space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        Departments
                    </h3>
                    <ul className="space-y-3">
                        {departments?.map(dept => (
                            <li key={dept.id} className="p-3 bg-[hsl(var(--muted))/30] rounded-md flex justify-between items-center">
                                <span className="font-medium">{dept.name}</span>
                                <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--card))] px-2 py-1 rounded-full border">
                                    {personnel?.filter(p => p.department_id === dept.id).length} Members
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Personnel Table */}
                <div className="dashboard-card lg:col-span-2 overflow-hidden p-0">
                    <div className="p-4 border-b border-[hsl(var(--card-border))]">
                        <h3 className="font-semibold text-lg">Key Personnel</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                                    <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Role</th>
                                    <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Department</th>
                                    <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Competencies</th>
                                    <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[hsl(var(--card-border))]">
                                {personnel?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                            No personnel records found.
                                        </td>
                                    </tr>
                                ) : (
                                    personnel?.map((p) => (
                                        <tr key={p.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                            <td className="px-6 py-4 font-medium">{p.full_name}</td>
                                            <td className="px-6 py-4">{p.role}</td>
                                            <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">
                                                {p.departments?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {p.competencies?.slice(0, 2).map((c: string, i: number) => (
                                                        <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                                                            {c}
                                                        </span>
                                                    ))}
                                                    {p.competencies && p.competencies.length > 2 && (
                                                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">+{p.competencies.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
