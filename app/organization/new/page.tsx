'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NewPersonnelPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        const fetchDepts = async () => {
            const { data } = await supabase.from('departments').select('*');
            if (data) setDepartments(data);
        };
        fetchDepts();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // Handle competencies as array
        const competenciesString = formData.get('competencies') as string;
        const competencies = competenciesString ? competenciesString.split(',').map(s => s.trim()) : [];

        const data = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            role: formData.get('role'),
            department_id: formData.get('department_id'),
            status: formData.get('status'),
            competencies: competencies
        };

        const { error } = await supabase.from('personnel').insert([data]);

        if (error) {
            alert('Error adding personnel: ' + error.message);
            setLoading(false);
        } else {
            router.push('/organization');
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="heading-xl">Add Personnel</h1>
                <p className="subheading">Register a new team member and assign roles/competencies.</p>
            </div>

            <form onSubmit={handleSubmit} className="dashboard-card space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input name="full_name" required className="w-full p-2 border rounded-md bg-transparent" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input name="email" type="email" className="w-full p-2 border rounded-md bg-transparent" placeholder="jane@company.com" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role / Job Title</label>
                        <input name="role" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g. Asset Manager" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <select name="department_id" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="">-- Select Department --</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Competencies (comma separated)</label>
                    <input name="competencies" className="w-full p-2 border rounded-md bg-transparent" placeholder="ISO 55000 Foundation, CMRP, Safety Level 1" />
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">List certifications or key skills.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select name="status" className="w-full p-2 border rounded-md bg-transparent">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="leave">On Leave</option>
                    </select>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50">
                        {loading ? 'Adding...' : 'Add Personnel'}
                    </button>
                </div>
            </form>
        </div>
    );
}
