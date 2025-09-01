import { useState } from "react";

interface ClaudeApiResponse {
    response?: string;
    error?: string;
    quizId?: string;
}

interface QuizParams {
    category: string;
    level: "beginner" | "intermediate" | "upper-intermediate" | "expert";
    numberOfQuestions: number;
}

interface GenerateQuizResult {
    response: string;
    quizId?: string;
}

const useClaude = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<null | string>(null)

    const sendMessage = async (
        message: string, 
        options?: {
            saveToDb?: boolean;
            category?: string;
            level?: string;
            numberOfQuestions?: number;
        }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/claude", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message,
                    ...options
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ClaudeApiResponse = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.response) {
                throw new Error('No response received from Claude');
            }

            return {
                response: data.response,
                quizId: data.quizId
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            throw err
        }
        finally {
            setIsLoading(false);
        }

    }

    const generateQuiz = async (params: QuizParams, saveToDb: boolean = true): Promise<GenerateQuizResult> => {
        const { category, level, numberOfQuestions } = params;

        const prompt = `Generate ${numberOfQuestions} ${level} level questions about ${category}.
                  Format the response as JSON with this structure:
        {
          "questions": [
            {
              "id": 1,
              "question": "Question text here",
              "options": ["A", "B", "C", "D"], // only for multiple-choice
              "correctAnswer": "A", // integer for example if correct answer is "B" this property shall have value 1 (number) it is index of a correctAnswer in the array of options
              "explanation": "Brief explanation"
            }
          ]
        }
                 
        Make sure the JSON is valid and properly formatted and after i get it as a response I can use JSON.parse(response) on it. Don't add any extra characters except JSON structure for example: don't use extra quotations or word "json" except JSON structure`;

        return await sendMessage(prompt, {
            saveToDb,
            category,
            level,
            numberOfQuestions
        });
    };

    return {
        sendMessage,
        isLoading,
        error,
        generateQuiz,
        clearError: () => setError(null)
    }
}

export default useClaude;