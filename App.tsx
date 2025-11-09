import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentDashboard } from './components/StudentDashboard';
import { LessonView } from './components/LessonView';
import { MOCK_STUDENT, MOCK_CHAPTERS, MOCK_TEACHER_USER, MOCK_SESSION_REQUESTS, MOCK_BOOKED_SESSIONS, ONBOARDING_STEPS, TEACHER_ONBOARDING_STEPS } from './constants';
import { View, Chapter, Source, Student, Teacher, UserRole, ActiveStudySession, StudySessionConfig } from './types';
import { Card } from './components/common/Card';
import { Icon } from './components/common/Icon';
import { TeachersView } from './components/TeachersView';
import { Onboarding } from './components/Onboarding';
import { RoleSelection } from './components/RoleSelection';
import { TeacherDashboard } from './components/TeacherDashboard';
import * as geminiService from './services/geminiService';
import { StudySessionView } from './components/StudySessionView';


const ProfileView: React.FC = () => (
    <div className="p-8">
        <Card>
            <h2 className="text-2xl font-bold flex items-center"><Icon icon="profile" className="mr-2" />Profile</h2>
            <p className="mt-4 text-content/70">Profile management features would be here.</p>
        </Card>
    </div>
);


const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Student | Teacher | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const [view, setView] = useState<View>(View.DASHBOARD);
  const [chapters, setChapters] = useState<Chapter[]>(MOCK_CHAPTERS);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [personalizedPlan, setPersonalizedPlan] = useState<string>('');
  const [activeStudySession, setActiveStudySession] = useState<ActiveStudySession | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.STUDENT) {
      setCurrentUser(MOCK_STUDENT);
      setView(View.DASHBOARD);
    } else {
      setCurrentUser(MOCK_TEACHER_USER);
      setView(View.TEACHER_DASHBOARD);
    }
  };

  const handleOnboardingComplete = (formData: any, welcomeMessage: string) => {
    if (currentUser?.role === UserRole.STUDENT) {
       const updatedStudent: Student = {
        ...(currentUser as Student),
        name: formData.name,
        country: formData.country,
        educationLevel: formData.educationLevel,
        learningGoal: formData.goal,
        familiarity: formData.familiarity,
        learningStyle: formData.learningStyle,
        timeCommitment: formData.timeCommitment,
        mentorPreference: formData.mentorPreference,
        preferredLanguage: formData.language,
      };
      setCurrentUser(updatedStudent);
      setPersonalizedPlan(welcomeMessage);
    } else if (currentUser?.role === UserRole.TEACHER) {
      const updatedTeacher: Teacher = {
        ...(currentUser as Teacher),
        name: formData.name,
        country: formData.country,
        specialty: formData.specialty,
        languages: formData.languages,
        isVolunteer: formData.status === 'Volunteer Mentor',
        bio: formData.bio,
      };
       setCurrentUser(updatedTeacher);
    }
    setIsOnboardingComplete(true);
  };
  
  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setView(View.LESSON);
  };
  
  const handleReturnToDashboard = () => {
      setSelectedChapter(null);
      setView(currentUser?.role === UserRole.STUDENT ? View.DASHBOARD : View.TEACHER_DASHBOARD);
  }

  const handleAddChapter = (title: string, subject: string) => {
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title,
      subject,
      progress: 0,
      sources: [],
    };
    setChapters(prev => [...prev, newChapter]);
  };

  const handleAddSource = (chapterId: string, source: Omit<Source, 'id'>) => {
    const newSource: Source = { ...source, id: `source-${Date.now()}`};
    
    const updateChapter = (chapter: Chapter | null) => {
        if (!chapter || chapter.id !== chapterId) return chapter;
        // Invalidate study session by removing it
        const { studySession, ...rest } = chapter;
        return { ...rest, sources: [...chapter.sources, newSource] };
    };

    setChapters(prev => prev.map(updateChapter) as Chapter[]);

    // Also update the selectedChapter state if it's the one being modified
    setSelectedChapter(prev => updateChapter(prev));
  };

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    // Update the main chapters list
    const newChapters = chapters.map(c => c.id === updatedChapter.id ? updatedChapter : c);
    setChapters(newChapters);
  
    // If a LessonView is active, update its state
    if (selectedChapter?.id === updatedChapter.id) {
        setSelectedChapter(updatedChapter);
    }
  
    // If a Study Session is active, update the chapter within it
    if (activeStudySession) {
        const updatedSessionChapters = activeStudySession.config.chapters.map(c => 
            c.id === updatedChapter.id ? updatedChapter : c
        );
        setActiveStudySession(prev => prev ? {
            ...prev,
            config: {
                ...prev.config,
                chapters: updatedSessionChapters,
            }
        } : null);
    }
  };

  const handleStartStudySession = async (config: StudySessionConfig) => {
    const plan = await geminiService.generateStudyPlan(config.time, config.chapters);
    setActiveStudySession({
      plan,
      config,
      currentChapterIndex: 0,
      phase: 'studying',
    });
    setView(View.STUDY_SESSION);
  };

  const handleUpdateStudySession = (sessionUpdate: Partial<ActiveStudySession>) => {
    setActiveStudySession(prev => prev ? { ...prev, ...sessionUpdate } : null);
  };
  
  const handleEndStudySession = () => {
    setActiveStudySession(null);
    setView(View.DASHBOARD);
  };

  const renderContent = () => {
    if (!currentUser) return null;

    if (view === View.STUDY_SESSION && activeStudySession) {
      return (
        <StudySessionView 
          session={activeStudySession}
          onUpdateSession={handleUpdateStudySession}
          onEndSession={handleEndStudySession}
          setView={setView}
          onAddSource={handleAddSource}
          onUpdateChapter={handleUpdateChapter}
        />
      );
    }

    if (currentUser.role === UserRole.TEACHER) {
      switch (view) {
        case View.TEACHER_DASHBOARD:
        case View.DASHBOARD:
          return <TeacherDashboard teacher={currentUser as Teacher} sessionRequests={MOCK_SESSION_REQUESTS} bookedSessions={MOCK_BOOKED_SESSIONS} />;
        case View.PROFILE:
          return <ProfileView />;
        default:
           return <TeacherDashboard teacher={currentUser as Teacher} sessionRequests={MOCK_SESSION_REQUESTS} bookedSessions={MOCK_BOOKED_SESSIONS} />;
      }
    }

    // Student Views
    switch (view) {
      case View.DASHBOARD:
        return <StudentDashboard student={currentUser as Student} chapters={chapters} onSelectChapter={handleSelectChapter} onAddChapter={handleAddChapter} personalizedPlan={personalizedPlan} onStartStudySession={handleStartStudySession}/>;
      case View.TEACHERS:
        return <TeachersView student={currentUser as Student} chapters={chapters} />;
      case View.LESSON:
        return selectedChapter ? <LessonView key={selectedChapter.id} chapter={selectedChapter} onBack={handleReturnToDashboard} onAddSource={handleAddSource} onUpdateChapter={handleUpdateChapter} /> : <p>No chapter selected.</p>;
      case View.PROFILE:
        return <ProfileView />;
      default:
        return <StudentDashboard student={currentUser as Student} chapters={chapters} onSelectChapter={handleSelectChapter} onAddChapter={handleAddChapter} personalizedPlan={personalizedPlan} onStartStudySession={handleStartStudySession}/>;
    }
  };

  if (!userRole || !currentUser) {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  if (!isOnboardingComplete) {
    const isStudent = userRole === UserRole.STUDENT;
    const studentWelcomePrompt = (formData: any) => `
      A new student, ${formData.name}, has completed their onboarding.
      Their goal is to learn about: "${formData.subjects}".
      Based on this, create a very short and encouraging welcome message. It should be only 2-3 sentences long.
      - Greet the student by name.
      - Briefly mention their learning interest.
      - End with a simple, motivational message like "Enjoy the journey!".
      Do not create a detailed plan. Just a short, welcoming summary.
    `;

    const teacherWelcomePrompt = (formData: any) => `
      A new teacher, ${formData.name}, has just joined the platform. Their specialty is ${formData.specialty}.
      Generate a very short, encouraging welcome message (2 sentences max) to display on their dashboard upon first login.
      - Greet them by name.
      - Thank them for joining the community of educators.
    `;

    return (
      <Onboarding
        steps={isStudent ? ONBOARDING_STEPS : TEACHER_ONBOARDING_STEPS}
        initialData={currentUser}
        onComplete={handleOnboardingComplete}
        welcomePromptGenerator={isStudent ? studentWelcomePrompt : teacherWelcomePrompt}
        userRole={userRole}
      />
    );
  }

  return (
    <div className="min-h-screen bg-base-200 font-sans text-content">
      <Header user={currentUser} activeView={view} setView={setView} theme={theme} toggleTheme={toggleTheme} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
