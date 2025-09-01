import { supabase } from '@/lib/supabase';
import { Quiz, Question, QuizWithQuestions, ClaudeQuizResponse } from '@/types/database';

export class QuizService {
  static async saveQuiz(
    quizName: string, // New parameter
    category: string,
    level: string,
    numberOfQuestions: number,
    rawResponse: string,
    parsedResponse: ClaudeQuizResponse
  ): Promise<QuizWithQuestions> {
    // First, create the quiz record
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        quiz_name: quizName, 
        category,
        level,
        number_of_questions: numberOfQuestions,
        raw_response: rawResponse,
      })
      .select()
      .single();

    if (quizError) {
      throw new Error(`Failed to save quiz: ${quizError.message}`);
    }

    // Then, create the questions
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

  static async getQuiz(quizId: string): Promise<QuizWithQuestions | null> {
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions (*)
      `)
      .eq('id', quizId)
      .order('question_number', { foreignTable: 'questions' })
      .single();

    if (quizError) {
      if (quizError.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch quiz: ${quizError.message}`);
    }

    return quizData as QuizWithQuestions;
  }

  static async getAllQuizzes(): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch quizzes: ${error.message}`);
    }

    return data || [];
  }

  static async getQuizzesByCategory(category: string): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .ilike('category', `%${category}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch quizzes by category: ${error.message}`);
    }

    return data || [];
  }

  static async deleteQuiz(quizId: string): Promise<void> {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) {
      throw new Error(`Failed to delete quiz: ${error.message}`);
    }
  }
}