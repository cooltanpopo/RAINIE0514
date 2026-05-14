const API_URL = 'https://api.restful-api.dev/objects/ff8081819d82fab6019e255b355d3981';

// Format:
// data: {
//   tasks: [
//     { id, process: 'lapping' | 'polish', item: '', datetime: '', station: '', machine: '', action: '', problem: '', screenshot: '', requirement: '', handler: '', progress: '', resolveTime: '', status: '待處理' | '處理中' | '已完成', remark: '' }
//   ]
// }

export async function fetchTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();
    return json.data?.tasks || [];
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
      body: JSON.stringify({
        name: 'secs-tracker-db',
        data: { tasks }
      })
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Save error:', err);
    throw err;
  }
}
