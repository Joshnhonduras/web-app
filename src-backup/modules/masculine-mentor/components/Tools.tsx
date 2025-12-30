import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Tools.css';

function Tools() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [breathCount, setBreathCount] = useState(0);

  const tools = [
    {
      id: 'box-breathing',
      name: 'Box Breathing',
      icon: '🫁',
      description: 'Four-count breathing for instant calm',
      duration: '4 minutes',
    },
    {
      id: 'physio-sigh',
      name: 'Physiological Sigh',
      icon: '💨',
      description: 'Quick stress reset in under a minute',
      duration: '1 minute',
    },
    {
      id: 'tension-release',
      name: 'Tension Release',
      icon: '💪',
      description: 'Progressive muscle relaxation',
      duration: '5 minutes',
    },
    {
      id: 'focus-reset',
      name: 'Focus Reset',
      icon: '🎯',
      description: 'Clear your mind and refocus',
      duration: '3 minutes',
    },
  ];

  const mantras = [
    "I control my response, not the situation.",
    "Clarity over comfort.",
    "Do the next right thing.",
    "I am capable of handling this.",
    "Progress, not perfection.",
  ];

  const startExercise = (id: string) => {
    setActiveExercise(id);
    setBreathCount(0);
  };

  const stopExercise = () => {
    setActiveExercise(null);
    setBreathCount(0);
  };

  return (
    <div className="tools-container">
      <header className="tools-header">
        <Link to="/masculine-mentor" className="back-button">← Back</Link>
        <h2>Grounding Tools</h2>
      </header>

      <div className="tools-content">
        {!activeExercise ? (
          <>
            <section className="tools-section">
              <h3>Breathing Exercises</h3>
              <div className="tools-grid">
                {tools.map((tool) => (
                  <div key={tool.id} className="tool-card">
                    <div className="tool-icon">{tool.icon}</div>
                    <h4>{tool.name}</h4>
                    <p>{tool.description}</p>
                    <div className="tool-duration">{tool.duration}</div>
                    <button
                      className="start-btn"
                      onClick={() => startExercise(tool.id)}
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="tools-section mantras-section">
              <h3>Daily Mantras</h3>
              <p className="section-description">
                Choose one to repeat when you need grounding.
              </p>
              <div className="mantras-list">
                {mantras.map((mantra, index) => (
                  <div key={index} className="mantra-card">
                    {mantra}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="exercise-active">
            {activeExercise === 'box-breathing' && (
              <BoxBreathing
                count={breathCount}
                onIncrement={() => setBreathCount(breathCount + 1)}
                onStop={stopExercise}
              />
            )}
            {activeExercise === 'physio-sigh' && (
              <PhysiologicalSigh
                count={breathCount}
                onIncrement={() => setBreathCount(breathCount + 1)}
                onStop={stopExercise}
              />
            )}
            {activeExercise === 'tension-release' && (
              <TensionRelease onStop={stopExercise} />
            )}
            {activeExercise === 'focus-reset' && (
              <FocusReset onStop={stopExercise} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BoxBreathing({ count, onIncrement, onStop }: any) {
  const [phase, setPhase] = useState(0);
  const phases = ['Breathe In (4s)', 'Hold (4s)', 'Breathe Out (4s)', 'Hold (4s)'];

  return (
    <div className="breathing-exercise">
      <h2>Box Breathing</h2>
      <div className="breath-circle">
        <div className="phase-text">{phases[phase % 4]}</div>
        <div className="count-text">Round {Math.floor(count / 4) + 1}</div>
      </div>
      <div className="breath-controls">
        <button onClick={() => { onIncrement(); setPhase(phase + 1); }}>
          Next Phase
        </button>
        <button onClick={onStop} className="stop-btn">Stop</button>
      </div>
      <p className="instruction">Follow the prompts and breathe deeply.</p>
    </div>
  );
}

function PhysiologicalSigh({ count, onIncrement, onStop }: any) {
  return (
    <div className="breathing-exercise">
      <h2>Physiological Sigh</h2>
      <div className="breath-circle">
        <div className="phase-text">Deep inhale + quick inhale + long exhale</div>
        <div className="count-text">{count} sighs completed</div>
      </div>
      <div className="breath-controls">
        <button onClick={onIncrement}>Complete One Cycle</button>
        <button onClick={onStop} className="stop-btn">Finish</button>
      </div>
      <p className="instruction">Do 3-5 cycles for best results.</p>
    </div>
  );
}

function TensionRelease({ onStop }: any) {
  return (
    <div className="breathing-exercise">
      <h2>Tension Release</h2>
      <div className="instructions-list">
        <p>1. Tense your fists for 5 seconds, then release.</p>
        <p>2. Tense your shoulders for 5 seconds, then release.</p>
        <p>3. Tense your jaw for 5 seconds, then release.</p>
        <p>4. Take three deep breaths.</p>
        <p>5. Notice the difference in your body.</p>
      </div>
      <button onClick={onStop} className="stop-btn">Finish</button>
    </div>
  );
}

function FocusReset({ onStop }: any) {
  return (
    <div className="breathing-exercise">
      <h2>Focus Reset</h2>
      <div className="instructions-list">
        <p>1. Close your eyes and take three deep breaths.</p>
        <p>2. Name three things you can hear.</p>
        <p>3. Name three things you can feel.</p>
        <p>4. Set one clear intention for the next hour.</p>
        <p>5. Open your eyes and begin.</p>
      </div>
      <button onClick={onStop} className="stop-btn">Finish</button>
    </div>
  );
}

export default Tools;
