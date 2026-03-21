/**
 * ECOStageBar — horizontal stepper with pulse dot for current stage.
 */
const ECOStageBar = ({ stages = [], currentStage }) => {
  if (!stages.length) return null;
  const currentIndex = stages.findIndex((s) => s.name === currentStage);

  return (
    <div style={{
      background: '#FFFFFF', border: '1.5px solid #90E0EF', borderRadius: 12,
      padding: '18px 20px',
    }}>
      <p style={{ fontSize: 10, fontWeight: 600, color: '#90E0EF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16, margin: 0, marginBottom: 16 }}>
        Progress
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {stages.map((stage, i) => {
          const isDone    = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture  = i > currentIndex;

          return (
            <div key={stage.name} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {/* Node column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Dot */}
                <div
                  className={isCurrent ? 'stage-dot-current' : ''}
                  style={{
                    width: 18, height: 18, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? '#0077B6' : isCurrent ? '#00B4D8' : '#FFFFFF',
                    border: isDone
                      ? '2px solid #0077B6'
                      : isCurrent
                      ? '2px solid #00B4D8'
                      : '1.5px solid #90E0EF',
                    transition: 'all 0.2s',
                  }}
                >
                  {isDone && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Label below dot */}
                <div style={{ marginTop: 6, textAlign: 'center' }}>
                  <p style={{
                    fontSize: 10, fontWeight: isCurrent ? 600 : 400, margin: 0,
                    color: isDone ? '#0077B6' : isCurrent ? '#03045E' : '#90E0EF',
                  }}>
                    {stage.name}
                  </p>
                  {stage.requiresApproval && (
                    <p style={{ fontSize: 9, color: '#00B4D8', margin: '1px 0 0', fontWeight: 500 }}>Approval</p>
                  )}
                  {stage.isFinal && (
                    <p style={{ fontSize: 9, color: '#0077B6', margin: '1px 0 0', fontWeight: 500 }}>Final</p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {i < stages.length - 1 && (
                <div style={{
                  flex: 1,
                  height: isFuture ? undefined : 2,
                  borderTop: isFuture ? '1.5px dashed #CAF0F8' : undefined,
                  background: isDone ? '#0077B6' : undefined,
                  ...(isFuture ? { borderTopStyle: 'dashed', borderTopWidth: '1.5px', borderTopColor: '#CAF0F8' } : {}),
                  marginTop: -6,
                  flexShrink: 0,
                  minWidth: 20,
                  alignSelf: 'flex-start',
                  marginTop: 9,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Inject keyframes for spin in Button spinner */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ECOStageBar;
