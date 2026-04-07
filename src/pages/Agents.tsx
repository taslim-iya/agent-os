import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { PlusCircle, MessageSquare } from 'lucide-react';

export default function Agents() {
  const nav = useNavigate();
  const { agents } = useAppStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Agents</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{agents.length} agents · {agents.filter(a => a.status === 'active').length} active</p>
        </div>
        <button onClick={() => nav('/create')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
          <PlusCircle size={14} /> Create Agent
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(a => (
          <div key={a.id} className="rounded-2xl p-5 bg-white group hover:shadow-lg hover:shadow-black/5 transition-all" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${a.color}10` }}>{a.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
                <p className="text-xs" style={{ color: a.color }}>{a.role}</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{
                background: a.status === 'active' ? 'rgba(0,212,170,0.08)' : a.status === 'working' ? 'rgba(255,167,38,0.08)' : 'rgba(255,107,107,0.08)',
                color: a.status === 'active' ? '#17b169' : a.status === 'working' ? '#FFA726' : '#FF6B6B',
              }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} /> {a.status}
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{a.description}</p>
            <div className="flex gap-1 flex-wrap mb-4">
              {a.capabilities.slice(0, 3).map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-alt)', color: 'var(--text-tertiary)' }}>{c}</span>
              ))}
              {a.capabilities.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-alt)', color: 'var(--text-tertiary)' }}>+{a.capabilities.length - 3}</span>}
            </div>
            <button onClick={() => nav(`/chat/${a.id}`)} className="flex items-center gap-1.5 text-xs font-medium group-hover:gap-2 transition-all" style={{ color: 'var(--accent)' }}>
              <MessageSquare size={12} /> Chat with {a.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
