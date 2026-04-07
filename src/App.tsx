import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import AgentChat from './pages/AgentChat';
import Tasks from './pages/Tasks';
import Activity from './pages/Activity';
import CreateAgent from './pages/CreateAgent';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/chat/:agentId" element={<AgentChat />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/create" element={<CreateAgent />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
