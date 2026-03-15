import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCourseContent } from '../services/geminiService';
import Navbar from './Navbar';
import AboutPage from './AboutPage';
import './HomePage.css';

const HomePage = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const content = await generateCourseContent(topic);
      navigate('/results', { 
        state: { 
          content,
          topic 
        } 
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage-container">
        <div className="hero-section">
          <h1 className="hero-title">
            AI Course Maker
          </h1>
          <p className="hero-subtitle">
            Generate comprehensive courses, theory, quizzes, and learning resources powered by AI
          </p>
          
          <form onSubmit={handleSubmit} className="search-form">
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter any topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="topic-input"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="generate-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  'Generate Course'
                )}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Deep Theory</h3>
              <p>AI-generated comprehensive explanations</p>
            </div>



            <div className="feature-card">
              <div className="feature-icon">❓</div>
              <h3>Quiz Questions</h3>
              <p>Test your knowledge with AI questions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>Video Resources</h3>
              <p>Curated learning suggestions</p>
            </div>
          </div>
        </div>
      </div>

      
      <AboutPage />
    </div>
  );
};

export default HomePage;

