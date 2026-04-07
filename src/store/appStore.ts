import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AgentStatus = 'active' | 'idle' | 'working' | 'error' | 'disabled';
export type AgentCategory = 'executive' | 'marketing' | 'sales' | 'finance' | 'hr' | 'operations' | 'support' | 'research' | 'analytics' | 'legal' | 'product' | 'content' | 'custom';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed';
export type MessageRole = 'user' | 'agent' | 'system';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  category: AgentCategory;
  status: AgentStatus;
  avatar: string;
  color: string;
  capabilities: string[];
  systemPrompt: string;
  model: string;
  tasksCompleted: number;
  lastActive: string;
  isBuiltIn: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  completedAt?: string;
  output?: string;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface AgentLog {
  id: string;
  agentId: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface AppConfig {
  openaiKey: string;
  anthropicKey: string;
  defaultModel: string;
  ceoAutoDelegate: boolean;
  notificationsEnabled: boolean;
}

const BUILT_IN_AGENTS: Agent[] = [
  {
    id: 'ceo', name: 'Atlas', role: 'CEO Agent', description: 'Chief orchestrator. Delegates tasks to specialist agents, monitors performance, provides strategic oversight, and ensures all agents work in harmony.',
    category: 'executive', status: 'active', avatar: '👑', color: '#FFD700',
    capabilities: ['Task delegation', 'Agent coordination', 'Strategic planning', 'Performance monitoring', 'Priority management', 'Cross-agent workflows'],
    systemPrompt: 'You are Atlas, the CEO Agent. You orchestrate all other agents, delegate tasks to the right specialist, monitor progress, and ensure quality. Think strategically. Be decisive. Coordinate across teams.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'marketing', name: 'Mira', role: 'Marketing Agent', description: 'Manages SEO, social media, content strategy, brand positioning, ad campaigns, and analytics. Creates and publishes content autonomously.',
    category: 'marketing', status: 'idle', avatar: '📣', color: '#E91E63',
    capabilities: ['SEO optimization', 'Social media management', 'Content creation', 'Ad campaign management', 'Brand strategy', 'Analytics reporting'],
    systemPrompt: 'You are Mira, a senior marketing strategist. You handle all marketing tasks: SEO, content, social media, advertising, and analytics. Be creative but data-driven.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'sales', name: 'Hunter', role: 'Sales Agent', description: 'Handles lead generation, qualification, outreach sequences, CRM management, proposals, and sales forecasting.',
    category: 'sales', status: 'idle', avatar: '🎯', color: '#2196F3',
    capabilities: ['Lead generation', 'Cold outreach', 'Lead qualification', 'CRM updates', 'Proposal creation', 'Sales forecasting', 'Follow-up sequences'],
    systemPrompt: 'You are Hunter, a top-performing sales agent. You generate leads, qualify prospects, write outreach emails, create proposals, and close deals. Be persuasive but professional.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'finance', name: 'Ledger', role: 'Finance Agent', description: 'Manages invoicing, expense tracking, financial reporting, budgeting, cash flow analysis, and tax preparation.',
    category: 'finance', status: 'idle', avatar: '💰', color: '#4CAF50',
    capabilities: ['Invoice management', 'Expense tracking', 'Financial reports', 'Budget planning', 'Cash flow analysis', 'Tax preparation', 'Revenue forecasting'],
    systemPrompt: 'You are Ledger, a CFO-level financial agent. You handle all financial tasks: invoicing, expenses, reporting, budgeting, and forecasting. Be precise and analytical.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'hr', name: 'Nova', role: 'HR Agent', description: 'Handles recruitment, onboarding, employee support, performance reviews, training programs, and engagement.',
    category: 'hr', status: 'idle', avatar: '👥', color: '#9C27B0',
    capabilities: ['Resume screening', 'Interview scheduling', 'Onboarding flows', 'Performance reviews', 'Employee support', 'Training plans', 'Engagement surveys'],
    systemPrompt: 'You are Nova, an empathetic and efficient HR director. You manage recruitment, onboarding, employee relations, and development. Be warm but professional.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'operations', name: 'Ops', role: 'Operations Agent', description: 'Automates workflows, manages scheduling, coordinates logistics, monitors processes, and optimizes efficiency.',
    category: 'operations', status: 'idle', avatar: '⚙️', color: '#FF9800',
    capabilities: ['Workflow automation', 'Scheduling', 'Process optimization', 'Inventory management', 'Quality control', 'Resource allocation'],
    systemPrompt: 'You are Ops, a systems-thinking operations manager. You automate workflows, optimize processes, and ensure everything runs smoothly. Think efficiency first.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'support', name: 'Echo', role: 'Support Agent', description: 'Handles customer service, ticket routing, FAQ responses, issue resolution, and satisfaction monitoring.',
    category: 'support', status: 'idle', avatar: '🎧', color: '#00BCD4',
    capabilities: ['Customer support', 'Ticket management', 'FAQ responses', 'Issue escalation', 'Satisfaction tracking', 'Knowledge base management'],
    systemPrompt: 'You are Echo, a world-class customer support agent. You resolve issues quickly, communicate clearly, and ensure customer satisfaction. Be empathetic and efficient.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'research', name: 'Scout', role: 'Research Agent', description: 'Conducts market research, competitive analysis, trend identification, data collection, and industry reports.',
    category: 'research', status: 'idle', avatar: '🔬', color: '#795548',
    capabilities: ['Market research', 'Competitive analysis', 'Trend identification', 'Data collection', 'Industry reports', 'Sentiment analysis'],
    systemPrompt: 'You are Scout, a meticulous research analyst. You gather data, analyze markets, track competitors, and surface actionable insights. Be thorough and evidence-based.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'analytics', name: 'Prism', role: 'Analytics Agent', description: 'Creates dashboards, runs queries, identifies patterns, generates reports, and provides data-driven recommendations.',
    category: 'analytics', status: 'idle', avatar: '📊', color: '#3F51B5',
    capabilities: ['Dashboard creation', 'Data analysis', 'Pattern recognition', 'Report generation', 'Predictive modelling', 'Anomaly detection'],
    systemPrompt: 'You are Prism, a data scientist and BI analyst. You turn raw data into actionable insights, build dashboards, and predict trends. Let data guide every recommendation.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'legal', name: 'Clause', role: 'Legal Agent', description: 'Reviews contracts, ensures compliance, handles legal research, manages NDAs, and provides regulatory guidance.',
    category: 'legal', status: 'idle', avatar: '⚖️', color: '#607D8B',
    capabilities: ['Contract review', 'Compliance checking', 'Legal research', 'NDA management', 'Regulatory guidance', 'Risk assessment'],
    systemPrompt: 'You are Clause, a detail-oriented legal counsel. You review contracts, ensure compliance, and mitigate legal risk. Always caveat advice appropriately and recommend professional consultation for complex matters.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'product', name: 'Forge', role: 'Product Agent', description: 'Manages product roadmaps, feature prioritisation, user feedback analysis, sprint planning, and technical specs.',
    category: 'product', status: 'idle', avatar: '🛠', color: '#FF5722',
    capabilities: ['Roadmap planning', 'Feature prioritisation', 'User feedback analysis', 'Sprint planning', 'Technical specs', 'Competitive product analysis'],
    systemPrompt: 'You are Forge, a product manager who thinks in user outcomes. You prioritize ruthlessly, write clear specs, and balance user needs with business goals.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'content', name: 'Quill', role: 'Content Agent', description: 'Writes blog posts, emails, landing pages, ad copy, social captions, whitepapers, and presentation decks.',
    category: 'content', status: 'idle', avatar: '✍️', color: '#8BC34A',
    capabilities: ['Blog writing', 'Email copywriting', 'Landing page copy', 'Ad creative', 'Social media captions', 'Whitepapers', 'Presentations'],
    systemPrompt: 'You are Quill, a versatile content writer who adapts tone and style to any brand. You write compelling, clear, conversion-focused copy. No fluff.',
    model: 'gpt-4o', tasksCompleted: 0, lastActive: new Date().toISOString(), isBuiltIn: true, createdAt: new Date().toISOString(),
  },
];

interface AppState {
  agents: Agent[];
  tasks: Task[];
  messages: ChatMessage[];
  logs: AgentLog[];
  config: AppConfig;
  activeAgentId: string | null;
  addAgent: (a: Agent) => void;
  updateAgent: (id: string, data: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  addTask: (t: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  addMessage: (m: ChatMessage) => void;
  addLog: (l: AgentLog) => void;
  setActiveAgent: (id: string | null) => void;
  updateConfig: (data: Partial<AppConfig>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      agents: BUILT_IN_AGENTS,
      tasks: [],
      messages: [],
      logs: [],
      config: { openaiKey: '', anthropicKey: '', defaultModel: 'gpt-4o', ceoAutoDelegate: true, notificationsEnabled: true },
      activeAgentId: null,
      addAgent: (a) => set(s => ({ agents: [...s.agents, a] })),
      updateAgent: (id, data) => set(s => ({ agents: s.agents.map(a => a.id === id ? { ...a, ...data } : a) })),
      removeAgent: (id) => set(s => ({ agents: s.agents.filter(a => a.id !== id) })),
      addTask: (t) => set(s => ({ tasks: [t, ...s.tasks] })),
      updateTask: (id, data) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t) })),
      addMessage: (m) => set(s => ({ messages: [...s.messages, m] })),
      addLog: (l) => set(s => ({ logs: [l, ...s.logs] })),
      setActiveAgent: (id) => set({ activeAgentId: id }),
      updateConfig: (data) => set(s => ({ config: { ...s.config, ...data } })),
    }),
    { name: 'agent-os-store' }
  )
);
