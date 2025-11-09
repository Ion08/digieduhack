import React, { useState, useRef, useEffect } from 'react';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';
import { ChatMessage, TestResult } from '../types';
import * as geminiService from '../services/geminiService';
import type { Chat } from '@google/genai';
import { MarkdownRenderer } from './common/MarkdownRenderer';
import { Card } from './common/Card';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white flex-shrink-0"><Icon icon="sparkles" className="w-5 h-5" /></div>}
      <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${isUser ? 'bg-brand-primary' : 'bg-base-200'}`}>
         <MarkdownRenderer
          content={message.text + (message.isStreaming ? '▍' : '')}
          className={`${isUser ? 'prose-invert' : ''}`}
        />
      </div>
    </div>
  );
};

interface AIReflectionModalProps {
    onClose: () => void;
    onComplete: (history: ChatMessage[]) => void;
}

export const AIReflectionModal: React.FC<AIReflectionModalProps> = ({ onClose, onComplete }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const userMessageCount = messages.filter(m => m.sender === 'user').length;
  const canFinish = userMessageCount >= 2;

  useEffect(() => {
    const newChat = geminiService.createReflectionChat();
    setChat(newChat);
    // Initial message from AI
    const firstMessage = `Great job on the study session! Let's take a moment to reflect. What was the most surprising or interesting thing you learned?`;
    setMessages([{ id: 'initial', sender: 'ai', text: firstMessage }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat) return;
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '', isStreaming: true }]);

    try {
        const stream = await geminiService.sendMessageStream(chat, input);
        let accumulatedText = '';
        for await (const chunk of stream) {
            accumulatedText += chunk.text;
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId ? { ...msg, text: accumulatedText, isStreaming: true } : msg
            ));
        }
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        ));
    } catch (error) {
        setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: "Sorry, I ran into a problem. Please try again.", isStreaming: false } : msg
        ));
    } finally {
        setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onComplete(messages);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col relative">
            <div className="flex justify-between items-center border-b border-base-300 pb-4 mb-4">
                <h2 className="text-xl font-bold">AI Reflection</h2>
                 <Button variant="ghost" className="!p-1 h-auto" onClick={onClose} aria-label="Close modal">
                    <Icon icon="close" />
                </Button>
            </div>
            <div className="flex-grow overflow-y-auto px-2">
                {messages.map(msg => <Message key={msg.id} message={msg} />)}
                <div ref={messagesEndRef} />
            </div>
            <div className="pt-4 mt-auto">
                {canFinish && (
                    <div className="text-center mb-4">
                        <Button onClick={handleFinish} variant="secondary">Finish Reflection & Get Assessment</Button>
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                        placeholder="Share your thoughts..."
                        className="flex-grow p-3 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        {isLoading ? <Spinner size="sm" /> : <Icon icon="send" className="w-5 h-5" />}
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
};