import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RequestBody {
    message: string;
}

interface ClaudeResponse {
    response: string;
}

interface ErrorResponse {
    error: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ClaudeResponse | ErrorResponse>> {
    try {
        const { message }: RequestBody = await request.json();

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

        return NextResponse.json({
            response: response.content[0].text
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: 'Failed to get response from Claude' },
            { status: 500 }
        );
    }
}