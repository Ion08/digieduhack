
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';
import { ChatMessage } from '../types';
import * as geminiService from '../services/geminiService';
import type { Chat } from '@google/genai';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white flex-shrink-0"><Icon icon="sparkles" className="w-5 h-5" /></div>}
      <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${isUser ? 'bg-brand-primary text-white' : 'bg-base-100 text-content'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.text}{message.isStreaming && <span className="inline-block w-2 h-4 bg-current ml-1 animate-ping"></span>}</p>
      </div>
    </div>
  );
};

export const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(geminiService.createChat());
    setMessages([
        { id: 'initial', sender: 'ai', text: "Hello! I'm your AI learning assistant. How can I help you today?" }
    ]);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold text-content border-b border-base-300 pb-4">AI Chat Assistant</h2>
        <div className="flex-grow overflow-y-auto p-4">
          {messages.map(msg => <Message key={msg.id} message={msg} />)}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-base-300 pt-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask a question..."
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
