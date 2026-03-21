/**
 * ECOStageBar — horizontal stepper showing ECO stage progress.
 * Completed stages: green. Current stage: indigo. Future: gray.
 *
 * @param {Object[]} stages - ordered ECOStage objects [{name, order, ...}]
 * @param {string} currentStage - name of the current stage
 */
const ECOStageBar = ({ stages = [], currentStage }) => {
  if (!stages.length) return null;

  const currentIndex = stages.findIndex((s) => s.name === currentStage);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Progress</h3>
      <div className="flex items-center">
        {stages.map((stage, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={stage.name} className="flex items-center flex-1">
              {/* Node */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isDone
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isDone ? '✓' : i + 1}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${isCurrent ? 'text-indigo-700' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                    {stage.name}
                  </p>
                  {stage.requiresApproval && (
                    <p className="text-[10px] text-amber-500">Approval</p>
                  )}
                  {stage.isFinal && (
                    <p className="text-[10px] text-emerald-500">Final</p>
                  )}
                </div>
              </div>
              {/* Connector line */}
              {i < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition-all ${
                  i < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ECOStageBar;
