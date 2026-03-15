import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-content">
          <h1 className="about-title">About AI Course Maker</h1>
          
          <div className="about-section">
            <h2>Project Overview</h2>
            <p>
              AI Course Maker is a smart learning platform powered by Google’s Gemini AI.
              It instantly generates structured learning materials on any topic you choose.
              Whether you're a student, teacher, or lifelong learner, AI Course Maker helps
              you understand complex concepts in an easy and organized way.
            </p>
          </div>

          <div className="about-section">
            <h2>Key Features</h2>
            <ul className="features-list">
              <li><strong>AI-Generated Theory:</strong> Instantly get clear and detailed explanations on any topic.</li>
              <li><strong>Interactive Practice:</strong> Challenge yourself with AI-generated quiz questions.</li>
              <li><strong>Smart Video Suggestions:</strong> Watch curated YouTube videos related to your topic.</li>
              <li><strong>Modern Design:</strong> A clean, responsive, and user-friendly interface for all devices.</li>
              <li><strong>Fast & Reliable:</strong> Generate complete course materials within seconds.</li>
            </ul>
          </div>

        

          

          
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
