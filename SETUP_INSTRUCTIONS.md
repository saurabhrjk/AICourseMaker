# Complete Setup Instructions for AI Course Maker

## Step-by-Step Guide to Run Your Project

### Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### Step 2: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 3: Configure Environment Variables

Create a file named `.env` in the root directory (same level as package.json):

```bash
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied.

### Step 4: Start the Development Server

Run the following command:
```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## Usage Instructions

### Using the Application

1. **Homepage**: 
   - You'll see the project name in the navbar
   - In the center, there's an input box where you can enter any topic
   - Click "Generate Course" button

2. **Processing**:
   - The AI will analyze your topic
   - Wait for the API to generate three types of content

3. **Results Page**:
   - **Top**: The topic you entered
   - **First Div**: Theory chapters - comprehensive explanations
   - **Second Div**: Quiz questions - test your knowledge
   - **Third Div**: YouTube video suggestions - related learning resources

4. **Navigation**:
   - Click "AI Course Maker" in navbar to go home
   - Click "About" to see project and developer details
   - Click "Generate New Course" at bottom to start over

## File Structure Explained

```
project-f11/
├── public/
│   └── index.html          # Main HTML template
├── src/
│   ├── components/
│   │   ├── HomePage.js     # Landing page with search
│   │   ├── HomePage.css
│   │   ├── AboutPage.js    # Project details page
│   │   ├── AboutPage.css
│   │   ├── ResultsPage.js  # Displays AI-generated content
│   │   ├── ResultsPage.css
│   │   ├── Navbar.js       # Navigation bar
│   │   └── Navbar.css
│   ├── services/
│   │   └── geminiService.js # Gemini API integration
│   ├── App.js              # Main app with routing
│   ├── App.css
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies
└── README.md               # Project documentation
```

## Features Breakdown

### Navbar Component
- **Purpose**: Shows project name and navigation links
- **Location**: Top of every page
- **Links**: Home, About

### HomePage Component
- **Purpose**: User enters topic here
- **Features**: 
  - Large input field
  - Generate button
  - Loading spinner
  - Feature cards showing what you get

### ResultsPage Component
- **Purpose**: Shows AI-generated content
- **Features**:
  - Three dynamic sections:
    1. Theory & Concepts
    2. Quiz Questions
    3. Video Recommendations
  - Scrollable content
  - Professional card design

### AboutPage Component
- **Purpose**: Project and developer information
- **Features**:
  - Project overview
  - Technologies used
  - How it works
  - Developer info

### Gemini Service
- **Purpose**: Connects to Google's AI API
- **Functionality**:
  - Generates theory content
  - Creates quiz questions
  - Suggests YouTube videos
  - All dynamically created for any topic

## Customization Options

### Change Project Name
Edit `src/components/Navbar.js`:
```javascript
'AI Course Maker' → 'Your Project Name'
```

### Modify Colors
Edit gradient colors in CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Replace hex colors with your preferred colors.

### Update About Page
Edit `src/components/AboutPage.js` to change:
- Project description
- Developer information
- Features list

## Troubleshooting

### API Key Error
If you see "API key not configured":
1. Check your `.env` file exists in root directory
2. Verify the key starts with `REACT_APP_GEMINI_API_KEY=`
3. Restart the development server after adding the key

### API Rate Limits
- Gemini API has daily limits for free tier
- If you exceed limits, wait 24 hours or upgrade

### Build for Production
```bash
npm run build
```
Creates production-ready files in `build/` folder

## Technology Stack

- **React 18.2**: UI framework
- **React Router 6**: Navigation
- **Gemini API**: AI content generation
- **Modern CSS**: Animations and gradients

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check your internet connection

