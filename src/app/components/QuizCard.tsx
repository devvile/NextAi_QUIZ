import { Button } from '@mui/material';
import { Quiz } from '@/types/database';

interface QuizCardProps {
  quiz: Quiz;
  onDelete: (quizId: string, quizName: string, category: string) => void;
  onView: (quizId: string) => void;
}

const QuizCard = ({ quiz, onDelete, onView }: QuizCardProps) => {
  const handleDelete = () => {
    onDelete(quiz.id, quiz.quiz_name || quiz.category, quiz.category);
  };

  const handleView = () => {
    onView(quiz.id);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{quiz.quiz_name || quiz.category}</h3>
          {quiz.quiz_name && (
            <h4 className="text-stone-400">{quiz.category}</h4>
          )}
          <p className="text-gray-600 capitalize">
            {quiz.level.replace('-', ' ')} • {quiz.number_of_questions} questions
          </p>
          <p className="text-sm text-gray-500">
            Created: {new Date(quiz.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleView}
          >
            View
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;