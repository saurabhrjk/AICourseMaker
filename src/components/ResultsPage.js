import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (location.state && location.state.content) {
      setContent(location.state.content);
    }
     else {

      navigate('/');
    }
  }, [location.state, navigate]);

  if (!content) {
    return (
      <div className="results-page">
        <Navbar />
        <div className="loading-results">
          <div className="spinner-large"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }



  const parseVideosWithLinks = (videoText) => {
    const lines = videoText.split('\n').filter(line => line.trim());
    const videoList = [];
    
    lines.forEach(line => {


      const match = line.match(/(\d+)\.\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/);
      if (match) {
        const number = match[1];
        const title = match[2];
        const url = match[3];
        videoList.push({ number, title, url });
      }
    });
    
    return videoList;
  };

  const videoLinks = parseVideosWithLinks(content.videos);

  return (
    <div className="results-page">
      <Navbar />
      <div className="results-container">
        <div className="results-header">
          <h1 className="results-topic">{content.topic}</h1>
          <p className="results-subtitle">AI-Generated Learning Content</p>
        </div>

        <div className="results-grid">
    

          <div className="result-card theory-card">
            <div className="card-header">
              <h2>Theory & Concepts</h2>
            </div>
            <div className="card-content">
              <div className="content-text" dangerouslySetInnerHTML={{ 
                __html: content.theory.replace(/\n/g, '<br/>') 
              }} />
            </div>
          </div>



          <div className="result-card questions-card">
            <div className="card-header">
              <h2>Quiz Questions</h2>
            </div>
            <div className="card-content">
              <div className="content-text" dangerouslySetInnerHTML={{ 
                __html: content.questions.replace(/\n/g, '<br/>') 
              }} />
            </div>
          </div>




          <div className="result-card videos-card">
            <div className="card-header">
              <h2>Video Recommendations</h2>
            </div>
            <div className="card-content">
              {videoLinks.length > 0 ? (
                <div className="video-list">
                  {videoLinks.map((video, index) => (
                    <div key={index} className="video-item">
                      <a 
  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`}
  target="_blank" 
  rel="noopener noreferrer"
  className="video-link"
>
  {video.title}
</a>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="content-text" dangerouslySetInnerHTML={{ 
                  __html: content.videos.replace(/\n/g, '<br/>') 
                }} />
              )}
            </div>
          </div>
        </div>

        <div className="results-footer">
          <button 
            className="new-search-btn"
            onClick={() => navigate('/')}
          >
            Generate New Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

