import client from "./client";

/**
 * Prefer karta hai: GET /api/tasks/backlog (agar backend me added ho)
 * Fallback: GET /api/tasks/project/{projectId} karke FE side par SprintId == null filter
 */
export async function fetchBacklog({ projectId = null, companyId = null, search = "", status = "", priority = "", page = 1, pageSize = 20 }) {
  // Try backlog endpoint first
  try {
    const url = "/tasks/backlog";
    const { data } = await client.get(url, {
      params: { projectId, companyId, search, status, priority, page, pageSize }
    });
    return data; // assume array
  } catch (e) {
    // fallback: fetch project tasks (required: projectId) and filter on FE
    if (!projectId) throw new Error("Backlog endpoint missing & projectId not provided for fallback.");
    const { data } = await client.get(`/tasks/project/${projectId}`);
    let list = data || [];
    // filter backlog (SprintId == null)
    list = list.filter(t => !t.sprintId);
    // simple FE filters
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
      );
    }
    if (status) list = list.filter(t => (t.status || "").toLowerCase() === status.toLowerCase());
    if (priority) list = list.filter(t => (t.priority || "").toLowerCase() === priority.toLowerCase());

    // fake paginate on FE
    const start = (page - 1) * pageSize;
    const paged = list.slice(start, start + pageSize);
    return { items: paged, total: list.length, page, pageSize };
  }
}
