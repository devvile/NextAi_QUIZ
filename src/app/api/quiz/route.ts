import {NextResponse } from "next/server";
import { QuizService } from "@/services/quizService";

export async function GET() {
    try {
        const quizzes = await QuizService.getAllQuizzes();
        return NextResponse.json(quizzes)
    } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quizzes' },
            { status: 500 }
        );
    }
}