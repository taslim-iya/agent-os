import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { Send, Bot, Loader2, Sparkles, ArrowRight, Zap, ListTodo } from 'lucide-react';

export default function AgentChat() {
  const { agentId } = useParams();
  const nav = useNavigate();
  const { agents, messages, config, addMessage, addTask, addLog, updateAgent } = useAppStore();
  const agent = agents.find(a => a.id === agentId);
  const chatMessages = messages.filter(m => m.agentId === agentId);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages.length]);

  if (!agent) return <div className="text-center py-20" style={{ color: 'var(--text-3)' }}>Agent not found</div>;

  const isCEO = agent.id === 'ceo';

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');

    addMessage({ id: crypto.randomUUID(), agentId: agent.id, role: 'user', content: userMsg, timestamp: new Date().toISOString() });
    setLoading(true);
    updateAgent(agent.id, { status: 'working', lastActive: new Date().toISOString() });

    // CEO delegation logic
    if (isCEO) {
      const lowerMsg = userMsg.toLowerCase();
      const delegations: { keyword: string[]; targetId: string; taskTitle: string }[] = [
        { keyword: ['marketing', 'seo', 'social media', 'content calendar', 'brand', 'ad campaign'], targetId: 'marketing', taskTitle: 'Marketing task' },
        { keyword: ['sales', 'lead', 'outreach', 'prospect', 'pipeline', 'deal', 'crm'], targetId: 'sales', taskTitle: 'Sales task' },
        { keyword: ['finance', 'invoice', 'budget', 'expense', 'revenue', 'forecast', 'profit'], targetId: 'finance', taskTitle: 'Finance task' },
        { keyword: ['hire', 'recruit', 'onboard', 'employee', 'team', 'culture', 'training'], targetId: 'hr', taskTitle: 'HR task' },
        { keyword: ['operations', 'workflow', 'process', 'schedule', 'inventory', 'logistics'], targetId: 'operations', taskTitle: 'Operations task' },
        { keyword: ['support', 'customer', 'ticket', 'complaint', 'help desk', 'service'], targetId: 'support', taskTitle: 'Support task' },
        { keyword: ['research', 'market', 'competitor', 'industry', 'trend', 'analysis'], targetId: 'research', taskTitle: 'Research task' },
        { keyword: ['data', 'analytics', 'dashboard', 'metrics', 'report', 'kpi'], targetId: 'analytics', taskTitle: 'Analytics task' },
        { keyword: ['contract', 'legal', 'compliance', 'nda', 'regulation', 'terms'], targetId: 'legal', taskTitle: 'Legal task' },
        { keyword: ['product', 'feature', 'roadmap', 'spec', 'sprint', 'backlog', 'user feedback'], targetId: 'product', taskTitle: 'Product task' },
        { keyword: ['write', 'blog', 'copy', 'email copy', 'landing page', 'whitepaper', 'article'], targetId: 'content', taskTitle: 'Content task' },
      ];

      let delegatedTo: string | null = null;
      let taskTitle = '';
      for (const d of delegations) {
        if (d.keyword.some(k => lowerMsg.includes(k))) {
          delegatedTo = d.targetId;
          taskTitle = d.taskTitle;
          break;
        }
      }

      if (delegatedTo) {
        const target = agents.find(a => a.id === delegatedTo);
        const taskId = crypto.randomUUID();
        addTask({
          id: taskId, agentId: delegatedTo!, title: userMsg.slice(0, 80), description: userMsg,
          status: 'in-progress', priority: 'medium', createdAt: new Date().toISOString(),
        });
        addLog({ id: crypto.randomUUID(), agentId: 'ceo', action: `delegated task to ${target?.name}`, detail: userMsg.slice(0, 100), timestamp: new Date().toISOString() });
        updateAgent(delegatedTo!, { status: 'working', lastActive: new Date().toISOString() });

        setTimeout(() => {
          addMessage({
            id: crypto.randomUUID(), agentId: agent.id, role: 'agent',
            content: `I've analysed your request and delegated it to **${target?.avatar} ${target?.name}** (${target?.role}).\n\n**Task:** ${userMsg.slice(0, 100)}\n**Status:** In progress\n**Priority:** Medium\n\n${target?.name} is now working on this. You can chat with them directly at /chat/${delegatedTo} or I'll report back when it's done.\n\nAnything else you need me to coordinate?`,
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
          updateAgent(agent.id, { status: 'active', tasksCompleted: agent.tasksCompleted + 1 });
        }, 1500);
      } else {
        // Generic CEO response
        setTimeout(() => {
          addMessage({
            id: crypto.randomUUID(), agentId: agent.id, role: 'agent',
            content: `I can help coordinate that. Let me think about which team member is best suited.\n\nMy available agents:\n${agents.filter(a => a.id !== 'ceo').map(a => `${a.avatar} **${a.name}** — ${a.role}`).join('\n')}\n\nCould you be more specific about what you need? I'll route it to the right specialist.`,
            timestamp: new Date().toISOString(),
          });
          setLoading(false);
          updateAgent(agent.id, { status: 'active' });
        }, 1000);
      }
    } else {
      // Non-CEO agent — simulate AI response
      if (config.openaiKey) {
        try {
          const history = chatMessages.slice(-10).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
          const resp = await fetch('/api/ai', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'openai', apiKey: config.openaiKey, model: agent.model || 'gpt-4o-mini', systemPrompt: agent.systemPrompt, messages: [...history, { role: 'user', content: userMsg }] }),
          });
          const data = await resp.json();
          addMessage({ id: crypto.randomUUID(), agentId: agent.id, role: 'agent', content: data.content || 'I encountered an issue processing that request.', timestamp: new Date().toISOString() });
          addLog({ id: crypto.randomUUID(), agentId: agent.id, action: 'responded to query', detail: userMsg.slice(0, 60), timestamp: new Date().toISOString() });
        } catch {
          addMessage({ id: crypto.randomUUID(), agentId: agent.id, role: 'agent', content: `I'd love to help with that. To enable live AI responses, add your OpenAI API key in Settings.\n\nIn the meantime, here's what I would do:\n\n1. Analyse the request in context of my role as ${agent.role}\n2. Research relevant approaches\n3. Execute and report back\n\nThe task has been logged and I'll get to it once AI is connected.`, timestamp: new Date().toISOString() });
        }
      } else {
        setTimeout(() => {
          addMessage({ id: crypto.randomUUID(), agentId: agent.id, role: 'agent', content: `Got it — "${userMsg.slice(0, 60)}"\n\nAs **${agent.name}** (${agent.role}), here's my approach:\n\n${agent.capabilities.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nTo enable full AI responses, add your OpenAI key in **Settings**. I'll then give you real, contextual answers using my specialised system prompt.`, timestamp: new Date().toISOString() });
          addLog({ id: crypto.randomUUID(), agentId: agent.id, action: 'responded (offline mode)', detail: userMsg.slice(0, 60), timestamp: new Date().toISOString() });
          setLoading(false);
          updateAgent(agent.id, { status: 'active', tasksCompleted: agent.tasksCompleted + 1 });
        }, 1000);
        return;
      }
      setLoading(false);
      updateAgent(agent.id, { status: 'active', tasksCompleted: agent.tasksCompleted + 1 });
    }
  };

  const suggestions = isCEO
    ? ['Write a marketing plan for my SaaS product', 'Research my top 5 competitors', 'Create a sales outreach sequence', 'Draft a contract for a new client']
    : [`Help me with ${agent.capabilities[0]?.toLowerCase()}`, `What's your approach to ${agent.capabilities[1]?.toLowerCase()}?`];

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>
          {agent.avatar}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{agent.name}</h1>
          <p className="text-xs" style={{ color: agent.color }}>{agent.role} · {agent.capabilities.length} capabilities</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs" style={{
          background: agent.status === 'working' ? 'rgba(255,167,38,0.1)' : agent.status === 'active' ? 'rgba(0,210,160,0.1)' : 'var(--surface-2)',
          color: agent.status === 'working' ? '#FFA726' : agent.status === 'active' ? '#00D2A0' : 'var(--text-3)',
        }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'currentColor' }} />
          {agent.status}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">{agent.avatar}</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Chat with {agent.name}</h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-2)' }}>{agent.description}</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); }} className="px-3 py-1.5 rounded-lg text-xs transition hover:bg-white/5" style={{ border: '1px solid var(--border)', color: 'var(--text-2)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {chatMessages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
            <div className="max-w-[75%] rounded-xl px-4 py-3 text-sm" style={{
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-2)',
              color: m.role === 'user' ? '#fff' : 'var(--text)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border)',
            }}>
              {m.role === 'agent' && <span className="text-xs block mb-1" style={{ color: agent.color }}>{agent.avatar} {agent.name}</span>}
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
              <p className="text-xs mt-1.5" style={{ opacity: 0.4 }}>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex">
            <div className="rounded-xl px-4 py-3" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <span className="text-xs flex items-center gap-2" style={{ color: agent.color }}>
                <Loader2 size={12} className="animate-spin" /> {agent.name} is {isCEO ? 'coordinating' : 'thinking'}...
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-3 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder={`Message ${agent.name}...`} className="flex-1 rounded-lg px-4 py-3 text-sm border outline-none" style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} autoFocus />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4 py-3 rounded-lg transition disabled:opacity-30" style={{ background: 'var(--accent)', color: '#fff' }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
