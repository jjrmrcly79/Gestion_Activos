
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function PrintWorkOrderPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = params;

    // Fetch Full Data Tree
    const { data: wo } = await supabase
        .from('work_orders')
        .select(`
        *, 
        assets(tag, name, location, plant), 
        assignee:assignee_id(full_name),
        requester:requester_id(full_name),
        work_order_activities(*),
        measurement_readings(
            value, 
            captured_at, 
            measurement_points(name, unit, min_value, max_value)
        )
    `)
        .eq('id', id)
        .single();

    if (!wo) notFound();

    return (
        <div className="bg-white text-black p-8 max-w-4xl mx-auto print:max-w-none print:p-0 font-sans">
            <style>{`
        @media print {
            @page { margin: 1cm; size: A4; }
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
        }
      `}</style>

            <div className="mb-4 no-print flex justify-end">
                <button
                    // @ts-ignore
                    onClick="window.print()"
                    className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                >
                    Print / Save as PDF
                </button>
                <script dangerouslySetInnerHTML={{ __html: `document.querySelector('button').onclick = () => window.print()` }} />
            </div>

            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold uppercase">Work Order</h1>
                    <p className="text-lg font-mono mt-1">#{wo.wo_number}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">{wo.assets?.plant || 'General Plant'}</h2>
                    <p className="text-sm">Maintenance Dept.</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="uppercase text-xs font-bold text-gray-500 mb-1">Asset Info</h3>
                    <div className="border p-4 rounded bg-gray-50">
                        <p className="font-bold text-lg">{wo.assets?.tag}</p>
                        <p className="text-lg">{wo.assets?.name}</p>
                        <p className="text-sm text-gray-600 mt-2">{wo.assets?.location || 'No Location'}</p>
                    </div>
                </div>
                <div>
                    <h3 className="uppercase text-xs font-bold text-gray-500 mb-1">Task Info</h3>
                    <div className="border p-4 rounded">
                        <p className="font-bold">{wo.title}</p>
                        <div className="flex justify-between mt-2 text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium uppercase">{wo.type}</span>
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-600">Priority:</span>
                            <span className="font-medium uppercase">{wo.priority}</span>
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-600">Scheduled:</span>
                            <span className="font-medium">{wo.scheduled_date ? new Date(wo.scheduled_date).toLocaleDateString() : 'ASAP'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h3 className="uppercase text-xs font-bold text-gray-500 mb-2 border-b">Detailed Instructions</h3>
                <p className="whitespace-pre-wrap leading-relaxed min-h-[100px]">{wo.description}</p>
            </div>

            {/* Activities / Checklist */}
            <div className="mb-8">
                <h3 className="uppercase text-xs font-bold text-gray-500 mb-2 border-b">Checklist Activities</h3>
                <ul className="space-y-2">
                    {wo.work_order_activities?.length === 0 && <li className="italic text-gray-500">No specific checklist items.</li>}
                    {wo.work_order_activities?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((act: any) => (
                        <li key={act.id} className="flex items-start gap-4 py-2 border-b border-dashed">
                            <div className={`w-6 h-6 border-2 flex items-center justify-center ${act.is_completed ? 'bg-black border-black text-white' : 'border-gray-400'}`}>
                                {act.is_completed && '✓'}
                            </div>
                            <div className="flex-1">
                                <span className={act.is_completed ? 'line-through text-gray-400' : ''}>{act.description}</span>
                                {act.comments && <p className="text-sm text-gray-500 italic mt-1">Note: {act.comments}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Readings */}
            <div className="mb-8">
                <h3 className="uppercase text-xs font-bold text-gray-500 mb-2 border-b">Measurement Data</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Parameter</th>
                            <th className="p-2 text-center">Limits</th>
                            <th className="p-2 text-right">Captured Value</th>
                            <th className="p-2 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wo.measurement_readings?.length === 0 && (
                            <tr><td colSpan={4} className="p-4 text-center italic text-gray-500">No readings recorded.</td></tr>
                        )}
                        {wo.measurement_readings?.map((r: any) => (
                            <tr key={r.captured_at} className="border-b">
                                <td className="p-2 font-medium">{r.measurement_points?.name}</td>
                                <td className="p-2 text-center text-gray-500 text-xs">
                                    {r.measurement_points?.min_value ?? '-'} / {r.measurement_points?.max_value ?? '-'} {r.measurement_points?.unit}
                                </td>
                                <td className="p-2 text-right font-mono font-bold">{r.value} {r.measurement_points?.unit}</td>
                                <td className="p-2 text-right text-xs">{new Date(r.captured_at).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Signatures */}
            <div className="mt-12 grid grid-cols-2 gap-12 pt-8 border-t-2 border-black break-inside-avoid">
                <div>
                    <p className="mb-8 uppercase text-xs font-bold text-gray-500">Technician Signature</p>
                    <div className="border-b border-black h-8"></div>
                    <p className="mt-2 text-sm">{wo.assignee?.full_name || '______________________'}</p>
                </div>
                <div>
                    <p className="mb-8 uppercase text-xs font-bold text-gray-500">Supervisor / Reviewer</p>
                    <div className="border-b border-black h-8"></div>
                    <p className="mt-2 text-sm">______________________</p>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                Generated by AssetManager Pro • ISO 55000 Compliant System
            </div>
        </div>
    );
}
