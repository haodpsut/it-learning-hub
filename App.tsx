
import React, { useState, useMemo } from 'react';
import { ApiConfig, ViewState, Lesson, Lab, LabQuestion, QuestionType, UserProgress } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import ApiKeySetup from './components/ApiKeySetup';
import { INITIAL_LESSONS } from './constants';
import Chatbot from './components/Chatbot';
import { AcademicCapIcon, BookOpenIcon, BeakerIcon, LightBulbIcon, RefreshIcon } from './components/icons';

const Sidebar: React.FC<{
  lessons: Lesson[];
  onSelectView: (view: ViewState) => void;
  activeView: ViewState;
  userProgress: UserProgress;
}> = ({ lessons, onSelectView, activeView, userProgress }) => {
  const categories = [...new Set(lessons.map(l => l.category))];

  const getProgress = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return { total: 0, correct: 0 };
    const questionIds = lesson.labs.flatMap(lab => lab.questions.map(q => q.id));
    const correctCount = questionIds.filter(id => userProgress[id]?.correct).length;
    return { total: questionIds.length, correct: correctCount };
  };

  return (
    <aside className="w-80 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 h-screen flex flex-col fixed top-0 left-0">
      <div className="p-6 border-b border-gray-700 flex items-center space-x-3">
        <AcademicCapIcon className="h-10 w-10 text-indigo-400" />
        <div>
          <h1 className="text-xl font-bold text-white">IT Learning Hub</h1>
          <p className="text-sm text-gray-400">Your journey starts here</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
           <h2 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Practice</h2>
           <div className="space-y-1 mt-2">
            <button
                onClick={() => onSelectView({ type: 'practice' })}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    activeView.type === 'practice' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
            >
                <LightBulbIcon className="h-5 w-5 mr-3" />
                Smart Review
            </button>
            <button
                onClick={() => {
                  const allQuestions = lessons.flatMap(l => l.labs.flatMap(lab => lab.questions));
                  if (allQuestions.length > 0) {
                      const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
                      const lessonForQuestion = lessons.find(l => l.labs.some(lab => lab.questions.some(q => q.id === randomQuestion.id)));
                      const labForQuestion = lessonForQuestion?.labs.find(lab => lab.questions.some(q => q.id === randomQuestion.id));
                      if (lessonForQuestion && labForQuestion) {
                          onSelectView({type: 'lab', lessonId: lessonForQuestion.id, labId: labForQuestion.id});
                      }
                  }
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 text-gray-300 hover:bg-gray-700/50 hover:text-white`}
            >
                <RefreshIcon className="h-5 w-5 mr-3" />
                Random Question
            </button>
           </div>
        </div>
        {categories.map(category => (
          <div key={category}>
            <h2 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</h2>
            <div className="space-y-1 mt-2">
              {lessons.filter(l => l.category === category).map(lesson => (
                <div key={lesson.id}>
                  <button
                    onClick={() => onSelectView({ type: 'lesson', lessonId: lesson.id })}
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      activeView.lessonId === lesson.id ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center truncate">
                      <BookOpenIcon className="h-5 w-5 mr-3" />
                      <span className="truncate">{lesson.title}</span>
                    </div>
                    {getProgress(lesson.id).total > 0 && 
                        <span className="text-xs font-mono bg-gray-700 px-1.5 py-0.5 rounded-full">{getProgress(lesson.id).correct}/{getProgress(lesson.id).total}</span>
                    }
                  </button>
                  {activeView.lessonId === lesson.id && lesson.labs.length > 0 && (
                    <div className="pl-6 mt-1 space-y-1">
                      {lesson.labs.map(lab => (
                        <button
                          key={lab.id}
                          onClick={() => onSelectView({ type: 'lab', lessonId: lesson.id, labId: lab.id })}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                            activeView.labId === lab.id ? 'bg-indigo-500/30 text-indigo-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                          }`}
                        >
                          <BeakerIcon className="h-5 w-5 mr-3" />
                          <span className="truncate">{lab.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const LessonView: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    return (
        <article className="prose prose-invert prose-lg max-w-none p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-white mb-2">{lesson.title}</h1>
            <p className="text-sm text-gray-400 mb-8 uppercase tracking-wider">{lesson.category}</p>
            {lesson.content.split(/(```[\s\S]*?```|!\[.*\]\(.*\))/g).map((part, index) => {
                if (part.startsWith('```')) {
                    const code = part.replace(/```(python|javascript|html|sql)?\n?/, '').replace(/```$/, '');
                    return <pre key={index} className="bg-gray-800 text-sm text-yellow-300 rounded-md p-4 my-4 overflow-x-auto"><code>{code}</code></pre>;
                }
                if (part.startsWith('![')) {
                  const match = /!\[(.*)\]\((.*)\)/.exec(part);
                  if (match) {
                    return <img key={index} src={match[2]} alt={match[1]} className="my-6 rounded-lg shadow-lg"/>
                  }
                }
                return <div key={index} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />').replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-indigo-300 rounded px-1 py-0.5 font-mono">$&</code>') }} />;
            })}
        </article>
    );
};

const LabView: React.FC<{
  lab: Lab;
  userProgress: UserProgress;
  onUpdateProgress: (questionId: string, correct: boolean) => void;
}> = ({ lab, userProgress, onUpdateProgress }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: { correct: boolean; show: boolean } }>({});

  const handleMCQSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setFeedback(prev => ({ ...prev, [questionId]: { ...prev[questionId], show: false } }));
  };
  
  const handleCodeChange = (questionId: string, code: string) => {
    setAnswers(prev => ({...prev, [questionId]: code}));
  }

  const checkAnswer = (question: LabQuestion) => {
    let isCorrect = false;
    if (question.type === QuestionType.MCQ) {
      isCorrect = answers[question.id] === question.correctOptionId;
    } else if (question.type === QuestionType.CODE) {
        // Simple check for demonstration purposes
        isCorrect = answers[question.id]?.toLowerCase().includes('transport layer');
    }
    setFeedback(prev => ({ ...prev, [question.id]: { correct: isCorrect, show: true } }));
    onUpdateProgress(question.id, isCorrect);
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="text-3xl font-bold text-white mb-2">{lab.title}</h1>
      <p className="text-gray-400 mb-8">Test your knowledge with these interactive questions.</p>
      <div className="space-y-12">
        {lab.questions.map((q, index) => (
          <div key={q.id} className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
            <p className="font-semibold text-lg text-gray-200 mb-4">{index + 1}. {q.questionText}</p>
            {q.type === QuestionType.MCQ && (
              <div className="space-y-3">
                {q.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleMCQSelect(q.id, opt.id)}
                    className={`block w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      answers[q.id] === opt.id
                        ? 'bg-indigo-500/30 border-indigo-500'
                        : 'bg-gray-700/50 border-gray-600 hover:border-indigo-600'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
            {q.type === QuestionType.CODE && (
                <textarea
                    value={answers[q.id] || q.placeholderCode}
                    onChange={(e) => handleCodeChange(q.id, e.target.value)}
                    className="w-full h-32 bg-gray-900 text-mono text-sm p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
            )}
            <button
              onClick={() => checkAnswer(q)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-500"
              disabled={!answers[q.id]}
            >
              Check Answer
            </button>
            {feedback[q.id]?.show && (
              <div
                className={`mt-4 p-4 rounded-md text-sm ${
                  feedback[q.id].correct
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                <p className="font-bold">{feedback[q.id].correct ? 'Correct!' : 'Incorrect.'}</p>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


const SmartPracticeView: React.FC<{
  lessons: Lesson[];
  userProgress: UserProgress;
  onUpdateProgress: (questionId: string, correct: boolean) => void;
}> = ({ lessons, userProgress, onUpdateProgress }) => {
    const incorrectQuestions = useMemo(() => {
        const allQuestions: LabQuestion[] = lessons.flatMap(l => l.labs.flatMap(lab => lab.questions));
        return allQuestions.filter(q => userProgress[q.id] && !userProgress[q.id].correct);
    }, [lessons, userProgress]);

    if (incorrectQuestions.length === 0) {
        return (
            <div className="p-8 lg:p-12 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Smart Review</h1>
                <p className="text-gray-400 text-lg">Great job! You haven't missed any questions yet. Keep up the good work!</p>
            </div>
        )
    }

    // Creating a mock lab to reuse the LabView component
    const practiceLab: Lab = {
        id: 'smart-practice-lab',
        title: 'Questions for Review',
        questions: incorrectQuestions,
    };

    return (
      <div className="p-8 lg:p-12">
        <h1 className="text-3xl font-bold text-white mb-2">Smart Review</h1>
        <p className="text-gray-400 mb-8">Here are the questions you've answered incorrectly. Let's try them again!</p>
        <LabView lab={practiceLab} userProgress={userProgress} onUpdateProgress={onUpdateProgress} />
      </div>
    );
};


export default function App() {
  const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig | null>('apiConfig', null);
  const [lessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('userProgress', {});
  const [activeView, setActiveView] = useState<ViewState>({ type: 'lesson', lessonId: INITIAL_LESSONS[0].id });

  const handleUpdateProgress = (questionId: string, correct: boolean) => {
    setUserProgress(prev => ({
      ...prev,
      [questionId]: {
        correct,
        attempts: (prev[questionId]?.attempts || 0) + 1,
      },
    }));
  };

  if (!apiConfig) {
    return <ApiKeySetup onConfigured={setApiConfig} />;
  }
  
  const activeLesson = lessons.find(l => l.id === activeView.lessonId) || null;
  const activeLab = activeLesson?.labs.find(lab => lab.id === activeView.labId) || null;

  const renderContent = () => {
    switch (activeView.type) {
      case 'lab':
        return activeLab && <LabView lab={activeLab} userProgress={userProgress} onUpdateProgress={handleUpdateProgress} />;
      case 'lesson':
        return activeLesson && <LessonView lesson={activeLesson} />;
      case 'practice':
        return <SmartPracticeView lessons={lessons} userProgress={userProgress} onUpdateProgress={handleUpdateProgress} />;
      case 'dashboard':
      default:
        // A default/dashboard view can be implemented here. For now, show the first lesson.
        return activeLesson && <LessonView lesson={lessons[0]} />;
    }
  };
  
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <Sidebar lessons={lessons} onSelectView={setActiveView} activeView={activeView} userProgress={userProgress} />
      <main className="ml-80">
        {renderContent()}
      </main>
      <Chatbot activeLesson={activeLesson} />
    </div>
  );
}
