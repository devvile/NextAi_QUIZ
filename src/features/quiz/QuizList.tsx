"use client"
import { useEffect, useState } from 'react';
import { useQuizManagement } from '@/hooks/useQuizManagement';
import { Snackbar, Alert,LinearProgress } from '@mui/material';
import SearchBar from '@/app/components/SearchBar'
import QuizCard from "@/app/components/QuizCard"
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface DeleteDialogState {
  open: boolean;
  quizId: string;
  quizName: string;
  category: string;
}

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const QuizList = () => {
  const { 
    quizzes, 
    isLoading, 
    error, 
    fetchAllQuizzes, 
    searchQuizzes, 
    deleteQuiz 
  } = useQuizManagement();
  
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    quizId: '',
    quizName: '',
    category: ''
  });
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      if (searchTerm) {
        await searchQuizzes(searchTerm);
      } else {
        await fetchAllQuizzes();
      }
    } catch (err) {
      showNotification('Failed to search quizzes', 'error');
    }
  };

  const handleClearSearch = async () => {
    try {
      await fetchAllQuizzes();
    } catch (err) {
      showNotification('Failed to reload quizzes', 'error');
    }
  };

  const openDeleteDialog = (quizId: string, quizName: string, category: string) => {
    setDeleteDialog({
      open: true,
      quizId,
      quizName,
      category
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(prev => ({ ...prev, open: false }));
  };

  const handleDialogExited = () => {
    setDeleteDialog({
      open: false,
      quizId: '',
      quizName: '',
      category: ''
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteQuiz(deleteDialog.quizId);
      closeDeleteDialog();
      showNotification('Quiz deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete quiz:', err);
      showNotification('Failed to delete quiz. Please try again.', 'error');
    }
  };

  const handleViewQuiz = (quizId: string) => {
    window.open(`/quiz/${quizId}`, '_blank');
  };

  if (isLoading) {
    return       <div className="max-w-4xl m-auto  p-6 "><LinearProgress /></div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Saved Quizzes</h2>
        
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search by category..."
        />

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="grid gap-4">
          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No quizzes found. Generate some quizzes first!
            </div>
          ) : (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={openDeleteDialog}
                onView={handleViewQuiz}
              />
            ))
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        quizName={deleteDialog.quizName}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuizList;