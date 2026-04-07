import { useAppStore } from '@/store/appStore';
import { ListTodo, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function Tasks() {
  const { tasks, agents, updateTask } = useAppStore();

  const STATUS_STYLE: Record<string, { bg: string; color: string; icon: typeof Clock }> = {
    pending: { bg: 'var(--surface-2)', color: 'var(--text-3)', icon: Clock },
    'in-progress': { bg: 'rgba(255,167,38,0.1)', color: '#FFA726', icon: Loader2 },
    completed: { bg: 'rgba(0,210,160,0.1)', color: '#00D2A0', icon: CheckCircle },
    failed: { bg: 'rgba(255,107,107,0.1)', color: '#FF6B6B', icon: AlertCircle },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Tasks</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>{tasks.length} total · {tasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-20">
          <ListTodo size={32} className="mx-auto mb-3" style={{ color: 'var(--text-3)', opacity: 0.3 }} />
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>No tasks yet. Chat with Atlas to delegate work to agents.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(t => {
            const agent = agents.find(a => a.id === t.agentId);
            const style = STATUS_STYLE[t.status] || STATUS_STYLE.pending;
            return (
              <div key={t.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="text-lg">{agent?.avatar || '🤖'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{t.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Assigned to {agent?.name || 'Unknown'} · {t.priority} priority</p>
                </div>
                <div className="flex items-center gap-2">
                  {t.status !== 'completed' && t.status !== 'failed' && (
                    <button onClick={() => updateTask(t.id, { status: 'completed', completedAt: new Date().toISOString() })} className="text-xs px-2 py-1 rounded-lg transition hover:bg-white/5" style={{ border: '1px solid var(--border)', color: '#00D2A0' }}>
                      Complete
                    </button>
                  )}
                  <span className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: style.bg, color: style.color }}>
                    <style.icon size={10} /> {t.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
