import { getAssessment } from '../actions'
import AssessmentRunner from './AssessmentRunner'
import { notFound } from 'next/navigation'

export default async function AssessmentDetailPage({ params }: { params: { id: string } }) {
    try {
        const { assessment, answers } = await getAssessment(params.id)

        return (
            <AssessmentRunner
                assessment={assessment}
                initialAnswers={answers}
            />
        )
    } catch (error) {
        notFound()
    }
}
