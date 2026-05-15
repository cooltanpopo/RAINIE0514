// 使用 jsonblob.com - 真實存在的雲端儲存空間，完全免費無需 API Key
const BLOB_ID = '019e297d-75a3-7e92-bd6b-d4033615ae71';
const API_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

export async function fetchTasks() {
  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    const tasks = json.tasks || [];
    // 成功後備份到本地
    localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));
    return tasks;
  } catch (err) {
    console.warn('Cloud fetch failed, using local backup:', err);
    const backup = localStorage.getItem('secs_tasks_backup');
    return backup ? JSON.parse(backup) : [];
  }
}

export async function saveTasks(tasks) {
  // 先存本地
  localStorage.setItem('secs_tasks_backup', JSON.stringify(tasks));

  // 直接打 jsonblob.com（支援跨來源，不需要代理）
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ tasks })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Save failed: ${res.status} - ${errText}`);
  }

  return await res.json();
}
