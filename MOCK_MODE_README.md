# Using Mock Data Mode

The Edumentor AI application now supports running in mock data mode, which uses predefined responses instead of calling the Gemini API. This is useful for demonstrations, testing, or when you want to avoid API costs.

## How to Enable/Disable Mock Mode

To switch between mock data and real API calls, edit the `services/geminiService.ts` file:

```typescript
// Set this flag to true to use mock data, false to use real Gemini API
const USE_MOCK_DATA = true;
```

- `USE_MOCK_DATA = true` → Uses mock data (no API calls)
- `USE_MOCK_DATA = false` → Uses real Gemini API (requires valid API key)

## What Mock Data Includes

The mock service provides realistic responses for:

1. **Content Summaries** - Educational summaries for different topics
2. **Flashcards** - Pre-defined flashcard sets for common subjects
3. **Fill-in-the-Gaps Exercises** - Grammar and concept exercises
4. **Study Sessions** - Complete study plans with tests and exercises
5. **Chat Responses** - Simulated AI tutor conversations
6. **Study Plans** - Time-based study schedules
7. **Test Reports** - Performance feedback and assessments
8. **URL Content Generation** - Mock summaries for YouTube and web links

## Topics with Mock Data

Currently, comprehensive mock data is available for:
- Arithmetic and Geometric Sequences (Mathematics)
- Photosynthesis (Biology)

For other topics, the system will default to using the sequences mock data.

## Benefits of Mock Mode

- No API costs
- Instant responses (no loading delays)
- Consistent demonstrations
- Works offline
- Safe for testing and development

## Switching Back to Real API

When you're ready to use the real Gemini API:
1. Set `USE_MOCK_DATA = false` in `services/geminiService.ts`
2. Ensure your `.env.local` file contains a valid Gemini API key
3. Restart the development server

The application will then make real API calls to Gemini for all AI-generated content.