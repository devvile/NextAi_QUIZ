import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/services/quizService";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json(
            { error: 'Category parameter is required' },
            { status: 400 }
        );
    }

    try {
        const quizzes = await QuizService.getQuizzesByCategory(category);
        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Failed to search quizzes:', error);
        return NextResponse.json(
            { error: 'Failed to search quizzes' },
            { status: 500 }
        );
    }
}