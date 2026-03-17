import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import { generateQuizQuestions } from '../services/quizService';
import './QuizPage.css';

const STORAGE_KEY = 'ai-course-maker-quizzes';
const PARTICIPANT_KEY = 'ai-course-maker-participant-id';

const getStoredQuizzes = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Could not parse saved quizzes:', error);
    return [];
  }
};

const sortByDate = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const QuizPage = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [quizzes, setQuizzes] = useState([]);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [createError, setCreateError] = useState('');
  const [playError, setPlayError] = useState('');
  const [playingQuiz, setPlayingQuiz] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [selectedLeaderboardQuizId, setSelectedLeaderboardQuizId] = useState('');
  const [quizForm, setQuizForm] = useState({
    topic: '',
    difficulty: 'Easy',
    questionCount: 5,
    durationMinutes: 5
  });
  const [participantId, setParticipantId] = useState('');

  const participantName = playerName.trim() || 'Anonymous Player';

  const hasAlreadyAttempted = (quiz, attemptedBy = participantName) => {
    const normalizedName = attemptedBy.trim().toLowerCase();
    return (quiz.leaderboard || []).some((entry) => (
      entry.participantId === participantId
      || entry.name.trim().toLowerCase() === normalizedName
    ));
  };

  useEffect(() => {
    const initialQuizzes = getStoredQuizzes();
    setQuizzes(initialQuizzes);

    const savedParticipantId = localStorage.getItem(PARTICIPANT_KEY);
    if (savedParticipantId) {
      setParticipantId(savedParticipantId);
      return;
    }

    const generatedParticipantId = `participant-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(PARTICIPANT_KEY, generatedParticipantId);
    setParticipantId(generatedParticipantId);
  }, []);

  useEffect(() => {
    const updateQuizStatuses = () => {
      setQuizzes((currentQuizzes) => {
        if (!currentQuizzes.length) {
          return currentQuizzes;
        }

        const now = Date.now();
        const updated = currentQuizzes.map((quiz) => {
          if (quiz.status === 'live' && new Date(quiz.endsAt).getTime() <= now) {
            return { ...quiz, status: 'past' };
          }
          return quiz;
        });

        const changed = JSON.stringify(updated) !== JSON.stringify(currentQuizzes);
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          if (playingQuiz && new Date(playingQuiz.endsAt).getTime() <= now) {
            setPlayingQuiz(null);
            setTimeLeft(0);
          }
          return updated;
        }

        return currentQuizzes;
      });
    };

    updateQuizStatuses();
    const statusTimer = setInterval(updateQuizStatuses, 1000);
    return () => clearInterval(statusTimer);
  }, [playingQuiz]);

  const persistQuizzes = (newQuizzes) => {
    setQuizzes(newQuizzes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuizzes));
  };

  const liveQuizzes = useMemo(
    () => quizzes.filter((quiz) => quiz.status === 'live').sort(sortByDate),
    [quizzes]
  );

  const pastQuizzes = useMemo(
    () => quizzes.filter((quiz) => quiz.status === 'past').sort(sortByDate),
    [quizzes]
  );

  const selectedLeaderboardQuiz = quizzes.find((quiz) => quiz.id === selectedLeaderboardQuizId);

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateQuiz = async (event) => {
    event.preventDefault();

    if (!quizForm.topic.trim()) {
      setCreateError('Please enter a quiz topic.');
      return;
    }

    setCreateError('');
    setIsCreatingQuiz(true);

    try {
      const questions = await generateQuizQuestions(quizForm);
      const now = new Date();
      const endAt = new Date(now.getTime() + Number(quizForm.durationMinutes) * 60 * 1000);

      const newQuiz = {
        id: `quiz-${Date.now()}`,
        topic: quizForm.topic,
        difficulty: quizForm.difficulty,
        questionCount: Number(quizForm.questionCount),
        durationMinutes: Number(quizForm.durationMinutes),
        createdAt: now.toISOString(),
        endsAt: endAt.toISOString(),
        status: 'live',
        questions,
        leaderboard: []
      };

      const updated = [newQuiz, ...quizzes];
      persistQuizzes(updated);
      setPlayError('');
      setActiveTab('live');
      setSelectedLeaderboardQuizId(newQuiz.id);
      setQuizForm({ topic: '', difficulty: 'Easy', questionCount: 5, durationMinutes: 5 });
    } catch (error) {
      setCreateError(error.message || 'Unable to create quiz.');
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const startQuiz = (quiz) => {
    const now = Date.now();
    const endAt = new Date(quiz.endsAt).getTime();

    if (endAt <= now) {
      const updated = quizzes.map((item) => item.id === quiz.id ? { ...item, status: 'past' } : item);
      persistQuizzes(updated);
      return;
    }

    const participant = participantName;

    if (hasAlreadyAttempted(quiz, participant)) {
      setPlayError('You have already attempted this quiz. You can review the leaderboard instead.');
      return;
    }

    setPlayError('');
    setPlayerName(participant);
    setPlayingQuiz(quiz);
    setAnswers({});
    setLastResult(null);
    setTimeLeft(Math.floor((endAt - now) / 1000));
  };

  const submitQuiz = useCallback((isAutoSubmit = false) => {
    if (!playingQuiz) {
      return;
    }

    const total = playingQuiz.questions.length;
    const score = playingQuiz.questions.reduce((acc, question) => {
      return answers[question.id] === question.correctAnswer ? acc + 1 : acc;
    }, 0);

    const attempt = {
      id: `attempt-${Date.now()}`,
      name: participantName,
      score,
      total,
      submittedAt: new Date().toISOString(),
      autoSubmitted: isAutoSubmit,
      participantId
    };

    const updatedQuizzes = quizzes.map((quiz) => {
      if (quiz.id !== playingQuiz.id) {
        return quiz;
      }

      const leaderboard = [...(quiz.leaderboard || []), attempt]
        .sort((a, b) => b.score - a.score || new Date(a.submittedAt) - new Date(b.submittedAt));

      return {
        ...quiz,
        leaderboard
      };
    });

    persistQuizzes(updatedQuizzes);
    setLastResult({
      ...attempt,
      topic: playingQuiz.topic,
      difficulty: playingQuiz.difficulty
    });
    setSelectedLeaderboardQuizId(playingQuiz.id);
    setPlayingQuiz(null);
    setAnswers({});
    setTimeLeft(0);
  }, [answers, participantId, participantName, playingQuiz, quizzes]);

  useEffect(() => {
    if (!playingQuiz) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playingQuiz, submitQuiz]);

  return (
    <div className="quiz-page">
      <Navbar />
      <div className="quiz-container">
        <h1 className="quiz-title">&gt; tasks --challenge-board</h1>
        <p className="quiz-subtitle">Create live quizzes, join running quizzes, and track rankings.</p>

        {playingQuiz && (
          <div className="quiz-player card">
            <div className="quiz-player-head">
              <h2>[ task ] {playingQuiz.topic} ({playingQuiz.difficulty})</h2>
              <span className="timer-chip">time_left: {formatCountdown(timeLeft)}</span>
            </div>
            {playingQuiz.questions.map((question, index) => (
              <div key={question.id} className="question-block">
                <h3>{index + 1}. {question.question}</h3>
                <div className="options-grid">
                  {question.options.map((option) => (
                    <label key={option} className="option-item">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="player-actions">
              <button className="primary-btn" onClick={() => submitQuiz(false)}>Submit Quiz</button>
            </div>
          </div>
        )}

        {!playingQuiz && (
          <>
            {lastResult && (
              <div className="result-banner">
                <strong>{lastResult.name}</strong> scored <strong>{lastResult.score}/{lastResult.total}</strong> in <strong>{lastResult.topic}</strong>
                {lastResult.autoSubmitted && ' (auto-submitted when timer ended).'}
              </div>
            )}

            {playError && <p className="error-message play-error">{playError}</p>}

            <div className="tabs-row">
              <button className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>[ Available ]</button>
              <button className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>[ Completed ]</button>
              <button className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>[ Make Task ]</button>
            </div>

            {activeTab === 'live' && (
              <div className="tab-panel">
                <div className="name-field-row">
                  <label htmlFor="playerName">participant_name</label>
                  <input
                    id="playerName"
                    type="text"
                    className="topic-input"
                    placeholder="Enter your display name"
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                  />
                </div>
                {!liveQuizzes.length ? (
                  <p className="empty-state">no active task available.</p>
                ) : (
                  <div className="quiz-grid">
                    {liveQuizzes.map((quiz) => {
                      const alreadyAttempted = hasAlreadyAttempted(quiz);

                      return (
                        <div key={quiz.id} className="card quiz-task-card">
                          <h3>[ ] {quiz.topic}</h3>
                          <p><strong>difficulty:</strong> {quiz.difficulty}</p>
                          <p><strong>questions:</strong> {quiz.questionCount}</p>
                          <p><strong>ends_at:</strong> {new Date(quiz.endsAt).toLocaleString()}</p>
                          <button
                            className="primary-btn"
                            onClick={() => startQuiz(quiz)}
                            disabled={alreadyAttempted}
                          >
                            {alreadyAttempted ? 'already attempted' : 'start task'}
                          </button>
                          <button className="secondary-btn" onClick={() => setSelectedLeaderboardQuizId(quiz.id)}>view leaderboard</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="tab-panel">
                {!pastQuizzes.length ? (
                  <p className="empty-state">no completed task yet.</p>
                ) : (
                  <div className="quiz-grid">
                    {pastQuizzes.map((quiz) => (
                      <div key={quiz.id} className="card quiz-task-card">
                        <h3>[✓] {quiz.topic}</h3>
                        <p><strong>difficulty:</strong> {quiz.difficulty}</p>
                        <p><strong>questions:</strong> {quiz.questionCount}</p>
                        <p><strong>ended:</strong> {new Date(quiz.endsAt).toLocaleString()}</p>
                        <button className="secondary-btn" onClick={() => setSelectedLeaderboardQuizId(quiz.id)}>view leaderboard</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'create' && (
              <div className="tab-panel create-tab-panel">
                <form className="create-form card" onSubmit={handleCreateQuiz}>
                  <h3>&gt; make --new-task</h3>
                  <label>Task Topic</label>
                  <input
                    type="text"
                    className="topic-input"
                    placeholder="Example: JavaScript Basics"
                    value={quizForm.topic}
                    onChange={(event) => setQuizForm((prev) => ({ ...prev, topic: event.target.value }))}
                  />

                  <label>Difficulty</label>
                  <div className="select-wrap">
                    <select
                      className="topic-input difficulty-select"
                      value={quizForm.difficulty}
                      onChange={(event) => setQuizForm((prev) => ({ ...prev, difficulty: event.target.value }))}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>

                  <label>Number of Questions</label>
                  <input
                    type="number"
                    min="3"
                    max="20"
                    className="topic-input"
                    value={quizForm.questionCount}
                    onChange={(event) => setQuizForm((prev) => ({ ...prev, questionCount: event.target.value }))}
                  />

                  <label>Task Ends In (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    className="topic-input"
                    value={quizForm.durationMinutes}
                    onChange={(event) => setQuizForm((prev) => ({ ...prev, durationMinutes: event.target.value }))}
                  />

                  {createError && <p className="error-message">{createError}</p>}
                  <button type="submit" className="primary-btn" disabled={isCreatingQuiz}>
                    {isCreatingQuiz ? 'creating task...' : 'create task'}
                  </button>
                </form>
              </div>
            )}

            {selectedLeaderboardQuiz && (
              <div className="leaderboard card">
                <h3>&gt; leaderboard --{selectedLeaderboardQuiz.topic}</h3>
                {!selectedLeaderboardQuiz.leaderboard?.length ? (
                  <p className="empty-state">no attempts yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>rank</th>
                        <th>name</th>
                        <th>score</th>
                        <th>submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLeaderboardQuiz.leaderboard.map((entry, index) => (
                        <tr key={entry.id}>
                          <td>#{index + 1}</td>
                          <td>{entry.name}</td>
                          <td>{entry.score}/{entry.total}</td>
                          <td>{new Date(entry.submittedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
