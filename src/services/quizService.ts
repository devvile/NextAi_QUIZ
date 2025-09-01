import { supabase } from "@/lib/supabase"
import { Quiz, Question, QuizWithQuestions, ClaudeQuizResponse } from '@/types/database';

export class QuizService {
    static async saveQuiz(
        category: string,
        level: string,
        numberOfQuestions: number,
        rawResposne: string,
        parsedResponse: ClaudeQuizResponse
    ): Promise<QuizWithQuestions> {
        const { data: quizData, error: quizError } = await supabase
            .from('quizes')
            .select()
            .single()


        if (quizError) {
            throw new Error(`Failed to save quiz: ${quizError.message}`)
        }

        const questionsToInsert = parsedResponse.questions.map((q, index) => ({
            quiz_id: quizData.id,
            question_number: index + 1,
            question_text: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
        }));

        const { data: questionsData, error: questionsError } = await supabase
            .from('questions')
            .insert(questionsToInsert)
            .select();

        if (questionsError) {
            throw new Error(`Failed to save questions: ${questionsError.message}`);
        }
        return {
            ...quizData,
            questions: questionsData,
        };
    }
}