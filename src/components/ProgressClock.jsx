import React from 'react';

export default function ProgressClock({ tasks, currentProcess }) {
  const filteredTasks = tasks.filter(t => t.process === currentProcess);
  const total = filteredTasks.length;
  const completed = filteredTasks.filter(t => t.status === '已完成').length;
  
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  // Calculate SVG stroke dasharray for the circular progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>{currentProcess === 'lapping' ? '研磨' : '拋光'} 進度完成鐘</h3>
      
      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="transparent"
            stroke="var(--success)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div style={{ 
          position: 'absolute', 
          top: '0', left: '0', right: '0', bottom: '0', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' 
        }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{percentage}%</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{completed} / {total}</span>
        </div>
      </div>
    </div>
  );
}
