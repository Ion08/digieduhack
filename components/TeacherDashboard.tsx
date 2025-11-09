import React, { useState } from 'react';
import { Card } from './common/Card';
import { Teacher, SessionRequest, BookedSession } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { SessionRequestCard } from './SessionRequestCard';
import { BookedSessionCard } from './BookedSessionCard';

interface TeacherDashboardProps {
  teacher: Teacher;
  sessionRequests: SessionRequest[];
  bookedSessions: BookedSession[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacher, sessionRequests: initialRequests, bookedSessions }) => {
  const [requests, setRequests] = useState(initialRequests);
  
  const handleAccept = (requestId: string) => {
    alert(`Session with ${requests.find(r => r.id === requestId)?.student.name} accepted! (This is a demo)`);
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };
  
  const handleJoin = (session: BookedSession) => {
    window.open(session.meetLink, '_blank', 'noopener,noreferrer');
  };

  const teacherSessions = bookedSessions.filter(s => s.teacher.id === teacher.id);
  const upcomingSessions = teacherSessions.filter(s => new Date() < s.endTime);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <h2 className="text-3xl font-bold text-content">Welcome back, {teacher.name.split(' ')[0]}!</h2>
        
        {/* Session Requests */}
        <div>
            <h3 className="text-2xl font-bold text-content mb-4">Session Requests ({requests.length})</h3>
            {requests.length > 0 ? (
                <div className="space-y-4">
                    {requests.map(req => (
                        <SessionRequestCard key={req.id} request={req} onAccept={handleAccept} onDecline={handleDecline} />
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-content/70">You have no new session requests.</p>
                </Card>
            )}
        </div>
        
        {/* Upcoming Sessions */}
        <div>
            <h3 className="text-2xl font-bold text-content mb-4">Your Upcoming Sessions</h3>
             {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <BookedSessionCard key={session.id} session={session} onJoin={handleJoin} />
                  ))}
                </div>
              ) : (
                <Card>
                    <p className="text-content/70">You have no upcoming sessions booked.</p>
                </Card>
              )}
        </div>
    </div>
  );
};