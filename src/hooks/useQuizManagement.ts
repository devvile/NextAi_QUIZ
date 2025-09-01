import { useState, useEffect } from 'react'
import { Quiz, QuizWithQuestions } from "@/types/database"

export const useQuizManagement = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const fetchAllQuizzes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/quiz");
            if (!response.ok) throw new Error("Failed to fetch quizzes");
            const data: Quiz[] = await response.json();
            setQuizzes(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown Error";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchQuiz = async (quizId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/quiz/${quizId}`);
            if (!response.ok) throw new Error("Failed to fetch quiz")
            const quiz: QuizWithQuestions = await response.json();
            return quiz;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unkwnow Error";
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteQuiz = async (quizId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/quiz/${quizId}`, {
                method: "DELETE"
            })
            if (!response.ok) throw new Error('Failed to delete quiz');
            setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setIsLoading(false)
        }
    }

    const searchQuizzes = async (category: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/quiz/search?category=${encodeURIComponent(category)}`);
            if(!response.ok) throw new Error("Failed to search quizzes");
            const quizzes:Quiz[] = await response.json();
            setQuizzes(quizzes);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown Message";
            setError(errorMessage);
        } finally {
            setIsLoading(false)
        }
    }

    return{
        searchQuizzes,
        deleteQuiz,
        fetchAllQuizzes,
        fetchQuiz,
        quizzes,
        error,
        isLoading,
        clearError:()=>setError(null)
    }
}