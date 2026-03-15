const API_KEY = 'AIzaSyAxE0OT2vQEXEcWksZogQvzrUMlyoBQyyo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const fallbackOptions = [
  'Option A',
  'Option B',
  'Option C',
  'Option D'
];

const createFallbackQuestions = (topic, questionCount, difficulty) =>
  Array.from({ length: questionCount }, (_, index) => ({
    id: `${Date.now()}-${index + 1}`,
    question: `(${difficulty}) ${topic}: Sample question ${index + 1}?`,
    options: fallbackOptions,
    correctAnswer: 'Option A'
  }));

const normalizeQuestion = (question, index) => {
  const options = Array.isArray(question.options)
    ? question.options.filter((option) => typeof option === 'string' && option.trim())
    : [];

  const safeOptions = options.length >= 2 ? options.slice(0, 4) : fallbackOptions;
  const answer = typeof question.correctAnswer === 'string' ? question.correctAnswer : safeOptions[0];
  const answerInOptions = safeOptions.includes(answer) ? answer : safeOptions[0];

  return {
    id: `${Date.now()}-${index + 1}`,
    question: typeof question.question === 'string' && question.question.trim()
      ? question.question
      : `Sample question ${index + 1}?`,
    options: safeOptions,
    correctAnswer: answerInOptions
  };
};

export const generateQuizQuestions = async ({ topic, difficulty, questionCount }) => {
  if (!topic.trim()) {
    throw new Error('Topic is required to create a quiz.');
  }

  const parsedCount = Number(questionCount) || 5;

  if (!API_KEY) {
    return createFallbackQuestions(topic, parsedCount, difficulty);
  }

  const prompt = `Create a ${difficulty} level multiple-choice quiz about "${topic}" with ${parsedCount} questions.
Return ONLY valid JSON in this format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1"
    }
  ]
}
Rules:
- exactly ${parsedCount} questions
- exactly 4 options per question
- correctAnswer must exactly match one option text
- do not include markdown or extra text`;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.slice(0, parsedCount).map(normalizeQuestion)
      : [];

    if (!questions.length) {
      return createFallbackQuestions(topic, parsedCount, difficulty);
    }

    return questions;
  } catch (error) {
    console.error('Quiz generation failed, using fallback questions:', error);
    return createFallbackQuestions(topic, parsedCount, difficulty);
  }
};
