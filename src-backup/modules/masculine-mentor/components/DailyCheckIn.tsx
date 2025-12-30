import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMasculineMentorStore } from '../store/useMasculineMentorStore';
import './DailyCheckIn.css';

function DailyCheckIn() {
  const { addCheckIn, checkIns } = useMasculineMentorStore();
  const [mood, setMood] = useState(3);
  const [reflection, setReflection] = useState('');

  const handleSubmit = () => {
    if (!reflection.trim()) {
      alert('Please write a brief reflection.');
      return;
    }

    addCheckIn({
      date: new Date(),
      mood,
      reflection,
    });

    setMood(3);
    setReflection('');
    alert('Check-in recorded! Keep building that streak.');
  };

  const moods = [
    { value: 1, emoji: '😞', label: 'Struggling' },
    { value: 2, emoji: '😐', label: 'Low' },
    { value: 3, emoji: '🙂', label: 'Steady' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '🔥', label: 'Strong' },
  ];

  const recentCheckIns = checkIns.slice(-7).reverse();
  const streak = calculateStreak(checkIns);

  return (
    <div className="daily-checkin">
      <header className="checkin-header">
        <Link to="/masculine-mentor" className="back-button">← Back</Link>
        <h2>Daily Check-In</h2>
      </header>

      <div className="checkin-content">
        <div className="streak-banner">
          <div className="streak-number">{streak}</div>
          <div className="streak-label">Day Streak 🔥</div>
        </div>

        <div className="checkin-form">
          <h3>How are you feeling today?</h3>
          <div className="mood-selector">
            {moods.map((m) => (
              <button
                key={m.value}
                className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                onClick={() => setMood(m.value)}
              >
                <div className="mood-emoji">{m.emoji}</div>
                <div className="mood-label">{m.label}</div>
              </button>
            ))}
          </div>

          <h3>What's on your mind?</h3>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Share what's going well, challenges you're facing, or goals you're working on..."
            rows={6}
          />

          <button className="submit-btn" onClick={handleSubmit}>
            Record Check-In
          </button>
        </div>

        {recentCheckIns.length > 0 && (
          <div className="history-section">
            <h3>Recent Check-Ins</h3>
            <div className="history-list">
              {recentCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="history-item">
                  <div className="history-date">
                    {new Date(checkIn.date).toLocaleDateString()}
                  </div>
                  <div className="history-mood">
                    {moods.find((m) => m.value === checkIn.mood)?.emoji}
                  </div>
                  <div className="history-reflection">{checkIn.reflection}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateStreak(checkIns: any[]): number {
  if (checkIns.length === 0) return 0;

  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const checkIn of sortedCheckIns) {
    const checkInDate = new Date(checkIn.date);
    checkInDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
      streak++;
      currentDate = checkInDate;
    } else {
      break;
    }
  }

  return streak;
}

export default DailyCheckIn;
