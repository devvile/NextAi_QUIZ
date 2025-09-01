"use client"
import { useEffect, useState } from 'react';
import { useQuizManagement } from '@/hooks/useQuizManagement';
import { QuizWithQuestions } from '@/types/database';
import { Radio, RadioGroup, FormControlLabel, FormControl, LinearProgress } from '@mui/material';

interface QuizViewerProps {
  quizId: string;
}

const QuizViewer = ({ quizId }: QuizViewerProps) => {
  const { fetchQuiz, isLoading, error } = useQuizManagement();
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await fetchQuiz(quizId);
        if (quizData) {
          setQuiz(quizData);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      }
    };

    loadQuiz();
  }, [quizId]);

  if (isLoading) {
    return <div className="max-w-4xl m-auto  p-6 "><LinearProgress /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{quiz.category} Quiz</h1>
        <p className="text-gray-600 capitalize">
          {quiz.level.replace('-', ' ')} • {quiz.number_of_questions} questions
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ✅ Correct answers are highlighted in green
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              {index + 1}. {question.question_text}
            </h3>

            <FormControl component="fieldset" className="w-full">
              <RadioGroup value={question.correct_answer}>
                {question.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === question.correct_answer;

                  return (
                    <FormControlLabel
                      key={optionIndex}
                      value={optionIndex}
                      disabled={true}
                      control={
                        <Radio
                          sx={{
                            color: isCorrect ? '#22c55e' : undefined,
                            '&.Mui-checked': {
                              color: '#22c55e',
                            },
                          }}
                        />
                      }
                      label={option}
                      className={isCorrect ? 'text-green-600 font-medium' : ''}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>

            {/* Always show explanation */}
            {question.explanation && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <strong>💡 Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">
          This is a preview of your quiz. All correct answers are highlighted.
        </p>
      </div>
    </div>
  );
};

export default QuizViewer;