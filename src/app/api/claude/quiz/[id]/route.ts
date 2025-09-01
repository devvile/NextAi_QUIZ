import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/services/quizService";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const quiz = await QuizService.getQuiz(params.id);
        if (!quiz) {
            return NextResponse.json(
                { error: "Quiz not found" },
                { status: 404 }
            )
        }
    } catch (error) {
        console.error("Failed to fetch quiz", error);
        return NextResponse.json(
            { error: 'Failed to fetch quiz' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await QuizService.deleteQuiz(params.id);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Failed to delete quiz:', error);
        return NextResponse.json(
            { error: 'Failed to delete quiz' },
            { status: 500 }
        );
    }
}