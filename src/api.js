// 終極備援：雲端 + 本地雙重儲存
const API_URL = '/api/tasks';

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Cloud Sync Error');
    const json = await res.json();
    const tasks = json.record?.tasks || json.tasks || [];
    
    // 每次抓取成功，同步存一份在本地，以防萬一
    if (tasks.length > 0) {
      localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));
    }
    return tasks;
  } catch (err) {
    // 雲端失敗時，自動讀取本地備份
    const backup = localStorage.getItem('secs_tasks_backup');
    return backup ? JSON.parse(backup) : [];
  }
}

export async function saveTasks(tasks) {
  // 先存本地，確保使用者打的東西絕對不會噴掉
  localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));

  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });
    return await res.json();
  } catch (err) {
    console.warn('Saving to cloud failed, data kept locally');
    return { success: true, localOnly: true };
  }
}
