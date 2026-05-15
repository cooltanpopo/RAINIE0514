const API_URL = '/api/tasks';

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    
    // 關鍵修正：相容 JsonBin 的資料結構
    if (json.record && json.record.tasks) {
      return json.record.tasks;
    }
    return json.tasks || [];
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

export async function saveTasks(tasks) {
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tasks })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Save error:', err);
    throw err;
  }
}
