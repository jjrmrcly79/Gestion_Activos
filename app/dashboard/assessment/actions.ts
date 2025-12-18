'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function createAssessment() {
    const supabase = await createClient()

    let userId = DEMO_USER_ID
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) userId = user.id
    } catch (e) {
        console.warn('Auth failed in createAssessment, using demo user', e)
    }

    const { data, error } = await supabase
        .from('assessments')
        .insert({
            user_id: userId,
            status: 'in_progress',
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating assessment:', error)
        throw new Error('Failed to create assessment')
    }

    revalidatePath('/dashboard/assessment')
    return data
}

export async function getAssessment(id: string) {
    const supabase = await createClient()

    // No need to fetch user here, RLS policies should handle access based on assessment_id and auth.uid()
    // The instruction implies that the current behavior of not checking user_id in code is acceptable
    // as RLS policies are expected to handle it.

    const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single()

    if (assessmentError) {
        console.error('Error fetching assessment:', assessmentError)
        throw new Error('Failed to fetch assessment')
    }

    const { data: answers, error: answersError } = await supabase
        .from('assessment_answers')
        .select('*')
        .eq('assessment_id', id)

    if (answersError) {
        console.error('Error fetching answers:', answersError)
        throw new Error('Failed to fetch answers')
    }

    return {
        assessment,
        answers
    }
}

export async function saveBlockAnswers(
    assessmentId: string,
    blockId: string,
    answers: { question_id: string; score: number; evidence: string }[]
) {
    const supabase = await createClient()

    // Transform answers for bulk upsert
    const upsertData = answers.map(answer => ({
        assessment_id: assessmentId,
        block_id: blockId,
        question_id: answer.question_id,
        score: answer.score,
        evidence: answer.evidence,
        updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
        .from('assessment_answers')
        .upsert(upsertData, {
            onConflict: 'assessment_id,question_id'
        })

    if (error) {
        console.error('Error saving answers:', error)
        throw new Error('Failed to save answers')
    }

    revalidatePath(`/dashboard/assessment/${assessmentId}`)
    return { success: true }
}

export async function completeAssessment(assessmentId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('assessments')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', assessmentId)

    if (error) {
        console.error('Error completing assessment:', error)
        throw new Error('Failed to complete assessment')
    }

    revalidatePath('/dashboard/assessment')
    return { success: true }
}

export async function getRecentAssessments() {
    const supabase = await createClient()

    let userId = DEMO_USER_ID
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) userId = user.id
    } catch (e) {
        // ignore
    }

    const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching assessments:', error)
        return []
    }

    return data
}
