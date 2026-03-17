import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-terminal">
          <p className="terminal-line">&gt; booting profile...</p>
          <p className="terminal-line">&gt; loading creator metadata...</p>
          <p className="terminal-line terminal-ok">&gt; system.status: online</p>
        </div>

        <div className="about-content">
          <h1 className="about-title">&gt; creator --profile</h1>

          <div className="about-section">
            <p><strong>name:</strong> Saurabh Khandelwal</p>
            <p><strong>role:</strong> student developer</p>
            <p><strong>project:</strong> AI Course Maker</p>
          </div>

          <div className="about-section">
            <h2>&gt; mission --statement</h2>
            <p>
              This platform helps students generate theory, quizzes, and video resources quickly using AI.
              The UI now follows a coding-dashboard style inspired by competitive programming portals.
            </p>
          </div>

          <div className="about-section">
            <h2>&gt; portfolio --link</h2>
            <a
              href="https://saurabhkhandelwal.site"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-link"
            >
              open portfolio ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
