// 透過 Vercel 後台代理，避免 CORS 問題
const API_URL = '/api/tasks';

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const tasks = json.tasks || [];
    if (tasks.length > 0) {
      localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));
    }
    return tasks;
  } catch (err) {
    console.warn('Cloud fetch failed, using local backup:', err);
    const backup = localStorage.getItem('secs_tasks_backup');
    return backup ? JSON.parse(backup) : [];
  }
}

export async function saveTasks(tasks) {
  localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Save failed: ${res.status} - ${txt}`);
  }
  return await res.json();
}
