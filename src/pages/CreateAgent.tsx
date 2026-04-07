import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { Sparkles, Loader2, Check, ArrowRight, Bot, Wand2 } from 'lucide-react';

const AVATAR_OPTIONS = ['🤖', '🧠', '⚡', '🔮', '🎭', '🦾', '🪄', '💎', '🌟', '🎪', '🔧', '📡', '🛸', '🧬', '🎯', '🏗'];
const COLOR_OPTIONS = ['#6C5CE7', '#17b169', '#FF6B6B', '#FFA726', '#2196F3', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#795548', '#607D8B'];

export default function CreateAgent() {
  const nav = useNavigate();
  const { addAgent, config } = useAppStore();
  const [mode, setMode] = useState<'prompt' | 'manual'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    name: '', role: '', description: '', avatar: '🤖', color: '#6C5CE7',
    capabilities: '', systemPrompt: '', model: 'gpt-4o',
  });

  const generateFromPrompt = () => {
    if (!prompt.trim()) return;
    setGenerating(true);

    // Parse the prompt to generate agent config
    setTimeout(() => {
      const lowerPrompt = prompt.toLowerCase();
      let name = 'Custom Agent';
      let role = 'Custom Agent';
      let description = prompt;
      let avatar = '🤖';
      let color = '#6C5CE7';
      let capabilities: string[] = [];
      let systemPrompt = `You are a specialised AI agent. Your purpose: ${prompt}. Be thorough, precise, and proactive.`;

      // Smart prompt parsing
      if (lowerPrompt.includes('social media') || lowerPrompt.includes('instagram') || lowerPrompt.includes('tiktok')) {
        name = 'Viral'; role = 'Social Media Agent'; avatar = '📱'; color = '#E91E63';
        capabilities = ['Social strategy', 'Content creation', 'Hashtag research', 'Engagement tracking', 'Trend spotting'];
      } else if (lowerPrompt.includes('email') || lowerPrompt.includes('newsletter')) {
        name = 'Inbox'; role = 'Email Agent'; avatar = '📧'; color = '#2196F3';
        capabilities = ['Email copywriting', 'A/B testing', 'Automation flows', 'List segmentation', 'Deliverability'];
      } else if (lowerPrompt.includes('design') || lowerPrompt.includes('ui') || lowerPrompt.includes('ux')) {
        name = 'Pixel'; role = 'Design Agent'; avatar = '🎨'; color = '#E91E63';
        capabilities = ['UI/UX design', 'Brand identity', 'Wireframing', 'Design systems', 'Prototyping'];
      } else if (lowerPrompt.includes('code') || lowerPrompt.includes('develop') || lowerPrompt.includes('engineer')) {
        name = 'Dev'; role = 'Engineering Agent'; avatar = '⚡'; color = '#FF9800';
        capabilities = ['Code generation', 'Debugging', 'Code review', 'Architecture', 'Testing', 'Documentation'];
      } else if (lowerPrompt.includes('customer') || lowerPrompt.includes('success')) {
        name = 'Care'; role = 'Customer Success Agent'; avatar = '🤝'; color = '#4CAF50';
        capabilities = ['Onboarding', 'Health scores', 'Churn prevention', 'Upselling', 'Feedback collection'];
      } else if (lowerPrompt.includes('data') || lowerPrompt.includes('scrape') || lowerPrompt.includes('collect')) {
        name = 'Crawler'; role = 'Data Collection Agent'; avatar = '🕷'; color = '#795548';
        capabilities = ['Web scraping', 'Data cleaning', 'API integration', 'Data enrichment', 'Monitoring'];
      } else if (lowerPrompt.includes('write') || lowerPrompt.includes('blog') || lowerPrompt.includes('copy')) {
        name = 'Scribe'; role = 'Copywriting Agent'; avatar = '✍️'; color = '#9C27B0';
        capabilities = ['Blog writing', 'Ad copy', 'Landing pages', 'Email sequences', 'SEO content'];
      } else if (lowerPrompt.includes('automat') || lowerPrompt.includes('workflow') || lowerPrompt.includes('zapier')) {
        name = 'Flow'; role = 'Automation Agent'; avatar = '🔄'; color = '#00BCD4';
        capabilities = ['Workflow design', 'API connections', 'Trigger management', 'Error handling', 'Monitoring'];
      } else {
        // Generic parsing — extract key words
        const words = prompt.split(' ').filter(w => w.length > 3);
        name = words[0]?.charAt(0).toUpperCase() + words[0]?.slice(1).toLowerCase() || 'Custom';
        role = `${prompt.slice(0, 40)} Agent`;
        capabilities = ['Task execution', 'Research', 'Analysis', 'Reporting', 'Recommendations'];
      }

      setForm({ name, role, description, avatar, color, capabilities: capabilities.join(', '), systemPrompt, model: 'gpt-4o' });
      setMode('manual');
      setGenerating(false);
    }, 1500);
  };

  const createAgent = () => {
    if (!form.name || !form.role) return;
    const id = `custom-${Date.now()}`;
    addAgent({
      id, name: form.name, role: form.role, description: form.description || form.role,
      category: 'custom', status: 'active', avatar: form.avatar, color: form.color,
      capabilities: form.capabilities.split(',').map(c => c.trim()).filter(Boolean),
      systemPrompt: form.systemPrompt || `You are ${form.name}, a specialised ${form.role}. Be helpful, precise, and proactive.`,
      model: form.model, tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: false, createdAt: new Date().toISOString(),
    });
    nav(`/chat/${id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Agent</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Build a new AI agent from a prompt or configure manually</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('prompt')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: mode === 'prompt' ? 'var(--accent)' : 'var(--bg)', color: mode === 'prompt' ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <Wand2 size={14} /> From Prompt
        </button>
        <button onClick={() => setMode('manual')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: mode === 'manual' ? 'var(--accent)' : 'var(--bg)', color: mode === 'manual' ? '#fff' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <Bot size={14} /> Manual Config
        </button>
      </div>

      <div className="max-w-2xl">
        {mode === 'prompt' && (
          <div className="rounded-xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Describe your agent</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Tell me what you need and I'll create a specialised agent for you.</p>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. I need an agent that manages my TikTok and Instagram content, creates viral posts, tracks trends, and schedules posts at optimal times..." rows={4} className="w-full rounded-lg px-4 py-3 text-sm border resize-none mb-4 outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <button onClick={generateFromPrompt} disabled={generating || !prompt.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-40 transition hover:scale-[1.02]" style={{ background: 'var(--accent)', color: '#fff' }}>
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {generating ? 'Generating...' : 'Generate Agent'}
            </button>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>Quick templates:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Social media manager for TikTok and Instagram',
                  'Code reviewer and debugging assistant',
                  'Email marketing automation specialist',
                  'Customer success and onboarding manager',
                  'Web scraping and data collection agent',
                  'SEO content writer and strategist',
                ].map(t => (
                  <button key={t} onClick={() => setPrompt(t)} className="text-xs px-3 py-1.5 rounded-lg transition hover:bg-white/5" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-4">
            <div className="rounded-xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Agent Identity</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Viral" className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Role</label>
                    <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Social Media Agent" className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full rounded-lg px-3 py-2 text-sm border resize-none outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>Avatar</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {AVATAR_OPTIONS.map(a => (
                      <button key={a} onClick={() => setForm(f => ({ ...f, avatar: a }))} className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition" style={{ background: form.avatar === a ? 'var(--accent)' : 'var(--bg-alt)', border: form.avatar === a ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>Colour</label>
                  <div className="flex gap-1.5">
                    {COLOR_OPTIONS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} className="w-7 h-7 rounded-full border-2 transition" style={{ background: c, borderColor: form.color === c ? '#fff' : 'transparent' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Capabilities & Prompt</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Capabilities (comma-separated)</label>
                  <input value={form.capabilities} onChange={e => setForm(f => ({ ...f, capabilities: e.target.value }))} placeholder="e.g. Content creation, Trend analysis, Scheduling" className="w-full rounded-lg px-3 py-2 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>System Prompt</label>
                  <textarea value={form.systemPrompt} onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))} rows={4} placeholder="Define the agent's personality, expertise, and behaviour..." className="w-full rounded-lg px-3 py-2 text-sm border resize-none outline-none mono" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)', fontSize: '12px' }} />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-tertiary)' }}>AI Model</label>
                  <select value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} className="rounded-lg px-3 py-2 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="claude-sonnet-4-20250514">Claude Sonnet</option>
                    <option value="claude-opus-4-20250514">Claude Opus</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: `${form.color}08`, border: `1px solid ${form.color}20` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${form.color}15` }}>{form.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{form.name || 'Agent Name'}</p>
                <p className="text-xs" style={{ color: form.color }}>{form.role || 'Agent Role'}</p>
              </div>
              <button onClick={createAgent} disabled={!form.name || !form.role} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-30 transition hover:scale-[1.02]" style={{ background: 'var(--accent)', color: '#fff' }}>
                <Check size={14} /> Create Agent
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
