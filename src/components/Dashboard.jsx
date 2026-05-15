import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Save, RefreshCw } from 'lucide-react';
import ProgressClock from './ProgressClock';
import { fetchTasks, saveTasks } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('lapping'); // 'lapping' | 'polish'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Auto switch tab if not admin
    if (parsedUser.role !== 'admin') {
      setActiveTab(parsedUser.role);
    }
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTasks(tasks);
      alert('儲存成功！(Data saved successfully)');
    } catch (e) {
      alert('儲存失敗！(Failed to save data)');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now().toString(),
      process: activeTab,
      item: '',
      datetime: new Date().toISOString().slice(0,10),
      station: '',
      machine: '',
      action: '',
      problem: '',
      requirement: '',
      handler: '',
      progress: '',
      resolveTime: '',
      status: '待處理',
      remark: ''
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const deleteTask = (id) => {
    if(window.confirm('確定要刪除嗎？ (Are you sure you want to delete?)')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === activeTab;
  const filteredTasks = tasks.filter(t => t.process === activeTab);

  if (!user) return null;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'var(--panel-bg)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>研磨&拋光SECS測試專案進度</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>使用者: {user.username}</p>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            className={`btn ${activeTab === 'lapping' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => user.role === 'admin' || user.role === 'lapping' ? setActiveTab('lapping') : null}
            style={{ width: '100%', justifyContent: 'flex-start', opacity: (user.role === 'admin' || user.role === 'lapping') ? 1 : 0.5 }}
            disabled={user.role !== 'admin' && user.role !== 'lapping'}
          >
            研磨製程 (Lapping)
          </button>
          
          <button 
            className={`btn ${activeTab === 'polish' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => user.role === 'admin' || user.role === 'polish' ? setActiveTab('polish') : null}
            style={{ width: '100%', justifyContent: 'flex-start', opacity: (user.role === 'admin' || user.role === 'polish') ? 1 : 0.5 }}
            disabled={user.role !== 'admin' && user.role !== 'polish'}
          >
            拋光製程 (Polishing)
          </button>
        </div>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-outline" style={{ width: '100%', color: 'var(--danger)' }} onClick={handleLogout}>
            <LogOut size={16} /> 登出
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{activeTab === 'lapping' ? '研磨' : '拋光'} 追蹤表</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={loadData} disabled={loading}>
              <RefreshCw size={16} className={loading ? 'spinning' : ''} /> 重新整理
            </button>
            {canEdit && (
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={16} /> {saving ? '儲存中...' : '儲存至雲端'}
              </button>
            )}
          </div>
        </div>

        {/* Progress & Stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <ProgressClock tasks={tasks} currentProcess={activeTab} />
          
          {/* Quick instructions */}
          <div className="glass-panel" style={{ flex: 1, padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>系統說明</h3>
            <ul style={{ color: 'var(--text-muted)', marginLeft: '1.2rem', lineHeight: '1.8' }}>
              <li>綠色框框欄位請直接在下方表格內編輯。</li>
              <li>任何修改完成後，請務必點擊右上角「儲存至雲端」以同步資料庫。</li>
              <li>目前權限：{user.role === 'admin' ? '全區管理者 (可編輯研磨與拋光)' : '區域編輯者 (僅可編輯所屬區域)'}</li>
              <li>進度完成鐘會根據目前區域的「狀態 = 已完成」數量自動計算。</li>
            </ul>
          </div>
        </div>

        {/* Table Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>任務列表</h3>
            {canEdit && (
              <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }} onClick={handleAddTask}>
                <Plus size={16} /> 新增項目
              </button>
            )}
          </div>
          
          <div className="table-container" style={{ flex: 1 }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>載入中...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>項</th>
                    <th>日期/時間</th>
                    <th>站點</th>
                    <th>機台</th>
                    <th>作業行為/測試項目</th>
                    <th>問題點/原因分析</th>
                    <th>需求</th>
                    <th>處理者</th>
                    <th>處理進度/解決方案</th>
                    <th>解決時間</th>
                    <th>狀態</th>
                    <th>備註</th>
                    {canEdit && <th>操作</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit ? "13" : "12"} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>尚無資料</td>
                    </tr>
                  ) : (
                    filteredTasks.map((t, index) => (
                      <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td>
                          <input type="text" value={t.datetime} onChange={e => updateTask(t.id, 'datetime', e.target.value)} disabled={!canEdit} style={inputStyle} />
                        </td>
                        <td>
                          <input type="text" value={t.station} onChange={e => updateTask(t.id, 'station', e.target.value)} disabled={!canEdit} style={inputStyle} />
                        </td>
                        <td>
                          <input type="text" value={t.machine} onChange={e => updateTask(t.id, 'machine', e.target.value)} disabled={!canEdit} style={inputStyle} />
                        </td>
                        <td>
                          <textarea value={t.action} onChange={e => updateTask(t.id, 'action', e.target.value)} disabled={!canEdit} style={{...inputStyle, minHeight: '60px'}} />
                        </td>
                        <td>
                          <textarea value={t.problem} onChange={e => updateTask(t.id, 'problem', e.target.value)} disabled={!canEdit} style={{...inputStyle, minHeight: '60px'}} />
                        </td>
                        <td>
                          <textarea value={t.requirement} onChange={e => updateTask(t.id, 'requirement', e.target.value)} disabled={!canEdit} style={{...inputStyle, minHeight: '60px'}} />
                        </td>
                        <td>
                          <input type="text" value={t.handler} onChange={e => updateTask(t.id, 'handler', e.target.value)} disabled={!canEdit} style={inputStyle} />
                        </td>
                        <td>
                          <textarea value={t.progress} onChange={e => updateTask(t.id, 'progress', e.target.value)} disabled={!canEdit} style={{...inputStyle, minHeight: '60px'}} />
                        </td>
                        <td>
                          <input type="text" value={t.resolveTime} onChange={e => updateTask(t.id, 'resolveTime', e.target.value)} disabled={!canEdit} style={inputStyle} />
                        </td>
                        <td>
                          <select 
                            value={t.status} 
                            onChange={e => updateTask(t.id, 'status', e.target.value)} 
                            disabled={!canEdit}
                            style={{...inputStyle, backgroundColor: getStatusColor(t.status), color: '#fff', border: 'none', fontWeight: 'bold'}}
                          >
                            <option value="待處理">待處理</option>
                            <option value="處理中">處理中</option>
                            <option value="已完成">已完成</option>
                          </select>
                        </td>
                        <td>
                          <textarea value={t.remark} onChange={e => updateTask(t.id, 'remark', e.target.value)} disabled={!canEdit} style={{...inputStyle, minHeight: '60px'}} />
                        </td>
                        {canEdit && (
                          <td>
                            <button className="btn btn-outline" style={{ padding: '0.25rem', color: 'var(--danger)' }} onClick={() => deleteTask(t.id)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-main)',
  padding: '0.5rem',
  borderRadius: '4px',
  width: '100%',
  minWidth: '100px',
  outline: 'none',
  fontFamily: 'inherit'
};

function getStatusColor(status) {
  switch(status) {
    case '待處理': return 'var(--danger)';
    case '處理中': return 'var(--warning)';
    case '已完成': return 'var(--success)';
    default: return 'transparent';
  }
}
