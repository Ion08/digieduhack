import { Flashcard, FillTheGapsExercise, StudySession, Chapter, ChatMessage, TrueFalseQuestion, DefinitionTerm, TestExercises, TestResult } from '../types';

// Mock data for summaries
const MOCK_SUMMARIES = {
  sequences: `# Key Concepts: Arithmetic and Geometric Sequences

## Arithmetic Sequences
- An arithmetic sequence is a sequence where each term after the first is obtained by adding a constant difference
- The formula for the nth term: aₙ = a₁ + (n-1)d
- Common difference (d) is the constant value added to each term
- Example: 2, 5, 8, 11, 14... (d = 3)

## Geometric Sequences
- A geometric sequence is a sequence where each term after the first is obtained by multiplying by a constant ratio
- The formula for the nth term: aₙ = a₁ × r^(n-1)
- Common ratio (r) is the constant value multiplied to each term
- Example: 3, 6, 12, 24, 48... (r = 2)

## Applications
- Financial calculations (compound interest, loan payments)
- Population growth models
- Computer algorithms and data structures
- Physics and engineering problems`,

  photosynthesis: `# Key Concepts: Photosynthesis

## Definition
- Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy
- Occurs in chloroplasts containing chlorophyll
- Produces glucose (sugar) and oxygen from carbon dioxide and water

## Chemical Equation
- Overall equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
- Carbon dioxide + water + light energy → glucose + oxygen

## Two Stages
1. Light-dependent reactions:
   - Occur in thylakoid membranes
   - Convert light energy to chemical energy (ATP and NADPH)
   - Split water to release oxygen

2. Light-independent reactions (Calvin cycle):
   - Occur in stroma
   - Use ATP and NADPH to produce glucose
   - Fix carbon from CO₂

## Importance
- Primary source of organic compounds for most ecosystems
- Produces oxygen essential for aerobic respiration
- Forms the base of most food chains`
};

// Mock flashcards
const MOCK_FLASHCARDS = {
  sequences: [
    { front: "What is an arithmetic sequence?", back: "A sequence where each term after the first is obtained by adding a constant difference." },
    { front: "What is the formula for the nth term of an arithmetic sequence?", back: "aₙ = a₁ + (n-1)d, where a₁ is the first term and d is the common difference." },
    { front: "What is a geometric sequence?", back: "A sequence where each term after the first is obtained by multiplying by a constant ratio." },
    { front: "What is the formula for the nth term of a geometric sequence?", back: "aₙ = a₁ × r^(n-1), where a₁ is the first term and r is the common ratio." },
    { front: "What is the common difference in the sequence: 3, 7, 11, 15?", back: "The common difference is 4." },
    { front: "What is the common ratio in the sequence: 2, 6, 18, 54?", back: "The common ratio is 3." },
    { front: "Find the 10th term of the arithmetic sequence: 5, 8, 11, 14...", back: "The 10th term is 32. (a₁₀ = 5 + (10-1)×3 = 5 + 27 = 32)" }
  ],
  photosynthesis: [
    { front: "What is photosynthesis?", back: "The process by which plants, algae, and some bacteria convert light energy into chemical energy." },
    { front: "Where does photosynthesis occur?", back: "In chloroplasts, which contain chlorophyll." },
    { front: "What are the reactants in photosynthesis?", back: "Carbon dioxide (CO₂), water (H₂O), and light energy." },
    { front: "What are the products of photosynthesis?", back: "Glucose (C₆H₁₂O₆) and oxygen (O₂)." },
    { front: "What are the two main stages of photosynthesis?", back: "Light-dependent reactions and light-independent reactions (Calvin cycle)." },
    { front: "Why is photosynthesis important?", back: "It produces oxygen for aerobic respiration and forms the base of most food chains." },
    { front: "What is chlorophyll?", back: "The green pigment in plants that absorbs light energy for photosynthesis." }
  ]
};

// Mock fill in the gaps exercises
const MOCK_FILL_GAPS = {
  sequences: [
    { sentence_start: "In an arithmetic sequence, the", answer: "difference", sentence_end: "between consecutive terms is constant." },
    { sentence_start: "The formula for the nth term of an arithmetic sequence is aₙ = a₁ + (n-1)", answer: "d", sentence_end: ", where d is the common difference." },
    { sentence_start: "In a geometric sequence, each term is obtained by multiplying the previous term by the", answer: "common ratio", sentence_end: "." },
    { sentence_start: "The formula for the nth term of a geometric sequence is aₙ = a₁ ×", answer: "r^(n-1)", sentence_end: ", where r is the common ratio." },
    { sentence_start: "Arithmetic sequences are used in financial calculations such as", answer: "loan payments", sentence_end: "and simple interest." }
  ],
  photosynthesis: [
    { sentence_start: "Photosynthesis occurs in the", answer: "chloroplasts", sentence_end: "of plant cells." },
    { sentence_start: "The green pigment that absorbs light energy is called", answer: "chlorophyll", sentence_end: "." },
    { sentence_start: "During photosynthesis, plants convert", answer: "carbon dioxide", sentence_end: "and water into glucose and oxygen." },
    { sentence_start: "The light-dependent reactions occur in the", answer: "thylakoid membranes", sentence_end: "of the chloroplast." },
    { sentence_start: "The Calvin cycle is also known as the", answer: "light-independent", sentence_end: "reactions of photosynthesis." }
  ]
};

// Mock study sessions
const MOCK_STUDY_SESSIONS = {
  sequences: {
    keyIdeas: `# Arithmetic and Geometric Sequences - Key Ideas

## Arithmetic Sequences
- Definition: Each term is obtained by adding a constant difference
- Formula: aₙ = a₁ + (n-1)d
- Applications: Financial calculations, simple interest, loan payments

## Geometric Sequences  
- Definition: Each term is obtained by multiplying by a constant ratio
- Formula: aₙ = a₁ × r^(n-1)
- Applications: Compound interest, population growth, computer algorithms

## Problem-Solving Strategies
- Identify whether the sequence is arithmetic or geometric
- Find the common difference or ratio
- Apply the appropriate formula
- Check your answer by verifying the pattern`,
    flashcards: MOCK_FLASHCARDS.sequences,
    exercises: {
      true_false_questions: [
        { statement: "In an arithmetic sequence, the difference between consecutive terms is always the same.", correct_answer: true },
        { statement: "The formula for the nth term of an arithmetic sequence is aₙ = a₁ + nd.", correct_answer: false },
        { statement: "In a geometric sequence, each term is obtained by adding a constant to the previous term.", correct_answer: false },
        { statement: "The common ratio in a geometric sequence can be found by dividing any term by its preceding term.", correct_answer: true },
        { statement: "Arithmetic sequences are used to model compound interest.", correct_answer: false },
        { statement: "The sequence 2, 4, 8, 16, 32 is a geometric sequence with common ratio 2.", correct_answer: true },
        { statement: "In an arithmetic sequence, if a₁ = 3 and d = 4, then a₅ = 19.", correct_answer: true },
        { statement: "Geometric sequences can have a common ratio of 0.", correct_answer: true },
        { statement: "The sequence 10, 7, 4, 1, -2 is arithmetic with common difference -3.", correct_answer: true },
        { statement: "All arithmetic sequences are also geometric sequences.", correct_answer: false }
      ] as TrueFalseQuestion[],
      fill_the_gaps_questions: MOCK_FILL_GAPS.sequences,
      definition_terms: [
        { term: "Arithmetic sequence" },
        { term: "Common difference" },
        { term: "Geometric sequence" },
        { term: "Common ratio" },
        { term: "nth term" },
        { term: "Recursive formula" },
        { term: "Explicit formula" },
        { term: "Convergence" },
        { term: "Divergence" },
        { term: "Series" }
      ] as DefinitionTerm[]
    } as TestExercises,
    isGenerated: true
  },
  photosynthesis: {
    keyIdeas: `# Photosynthesis - Key Ideas

## Definition and Importance
- Process of converting light energy to chemical energy
- Essential for life on Earth
- Produces oxygen and organic compounds

## Process Overview
- Occurs in chloroplasts containing chlorophyll
- Two main stages: light-dependent and light-independent reactions
- Overall equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂

## Key Components
- Chlorophyll: Green pigment that absorbs light
- Chloroplasts: Organelles where photosynthesis occurs
- Thylakoids: Site of light-dependent reactions
- Stroma: Site of Calvin cycle

## Applications
- Base of most food chains
- Source of atmospheric oxygen
- Foundation for fossil fuels`,
    flashcards: MOCK_FLASHCARDS.photosynthesis,
    exercises: {
      true_false_questions: [
        { statement: "Photosynthesis occurs in mitochondria.", correct_answer: false },
        { statement: "Chlorophyll is the green pigment responsible for absorbing light energy.", correct_answer: true },
        { statement: "Oxygen is a reactant in photosynthesis.", correct_answer: false },
        { statement: "The Calvin cycle occurs in the stroma of chloroplasts.", correct_answer: true },
        { statement: "Photosynthesis produces glucose and oxygen.", correct_answer: true },
        { statement: "Light-dependent reactions produce ATP and NADPH.", correct_answer: true },
        { statement: "Carbon dioxide is produced during photosynthesis.", correct_answer: false },
        { statement: "The light-independent reactions are also called the Calvin cycle.", correct_answer: true },
        { statement: "Photosynthesis only occurs in plants.", correct_answer: false },
        { statement: "Water is split during the light-dependent reactions to release oxygen.", correct_answer: true }
      ] as TrueFalseQuestion[],
      fill_the_gaps_questions: MOCK_FILL_GAPS.photosynthesis,
      definition_terms: [
        { term: "Photosynthesis" },
        { term: "Chlorophyll" },
        { term: "Chloroplast" },
        { term: "Thylakoid" },
        { term: "Stroma" },
        { term: "Calvin cycle" },
        { term: "ATP" },
        { term: "NADPH" },
        { term: "Glucose" },
        { term: "Light-dependent reactions" }
      ] as DefinitionTerm[]
    } as TestExercises,
    isGenerated: true
  }
};

// Mock chat responses
const MOCK_CHAT_RESPONSES = [
  "That's a great question! Based on the material, the key concept here is understanding the fundamental pattern in the sequence.",
  "I can see you're thinking about this carefully. Let me explain it in a different way using the information from our source material.",
  "Excellent observation! The source material provides several examples that illustrate this principle.",
  "You're on the right track! The key is to apply the formula we discussed earlier.",
  "That's a thoughtful question. According to the source, this concept is important because..."
];

// Mock study plans
const MOCK_STUDY_PLANS = [
  `Great! Here is your focused study plan for the next hour.

### Study Schedule
*   **0-30 mins:** Arithmetic & Geometric Sequences
*   **30-55 mins:** Introduction to Photosynthesis
*   **55-60 mins:** Quick Review

### Focus Points
**Arithmetic & Geometric Sequences**
*   Understand the difference between a common difference and a common ratio.
*   Practice the formulas for the nth term.

**Introduction to Photosynthesis**
*   Memorize the overall chemical equation for photosynthesis.
*   Identify the roles of chloroplasts and chlorophyll.

You've got this! Let's begin.`,

  `Perfect! Here's your study plan for 2 hours.

### Study Schedule
*   **0-45 mins:** Arithmetic & Geometric Sequences
*   **45-90 mins:** Introduction to Photosynthesis
*   **90-105 mins:** Practice Problems
*   **105-120 mins:** Review and Assessment

### Focus Points
**Arithmetic & Geometric Sequences**
*   Master identifying sequence types
*   Work through complex examples
*   Apply formulas to real-world problems

**Introduction to Photosynthesis**
*   Understand both stages of photosynthesis
*   Learn the chemical equations
*   Connect to ecological concepts

Let's make the most of this time!`,
  
  `Excellent! Here's your intensive 3-hour study plan.

### Study Schedule
*   **0-60 mins:** Arithmetic & Geometric Sequences
*   **60-120 mins:** Introduction to Photosynthesis
*   **120-150 mins:** Advanced Applications
*   **150-180 mins:** Comprehensive Review

### Focus Points
**Arithmetic & Geometric Sequences**
*   Deep dive into recursive and explicit formulas
*   Explore convergence and divergence
*   Solve complex multi-step problems

**Introduction to Photosynthesis**
*   Detailed analysis of light reactions
*   Master the Calvin cycle
*   Understand environmental factors

This extended session will really solidify your understanding!`
];

// Mock reflection chat messages
const MOCK_REFLECTION_MESSAGES = [
  "What did you find most surprising or interesting during your study session?",
  "What was the most challenging concept for you today?",
  "Which part of the material are you most proud of mastering?",
  "How does this topic connect to what you already knew?",
  "What's one thing you'll do differently in your next study session?"
];

// Mock final assessments
const MOCK_FINAL_ASSESSMENTS = [
  "Excellent work! It sounds like you've really grasped the key concepts and identified areas to focus on. To solidify your knowledge, try explaining these ideas to a friend.",
  "Great progress! You've shown good understanding of the material while recognizing where you need more practice. Consider creating additional practice problems for yourself.",
  "Well done! Your reflection shows thoughtful engagement with the material. To enhance your learning, try applying these concepts to real-world situations.",
  "Impressive work! You've demonstrated strong analytical skills in your reflection. To deepen your understanding, explore how these topics connect to other subjects."
];

// Helper function to get mock data based on content
const getMockDataByContent = (content: string, dataType: string) => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('sequence') || lowerContent.includes('arithmetic') || lowerContent.includes('geometric')) {
    return {
      summary: MOCK_SUMMARIES.sequences,
      flashcards: MOCK_FLASHCARDS.sequences,
      fillGaps: MOCK_FILL_GAPS.sequences,
      studySession: MOCK_STUDY_SESSIONS.sequences
    };
  } else if (lowerContent.includes('photosynthesis') || lowerContent.includes('chloroplast') || lowerContent.includes('chlorophyll')) {
    return {
      summary: MOCK_SUMMARIES.photosynthesis,
      flashcards: MOCK_FLASHCARDS.photosynthesis,
      fillGaps: MOCK_FILL_GAPS.photosynthesis,
      studySession: MOCK_STUDY_SESSIONS.photosynthesis
    };
  }
  
  // Default to sequences if no specific content is detected
  return {
    summary: MOCK_SUMMARIES.sequences,
    flashcards: MOCK_FLASHCARDS.sequences,
    fillGaps: MOCK_FILL_GAPS.sequences,
    studySession: MOCK_STUDY_SESSIONS.sequences
  };
};

// Mock service functions
export const generateSummary = (sourceText: string) => {
  const mockData = getMockDataByContent(sourceText, 'summary');
  return Promise.resolve(mockData.summary);
};

export const generateFlashcards = async (sourceText: string): Promise<Flashcard[]> => {
  const mockData = getMockDataByContent(sourceText, 'flashcards');
  return Promise.resolve(mockData.flashcards);
};

export const generateFillTheGaps = async (sourceText: string): Promise<FillTheGapsExercise[]> => {
  const mockData = getMockDataByContent(sourceText, 'fillGaps');
  return Promise.resolve(mockData.fillGaps);
};

export const generateContentFromUrl = async (url: string, type: 'web' | 'youtube'): Promise<{ content: string }> => {
  // Generate mock content based on URL
  let content = "";
  
  if (url.includes('youtube') || type === 'youtube') {
    content = "This video provides a comprehensive introduction to the topic. The instructor explains key concepts with clear examples and visual aids. Important points are highlighted throughout the video, making it easy to follow along and understand the material.";
  } else if (url.includes('wikipedia') || type === 'web') {
    content = "This web page offers detailed information about the topic, covering its definition, history, applications, and importance. The content is well-structured with headings and subheadings, making it easy to navigate and find specific information.";
  } else {
    content = "This source contains valuable information about the topic. It covers fundamental concepts, provides examples, and explains the significance of the material in a broader context.";
  }
  
  return Promise.resolve({ content });
};

export const generateComplexResponse = async (prompt: string, systemInstruction: string) => {
  // Return a generic but helpful response
  const responses = [
    "Based on your request, I've created a comprehensive plan that addresses your needs. This approach will help you achieve your goals effectively.",
    "I've analyzed your requirements and developed a tailored solution. This plan takes into account your specific situation and objectives.",
    "Here's a customized approach designed to meet your needs. This strategy has been proven effective in similar situations."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return Promise.resolve(randomResponse);
};

export const generateStudySession = async (sourceText: string, previousFeedback?: string): Promise<StudySession> => {
  const mockData = getMockDataByContent(sourceText, 'studySession');
  
  // If there's previous feedback, we could modify the session slightly
  if (previousFeedback) {
    // For now, just return the standard mock session
    // In a real implementation, you might adjust based on the feedback
  }
  
  return Promise.resolve(mockData.studySession);
};

export const evaluateAnswerSemantically = async (
  context: string,
  question: string,
  userAnswer: string
): Promise<{ isCorrect: boolean, feedback: string }> => {
  // Simple mock evaluation - in a real app, this would use AI
  const isCorrect = Math.random() > 0.3; // 70% chance of being correct
  
  const feedback = isCorrect 
    ? "Correct! Well done. Your answer shows good understanding of the concept."
    : "Not quite right. Review the material and try to focus on the key aspects mentioned in the source.";
    
  return Promise.resolve({ isCorrect, feedback });
};

export const evaluateUserQuestion = async (
  context: string,
  userQuestion: string
): Promise<{ isRelevant: boolean, feedback: string }> => {
  // Mock evaluation - assume most questions are relevant
  const isRelevant = Math.random() > 0.2; // 80% chance of being relevant
  
  const feedback = isRelevant
    ? "Great question! This is directly related to our study material."
    : "That's an interesting question, but let's try to focus on the key concepts from our current material.";
    
  return Promise.resolve({ isRelevant, feedback });
};

export const generateTestReport = async (
  context: string,
  results: any
): Promise<{ overallScore: number; feedback: string; strengths: string; areasForImprovement: string; }> => {
  // Calculate mock overall score
  const overallScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100
  
  const feedback = overallScore >= 90 
    ? "Excellent work! You've demonstrated outstanding understanding of the material."
    : overallScore >= 80
    ? "Good job! You have a solid grasp of the concepts with room for improvement."
    : "You're making progress! Continue reviewing the material to strengthen your understanding.";
    
  const strengths = `- Strong understanding of key concepts
- Good application of formulas
- Clear explanation of fundamental principles`;
    
  const areasForImprovement = `- Review complex problem-solving techniques
- Practice with more challenging examples
- Focus on connecting concepts to real-world applications`;
    
  return Promise.resolve({
    overallScore,
    feedback,
    strengths,
    areasForImprovement
  });
};

// Mock chat implementation
export const createChat = (sourceContext?: string) => {
  return {
    sendMessageStream: async ({ message }: { message: string }) => {
      // Return a mock streaming response
      const response = MOCK_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_CHAT_RESPONSES.length)];
      
      return {
        stream: async function* () {
          // Simulate streaming by breaking the response into chunks
          const words = response.split(' ');
          for (const word of words) {
            yield { text: word + ' ' };
            await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to simulate streaming
          }
        }
      };
    }
  };
};

export const sendMessageStream = async (chat: any, message: string) => {
  return chat.sendMessageStream({ message });
};

export const generateStudyPlan = async (time: string, chapters: Chapter[]): Promise<string> => {
  // Select a mock study plan based on the time available
  const timeInHours = parseInt(time);
  
  if (timeInHours <= 1) {
    return Promise.resolve(MOCK_STUDY_PLANS[0]);
  } else if (timeInHours <= 2) {
    return Promise.resolve(MOCK_STUDY_PLANS[1]);
  } else {
    return Promise.resolve(MOCK_STUDY_PLANS[2]);
  }
};

export const createReflectionChat = () => {
  return {
    sendMessageStream: async ({ message }: { message: string }) => {
      const response = MOCK_REFLECTION_MESSAGES[Math.floor(Math.random() * MOCK_REFLECTION_MESSAGES.length)];
      
      return {
        stream: async function* () {
          const words = response.split(' ');
          for (const word of words) {
            yield { text: word + ' ' };
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
      };
    }
  };
};

export const generateFinalAssessment = async (reflectionHistory: ChatMessage[]): Promise<string> => {
  const assessment = MOCK_FINAL_ASSESSMENTS[Math.floor(Math.random() * MOCK_FINAL_ASSESSMENTS.length)];
  return Promise.resolve(assessment);
};