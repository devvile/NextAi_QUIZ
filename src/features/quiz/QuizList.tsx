"use client"
import { useEffect, useState } from 'react';
import { useQuizManagement } from '@/hooks/useQuizManagement';
import { Button, TextField } from '@mui/material';

const QuizList = () => {
  const { 
    quizzes, 
    isLoading, 
    error, 
    fetchAllQuizzes, 
    searchQuizzes, 
    deleteQuiz 
  } = useQuizManagement();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Load all quizzes on component mount
  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchQuizzes(searchTerm);
    } else {
      await fetchAllQuizzes();
    }
  };

  const handleDelete = async (quizId: string, quizCategory: string) => {
    if (window.confirm(`Are you sure you want to delete the ${quizCategory} quiz?`)) {
      try {
        await deleteQuiz(quizId);
        console.log('Quiz deleted successfully');
      } catch (err) {
        console.error('Failed to delete quiz:', err);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading quizzes...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Saved Quizzes</h2>
      
      {/* Search */}
      <div className="mb-6 flex gap-2">
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={() => {
          setSearchTerm('');
          fetchAllQuizzes();
        }}>
          Clear
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Quiz List */}
      <div className="grid gap-4">
        {quizzes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No quizzes found. Generate some quizzes first!
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{quiz.category}</h3>
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
                    onClick={() => window.open(`/quiz/${quiz.id}`, '_blank')}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(quiz.id, quiz.category)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizList;