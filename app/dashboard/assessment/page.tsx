import { getRecentAssessments } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import CreateAssessmentButton from './CreateAssessmentButton'

export default async function AssessmentPage() {
    const assessments = await getRecentAssessments()

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Diagnóstico Mantenimiento</h1>
                    <p className="text-muted-foreground mt-2">
                        Evalúa la madurez de tu gestión de activos conforme a ISO 55000.
                    </p>
                </div>
                <CreateAssessmentButton />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assessments.map((assessment) => (
                    <Card key={assessment.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex justify-between items-start">
                                <span className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Diagnóstico
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${assessment.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {assessment.status === 'completed' ? 'Completado' : 'En Progreso'}
                                </span>
                            </CardTitle>
                            <CardDescription>
                                Iniciado el {new Date(assessment.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end">
                                <Button variant="ghost" className="gap-2 group-hover:translate-x-1 transition-transform" asChild>
                                    <Link href={`/dashboard/assessment/${assessment.id}`}>
                                        Ver detalles <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {assessments.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/50">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No hay diagnósticos registrados</p>
                        <p className="text-sm">Inicia uno nuevo para conocer el estado de tu planta.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
