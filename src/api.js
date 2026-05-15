const API_URL = '/api/tasks';

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Cloud error');
    const json = await res.json();

    // 相容 JsonBin 的資料格式
    const tasks = json.record?.tasks ?? json.tasks ?? [];

    // 成功抓到資料後，同時備份到本地
    if (tasks.length > 0) {
      localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));
    }
    return tasks;
  } catch (err) {
    console.warn('Cloud fetch failed, using local backup:', err);
    // 雲端失敗時，讀取本地備份
    const backup = localStorage.getItem('secs_tasks_backup');
    return backup ? JSON.parse(backup) : [];
  }
}

export async function saveTasks(tasks) {
  // 立刻先存本地，確保資料不噴掉
  localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));

  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });
    if (!res.ok) throw new Error('Cloud save failed');
    return await res.json();
  } catch (err) {
    console.warn('Cloud save failed, data is safe locally:', err);
    // 就算雲端失敗也不拋出錯誤，因為本地已經存好了
    return { localOnly: true };
  }
}
