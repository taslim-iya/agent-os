import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { Bot, ListTodo, Activity, ArrowRight, Cpu, Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl p-5 ${className}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>{children}</div>;
}

export default function Dashboard() {
  const nav = useNavigate();
  const { agents, tasks, logs } = useAppStore();
  const active = agents.filter(a => a.status === 'active' || a.status === 'working').length;
  const idle = agents.filter(a => a.status === 'idle').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Command Centre</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>{agents.length} agents · {active} active · {pendingTasks} pending tasks</p>
        </div>
        <button onClick={() => nav('/chat/ceo')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:scale-[1.02]" style={{ background: 'var(--accent)', color: '#fff' }}>
          👑 Talk to Atlas (CEO) <ArrowRight size={14} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Agents', value: agents.length, icon: Bot, color: '#6C5CE7' },
          { label: 'Active Now', value: active, icon: Zap, color: '#00D2A0' },
          { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle, color: '#4CAF50' },
          { label: 'Tasks Pending', value: pendingTasks, icon: Clock, color: '#FFA726' },
        ].map(s => (
          <Card key={s.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{s.label}</span>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Your Agents</h2>
          <button onClick={() => nav('/agents')} className="text-xs" style={{ color: 'var(--accent)' }}>View all →</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {agents.slice(0, 8).map(agent => (
            <div key={agent.id} onClick={() => nav(`/chat/${agent.id}`)} className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{agent.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{agent.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{agent.role}</p>
                </div>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                  background: agent.status === 'active' ? '#00D2A0' : agent.status === 'working' ? '#FFA726' : agent.status === 'error' ? '#FF6B6B' : 'var(--text-3)',
                }} />
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
                <span>{agent.tasksCompleted} tasks</span>
                <span>·</span>
                <span className="capitalize">{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Recent Tasks</h3>
            <button onClick={() => nav('/tasks')} className="text-xs" style={{ color: 'var(--accent)' }}>View all</button>
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-6">
              <ListTodo size={20} className="mx-auto mb-2" style={{ color: 'var(--text-3)', opacity: 0.3 }} />
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>No tasks yet. Chat with Atlas to delegate work.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map(t => {
                const agent = agents.find(a => a.id === t.agentId);
                return (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg p-3" style={{ background: 'var(--surface-2)' }}>
                    <span className="text-sm">{agent?.avatar || '🤖'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{t.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-3)' }}>{agent?.name}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: t.status === 'completed' ? 'rgba(0,210,160,0.1)' : t.status === 'in-progress' ? 'rgba(255,167,38,0.1)' : 'var(--surface-3)',
                      color: t.status === 'completed' ? '#00D2A0' : t.status === 'in-progress' ? '#FFA726' : 'var(--text-3)',
                    }}>{t.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Activity Feed</h3>
            <button onClick={() => nav('/activity')} className="text-xs" style={{ color: 'var(--accent)' }}>View all</button>
          </div>
          {logs.length === 0 ? (
            <div className="text-center py-6">
              <Activity size={20} className="mx-auto mb-2" style={{ color: 'var(--text-3)', opacity: 0.3 }} />
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>No activity yet. Start by chatting with an agent.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.slice(0, 5).map(l => {
                const agent = agents.find(a => a.id === l.agentId);
                return (
                  <div key={l.id} className="flex gap-2 p-2">
                    <span className="text-xs">{agent?.avatar || '🤖'}</span>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-2)' }}><strong style={{ color: 'var(--text)' }}>{agent?.name}</strong> {l.action}</p>
                      <p className="text-xs" style={{ color: 'var(--text-3)' }}>{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
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
