import { useAppStore } from '@/store/appStore';
import { Activity as ActivityIcon } from 'lucide-react';

export default function Activity() {
  const { logs, agents } = useAppStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Activity Feed</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Everything your agents have been doing</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20">
          <ActivityIcon size={32} className="mx-auto mb-3" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No activity yet. Start chatting with agents to see their activity here.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {logs.map((l, i) => {
            const agent = agents.find(a => a.id === l.agentId);
            return (
              <div key={l.id} className="flex gap-4 py-3" style={{ borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: `${agent?.color || '#666'}12` }}>
                    {agent?.avatar || '🤖'}
                  </div>
                  {i < logs.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />}
                </div>
                <div className="pb-2">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: agent?.color || 'var(--text-primary)' }}>{agent?.name || 'Unknown'}</strong> {l.action}
                  </p>
                  {l.detail && <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{l.detail}</p>}
                  <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{new Date(l.timestamp).toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
