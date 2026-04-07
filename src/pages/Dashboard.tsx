import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { Crown, ArrowRight, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl p-5 md:p-6 bg-white ${className}`} style={{ border: '1px solid var(--border)' }}>{children}</div>;
}

export default function Dashboard() {
  const nav = useNavigate();
  const { agents, tasks, logs } = useAppStore();
  const activeCount = agents.filter(a => a.status === 'active').length;
  const workingCount = agents.filter(a => a.status === 'working').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Command Centre</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your AI workforce at a glance</p>
        </div>
        <button onClick={() => nav('/chat/ceo')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
          <Crown size={14} /> Talk to Atlas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Agents', value: agents.length, color: 'var(--accent)' },
          { label: 'Active', value: activeCount, color: '#17b169' },
          { label: 'Working', value: workingCount, color: '#FFA726' },
          { label: 'Tasks Done', value: completed, color: '#e44ced' },
        ].map(s => (
          <Card key={s.label}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
            <p className="text-2xl md:text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {agents.slice(0, 8).map(a => (
          <div key={a.id} onClick={() => nav(`/chat/${a.id}`)} className="rounded-2xl p-4 bg-white cursor-pointer group hover:shadow-lg hover:shadow-black/5 transition-all" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: `${a.color}10` }}>{a.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
                <p className="text-[11px] truncate" style={{ color: a.color }}>{a.role}</p>
              </div>
              <div className="w-2 h-2 rounded-full" style={{ background: a.status === 'active' ? '#17b169' : a.status === 'working' ? '#FFA726' : '#FF6B6B' }} />
            </div>
            <div className="flex gap-1 flex-wrap">
              {a.capabilities.slice(0, 2).map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-alt)', color: 'var(--text-tertiary)' }}>{c}</span>
              ))}
              {a.capabilities.length > 2 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-alt)', color: 'var(--text-tertiary)' }}>+{a.capabilities.length - 2}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Tasks + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Tasks</h3>
            <button onClick={() => nav('/tasks')} className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>View all <ArrowRight size={10} /></button>
          </div>
          {tasks.length === 0 ? (
            <p className="text-xs py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>No tasks yet. Talk to Atlas to get started.</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(-5).reverse().map(t => {
                const agent = agents.find(a => a.id === t.agentId);
                return (
                  <div key={t.id} className="flex items-center gap-2 py-1.5">
                    <span className="text-sm">{agent?.avatar}</span>
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>{t.title}</span>
                    {t.status === 'completed' && <CheckCircle size={12} style={{ color: '#17b169' }} />}
                    {t.status === 'in-progress' && <Loader2 size={12} className="animate-spin" style={{ color: '#FFA726' }} />}
                    {t.status === 'pending' && <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Activity</h3>
            <button onClick={() => nav('/activity')} className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>View all <ArrowRight size={10} /></button>
          </div>
          {logs.length === 0 ? (
            <p className="text-xs py-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Agent activity will appear here.</p>
          ) : (
            <div className="space-y-2">
              {logs.slice(-5).reverse().map(l => {
                const agent = agents.find(a => a.id === l.agentId);
                return (
                  <div key={l.id} className="flex items-center gap-2 py-1.5">
                    <span className="text-sm">{agent?.avatar}</span>
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-secondary)' }}><strong style={{ color: agent?.color }}>{agent?.name}</strong> {l.action}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
