'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { createAssessment } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function CreateAssessmentButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleCreate = () => {
        startTransition(async () => {
            try {
                const newAssessment = await createAssessment()
                toast.success('Diagnóstico creado')
                if (newAssessment?.id) {
                    router.push(`/dashboard/assessment/${newAssessment.id}`)
                } else {
                    console.error('No ID returned', newAssessment)
                    toast.error('Error: No se recibió ID del diagnóstico')
                }
            } catch (error) {
                console.error('Create error:', error)
                toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        })
    }

    return (
        <Button
            size="lg"
            onClick={handleCreate}
            disabled={isPending}
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
        >
            <PlusCircle className="h-5 w-5" />
            {isPending ? 'Creando...' : 'Nuevo Diagnóstico'}
        </Button>
    )
}
