import React, { useState, useRef, useEffect } from 'react';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';
import { ChatMessage } from '../types';
import * as geminiService from '../services/geminiService';
import type { Chat } from '@google/genai';
import { MarkdownRenderer } from './common/MarkdownRenderer';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white flex-shrink-0"><Icon icon="sparkles" className="w-5 h-5" /></div>}
      <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${isUser ? 'bg-brand-primary' : 'bg-base-100'}`}>
         <MarkdownRenderer
          content={message.text + (message.isStreaming ? '▍' : '')}
          className={`${isUser ? 'prose-invert' : ''}`}
        />
      </div>
    </div>
  );
};

interface ChatPaneProps {
    sourceContext: string;
}

export const ChatPane: React.FC<ChatPaneProps> = ({ sourceContext }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-initialize chat when the source context changes
    const newChat = geminiService.createChat(sourceContext);
    setChat(newChat);
    setMessages([
        { id: 'initial', sender: 'ai', text: "Ask me anything about the source material!" }
    ]);
  }, [sourceContext]);

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
    <div className="h-full flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 -mx-4 -my-4">
            {messages.map(msg => <Message key={msg.id} message={msg} />)}
            <div ref={messagesEndRef} />
        </div>
        <div className="pt-4 mt-auto">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder="Ask about the source..."
                    className="flex-grow p-3 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                    disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    {isLoading ? <Spinner size="sm" /> : <Icon icon="send" className="w-5 h-5" />}
                </Button>
            </div>
        </div>
    </div>
  );
};