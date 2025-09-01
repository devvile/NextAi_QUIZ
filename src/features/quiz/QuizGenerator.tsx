"use client"
import useClaude from "@/hooks/useClaude";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Snackbar, Alert } from "@mui/material";
import QuizPreviewDialog from "./QuizPreviewDialog";
import { ClaudeQuizResponse } from '@/types/database';

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

interface NotificationState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    quizId?: string;
}

const QuizGenerator = () => {
    const [generatedQuiz, setGeneratedQuiz] = useState<ClaudeQuizResponse | null>(null);
    const [generatedQuizRaw, setGeneratedQuizRaw] = useState<string>("");
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [currentQuizParams, setCurrentQuizParams] = useState<QuizFormData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info'
    });
    
    const { generateQuiz, saveQuizWithName, isLoading, error } = useClaude();
    const { register, handleSubmit, formState: { errors } } = useForm<QuizFormData>(
        {
            resolver: zodResolver(quizFormSchema),
            defaultValues: {
                level: "beginner",
                numberOfQuestions: 5,
            }
        }
    )

    const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info', quizId?: string) => {
        setNotification({ open: true, message, severity, quizId });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    const onSubmit = async (data: QuizFormData) => {
        try {
            // Generate quiz without saving first
            const result = await generateQuiz({
                category: data.category,
                level: data.level,
                numberOfQuestions: data.numberOfQuestions
            }, false); // Don't save yet

            // Validate JSON
            const quizObject: ClaudeQuizResponse = JSON.parse(result.response);
            console.log('Generated quiz:', quizObject);

            // Store the data and show preview dialog
            setGeneratedQuiz(quizObject);
            setGeneratedQuizRaw(result.response);
            setCurrentQuizParams(data);
            setShowPreviewDialog(true);
        } catch (err) {
            console.error("Failed to generate quiz:", err);
            showNotification('Failed to generate quiz. Please try again.', 'error');
        }
    };

    const handleSaveQuiz = async (quizName: string) => {
        if (!currentQuizParams || !generatedQuizRaw) return;
        
        setIsSaving(true);
        try {
            const result = await saveQuizWithName(
                quizName,
                currentQuizParams.category,
                currentQuizParams.level,
                currentQuizParams.numberOfQuestions,
                generatedQuizRaw
            );

            setShowPreviewDialog(false);
            
            if (result.quizId) {
                console.log('Quiz saved to database with ID:', result.quizId);
                showNotification('Quiz saved successfully!', 'success', result.quizId);
            } else {
                showNotification('Quiz generated but not saved to database.', 'warning');
            }
        } catch (err) {
            console.error("Failed to save quiz:", err);
            showNotification('Failed to save quiz. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClosePreview = () => {
        setShowPreviewDialog(false);
        setGeneratedQuiz(null);
        setGeneratedQuizRaw("");
        setCurrentQuizParams(null);
    };

    const handleViewQuiz = () => {
        if (notification.quizId) {
            window.location.href = `/quiz/${notification.quizId}`;
        }
    };

    return (
        <>
            <div className="max-w-2xl my-4 mx-auto p-6">
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

                    {/*Submit button*/}
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
                    </Button>
                </form>
            </div>

            {/* Preview Dialog */}
            <QuizPreviewDialog
                open={showPreviewDialog}
                onClose={handleClosePreview}
                onSave={handleSaveQuiz}
                quizData={generatedQuiz}
                category={currentQuizParams?.category || ''}
                level={currentQuizParams?.level || ''}
                isLoading={isSaving}
            />

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={hideNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={hideNotification} 
                    severity={notification.severity}
                    variant="filled"
                    action={
                        notification.severity === 'success' && notification.quizId ? (
                            <Button 
                                color="inherit" 
                                size="small" 
                                onClick={handleViewQuiz}
                                sx={{ ml: 2 }}
                            >
                                VIEW QUIZ
                            </Button>
                        ) : undefined
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default QuizGenerator;