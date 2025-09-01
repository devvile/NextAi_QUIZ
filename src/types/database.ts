export interface Quiz {
  id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'upper-intermediate' | 'expert';
  number_of_questions: number;
  raw_response?: string;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

export interface Question {
  id: string;
  quiz_id: string;
  question_number: number;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  created_at: string;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

// For Claude API response parsing
export interface ClaudeQuizResponse {
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}