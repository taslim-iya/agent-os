import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { MessageSquare, PlusCircle, Power, PowerOff } from 'lucide-react';

export default function Agents() {
  const nav = useNavigate();
  const { agents, updateAgent } = useAppStore();

  const categories = [...new Set(agents.map(a => a.category))];
  const CATEGORY_LABELS: Record<string, string> = {
    executive: 'Executive', marketing: 'Marketing', sales: 'Sales', finance: 'Finance',
    hr: 'Human Resources', operations: 'Operations', support: 'Support', research: 'Research',
    analytics: 'Analytics', legal: 'Legal', product: 'Product', content: 'Content', custom: 'Custom',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Agents</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>{agents.length} agents across {categories.length} categories</p>
        </div>
        <button onClick={() => nav('/create')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>
          <PlusCircle size={14} /> Create Agent
        </button>
      </div>

      {categories.map(cat => {
        const catAgents = agents.filter(a => a.category === cat);
        return (
          <div key={cat} className="mb-8">
            <h2 className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-3)' }}>{CATEGORY_LABELS[cat] || cat}</h2>
            <div className="grid grid-cols-3 gap-3">
              {catAgents.map(agent => (
                <div key={agent.id} className="rounded-xl p-5 transition-all hover:scale-[1.005]" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>
                        {agent.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{agent.name}</p>
                        <p className="text-xs" style={{ color: agent.color }}>{agent.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{
                        background: agent.status === 'active' ? '#00D2A0' : agent.status === 'working' ? '#FFA726' : 'var(--text-3)',
                      }} />
                      <span className="text-xs capitalize" style={{ color: 'var(--text-3)' }}>{agent.status}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>{agent.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.capabilities.slice(0, 3).map(c => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>{c}</span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-3)' }}>+{agent.capabilities.length - 3}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => nav(`/chat/${agent.id}`)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition hover:bg-white/5" style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
                      <MessageSquare size={12} /> Chat
                    </button>
                    <button onClick={() => updateAgent(agent.id, { status: agent.status === 'active' ? 'idle' : 'active' })} className="py-2 px-3 rounded-lg transition hover:bg-white/5" style={{ border: '1px solid var(--border)' }}>
                      {agent.status === 'active' || agent.status === 'working' ? <PowerOff size={12} style={{ color: '#FF6B6B' }} /> : <Power size={12} style={{ color: '#00D2A0' }} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
