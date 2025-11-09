
import React from 'react';
import { Card } from './common/Card';
import { Icon } from './common/Icon';
import { UserRole } from '../types';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleButton: React.FC<{ icon: React.ComponentProps<typeof Icon>['icon']; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center text-center p-8 bg-base-100 border-2 border-base-300 rounded-lg shadow-sm hover:shadow-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-300 w-full sm:w-64 h-64"
    >
        <Icon icon={icon} className="w-16 h-16 mb-4 text-brand-primary" />
        <h3 className="text-2xl font-bold text-content">{title}</h3>
        <p className="text-content/70 mt-2">{description}</p>
    </button>
);


export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                 <img src="https://i.ibb.co/HLWY2TL2/ti-1.png" alt="EduMentor AI Logo" className="h-16" />
            </div>
            
            <p className="text-lg text-content/70 mt-2 mb-12">First, let's get to know you. Are you a...</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <RoleButton 
                    icon="user-outline"
                    title="Student"
                    description="Personalized learning, AI tutors, and practice tests."
                    onClick={() => onSelectRole(UserRole.STUDENT)}
                />
                <RoleButton 
                    icon="academic-cap"
                    title="Teacher"
                    description="Manage sessions, connect with students, and share your knowledge."
                    onClick={() => onSelectRole(UserRole.TEACHER)}
                />
            </div>
        </div>
    </div>
  );
};
