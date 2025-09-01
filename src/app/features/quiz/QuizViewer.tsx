// components/QuizViewer.tsx
"use client"
import { useEffect, useState } from 'react';
import { useQuizManagement } from '@/hooks/useQuizManagement';
import { QuizWithQuestions } from '@/types/database';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

interface QuizViewerProps {
  quizId: string;
}

const QuizViewer = ({ quizId }: QuizViewerProps) => {
  const { fetchQuiz, isLoading, error } = useQuizManagement();
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await fetchQuiz(quizId);
        setQuiz(quizData);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    
    let correct = 0;
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    
    return correct;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading quiz...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  const score = calculateScore();
  const totalQuestions = quiz.questions.length;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{quiz.category} Quiz</h1>
        <p className="text-gray-600 capitalize">
          {quiz.level.replace('-', ' ')} • {quiz.number_of_questions} questions
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">
              {index + 1}. {question.question_text}
            </h3>
            
            <FormControl component="fieldset" className="w-full">
              <RadioGroup
                value={answers[question.id] ?? ''}
                onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
              >
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={optionIndex}
                    control={<Radio />}
                    label={option}
                    className={showResults ? (
                      optionIndex === question.correct_answer 
                        ? 'text-green-600 font-medium' 
                        : answers[question.id] === optionIndex && optionIndex !== question.correct_answer
                        ? 'text-red-600'
                        : ''
                    ) : ''}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Show explanation after submission */}
            {showResults && question.explanation && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit/Results */}
      <div className="mt-8 text-center">
        {!showResults ? (
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== totalQuestions}
          >
            Submit Quiz
          </Button>
        ) : (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl">
              You scored <span className="font-bold text-green-600">{score}</span> out of {totalQuestions}
            </p>
            <p className="text-gray-600">
              ({Math.round((score / totalQuestions) * 100)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizViewer;