// FIX: Removed circular import of 'ChatMessage' which was causing a name conflict.

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// Views now reflect the new app structure
export enum View {
  DASHBOARD = 'dashboard',
  LESSON = 'lesson', // This is now the main study view for a chapter
  PROFILE = 'profile',
  TEACHERS = 'teachers',
  TEACHER_DASHBOARD = 'teacher_dashboard',
  STUDY_SESSION = 'study_session',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  educationLevel: string;
  country: string;
  learningGoal?: string;
  familiarity?: 'Beginner' | 'Intermediate' | 'Advanced';
  learningStyle?: string[];
  timeCommitment?: string;
  mentorPreference?: string;
  preferredLanguage?: string;
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  // FIX: Add missing 'country' property to align with onboarding form data and fix type error in App.tsx.
  country: string;
  isVolunteer: boolean;
  specialty: string;
  rating: number;
  bio?: string;
  languages?: string[];
}

export type SourceType = 'pdf' | 'youtube' | 'web';

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  content: string; // For PDF, this is the text. For others, a description.
  url?: string; // For YouTube or web links
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isStreaming?: boolean;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface FillTheGapsExercise {
  sentence_start: string;
  answer: string;
  sentence_end: string;
}

// Types for the new Study Session feature
export interface TrueFalseQuestion {
    statement: string;
    correct_answer: boolean;
}

export interface DefinitionTerm {
    term: string;
}

export interface TestExercises {
    true_false_questions: TrueFalseQuestion[];
    fill_the_gaps_questions: FillTheGapsExercise[];
    definition_terms: DefinitionTerm[];
}

export interface TestResult {
    id: string;
    timestamp: string;
    scores: {
        true_false: number;
        fill_the_gaps: number;
        definitions: number;
        create_questions: number;
        oral_explanation: number;
    };
    overallScore: number;
    feedback: string;
    strengths: string;
    areasForImprovement: string;
}


export interface StudySession {
    keyIdeas: string;
    flashcards: Flashcard[];
    exercises: TestExercises;
    isGenerated: boolean;
    resultsHistory?: TestResult[];
}

export interface Chapter {
  id:string;
  title: string;
  subject: string;
  progress: number;
  sources: Source[];
  studySession?: StudySession;
}

export interface BookedSession {
  id: string;
  teacher: Teacher;
  startTime: Date;
  endTime: Date;
  meetLink: string;
}

export interface SessionRequest {
  id: string;
  student: Student;
  chapter: Chapter;
  requestedTime: Date;
  note?: string;
}

// FIX: Define OnboardingStep as a shared type to fix type inference issues in constants.ts that caused an error in App.tsx.
export interface OnboardingStep {
    id: string;
    question: string;
    description: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'textarea';
    placeholder?: string;
    required: boolean;
    options?: any[];
}


// New types for Guided Study Session feature
export interface StudySessionConfig {
  time: string;
  chapters: Chapter[];
}

export interface ActiveStudySession {
  plan: string; // The generated markdown plan
  config: StudySessionConfig;
  currentChapterIndex: number;
  phase: 'studying' | 'chapter_testing' | 'chapter_report' | 'reflecting' | 'complete' | 'break';
  chapterTestResult?: TestResult;
  reflectionHistory?: ChatMessage[];
  finalAssessment?: string;
}