"use client"
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ClaudeQuizResponse } from '@/types/database';

interface QuizPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (quizName: string) => void;
  quizData: ClaudeQuizResponse | null;
  category: string;
  level: string;
  isLoading?: boolean;
}

const QuizPreviewDialog = ({ 
  open, 
  onClose, 
  onSave, 
  quizData, 
  category, 
  level,
  isLoading = false 
}: QuizPreviewDialogProps) => {
  const [quizName, setQuizName] = useState('');

  // Generate default name when dialog opens
  const handleOpen = () => {
    if (quizData && !quizName) {
      setQuizName(`${category} Quiz`);
    }
  };

  const handleSave = () => {
    if (quizName.trim()) {
      onSave(quizName.trim());
    }
  };

  const handleCancel = () => {
    setQuizName('');
    onClose();
  };

  if (!quizData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      onTransitionEnter={handleOpen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Preview Your Quiz</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Quiz Name Input */}
        <Box mb={3}>
          <TextField
            label="Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            fullWidth
            placeholder="Enter a name for your quiz..."
            helperText="Give your quiz a memorable name"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Questions Preview */}
        <Typography variant="h6" gutterBottom>
          Questions Preview:
        </Typography>
        
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {quizData.questions.map((question, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`question-${index}-content`}
                id={`question-${index}-header`}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    margin: '12px 0'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {index + 1}. {question.question}
                </Typography>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ ml: 1 }}>
                  {question.options.map((option, optionIndex) => (
                    <Box 
                      key={optionIndex}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        py: 0.5,
                        color: optionIndex === question.correctAnswer ? 'success.main' : 'text.primary',
                        fontWeight: optionIndex === question.correctAnswer ? 'bold' : 'normal'
                      }}
                    >
                      <Typography variant="body2">
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {optionIndex === question.correctAnswer && ' ✓'}
                      </Typography>
                    </Box>
                  ))}

                  {question.explanation && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="info.contrastText">
                        <strong>Explanation:</strong> {question.explanation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!quizName.trim() || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Quiz'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizPreviewDialog;