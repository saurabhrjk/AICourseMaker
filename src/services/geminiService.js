

const API_KEY = 'AIzaSyAxE0OT2vQEXEcWksZogQvzrUMlyoBQyyo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const generateCourseContent = async (topic) => {
  if (!API_KEY) throw new Error('Missing Gemini API Key.');

  try {
   
    const theoryPrompt = `You are a teacher. Explain the topic "${topic}" as if preparing a student for an exam. Divide it into 1–3 short chapters in clear, simple language.`;

    const theoryResponse = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: theoryPrompt }] }] })
    });

    const theoryData = await theoryResponse.json();
    const theory = theoryData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate theory content.';


    const questionsPrompt = `Create 5 multiple-choice quiz questions about "${topic}" with 4 options each and specify the correct answer. Format like:
    1. Question?
    a) Option 1
    b) Option 2
    c) Option 3
    d) Option 4
    Correct Answer: a) Option 1`;

    const questionsResponse = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: questionsPrompt }] }] })
    });

    const questionsData = await questionsResponse.json();
    const questions = questionsData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate questions.';


    const videosPrompt = `Suggest 3 YouTube videos that clearly explain "${topic}". Format like:
    1. [Title] - https://www.youtube.com/results?search_query=[Title]
    2. [Title] - https://www.youtube.com/results?search_query=[Title]
    3. [Title] - https://www.youtube.com/results?search_query=[Title]`;

    const videosResponse = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: videosPrompt }] }] })
    });

    const videosData = await videosResponse.json();
    const videos = videosData.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate videos.';

    return { theory, questions, videos, topic };
  } catch (error) {
    console.error('Error generating course content:', error);
    throw new Error('Failed to generate content.');
  }
};
