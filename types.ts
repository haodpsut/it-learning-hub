
export type AIProvider = 'gemini' | 'openrouter';

export interface ApiConfig {
  provider: AIProvider;
  geminiApiKey: string;
  openRouterApiKey: string;
  openRouterModel: string;
}

export enum QuestionType {
  MCQ = 'MCQ',
  CODE = 'CODE',
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  type: QuestionType.MCQ;
  questionText: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
}

export interface CodeQuestion {
  id: string;
  type: QuestionType.CODE;
  questionText: string;
  explanation: string;
  placeholderCode: string;
}

export type LabQuestion = MCQQuestion | CodeQuestion;

export interface Lab {
  id: string;
  title: string;
  questions: LabQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown content
  labs: Lab[];
}

export interface UserProgress {
  [questionId: string]: {
    correct: boolean;
    attempts: number;
  };
}

export interface ViewState {
  type: 'dashboard' | 'lesson' | 'lab' | 'practice';
  lessonId?: string;
  labId?: string;
}
