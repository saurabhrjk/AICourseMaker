# AI Course Maker

An intelligent educational platform that generates courses, theory chapters, quiz questions, and YouTube video suggestions using Google's Gemini API.

## Features

- 🤖 AI-powered content generation
- 📚 Dynamic theory chapters
- ❓ Interactive quiz questions
- 🎥 YouTube video recommendations
- 🎨 Modern, responsive UI

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Gemini API

Create a `.env` file in the root directory and add your Gemini API key:

```
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

You can get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Step 3: Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

## How to Use

1. Enter any educational topic in the search box
2. Click "Generate Course"
3. Wait for AI to generate:
   - Theory chapters
   - Quiz questions
   - YouTube video suggestions
4. Explore the generated content

## Project Structure

```
project-f11/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── HomePage.js
│   │   ├── AboutPage.js
│   │   ├── ResultsPage.js
│   │   └── Navbar.js
│   ├── services/
│   │   └── geminiService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- React.js 18
- React Router DOM
- Google Gemini API
- Modern CSS with gradients

## License

MIT

