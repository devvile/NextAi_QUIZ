"use client"
import useClaude from "@/hooks/useClaude";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@mui/material";

type levels = "beginner" | "intermediate" | "upper-intermediate" | "expert"
const LEVELS: levels[] = ["beginner", "intermediate", "upper-intermediate", "expert"];

const quizFormSchema = z.object({
    category: z.string()
        .min(1, "Category is required")
        .max(100, "Category must be less than 100 characters"),
    level: z.enum(["beginner", "intermediate", "upper-intermediate", "expert"]),
    numberOfQuestions: z.number()
        .min(1, "At least 1 question required")
        .max(50, "Maximum 50 questions allowed")
        .int("Number of questions must be a whole number")
});

type QuizFormData = z.infer<typeof quizFormSchema>;

const QuizGenerator = () => {
    const [generatedQuiz, setGeneratedQuiz] = useState<string>("");
    const [quizId, setQuizId] = useState<string | null>(null);
    const [saveToDatabase, setSaveToDatabase] = useState<boolean>(true);
    const { generateQuiz, isLoading, error } = useClaude();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<QuizFormData>(
        {
            resolver: zodResolver(quizFormSchema),
            defaultValues: {
                level: "beginner",
                numberOfQuestions: 5,
            }
        }
    )

    const onSubmit = async (data: QuizFormData) => {
        try {
            const result = await generateQuiz({
                category: data.category,
                level: data.level,
                numberOfQuestions: data.numberOfQuestions
            }, saveToDatabase);

            // Validate JSON before setting state
            const quizObject = JSON.parse(result.response);
            console.log('Generated quiz:', quizObject);
            
            setGeneratedQuiz(result.response);
            setQuizId(result.quizId || null);
            
            if (result.quizId) {
                console.log('Quiz saved to database with ID:', result.quizId);
            }
        } catch (err) {
            console.error("Failed to generate quiz:", err)
        }
    }

    return <div className="max-w-2xl my-4 mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Quiz Generator</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category */}
            <div className="my-2">
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                    {...register("category")}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    type="text"
                    placeholder="e.g. History, Science"
                />
                {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
            </div>
            
            {/*Level*/}
            <div className="my-2">
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                    {...register("level")}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                >
                    {LEVELS.map((level) => (
                        <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ')}
                        </option>
                    ))}
                </select>
                {errors.level && (
                    <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                )}
            </div>
            
            <div className="my-2">
                <label className="block text-sm font-medium mb-2">Number Of Questions</label>
                <input
                    {...register("numberOfQuestions", {
                        valueAsNumber: true
                    })}
                    type="number"
                    min="1"
                    max="50"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {errors.numberOfQuestions && (
                    <p className="text-red-500 text-sm mt-1">{errors.numberOfQuestions.message}</p>
                )}
            </div>

            {/* Save to Database Option */}
            <div className="my-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={saveToDatabase}
                        onChange={(e) => setSaveToDatabase(e.target.checked)}
                        className="mr-2"
                    />
                    <span className="text-sm font-medium">Save quiz to database</span>
                </label>
            </div>
            
            {/*Submit button*/}
            <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </Button>
        </form>

        {/* Error Display */}
        {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                Error: {error}
            </div>
        )}

        {/* Success message */}
        {quizId && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                ✅ Quiz saved successfully! Quiz ID: {quizId}
            </div>
        )}

        {/* Generated Quiz Display */}
        {generatedQuiz && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold mb-2">Generated Quiz:</h3>
                <pre className="whitespace-pre-wrap text-sm">{generatedQuiz}</pre>
            </div>
        )}
    </div>
}

export default QuizGenerator;