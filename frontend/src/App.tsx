/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Acolhido, MedicationLog, Medication } from './types';
import { MOCK_ACOLHIDOS } from './mockData';
import Dashboard from './components/Dashboard';
import ResidentList from './components/ResidentList';
import ResidentForm from './components/ResidentForm';
import ResidentProfile from './components/ResidentProfile';
import MedicationControl from './components/MedicationControl';
import GeneralReport from './components/GeneralReport';
import { 
  HeartHandshake, 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  Pill, 
  Calendar, 
  AlertCircle,
  FolderHeart,
  Clock,
  FileSpreadsheet,
  LogOut,
  ShieldCheck,
  UserRound,
  KeyRound
} from 'lucide-react';

export default function App() {
  // 1. MASTER STATE WITH LOCAL STORAGE PERSISTENCE
  const [acolhidos, setAcolhidos] = useState<Acolhido[]>(() => {
    const saved = localStorage.getItem('crm_acolhidos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar acolhidos do localStorage", e);
      }
    }
    return MOCK_ACOLHIDOS;
  });

  // Use real system time; remove simulated time state

  // Base list of logs for medications
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(() => {
    const saved = localStorage.getItem('crm_medication_logs');
    if (saved) {
      try {
        const parsed: MedicationLog[] = JSON.parse(saved);
        // Migrate older logs that used medicationId = med.id to include resident prefix
        const migrated = parsed.map(log => {
          if (!log.medicationId.startsWith('rec-')) {
            // Attempt to find the resident that has this medication id
            for (const r of MOCK_ACOLHIDOS) {
              if (r.medicacoes?.some(m => m.id === log.medicationId)) {
                return { ...log, medicationId: `${r.id}-${log.medicationId}` };
              }
            }
          }
          return log;
        });
        return migrated;
      } catch (e) {
        console.error("Erro ao carregar logs de medicação", e);
      }
    }

    // Generate initial logs for today based on MOCK_ACOLHIDOS
    const logs: MedicationLog[] = [];
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = today.getFullYear();
    const mm = pad(today.getMonth() + 1);
    const dd = pad(today.getDate());
    MOCK_ACOLHIDOS.forEach(acolhido => {
      if (acolhido.status === 'Ativo' && acolhido.medicacoes) {
        acolhido.medicacoes.forEach(med => {
          if (med.ativo) {
            med.horarios.forEach(hr => {
              logs.push({
                id: `${acolhido.id}-${med.id}-log-${hr}-${dd}`,
                medicationId: `${acolhido.id}-${med.id}`,
                medicationNome: med.nome,
                dosagem: med.dosagem,
                horarioPrevisto: `${yyyy}-${mm}-${dd}T${hr}:00`,
                status: 'Pendente',
                alertasAtivos: med.alertasAtivos
              });
            });
          }
        });
      }
    });
    return logs;
  });

  // Navigation and active UI tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'acolhidos' | 'cadastro' | 'prescricoes' | 'perfil' | 'relatorios'>('dashboard');
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [residentToEdit, setResidentToEdit] = useState<Acolhido | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('crm_auth_token'));
  });
  const [authUser, setAuthUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recovery' | 'reset'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState({
    identifier: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    recoveryToken: '',
  });

  const handleAuthFieldChange = (field: keyof typeof authForm, value: string) => {
    setAuthForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: authForm.identifier, password: authForm.password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível entrar no sistema.');
      }

      localStorage.setItem('crm_auth_token', data.token);
      setAuthUser(data.user);
      setIsAuthenticated(true);
      setAuthForm({ identifier: '', username: '', email: '', password: '', confirmPassword: '', recoveryToken: '' });
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Falha ao entrar no sistema.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    if (authForm.password !== authForm.confirmPassword) {
      setAuthMessage('As senhas não conferem.');
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authForm.username,
          email: authForm.email,
          password: authForm.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível criar o usuário.');
      }

      localStorage.setItem('crm_auth_token', data.token);
      setAuthUser(data.user);
      setIsAuthenticated(true);
      setAuthForm({ identifier: '', username: '', email: '', password: '', confirmPassword: '', recoveryToken: '' });
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Falha ao cadastrar usuário.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível iniciar a recuperação.');
      }

      setAuthMessage(data.message || 'Instruções de recuperação enviadas.');
      setAuthMode('reset');
      setAuthForm(prev => ({ ...prev, recoveryToken: data.resetToken || '' }));
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Erro ao recuperar a senha.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    if (authForm.password !== authForm.confirmPassword) {
      setAuthMessage('As senhas não conferem.');
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authForm.recoveryToken, newPassword: authForm.password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível redefinir a senha.');
      }

      setAuthMode('login');
      setAuthMessage(data.message || 'Senha alterada com sucesso.');
      setAuthForm({ identifier: '', username: '', email: '', password: '', confirmPassword: '', recoveryToken: '' });
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Erro ao redefinir a senha.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_auth_token');
    setIsAuthenticated(false);
    setAuthUser(null);
    setAuthMode('login');
    setAuthMessage(null);
    setAuthForm({ identifier: '', username: '', email: '', password: '', confirmPassword: '', recoveryToken: '' });
  };

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('crm_auth_token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Sessão inválida');
        }

        const data = await response.json().catch(() => ({}));
        setAuthUser(data.user || null);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('crm_auth_token');
        setAuthUser(null);
        setIsAuthenticated(false);
      }
    };

    verifySession();
  }, []);

  // Sync state to local storage whenever they update
  useEffect(() => {
    localStorage.setItem('crm_acolhidos', JSON.stringify(acolhidos));
  }, [acolhidos]);

  useEffect(() => {
    localStorage.setItem('crm_medication_logs', JSON.stringify(medicationLogs));
  }, [medicationLogs]);

  

  // 3. MEDICATION DISPENSATION ACTION
  const handleAdministerMedication = (logId: string) => {
    setMedicationLogs(prev => prev.map(log => {
      if (log.id === logId) {
        return { ...log, status: 'Administrado' as const };
      }
      return log;
    }));
  };

  // 4. TOGGLE INDIVIDUAL MEDICATION ALARM BELLS
  const handleToggleAlerts = (medId: string) => {
    // 1. Update in master resident prescriptions list
    setAcolhidos(prev => prev.map(res => {
      if (res.medicacoes) {
        const updatedMeds = res.medicacoes.map(m => {
          if (m.id === medId) {
            return { ...m, alertasAtivos: !m.alertasAtivos };
          }
          return m;
        });
        return { ...res, medicacoes: updatedMeds };
      }
      return res;
    }));

    // 2. Update active dose logs alert parameter
    setMedicationLogs(prev => prev.map(log => {
      if (log.medicationId === medId) {
        return { ...log, alertasAtivos: !log.alertasAtivos };
      }
      return log;
    }));
  };

  // 5. RESIDENT CRUD OPERATIONAL STATE
  const handleSaveResident = (formData: Acolhido) => {
    const exists = acolhidos.some(a => a.id === formData.id);
    if (exists) {
      setAcolhidos(prev => prev.map(a => a.id === formData.id ? formData : a));
    } else {
      setAcolhidos(prev => [...prev, formData]);
    }
    // Return to main list
    setActiveTab('acolhidos');
    setResidentToEdit(null);
  };

  const handleEditResident = (resident: Acolhido) => {
    setResidentToEdit(resident);
    setActiveTab('cadastro');
  };

  const handleDeleteResident = (id: string) => {
    if (window.confirm("Atenção: Tem certeza de que deseja remover permanentemente este registro de acolhido?")) {
      setAcolhidos(prev => prev.filter(a => a.id !== id));
      setMedicationLogs(prev => prev.filter(log => !log.medicationId.startsWith(id)));
      if (selectedResidentId === id) {
        setSelectedResidentId(null);
        setActiveTab('acolhidos');
      }
    }
  };

  const handleUpdateResidentDirectly = (updated: Acolhido) => {
    setAcolhidos(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  // Select a resident for detailed profile viewing
  const handleViewProfile = (id: string) => {
    setSelectedResidentId(id);
    setActiveTab('perfil');
  };

  // Add a family communication record for a resident
  const handleAddFamilyCommunication = (residentId: string, comm: Omit<import('./types').FamilyCommunication, 'id'>) => {
    const entry = { ...comm, id: `com-${Date.now()}` };
    setAcolhidos(prev => prev.map(a => a.id === residentId ? { ...a, comunicacoesFamilia: [...(a.comunicacoesFamilia || []), entry] } : a));
  };

  const currentProfileResident = useMemo(() => {
    return acolhidos.find(a => a.id === selectedResidentId) || null;
  }, [acolhidos, selectedResidentId]);

  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // Compute live active alert flags
  const activeAlertsCount = useMemo(() => {
    const nowDate = now;
    return medicationLogs.filter(log => {
      if (log.status !== 'Pendente' || !log.alertasAtivos) return false;
      const scheduled = new Date(log.horarioPrevisto);
      return nowDate.getTime() > scheduled.getTime(); // Overdue & enabled
    }).length;
  }, [medicationLogs, now]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.22),_transparent_55%),linear-gradient(135deg,_#06070a_0%,_#0f1116_60%,_#0a0b0e_100%)] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F1116]/95 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Acesso seguro</h1>
              <p className="text-sm text-slate-400">Cadastre-se, entre e recupere a senha com proteção de backend.</p>
            </div>
          </div>

          <div className="mt-6 flex rounded-xl border border-white/10 bg-slate-950/70 p-1">
            {(['login', 'register', 'recovery'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setAuthMode(mode);
                  setAuthMessage(null);
                }}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  authMode === mode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Cadastro' : 'Recuperar'}
              </button>
            ))}
          </div>

          {authMode === 'login' && (
            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <UserRound className="h-4 w-4" />
                  Usuário ou e-mail
                </span>
                <input
                  type="text"
                  value={authForm.identifier}
                  onChange={(event) => handleAuthFieldChange('identifier', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Digite seu usuário ou e-mail"
                  autoComplete="username"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <KeyRound className="h-4 w-4" />
                  Senha
                </span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => handleAuthFieldChange('password', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </label>

              <button
                type="submit"
                disabled={authLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                {authLoading ? 'Entrando...' : 'Entrar no sistema'}
              </button>
            </form>
          )}

          {authMode === 'register' && (
            <form className="mt-6 space-y-4" onSubmit={handleRegister}>
              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">Nome de usuário</span>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(event) => handleAuthFieldChange('username', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Escolha um usuário"
                />
              </label>

              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">E-mail</span>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) => handleAuthFieldChange('email', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Digite seu e-mail"
                />
              </label>

              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">Senha</span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => handleAuthFieldChange('password', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Crie uma senha"
                />
              </label>

              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">Confirmar senha</span>
                <input
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(event) => handleAuthFieldChange('confirmPassword', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Repita a senha"
                />
              </label>

              <button
                type="submit"
                disabled={authLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                {authLoading ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>
          )}

          {authMode === 'recovery' && (
            <form className="mt-6 space-y-4" onSubmit={handleForgotPassword}>
              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">E-mail cadastrado</span>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(event) => handleAuthFieldChange('email', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Digite seu e-mail"
                />
              </label>

              <button
                type="submit"
                disabled={authLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                {authLoading ? 'Processando...' : 'Enviar recuperação'}
              </button>
            </form>
          )}

          {authMode === 'reset' && (
            <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">Token de recuperação</span>
                <input
                  type="text"
                  value={authForm.recoveryToken}
                  onChange={(event) => handleAuthFieldChange('recoveryToken', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Cole o token recebido"
                />
              </label>

              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">Nova senha</span>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => handleAuthFieldChange('password', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Defina uma nova senha"
                />
              </label>

              <label className="block">
                <span className="mb-2 text-sm font-medium text-slate-300">Confirmar nova senha</span>
                <input
                  type="password"
                  value={authForm.confirmPassword}
                  onChange={(event) => handleAuthFieldChange('confirmPassword', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  placeholder="Repita a nova senha"
                />
              </label>

              <button
                type="submit"
                disabled={authLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                {authLoading ? 'Atualizando...' : 'Alterar senha'}
              </button>
            </form>
          )}

          {authMessage && (
            <div className={`mt-4 rounded-xl border px-3 py-2 text-sm ${authMessage.toLowerCase().includes('sucesso') || authMessage.toLowerCase().includes('enviadas') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
              {authMessage}
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-3 text-center text-xs text-slate-400">
            Demo inicial: usuário <span className="font-semibold text-slate-200">admin</span> e senha <span className="font-semibold text-slate-200">123456</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] flex flex-col md:flex-row antialiased text-slate-200">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#0F1116] text-slate-300 flex flex-col shrink-0 border-r border-white/5 shadow-xl" id="main-navigation-sidebar">
        
        {/* CT Logo brand header */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-widest text-white uppercase">REDUZIR • PR</h1>
            <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">Gestão e Prontuários CT</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 flex-1 space-y-1.5 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('dashboard'); setResidentToEdit(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer border-l-2 ${
              activeTab === 'dashboard' 
                ? 'bg-white/5 text-white border-indigo-500' 
                : 'border-transparent hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Painel de Controle</span>
          </button>

          <button
            onClick={() => { setActiveTab('acolhidos'); setResidentToEdit(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer border-l-2 ${
              activeTab === 'acolhidos' 
                ? 'bg-white/5 text-white border-indigo-500' 
                : 'border-transparent hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Acolhidos Regulados</span>
          </button>

          <button
            onClick={() => { setActiveTab('relatorios'); setResidentToEdit(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer border-l-2 ${
              activeTab === 'relatorios' 
                ? 'bg-white/5 text-white border-indigo-500' 
                : 'border-transparent hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Relatório Geral</span>
          </button>

          <button
            onClick={() => { setActiveTab('prescricoes'); setResidentToEdit(null); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all cursor-pointer border-l-2 ${
              activeTab === 'prescricoes' 
                ? 'bg-white/5 text-white border-indigo-500' 
                : 'border-transparent hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <Pill className="h-4 w-4" />
              <span>Controle de Medicamentos</span>
            </div>
            {activeAlertsCount > 0 && (
              <span className="h-4 min-w-4 px-1.5 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setResidentToEdit(null); setActiveTab('cadastro'); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer border-l-2 ${
              activeTab === 'cadastro' && !residentToEdit
                ? 'bg-white/5 text-white border-indigo-500' 
                : 'border-transparent hover:bg-white/5 hover:text-white text-slate-400'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Matrícula de Acolhimento</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair do sistema
          </button>

          <div className="mt-3 text-center text-[10px] text-slate-500">
            <div>Consonância com SEDEF e SESA</div>
            <div className="font-bold text-slate-400 mt-0.5">Paraná Governo do Estado</div>
          </div>
        </div>

      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
        
        {/* Global alert warning bar for overdue doses */}
        {activeAlertsCount > 0 && activeTab !== 'prescricoes' && (
          <div 
            onClick={() => setActiveTab('prescricoes')}
            className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-rose-300 shadow-sm cursor-pointer hover:bg-rose-500/20 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 animate-bounce" />
              <div>
                <strong className="font-bold">Aviso de Dispensário Pendente:</strong>
                <span> Existem {activeAlertsCount} doses de medicação em atraso necessitando de administração imediata!</span>
              </div>
            </div>
            <span className="font-bold underline uppercase text-[10px] text-rose-400 tracking-wider">Acessar Dispensário</span>
          </div>
        )}

        {/* 3. SWITCH RENDER FOR ACTIVE NAVIGATION VIEW */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            acolhidos={acolhidos} 
            onSelectAcolhido={handleViewProfile}
            onNavigateToTab={(tab) => { if (tab === 'medicamentos' || tab === 'prescricoes') setActiveTab('prescricoes'); else setActiveTab('acolhidos'); }}
            medicationLogs={medicationLogs}
            onAdministerMedication={handleAdministerMedication}
            onAddFamilyCommunication={handleAddFamilyCommunication}
          />
        )}

        {activeTab === 'acolhidos' && (
          <ResidentList 
            acolhidos={acolhidos} 
            onSelectAcolhido={handleViewProfile}
            onOpenNewResidentForm={() => { setResidentToEdit(null); setActiveTab('cadastro'); }}
            onDeleteAcolhido={handleDeleteResident}
          />
        )}

        {activeTab === 'cadastro' && (
          <ResidentForm 
            onSave={(formData) => handleSaveResident(formData as Acolhido)} 
            residentToEdit={residentToEdit || undefined} 
            onCancel={() => { setActiveTab('acolhidos'); setResidentToEdit(null); }}
          />
        )}

        {activeTab === 'prescricoes' && (
          <MedicationControl 
            acolhidos={acolhidos}
            medicationLogs={medicationLogs}
            onAdministerMedication={handleAdministerMedication}
            onToggleAlerts={handleToggleAlerts}
          />
        )}

        {activeTab === 'perfil' && currentProfileResident && (
          <ResidentProfile 
            resident={currentProfileResident}
            onBack={() => setActiveTab('acolhidos')}
            onUpdateResident={handleUpdateResidentDirectly}
          />
        )}

        {activeTab === 'relatorios' && (
          <GeneralReport 
            acolhidos={acolhidos}
            onSelectAcolhido={handleViewProfile}
          />
        )}

      </main>

    </div>
  );
}
