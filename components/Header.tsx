
import React, { useState } from 'react';
import { User, View, UserRole } from '../types';
import { Icon } from './common/Icon';
import { Button } from './common/Button';

interface HeaderProps {
  user: User;
  activeView: View;
  setView: (view: View) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NavItem: React.FC<{
  icon: React.ComponentProps<typeof Icon>['icon'];
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-content/70 hover:bg-base-300/50'
    }`}
  >
    <Icon icon={icon} className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </button>
);

export const Header: React.FC<HeaderProps> = ({ user, activeView, setView, theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isTeacher = user.role === UserRole.TEACHER;

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMobileMenuOpen(false);
  }

  const defaultView = isTeacher ? View.TEACHER_DASHBOARD : View.DASHBOARD;
  const dashboardLabel = isTeacher ? 'Teacher Dashboard' : 'Dashboard';

  const desktopNavItems = isTeacher ? (
    <>
      <NavItem icon="dashboard" label={dashboardLabel} isActive={activeView === View.TEACHER_DASHBOARD || activeView === View.DASHBOARD} onClick={() => handleNavClick(defaultView)} />
      {/* Add more teacher-specific links here if needed */}
    </>
  ) : (
    <>
      <NavItem icon="dashboard" label="Dashboard" isActive={activeView === View.DASHBOARD} onClick={() => handleNavClick(View.DASHBOARD)} />
      <NavItem icon="users" label="Find a Teacher" isActive={activeView === View.TEACHERS} onClick={() => handleNavClick(View.TEACHERS)} />
    </>
  );

  const mobileNavItems = (
     <>
      <NavItem icon="dashboard" label={dashboardLabel} isActive={activeView === defaultView || (activeView === View.DASHBOARD && !isTeacher)} onClick={() => handleNavClick(defaultView)} />
      {!isTeacher && <NavItem icon="users" label="Find a Teacher" isActive={activeView === View.TEACHERS} onClick={() => handleNavClick(View.TEACHERS)} />}
      <NavItem icon="profile" label="Profile" isActive={activeView === View.PROFILE} onClick={() => handleNavClick(View.PROFILE)} />
     </>
  );

  return (
    <header className="bg-base-100 shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick(defaultView)}>
            <img src="https://i.ibb.co/HLWY2TL2/ti-1.png" alt="EduMentor AI Logo" className="h-12" />
           
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center space-x-2">
              {desktopNavItems}
            </nav>
            <Button variant="ghost" onClick={toggleTheme} className="!px-2">
              <Icon icon={theme === 'light' ? 'moon' : 'sun'} className="w-5 h-5" />
            </Button>
            <button onClick={() => handleNavClick(View.PROFILE)} className="hidden md:flex items-center space-x-3 p-2 rounded-full hover:bg-base-200 transition-colors">
              <img className="h-9 w-9 rounded-full" src={user.avatarUrl} alt={user.name} />
              <span className="text-sm font-medium text-content hidden sm:inline">{user.name}</span>
            </button>
            <div className="md:hidden">
                <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="!px-2">
                    <Icon icon={isMobileMenuOpen ? 'close' : 'summary'} className="w-6 h-6" />
                </Button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
                <nav className="flex flex-col gap-2">
                    {mobileNavItems}
                </nav>
            </div>
        )}
      </div>
    </header>
  );
};
