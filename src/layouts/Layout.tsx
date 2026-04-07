import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Bot, MessageSquare, ListTodo, Activity, PlusCircle, Settings, Cpu } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const NAV = [
  { to: '/', icon: Home, label: 'Dashboard', end: true },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/chat/ceo', icon: MessageSquare, label: 'CEO Chat' },
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/create', icon: PlusCircle, label: 'Create Agent' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const loc = useLocation();
  const agents = useAppStore(s => s.agents);
  const activeCount = agents.filter(a => a.status === 'active' || a.status === 'working').length;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col z-50" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div className="p-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Cpu size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Agent OS</span>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>{activeCount} active</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const isChat = item.to.startsWith('/chat/');
            const active = item.end ? loc.pathname === item.to : isChat ? loc.pathname.startsWith('/chat') : loc.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{
                background: active ? 'var(--glow)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-2)',
              }}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs font-medium px-3 mb-2" style={{ color: 'var(--text-3)' }}>AGENTS</p>
            {agents.slice(0, 8).map(agent => (
              <NavLink key={agent.id} to={`/chat/${agent.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all" style={{
                color: loc.pathname === `/chat/${agent.id}` ? agent.color : 'var(--text-2)',
                background: loc.pathname === `/chat/${agent.id}` ? `${agent.color}12` : 'transparent',
              }}>
                <span>{agent.avatar}</span>
                <span className="truncate">{agent.name}</span>
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{
                  background: agent.status === 'active' ? '#00D2A0' : agent.status === 'working' ? '#FFA726' : 'var(--text-3)',
                }} />
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      <main className="ml-[220px] flex-1 p-8">
        <div className="max-w-[1100px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
