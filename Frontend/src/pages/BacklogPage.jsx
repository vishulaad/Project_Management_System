import React, { useEffect, useMemo, useState } from "react";
import { fetchBacklog } from "../api/tasks";
import TaskCard from "../components/TaskCard";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BacklogPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // You can set these via URL ?projectId=.. or ?companyId=..
  const initialProjectId = params.get("projectId");
  const initialCompanyId = params.get("companyId");

  const [projectId, setProjectId] = useState(initialProjectId || "");
  const [companyId, setCompanyId] = useState(initialCompanyId || "");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState({ items: [], total: 0, page: 1, pageSize });

  const canQuery = useMemo(() => {
    // if backlog endpoint present => project/company optional
    // but in fallback, we need projectId; so if no projectId and endpoint 404s, we’ll show helpful error.
    return true;
  }, []);

  useEffect(() => {
    if (!canQuery) return;
    (async () => {
      setLoading(true); setError("");
      try {
        const data = await fetchBacklog({
          projectId: projectId || null,
          companyId: companyId || null,
          search, status, priority, page, pageSize
        });
        // If API returns array directly, normalize to items
        if (Array.isArray(data)) {
          setResult({ items: data, total: data.length, page, pageSize });
        } else {
          setResult(data);
        }
      } catch (e) {
        setError(e?.message || "Failed to load backlog");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId, companyId, search, status, priority, page, pageSize, canQuery]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Project Id (optional if /tasks/backlog exists)</label>
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="e.g. 12"
            value={projectId}
            onChange={(e) => { setPage(1); setProjectId(e.target.value); }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Company Id (optional)</label>
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="e.g. 3"
            value={companyId}
            onChange={(e) => { setPage(1); setCompanyId(e.target.value); }}
          />
        </div>
        <div className="flex flex-col grow min-w-[220px]">
          <label className="text-sm text-gray-600 mb-1">Search</label>
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Title / Description…"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Status</label>
          <select
            className="border rounded-xl px-3 py-2"
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          >
            <option value="">All</option>
            <option>NotStarted</option>
            <option>InProgress</option>
            <option>Completed</option>
            <option>Blocked</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Priority</label>
          <select
            className="border rounded-xl px-3 py-2"
            value={priority}
            onChange={(e) => { setPage(1); setPriority(e.target.value); }}
          >
            <option value="">All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading backlog…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(result.items || []).map((t) => (
              <TaskCard
                key={t.taskId}
                task={t}
                onClick={(task) => navigate(`/tasks/${task.taskId}`)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              {result.total > 0
                ? `Showing ${(result.page - 1) * result.pageSize + 1}–${Math.min(result.page * result.pageSize, result.total)} of ${result.total}`
                : "No tasks"}
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded-xl border bg-white disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-2 rounded-xl border bg-white disabled:opacity-50"
                onClick={() => {
                  const maxPage = Math.ceil((result.total || 0) / pageSize);
                  setPage((p) => (p < maxPage ? p + 1 : p));
                }}
                disabled={page >= Math.ceil((result.total || 0) / pageSize)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
