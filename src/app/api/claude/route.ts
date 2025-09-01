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
    quizName?: string; // New field
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
            quizName,
            category, 
            level, 
            numberOfQuestions 
        }: RequestBody = await request.json();

        // If we're just saving an already-generated quiz (message contains the quiz JSON)
        if (saveToDb && quizName && category && level && numberOfQuestions && message) {
            try {
                // Parse the message as the quiz JSON
                const parsedQuiz: ClaudeQuizResponse = JSON.parse(message);
                
                // Save to database
                const savedQuiz = await QuizService.saveQuiz(
                    quizName,
                    category,
                    level,
                    numberOfQuestions,
                    message, // raw response
                    parsedQuiz
                );

                return NextResponse.json({
                    response: message,
                    quizId: savedQuiz.id
                });
            } catch (parseError) {
                console.error('Failed to parse or save quiz:', parseError);
                return NextResponse.json(
                    { error: 'Failed to save quiz - invalid quiz data' },
                    { status: 400 }
                );
            }
        }

        // Generate new quiz from Claude
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