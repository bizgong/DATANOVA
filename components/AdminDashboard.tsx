import React, { useState, useEffect } from 'react';
import { X, Lock, User, Settings, MessageSquare, LogOut, Trash2 } from 'lucide-react';
import { ContactMessage } from '../types';
import { supabase } from '../supabaseClient';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_CREDS = 'datanova_admin_creds';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'settings'>('messages');
  
  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Settings State
  const [newId, setNewId] = useState('');
  const [newPw, setNewPw] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setMessages(data as ContactMessage[]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchMessages();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedCreds = JSON.parse(localStorage.getItem(STORAGE_KEY_CREDS) || '{"id":"admin","pw":"password123"}');
    
    if (loginId === storedCreds.id && loginPw === storedCreds.pw) {
      setIsAuthenticated(true);
      setLoginError('');
      setLoginId('');
      setLoginPw('');
    } else {
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('messages');
  };

  const handleDeleteMessage = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // UI update after successful delete
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newPw) {
      setSettingsMsg('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify({ id: newId, pw: newPw }));
    setSettingsMsg('관리자 정보가 변경되었습니다. 다음 로그인부터 적용됩니다.');
    setNewId('');
    setNewPw('');
  };

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-dark-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Lock className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
              <p className="text-xs text-gray-400">관리자 전용 페이지</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {!isAuthenticated ? (
            // Login Form
            <div className="w-full flex items-center justify-center p-8">
              <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">로그인</h3>
                  <p className="text-gray-400">대시보드 접근 권한을 확인합니다.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">아이디</label>
                    <input 
                      type="text" 
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">비밀번호</label>
                    <input 
                      type="password" 
                      value={loginPw}
                      onChange={(e) => setLoginPw(e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      placeholder="password"
                    />
                  </div>
                </div>

                {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}

                <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors">
                  대시보드 진입
                </button>
              </form>
            </div>
          ) : (
            // Dashboard Interface
            <div className="w-full flex h-full">
              {/* Sidebar */}
              <div className="w-64 bg-dark-800 border-r border-white/10 flex flex-col hidden md:flex">
                <div className="p-4 space-y-2">
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <MessageSquare size={18} /> 상담 문의
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Settings size={18} /> 계정 설정
                  </button>
                </div>
                <div className="mt-auto p-4 border-t border-white/10">
                  <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm px-4">
                    <LogOut size={16} /> 로그아웃
                  </button>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 bg-dark-900 overflow-y-auto p-6 md:p-8">
                {/* Mobile Tabs */}
                <div className="flex md:hidden gap-2 mb-6">
                   <button 
                    onClick={() => setActiveTab('messages')}
                    className={`flex-1 py-2 text-sm rounded-lg font-medium ${activeTab === 'messages' ? 'bg-purple-600 text-white' : 'bg-dark-800 text-gray-400'}`}
                  >
                    문의 목록
                  </button>
                   <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-2 text-sm rounded-lg font-medium ${activeTab === 'settings' ? 'bg-purple-600 text-white' : 'bg-dark-800 text-gray-400'}`}
                  >
                    설정
                  </button>
                </div>

                {activeTab === 'messages' && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-4">상담 신청 내역</h3>
                    {loading ? (
                       <div className="text-center py-20 text-gray-500">데이터를 불러오는 중...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-20 bg-dark-800 rounded-xl border border-white/5 text-gray-500">
                        <MessageSquare className="mx-auto mb-4 opacity-50" size={48} />
                        <p>아직 접수된 상담 문의가 없습니다.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {messages.map((msg) => (
                          <div key={msg.id} className="bg-dark-800 p-6 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-white">{msg.name} <span className="text-sm font-normal text-gray-500 ml-2">{formatDate(msg.created_at || msg.date)}</span></h4>
                                <div className="text-sm text-purple-400 mt-1">{msg.phone} / {msg.email}</div>
                              </div>
                              <button 
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                title="삭제"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="bg-dark-900/50 p-4 rounded-lg text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-md">
                     <h3 className="text-2xl font-bold text-white mb-6">관리자 계정 변경</h3>
                     <form onSubmit={handleUpdateCreds} className="space-y-4 bg-dark-800 p-6 rounded-xl border border-white/5">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">새 아이디</label>
                          <input 
                            type="text" 
                            value={newId}
                            onChange={(e) => setNewId(e.target.value)}
                            className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">새 비밀번호</label>
                          <input 
                            type="password" 
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            className="w-full bg-dark-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        
                        {settingsMsg && <p className="text-green-400 text-sm">{settingsMsg}</p>}

                        <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors mt-4">
                          정보 변경 저장
                        </button>
                     </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;