import { getAssessment } from '../actions'
import AssessmentRunner from './AssessmentRunner'
import { notFound } from 'next/navigation'

export default async function AssessmentDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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
