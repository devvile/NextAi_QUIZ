import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { QuizService } from '@/services/quizService';
import { ClaudeQuizResponse } from '@/types/database';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RequestBody {
    message: string;
    saveToDb?: boolean;
    category?: string;
    level?: string;
    numberOfQuestions?: number;
}

interface ClaudeResponse {
    response: string;
    quizId?: string;
}

interface ErrorResponse {
    error: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ClaudeResponse | ErrorResponse>> {
    try {
        const { 
            message, 
            saveToDb = false, 
            category, 
            level, 
            numberOfQuestions 
        }: RequestBody = await request.json();

        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 5000,
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        const responseText = response.content[0].text;

        if (saveToDb && category && level && numberOfQuestions) {
            try {
                const parsedQuiz: ClaudeQuizResponse = JSON.parse(responseText);
                const savedQuiz = await QuizService.saveQuiz(
                    category,
                    level,
                    numberOfQuestions,
                    responseText,
                    parsedQuiz
                );

                return NextResponse.json({
                    response: responseText,
                    quizId: savedQuiz.id
                });
            } catch (parseError) {
                console.error('Failed to parse or save quiz:', parseError);
                return NextResponse.json({
                    response: responseText
                });
            }
        }

        return NextResponse.json({
            response: responseText
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Failed to get response from Claude' },
            { status: 500 }
        );
    }
}