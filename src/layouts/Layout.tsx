import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { LayoutDashboard, Bot, MessageSquare, ListTodo, Activity, PlusCircle, Settings, Sparkles, Crown } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Command Centre', end: true },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/chat/ceo', icon: Crown, label: 'Atlas (CEO)', accent: true },
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/create', icon: PlusCircle, label: 'Create Agent' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const nav = useNavigate();
  const { agents } = useAppStore();
  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'working').slice(0, 8);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-2)' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] bg-white border-r flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b cursor-pointer" style={{ borderColor: 'var(--border)' }} onClick={() => nav('/')}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Agent OS</span>
        </div>

        <nav className="flex-1 py-2 px-2 space-y-0.5">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[var(--bg-2)]' : 'hover:bg-[var(--bg-2)]'}`
            } style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : n.accent ? 'var(--accent)' : 'var(--text-2)' })}>
              <n.icon size={15} /> {n.label}
            </NavLink>
          ))}

          {/* Agent list */}
          <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="text-[10px] font-semibold tracking-widest uppercase px-3 mb-2" style={{ color: 'var(--text-3)' }}>Agents</p>
            {activeAgents.map(a => (
              <NavLink key={a.id} to={`/chat/${a.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--bg-2)] transition-colors" style={{ color: 'var(--text-2)' }}>
                <span>{a.avatar}</span>
                <span className="flex-1 truncate">{a.name}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.status === 'active' ? '#00d4aa' : a.status === 'working' ? '#FFA726' : 'var(--border)' }} />
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Sparkles size={11} className="text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>Agent OS</span>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex items-center justify-around py-2" style={{ borderColor: 'var(--border)' }}>
        {[NAV[0], NAV[1], NAV[2], NAV[3], NAV[5]].map(n => (
          <NavLink key={n.to} to={n.to} end={n.end} className="flex flex-col items-center gap-0.5 px-2 py-1" style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--text-3)' })}>
            <n.icon size={18} />
            <span className="text-[10px]">{n.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-[1100px] mx-auto p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
