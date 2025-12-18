import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text, context } = await req.json();

        if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

        let systemPrompt = "You are a helpful AI assistant for an industrial asset management system. Enhance the text to be more professional, concise, and technically accurate. IMPORTANT: Always respond in the SAME LANGUAGE as the user's input text (e.g., if the user writes in Spanish, provide the enhancement in Spanish).";

        if (context === 'work-order') {
            systemPrompt = "You are a technical expert helper. The user is describing a problem with an industrial asset. Enhance the description to be formal, precise, and actionable. Structure the output with sections: 'Technical Observation', 'Potential Causes', and 'Recommended Actions'. Output as plain text.";
        } else if (context === 'risk') {
            systemPrompt = "You are a risk management expert. The user is describing a risk scenario. Enhance this into a formal risk assessment statement. Include 'Risk Description', 'Potential Impact', and 'Mitigation Strategy'.";
        } else if (context === 'strategy') {
            systemPrompt = "You are a strategic planning consultant. The user is drafting a strategic plan for asset management (ISO 55000). Enhance the text to be inspiring, clear, and strategically aligned. For Mission/Vision, make it concise and impactful. For Executive Summary, ensure professional tone and clarity.";
        } else if (context === 'investment') {
            systemPrompt = "You are a financial analyst specializing in capital projects. The user is drafting an investment proposal. Enhance the description to clearly define the scope. Enhance the justification to build a strong business case, focusing on ROI, risk reduction, and strategic alignment.";
        } else if (context === 'lifecycle') {
            systemPrompt = "You are a maintenance planner. The user is logging an asset lifecycle event. Enhance the summary to be concise, technical, and factual. Focus on 'what happened', 'action taken', and 'outcome'.";
        } else if (context === 'asset') {
            systemPrompt = "You are a technical data specialist. The user is registering a new asset. Enhance the description to be a standard technical specification. include key equipment details and exclude subjective language.";
        } else if (context === 'inventory') {
            systemPrompt = "You are a warehouse inventory specialist. Enhance the kit description to clearly list intended usage, component compatibility, and kitting requirements.";
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            model: "gpt-3.5-turbo",
        });

        const enhancedText = completion.choices[0].message.content;

        return NextResponse.json({ result: enhancedText });

    } catch (error) {
        console.error('AI Service Error:', error);
        return NextResponse.json({ error: 'AI Service Error' }, { status: 500 });
    }
}
