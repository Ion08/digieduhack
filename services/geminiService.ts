
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Flashcard, FillTheGapsExercise, StudySession, Chapter, ChatMessage } from '../types';
import * as mockService from './mockService';

// Flag to use mock data instead of real API
const USE_MOCK_DATA = true;

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY && !USE_MOCK_DATA) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = !USE_MOCK_DATA ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

/**
 * Generates a fast response for a given prompt. Used for study tools.
 */
const generateToolResponse = async (prompt: string) => {
  if (USE_MOCK_DATA) {
    return mockService.generateComplexResponse(prompt, "You are a helpful AI assistant.");
  }
  
  try {
    const response = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateToolResponse:", error);
    return "Sorry, I couldn't generate a response at this time.";
  }
};

export const generateSummary = (sourceText: string) => {
    if (USE_MOCK_DATA) {
      return mockService.generateSummary(sourceText);
    }
    
    const prompt = `Provide a concise summary of the key concepts from the following text. Use bullet points for clarity:\n\n---\n${sourceText.substring(0, 30000)}`;
    return generateToolResponse(prompt);
}

export const generateFlashcards = async (sourceText: string): Promise<Flashcard[]> => {
    if (USE_MOCK_DATA) {
      return mockService.generateFlashcards(sourceText);
    }

    const prompt = `Create a set of 5-7 flashcards from the following text. Each flashcard should have a clear "front" (a term or question) and a "back" (the definition or answer).
    \n\n---\n${sourceText.substring(0, 30000)}`;

    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        flashcards: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    front: {
                                        type: Type.STRING,
                                        description: "The question or term on the front of the flashcard."
                                    },
                                    back: {
                                        type: Type.STRING,
                                        description: "The answer or definition on the back of the flashcard."
                                    }
                                },
                                required: ["front", "back"]
                            }
                        }
                    },
                    required: ["flashcards"]
                },
            },
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return parsed.flashcards || [];

    } catch (error) {
        console.error("Error in generateFlashcards:", error);
        return [{ front: "Error", back: "Could not generate flashcards at this time. Please try again." }];
    }
};


export const generateFillTheGaps = async (sourceText: string): Promise<FillTheGapsExercise[]> => {
    if (USE_MOCK_DATA) {
      return mockService.generateFillTheGaps(sourceText);
    }

    const prompt = `Create a "fill in the gaps" exercise with 3-5 sentences based on the following text. For each sentence, provide the part before the gap, the correct answer for the gap, and the part after the gap.
    \n\n---\n${sourceText.substring(0, 30000)}`;

    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        exercise: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sentence_start: {
                                        type: Type.STRING,
                                        description: "The part of the sentence before the blank."
                                    },
                                    answer: {
                                        type: Type.STRING,
                                        description: "The word or phrase that fills the blank."
                                    },
                                    sentence_end: {
                                        type: Type.STRING,
                                        description: "The part of the sentence after the blank."
                                    },
                                },
                                required: ["sentence_start", "answer", "sentence_end"]
                            }
                        }
                    },
                    required: ["exercise"]
                },
            },
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return parsed.exercise || [];

    } catch (error) {
        console.error("Error in generateFillTheGaps:", error);
        return [{ sentence_start: "Could not generate exercise. ", answer: "Error", sentence_end: "Please try again." }];
    }
};

/**
 * Generates content for a given URL by creating a plausible summary.
 */
export const generateContentFromUrl = async (url: string, type: 'web' | 'youtube'): Promise<{ content: string }> => {
    if (USE_MOCK_DATA) {
      return mockService.generateContentFromUrl(url, type);
    }

    const prompt = `Imagine you are a web scraper and content summarizer. A user has provided the following URL: "${url}". The source is a "${type}".
    
    Your task is to generate a detailed, educational summary of the content that would likely be found at this URL. This summary will be used as source material for a student to study from.
    
    - If it's a YouTube video, summarize it as if you watched it.
    - If it's a web page (e.g., Wikipedia, blog post), summarize it as if you read it.
    
    The summary should include key concepts, definitions, and important points. It needs to be comprehensive enough for the student to learn from it directly.
    
    Do not mention that you are an AI, that you are simulating this, or that you cannot access URLs. Just provide the generated summary directly.`;

    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return { content: response.text };
    } catch (error) {
        console.error("Error in generateContentFromUrl:", error);
        return { content: "Sorry, I couldn't generate a summary from the URL. Please try again or provide the content manually." };
    }
};

// FIX: Add missing `generateComplexResponse` function to handle personalized plan generation.
/**
 * Generates a more detailed response for a given prompt with a system instruction.
 */
export const generateComplexResponse = async (prompt: string, systemInstruction: string) => {
  if (USE_MOCK_DATA) {
    return mockService.generateComplexResponse(prompt, systemInstruction);
  }

  try {
    const response = await ai!.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateComplexResponse:", error);
    return "Sorry, I couldn't generate a response at this time. Please try again.";
  }
};

export const generateStudySession = async (sourceText: string, previousFeedback?: string): Promise<StudySession> => {
    if (USE_MOCK_DATA) {
      return mockService.generateStudySession(sourceText, previousFeedback);
    }

    const prompt = `Based on the following source material, create a complete study session for a student. The session must include:
    1.  **Key Ideas**: A concise summary of the most important concepts, formatted as markdown bullet points.
    2.  **Flashcards**: A set of 5 flashcards, each with a 'front' (term/question) and a 'back' (definition/answer).
    3.  **Test Exercises**: A structured test with three types of questions:
        a.  **True/False**: 10 statements. Provide the statement and whether it's true or false.
        b.  **Fill-in-the-Gaps**: 10 sentences with a missing part. Provide the start, the answer, and the end of the sentence.
        c.  **Definitions**: 10 important terms from the text that the student will need to define.

    ${previousFeedback ? `**Important**: The student previously struggled with the following topics: "${previousFeedback}". Please adapt the new session to focus more on these areas of weakness.` : ''}

    Source Material:
    ---
    ${sourceText.substring(0, 50000)}
    ---
    `;

    try {
        const response = await ai!.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        keyIdeas: { type: Type.STRING, description: "Markdown summary of key ideas." },
                        flashcards: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    front: { type: Type.STRING },
                                    back: { type: Type.STRING }
                                },
                                required: ["front", "back"]
                            }
                        },
                        exercises: {
                            type: Type.OBJECT,
                            properties: {
                                true_false_questions: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            statement: { type: Type.STRING },
                                            correct_answer: { type: Type.BOOLEAN }
                                        },
                                        required: ["statement", "correct_answer"]
                                    }
                                },
                                fill_the_gaps_questions: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            sentence_start: { type: Type.STRING },
                                            answer: { type: Type.STRING },
                                            sentence_end: { type: Type.STRING }
                                        },
                                        required: ["sentence_start", "answer", "sentence_end"]
                                    }
                                },
                                definition_terms: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            term: { type: Type.STRING }
                                        },
                                        required: ["term"]
                                    }
                                }
                            },
                            required: ["true_false_questions", "fill_the_gaps_questions", "definition_terms"]
                        }
                    },
                    required: ["keyIdeas", "flashcards", "exercises"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);
        return { ...parsed, isGenerated: true };

    } catch (error) {
        console.error("Error generating study session:", error);
        throw new Error("Failed to generate the study session. The source material might be too short or unclear.");
    }
};

// New evaluation functions
export const evaluateAnswerSemantically = async (
    context: string,
    question: string,
    userAnswer: string
): Promise<{ isCorrect: boolean, feedback: string }> => {
    if (USE_MOCK_DATA) {
      return mockService.evaluateAnswerSemantically(context, question, userAnswer);
    }

    const prompt = `As an intelligent teaching assistant, evaluate if the user's answer is semantically correct for the given question, based on the context. Tolerate minor spelling mistakes.

    Context: "${context.substring(0, 8000)}"
    Question/Term to Define: "${question}"
    User's Answer: "${userAnswer}"

    Return a JSON object with two keys: "isCorrect" (boolean) and "feedback" (a brief explanation for your decision).`;
    
    try {
       const response = await ai!.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    isCorrect: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING }
                },
                required: ["isCorrect", "feedback"]
            }
          }
       });
       return JSON.parse(response.text);
    } catch (error) {
        console.error("Error evaluating answer:", error);
        return { isCorrect: false, feedback: "Sorry, I couldn't evaluate this answer." };
    }
};

export const evaluateUserQuestion = async (
    context: string,
    userQuestion: string
): Promise<{ isRelevant: boolean, feedback: string }> => {
    if (USE_MOCK_DATA) {
      return mockService.evaluateUserQuestion(context, userQuestion);
    }

    const prompt = `As an intelligent teaching assistant, evaluate if the student's question is relevant to the study material and grammatically coherent.

    Context: "${context.substring(0, 8000)}"
    Student's Question: "${userQuestion}"
    
    Return a JSON object with two keys: "isRelevant" (boolean) and "feedback" (a brief explanation).`;
    
    try {
        const response = await ai!.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    isRelevant: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING }
                },
                required: ["isRelevant", "feedback"]
            }
          }
       });
       return JSON.parse(response.text);
    } catch (error) {
        console.error("Error evaluating question:", error);
        return { isRelevant: false, feedback: "Sorry, I couldn't evaluate this question." };
    }
};

export const generateTestReport = async (
    context: string,
    results: any
): Promise<{ overallScore: number; feedback: string; strengths: string; areasForImprovement: string; }> => {
    if (USE_MOCK_DATA) {
      return mockService.generateTestReport(context, results);
    }

    const prompt = `You are an expert educator providing feedback on a student's test. The test covered the following material:
    Context: "${context.substring(0, 8000)}"

    Here are the student's results:
    - True/False Score: ${results.true_false_score}/10
    - Fill in the Gaps Score: ${results.fill_the_gaps_score}/10
    - Definitions Score: ${results.definitions_score}/10
    - Question Creation Score: ${results.create_questions_score}/5
    - Oral Explanation Score: ${results.oral_explanation_score}/5

    Based on these scores, generate a comprehensive report. Calculate the final overall score out of 100. Provide encouraging overall feedback, a bulleted list of strengths, and a bulleted list of areas for improvement.

    Return a JSON object with keys: "overallScore" (number), "feedback" (string), "strengths" (string, markdown), "areasForImprovement" (string, markdown).
    `;

    try {
       const response = await ai!.models.generateContent({
          model: "gemini-2.5-pro",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    overallScore: { type: Type.NUMBER },
                    feedback: { type: Type.STRING },
                    strengths: { type: Type.STRING },
                    areasForImprovement: { type: Type.STRING }
                },
                required: ["overallScore", "feedback", "strengths", "areasForImprovement"]
            }
          }
       });
       return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating report:", error);
        return { overallScore: 0, feedback: "Failed to generate report.", strengths: "- N/A", areasForImprovement: "- N/A" };
    }
};


/**
 * Creates a new chat session. If sourceContext is provided, it's grounded in it.
 */
export const createChat = (sourceContext?: string) => {
  const systemInstruction = sourceContext
    ? `You are an expert tutor. Your answers MUST be based *only* on the following source material. If the answer is not in the material, state that the information is not available in the provided source. Do not use outside knowledge. Here is the source material:\n\n---\n\n${sourceContext.substring(0, 30000)}`
    : 'You are a helpful AI learning assistant.';

  return ai!.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });
};

/**
 * Sends a message to an existing chat session and returns a streaming response.
 */
export const sendMessageStream = async (chat: Chat, message: string) => {
  try {
    return await chat.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending streaming message:", error);
    throw new Error("Failed to send message.");
  }
};


// --- New functions for Guided Study Session ---

export const generateStudyPlan = async (time: string, chapters: Chapter[]): Promise<string> => {
    if (USE_MOCK_DATA) {
      return mockService.generateStudyPlan(time, chapters);
    }

    const chapterTitles = chapters.map(c => `"${c.title}" (${c.subject})`).join(', ');
    const prompt = `You are an expert academic planner. A student wants to study the following chapters: ${chapterTitles}.
    They have ${time} available for this study session.

    Your task is to create a concise, motivational, and structured study plan in Markdown format.
    1.  Start with a brief, encouraging opening statement.
    2.  Based on the number of chapters and the available time, create a simple schedule. Allocate a reasonable amount of time for each chapter. If the time is short, suggest which chapters to prioritize.
    3.  For each chapter in the plan, list 2-3 key concepts or "Focus Points" they should pay close attention to.
    4.  End with a motivational closing remark.

    Example Output:
    "Great! Here is your focused study plan for the next hour..."
    
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

    "You've got this! Let's begin."
    `;

    return generateComplexResponse(prompt, "You are an expert academic planner creating a short, motivational study plan.");
};


export const createReflectionChat = (): Chat => {
    if (USE_MOCK_DATA) {
      return mockService.createReflectionChat();
    }

    const systemInstruction = `You are a friendly and insightful academic coach. Your goal is to guide a student through a brief reflection after they've completed a study session.
    Keep your responses concise (1-3 sentences) and always end with a question to encourage the student to think deeper.
    Start the conversation by asking them what they found most surprising or interesting during their study session.
    
    Example questions you can ask:
    - "What was the most challenging concept for you?"
    - "Which part of the material are you most proud of mastering?"
    - "How does this topic connect to what you already knew?"
    - "What's one thing you'll do differently in your next study session?"`;
    
    return ai!.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
        },
    });
};

export const generateFinalAssessment = async (reflectionHistory: ChatMessage[]): Promise<string> => {
    if (USE_MOCK_DATA) {
      return mockService.generateFinalAssessment(reflectionHistory);
    }

    const historyText = reflectionHistory.map(m => `${m.sender}: ${m.text}`).join('\n');
    const prompt = `A student has completed a study session.
    - Here is a transcript of their reflection:
    ---
    ${historyText}
    ---
    Based on their reflection, provide a final, 2-sentence assessment.
    1. The first sentence should comment on their learning process or insights.
    2. The second sentence should offer a forward-looking piece of advice or encouragement.
    
    Example: "Excellent work! It sounds like you've really grasped the key concepts and identified areas to focus on. To solidify your knowledge, try explaining these ideas to a friend."
    `;
    return generateToolResponse(prompt);
};