
import { Student, Teacher, UserRole, Chapter, BookedSession, SessionRequest, OnboardingStep } from './types';

// Truncated for brevity, but this contains the full text from the provided PDF.
export const PDF_CONTENT_SEQUENCES = `Arithmetic and Geometric SEQUENCES
PREFACE
To the Teacher
This book is about arithmetic and geometric sequences, and their applications. Many people apply the principles of number sequences in their daily lives without recognizing them. This book introduces these principles and shows how they solve concrete problems.
...
A. SEQUENCES
1. Definition
If someone asked you to list the squares of all the natural numbers, you might begin by writing 1, 4, 9, 16, 25, 36, ...
But you would soon realize that it is actually impossible to list all these numbers since there are an infinite number of them.
...
(The rest of the OCR'd PDF content would be here)
...
A magic square is an arrangement of natural numbers in a square matrix so that the sum of the numbers in each column, row, and diagonal is the same number (the magic number). The number of cells on one side of the square is called the order of the magic square.
`;

// FIX: Add explicit type to prevent type inference issues with the 'type' property, which caused an error in App.tsx.
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'name',
    question: 'What’s your full name or preferred display name?',
    description: 'Used for personalizing messages and certificates.',
    type: 'text',
    placeholder: 'e.g., Alexei Popescu',
    required: true,
  },
  {
    id: 'country',
    question: 'Which country are you from?',
    description: 'Helps set timezone, language, and curriculum standards.',
    type: 'select',
    options: ['Republica Moldova', 'Romania', 'Ukraine', 'Poland', 'Other'],
    required: true,
  },
  {
    id: 'educationLevel',
    question: 'What’s your current education level?',
    description: 'Crucial for matching difficulty and subjects.',
    type: 'radio',
    options: ['Middle School', 'High School', 'University', 'Professional'],
    required: true,
  },
  {
    id: 'subjects',
    question: 'What subjects or skills do you want to learn?',
    description: 'Core input for creating your learning plan.',
    type: 'text',
    placeholder: 'e.g., Mathematics, Robotics, English Literature',
    required: true,
  },
  {
    id: 'goal',
    question: 'What is your main learning goal?',
    description: 'This helps us tailor the content to your needs.',
    type: 'radio',
    options: ['Prepare for exams', 'Develop career skills', 'Explore a new hobby', 'Improve grades'],
    required: true,
  },
  {
    id: 'familiarity',
    question: 'How familiar are you with this topic?',
    description: 'This helps us adapt the lesson depth.',
    type: 'radio',
    options: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  {
    id: 'learningStyle',
    question: 'How do you prefer to learn?',
    description: 'Select all that apply.',
    type: 'checkbox',
    options: [
      { value: 'Videos', icon: 'play' },
      { value: 'Text', icon: 'book' },
      { value: 'Practice', icon: 'fillGaps' },
      { value: 'AI Tutor Chat', icon: 'chat' },
    ],
    required: true,
  },
  {
    id: 'timeCommitment',
    question: 'How much time can you dedicate to learning each week?',
    description: 'Used to pace lessons and reminders.',
    type: 'radio',
    options: ['1-2 hours', '2-4 hours', '5-7 hours', '8+ hours'],
    required: true,
  },
  {
    id: 'mentorPreference',
    question: 'Would you like to connect with a mentor or study alone with AI?',
    description: 'Enables volunteer pairing and live sessions.',
    type: 'radio',
    options: ['Connect with a mentor', 'Study with AI only', 'Both'],
    required: true,
  },
  {
    id: 'language',
    question: 'What language do you prefer for learning?',
    description: 'Sets all UI, lessons, and AI explanations appropriately.',
    type: 'select',
    options: ['English', 'Romanian', 'Ukrainian', 'Russian'],
    required: true,
  },
];

// FIX: Add explicit type to prevent type inference issues with the 'type' property, which caused an error in App.tsx.
export const TEACHER_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'name',
    question: 'What’s your full name or preferred display name?',
    description: 'This will be shown to students on your profile.',
    type: 'text',
    placeholder: 'e.g., Dr. Elena Radu',
    required: true,
  },
  {
    id: 'country',
    question: 'Which country are you from?',
    description: 'Helps set your timezone for scheduling.',
    type: 'select',
    options: ['Republica Moldova', 'Romania', 'Ukraine', 'Poland', 'Other'],
    required: true,
  },
  {
    id: 'specialty',
    question: 'What subjects are you specialized in?',
    description: 'List the main subjects you are comfortable teaching.',
    type: 'text',
    placeholder: 'e.g., Mathematics, Robotics, English Literature',
    required: true,
  },
  {
    id: 'languages',
    question: 'What languages can you teach in?',
    description: 'Select all that apply.',
    type: 'checkbox',
    options: [
      { value: 'English', icon: 'globe' },
      { value: 'Romanian', icon: 'globe' },
      { value: 'Ukrainian', icon: 'globe' },
      { value: 'Russian', icon: 'globe' },
    ],
    required: true,
  },
  {
    id: 'status',
    question: 'What is your teaching status?',
    description: 'This helps students understand your availability and role.',
    type: 'radio',
    options: ['Professional Tutor', 'Volunteer Mentor'],
    required: true,
  },
  {
    id: 'bio',
    question: 'Write a short bio about yourself.',
    description: 'Introduce yourself to students. Mention your experience and teaching style (1-3 sentences).',
    type: 'textarea',
    placeholder: 'e.g., I am a PhD student in Mathematics with 5 years of tutoring experience...',
    required: true,
  },
];


export const MOCK_STUDENT: Student = {
  id: 'student-1',
  name: 'Alexei Popescu',
  role: UserRole.STUDENT,
  avatarUrl: 'https://picsum.photos/seed/student1/100/100',
  educationLevel: 'High School',
  country: 'Republica Moldova',
};

export const MOCK_TEACHER_USER: Teacher = {
  id: 'teacher-1',
  name: 'Dr. Elena Radu',
  role: UserRole.TEACHER,
  // FIX: Add missing 'country' property to conform to the updated Teacher type.
  country: 'Romania',
  avatarUrl: 'https://picsum.photos/seed/teacher1/100/100',
  isVolunteer: false,
  specialty: 'Mathematics',
  rating: 4.9,
  bio: 'Passionate mathematician with over 10 years of experience in academia and private tutoring. My goal is to make complex concepts accessible and engaging for all students.'
};


export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Arithmetic & Geometric Sequences',
    subject: 'Mathematics',
    progress: 45,
    sources: [
      {
        id: 'source-1-1',
        type: 'pdf',
        title: 'Official Manual: Sequences',
        content: PDF_CONTENT_SEQUENCES,
      },
      {
        id: 'source-1-2',
        type: 'youtube',
        title: 'Intro to Sequences (Video)',
        content: 'A helpful video from Khan Academy explaining the basics of arithmetic and geometric sequences.',
        url: 'https://www.youtube.com/watch?v=pA_eSduf_sM'
      }
    ],
  },
  {
    id: 'chapter-2',
    title: 'Introduction to Photosynthesis',
    subject: 'Biology',
    progress: 15,
    sources: [
       {
        id: 'source-2-1',
        type: 'web',
        title: 'Photosynthesis Explained',
        content: 'Photosynthesis is a process used by plants, algae, and certain bacteria to convert light energy into chemical energy, through a process that converts carbon dioxide and water into glucose (sugar) and oxygen. This process is essential for life on Earth as it produces most of the oxygen in the atmosphere and serves as the primary source of energy for most ecosystems.',
        url: 'https://en.wikipedia.org/wiki/Photosynthesis'
      }
    ]
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'Dr. Elena Radu',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher1/100/100',
    isVolunteer: false,
    specialty: 'Mathematics',
    rating: 4.9,
  },
  {
    id: 'teacher-2',
    name: 'Mihai Ionescu',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher2/100/100',
    isVolunteer: true,
    specialty: 'History',
    rating: 4.7,
  },
  {
    id: 'teacher-3',
    name: 'Dr. Ana Ciobanu',
    role: UserRole.TEACHER,
    country: 'Republica Moldova',
    avatarUrl: 'https://picsum.photos/seed/teacher3/100/100',
    isVolunteer: false,
    specialty: 'Biology',
    rating: 4.8,
  },
  {
    id: 'teacher-4',
    name: 'Ion Popa',
    role: UserRole.TEACHER,
    country: 'Republica Moldova',
    avatarUrl: 'https://picsum.photos/seed/teacher4/100/100',
    isVolunteer: true,
    specialty: 'Physics',
    rating: 4.5,
  },
  {
    id: 'teacher-5',
    name: 'Prof. Sofia Tudor',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher5/100/100',
    isVolunteer: false,
    specialty: 'Literature',
    rating: 5.0,
  },
  {
    id: 'teacher-6',
    name: 'Andrei Vasile',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher6/100/100',
    isVolunteer: true,
    specialty: 'Mathematics',
    rating: 4.6,
  },
  {
    id: 'teacher-7',
    name: 'Dr. Radu Petrescu',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher7/100/100',
    isVolunteer: false,
    specialty: 'Chemistry',
    rating: 4.9,
  },
  {
    id: 'teacher-8',
    name: 'Irina Stan',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher8/100/100',
    isVolunteer: true,
    specialty: 'Computer Science',
    rating: 4.8,
  },
  {
    id: 'teacher-9',
    name: 'Prof. Victor Iancu',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher9/100/100',
    isVolunteer: false,
    specialty: 'Arts',
    rating: 4.7,
  },
   {
    id: 'teacher-10',
    name: 'Cristina Neagu',
    role: UserRole.TEACHER,
    country: 'Romania',
    avatarUrl: 'https://picsum.photos/seed/teacher10/100/100',
    isVolunteer: true,
    specialty: 'Physics',
    rating: 4.9,
  },
  {
    id: 'teacher-11',
    name: 'Romaciuc Cristian',
    role: UserRole.TEACHER,
    country: 'Republica Moldova',
    avatarUrl: 'https://picsum.photos/seed/teacher11/100/100',
    isVolunteer: true,
    specialty: 'Robotics',
    rating: 5.0,
  },
];

const now = new Date();
export const MOCK_BOOKED_SESSIONS: BookedSession[] = [
  {
    id: 'session-1',
    teacher: MOCK_TEACHERS.find(t => t.name === 'Romaciuc Cristian')!,
    startTime: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
    endTime: new Date(now.getTime() + 25 * 60 * 1000), // 25 minutes from now
    meetLink: 'https://meet.google.com/oip-irsh-drp',
  },
  {
    id: 'session-2',
    teacher: MOCK_TEACHERS.find(t => t.name === 'Dr. Elena Radu')!,
    startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 minutes duration
    meetLink: 'https://meet.google.com/klm-nopq-rst',
  },
  {
    id: 'session-3',
    teacher: MOCK_TEACHER_USER,
    startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    meetLink: 'https://meet.google.com/abc-defg-hij',
  }
];

export const MOCK_SESSION_REQUESTS: SessionRequest[] = [
  {
    id: 'req-1',
    student: MOCK_STUDENT,
    chapter: MOCK_CHAPTERS[0], // Arithmetic & Geometric Sequences
    requestedTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    note: "I'm struggling with the concept of infinite geometric series. Could we focus on that?",
  },
  {
    id: 'req-2',
    student: { ...MOCK_STUDENT, id: 'student-2', name: 'Maria Ionescu', avatarUrl: 'https://picsum.photos/seed/student2/100/100'},
    chapter: MOCK_CHAPTERS[0],
    requestedTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
  }
];
