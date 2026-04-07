import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Key, Bot, Bell, Cpu, Check } from 'lucide-react';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl p-6 ${className}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>{children}</div>;
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="w-10 h-6 rounded-full transition" style={{ background: value ? 'var(--accent)' : 'var(--surface-3)' }}>
      <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: value ? 'translateX(18px)' : 'translateX(2px)', marginTop: 2 }} />
    </button>
  );
}

export default function Settings() {
  const { config, updateConfig, agents } = useAppStore();
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Configure Agent OS and API connections</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Key size={16} style={{ color: 'var(--accent)' }} /> API Keys
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-3)' }}>OpenAI API Key</label>
              <input value={config.openaiKey} onChange={e => updateConfig({ openaiKey: e.target.value })} type="password" placeholder="sk-..." className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>Powers all agent AI responses (GPT-4o, GPT-4o-mini)</p>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-3)' }}>Anthropic API Key (optional)</label>
              <input value={config.anthropicKey} onChange={e => updateConfig({ anthropicKey: e.target.value })} type="password" placeholder="sk-ant-..." className="w-full rounded-lg px-3 py-2.5 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
              <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>For agents configured to use Claude models</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Bot size={16} style={{ color: '#00D2A0' }} /> CEO Agent Behaviour
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text)' }}>Auto-delegate tasks</p>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>Let Atlas automatically route tasks to the right agent based on context</p>
              </div>
              <Toggle value={config.ceoAutoDelegate} onChange={() => updateConfig({ ceoAutoDelegate: !config.ceoAutoDelegate })} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-3)' }}>Default AI Model</label>
              <select value={config.defaultModel} onChange={e => updateConfig({ defaultModel: e.target.value })} className="rounded-lg px-3 py-2 text-sm border outline-none" style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini (faster, cheaper)</option>
                <option value="claude-sonnet-4-20250514">Claude Sonnet</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Cpu size={16} style={{ color: '#FFA726' }} /> System Info
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Total Agents', value: agents.length.toString() },
              { label: 'Built-in Agents', value: agents.filter(a => a.isBuiltIn).length.toString() },
              { label: 'Custom Agents', value: agents.filter(a => !a.isBuiltIn).length.toString() },
              { label: 'Storage', value: 'localStorage (Zustand persist)' },
              { label: 'Version', value: '1.0.0' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>{item.label}</span>
                <span className="text-xs font-medium mono" style={{ color: 'var(--text)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <button onClick={save} className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition hover:scale-[1.02]" style={{ background: saved ? '#00D2A0' : 'var(--accent)', color: '#fff' }}>
          {saved ? <><Check size={14} /> Saved!</> : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
