
import React from 'react';
import { SessionRequest } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface SessionRequestCardProps {
  request: SessionRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export const SessionRequestCard: React.FC<SessionRequestCardProps> = ({ request, onAccept, onDecline }) => (
    <Card className="flex flex-col sm:flex-row items-start gap-4">
        <img src={request.student.avatarUrl} alt={request.student.name} className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-grow">
            <h4 className="font-bold">{request.student.name}</h4>
            <p className="text-sm text-content/70">Wants to study: <span className="font-semibold">{request.chapter.title}</span></p>
            <p className="text-sm text-content/80 mt-1">
                <Icon icon="clock" className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
                Requested for {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(request.requestedTime)}
            </p>
            {request.note && (
                <div className="mt-2 p-3 bg-base-200/70 rounded-md text-sm italic">
                    "{request.note}"
                </div>
            )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
            <Button onClick={() => onAccept(request.id)} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:ring-green-500">Accept</Button>
            <Button onClick={() => onDecline(request.id)} variant="ghost" className="w-full sm:w-auto">Decline</Button>
        </div>
    </Card>
);
