
import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleIcon, XIcon, PaperAirplaneIcon, SparklesIcon } from './icons';
import { generateText } from '../services/aiService';
import { Lesson } from '../types';

interface ChatbotProps {
  activeLesson: Lesson | null;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ activeLesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen) {
        setMessages([{
            sender: 'ai',
            text: activeLesson 
                ? `Hello! How can I help you with the lesson "${activeLesson.title}"?`
                : "Hello! Ask me anything about IT concepts."
        }]);
    }
  }, [isOpen, activeLesson]);

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const systemInstruction = `You are a helpful and friendly IT tutor. Your goal is to explain concepts clearly to a high school or first-year university student.
    ${activeLesson ? `The user is currently studying the lesson: "${activeLesson.title}". Keep your answers relevant to this topic if possible. Here is the lesson content for context:\n\n${activeLesson.content}` : ''}
    Keep your answers concise and easy to understand. Use analogies where helpful. Use markdown for formatting like lists, bold text, and code blocks.`;

    const aiResponseText = await generateText(userInput, systemInstruction);
    const aiMessage: Message = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
        aria-label="Open Chatbot"
      >
        <ChatBubbleIcon className="h-8 w-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400"/>
            AI Assistant
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm lg:max-w-md rounded-xl px-4 py-2 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                {msg.text.split('```').map((part, i) =>
                  i % 2 === 1 ? (
                    <pre key={i} className="bg-gray-900 text-sm text-yellow-300 rounded-md p-2 my-2 overflow-x-auto"><code>{part}</code></pre>
                  ) : (
                    <p key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />') }}></p>
                  )
                )}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="max-w-xs rounded-xl px-4 py-2 bg-gray-700 text-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
