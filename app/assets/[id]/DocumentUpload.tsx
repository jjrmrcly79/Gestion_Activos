'use client';

import { createClient } from '@/utils/supabase/client';
import { Upload, File, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentUpload({ assetId }: { assetId: string }) {
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('asset-docs')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Insert into asset_documents table
            const { error: dbError } = await supabase.from('asset_documents').insert({
                asset_id: assetId,
                file_name: file.name,
                file_url: filePath, // Storing path relative to bucket
                file_type: file.type,
                file_size: file.size,
            });

            if (dbError) {
                throw dbError;
            }

            router.refresh(); // Refresh server data
        } catch (error: any) {
            alert('Error uploading file: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <label className={`flex items-center gap-2 px-4 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--card-border))] rounded-md text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </label>
        </div>
    );
}
