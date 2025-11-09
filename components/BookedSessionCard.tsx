import React, { useState, useEffect } from 'react';
import { BookedSession } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface BookedSessionCardProps {
  session: BookedSession;
  onJoin: (session: BookedSession) => void;
}

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session, onJoin }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState<'now' | 'upcoming' | 'completed'>('upcoming');
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date().getTime();
      const startTime = session.startTime.getTime();
      const endTime = session.endTime.getTime();

      if (now >= startTime && now < endTime) {
        setStatus('now');
      } else if (now < startTime) {
        setStatus('upcoming');
        const diff = startTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if(days > 0) {
            setTimeRemaining(`Starts in ${days} day${days > 1 ? 's' : ''}`);
        } else if (hours > 0) {
            setTimeRemaining(`Starts in ${hours} hour${hours > 1 ? 's' : ''}`);
        } else {
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeRemaining(`Starts in ${minutes} minute${minutes > 1 ? 's' : ''}`);
        }
      } else {
        setStatus('completed');
      }
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [session.startTime, session.endTime]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.meetLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  if (status === 'completed') {
      return null; // Don't show completed sessions
  }

  return (
    <Card className="flex flex-col sm:flex-row items-center gap-4">
      <img src={session.teacher.avatarUrl} alt={session.teacher.name} className="w-16 h-16 rounded-full flex-shrink-0" />
      <div className="flex-grow text-center sm:text-left">
        <h4 className="font-bold">{session.teacher.name}</h4>
        <p className="text-sm text-content/70">{session.teacher.specialty}</p>
        <p className="text-sm font-semibold mt-1">
          {status === 'now' 
            ? <span className="text-red-600 animate-pulse">Happening Now</span>
            : <span>{formatDateTime(session.startTime)}</span>
          }
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 sm:mt-0">
        {status === 'now' ? (
          <>
            <Button onClick={() => onJoin(session)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:ring-green-500" leftIcon={<Icon icon="video" className="w-5 h-5"/>}>
              Join Meet
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto" onClick={handleCopyLink} leftIcon={<Icon icon="copy" className="w-4 h-4"/>}>
              {isCopied ? 'Copied!' : 'Copy Link'}
            </Button>
          </>
        ) : (
          <div className="bg-brand-secondary/10 text-brand-secondary text-xs font-bold px-3 py-1.5 rounded-full">
            {timeRemaining}
          </div>
        )}
      </div>
    </Card>
  );
};