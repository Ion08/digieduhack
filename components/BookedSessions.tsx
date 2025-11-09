import React from 'react';
import { BookedSession } from '../types';
import { BookedSessionCard } from './BookedSessionCard';

interface BookedSessionsProps {
  sessions: BookedSession[];
  onJoin: (session: BookedSession) => void;
}

export const BookedSessions: React.FC<BookedSessionsProps> = ({ sessions, onJoin }) => {
  const upcomingSessions = sessions.filter(s => new Date() < s.endTime);
  
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-content mb-4">Your Booked Sessions</h3>
      {upcomingSessions.length > 0 ? (
        <div className="space-y-4">
          {upcomingSessions.map(session => (
            <BookedSessionCard key={session.id} session={session} onJoin={onJoin} />
          ))}
        </div>
      ) : (
        <p className="text-content/70">You have no upcoming sessions booked.</p>
      )}
    </div>
  );
};