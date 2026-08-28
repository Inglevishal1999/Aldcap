import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Search,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  X,
  Loader2,
  AlertTriangle,
  LayoutDashboard,
  Newspaper,
} from "lucide-react";

// ==========================================
// CONFIG — point this at your backend.
// Adjust paths here if your Express routes differ
// from the controller names in blogController.js.
// ==========================================
const API_BASE = "/api/blogs";
const ROUTES = {
  published: `${API_BASE}`,        // GET  -> getPublishedBlogs
  all: `${API_BASE}/all`,          // GET  -> getAllBlogs (admin)
  byId: (id) => `${API_BASE}/${id}`, // GET / PUT / DELETE -> getBlogById / updateBlog / deleteBlog
  create: `${API_BASE}`,           // POST -> createBlog
};
const UPLOADS_BASE = ""; // e.g. "http://localhost:5000" if images are served from a different origin

const CATEGORIES = ["Safety", "Projects", "Company News", "Careers", "Technology"];
const STATUSES = ["Draft", "Published", "Archived"];

// ==========================================
// SHARED HELPERS
// ==========================================
async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok || (body && body.success === false)) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}

function StatusBadge({ status }) {
  const styles = {
    Published: "bg-emerald-50 text-emerald-700",
    Draft: "bg-slate-100 text-slate-500",
    Archived: "bg-rose-50 text-rose-600",
  };
  const dot = {
    Published: "bg-emerald-500",
    Draft: "bg-slate-400",
    Archived: "bg-rose-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3 mb-4">
      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      <button onClick={onDismiss} className="text-rose-400 hover:text-rose-600">
        <X size={14} />
      </button>
    </div>
  );
}

// ==========================================
// ADD / EDIT MODAL
// ==========================================
function BlogFormModal({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState({
    title: initial?.title || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    category: initial?.category || CATEGORIES[0],
    status: initial?.status || "Draft",
    author: initial?.author || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    initial?.image ? `${UPLOADS_BASE}/${initial.image}` : null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Title, excerpt and content are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (imageFile) fd.append("image", imageFile);

      const url = isEdit ? ROUTES.byId(initial._id) : ROUTES.create;
      const method = isEdit ? "PUT" : "POST";

      const result = await apiRequest(url, { method, body: fd });
      onSaved(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-[#0B1B45]">
            {isEdit ? "Edit blog post" : "Add new blog post"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <ErrorBanner message={error} onDismiss={() => setError("")} />

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
            <input
              value={form.title}
              onChange={update("title")}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Essential electrical safety tips..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={update("excerpt")}
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300 resize-none"
              placeholder="A short summary shown in listings"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={update("content")}
              rows={6}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300 resize-none"
              placeholder="Full post body"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select
                value={form.category}
                onChange={update("category")}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
              <select
                value={form.status}
                onChange={update("status")}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Author</label>
            <input
              value={form.author}
              onChange={update("author")}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Author name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Cover image</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={18} className="text-slate-400" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 text-sm font-semibold bg-amber-400 text-[#0B1B45] rounded-lg px-4 py-2 hover:bg-amber-300 transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? "Save changes" : "Publish post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// DELETE CONFIRM
// ==========================================
function DeleteConfirm({ post, onCancel, onConfirmed }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await apiRequest(ROUTES.byId(post._id), { method: "DELETE" });
      onConfirmed(post._id);
    } catch (err) {
      setError(err.message || "Failed to delete blog.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm px-6 py-5">
        <h3 className="text-base font-bold text-[#0B1B45] mb-1">Delete this post?</h3>
        <p className="text-sm text-slate-500 mb-4">
          "{post.title}" will be permanently removed. This can't be undone.
        </p>
        <ErrorBanner message={error} onDismiss={() => setError("")} />
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-sm font-medium text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-sm font-semibold bg-rose-500 text-white rounded-lg px-4 py-2 hover:bg-rose-600 transition-colors disabled:opacity-60"
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ADMIN VIEW
// ==========================================
export function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [modalPost, setModalPost] = useState(undefined); // undefined = closed, null = create, obj = edit
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (category !== "all") params.set("category", category);
      if (status !== "all") params.set("status", status);

      const result = await apiRequest(`${ROUTES.all}?${params.toString()}`);
      setBlogs(result.data || []);
    } catch (err) {
      setError(err.message || "Failed to load blogs. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [query, category, status]);

  useEffect(() => {
    const debounce = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(debounce);
  }, [fetchBlogs]);

  const handleSaved = (savedPost) => {
    setBlogs((prev) => {
      const exists = prev.some((p) => p._id === savedPost._id);
      return exists
        ? prev.map((p) => (p._id === savedPost._id ? savedPost : p))
        : [savedPost, ...prev];
    });
    setModalPost(undefined);
  };

  const handleDeleted = (id) => {
    setBlogs((prev) => prev.filter((p) => p._id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1B45]">Blog</h2>
          <p className="text-slate-500 text-sm mt-1">Publish and manage blog posts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full max-w-xs">
            <Search size={15} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blogs..."
              className="bg-transparent outline-none text-sm w-full placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none text-sm text-slate-600 border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:bg-slate-50 transition-colors outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none text-sm text-slate-600 border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:bg-slate-50 transition-colors outline-none"
              >
                <option value="all">Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              onClick={() => setModalPost(null)}
              className="flex items-center gap-2 text-sm font-semibold bg-amber-400 text-[#0B1B45] rounded-lg px-4 py-2 hover:bg-amber-300 transition-colors"
            >
              <Plus size={15} />
              Add New Blog
            </button>
          </div>
        </div>

        <div className="px-6 pt-4">
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[80px_1fr_140px_140px_100px] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
          <span>Image</span>
          <span>Title</span>
          <span>Category</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="px-6 py-12 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              Loading blogs...
            </div>
          )}

          {!loading && blogs.map((post) => (
            <div
              key={post._id}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_140px_140px_100px] items-center gap-3 px-6 py-4"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                {post.image ? (
                  <img src={`${UPLOADS_BASE}/${post.image}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={16} />
                )}
              </div>

              <p className="text-sm font-medium text-slate-800 leading-snug pr-4">{post.title}</p>
              <span className="text-sm text-slate-500">{post.category}</span>
              <StatusBadge status={post.status} />

              <div className="flex items-center justify-start md:justify-end gap-3 text-slate-400">
                <button
                  onClick={() => setModalPost(post)}
                  className="hover:text-amber-500 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(post)}
                  className="hover:text-rose-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {!loading && !error && blogs.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              No blogs match your filters yet. Add your first post to get started.
            </div>
          )}
        </div>
      </div>

      {modalPost !== undefined && (
        <BlogFormModal
          initial={modalPost}
          onClose={() => setModalPost(undefined)}
          onSaved={handleSaved}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          post={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirmed={handleDeleted}
        />
      )}
    </div>
  );
}

// ==========================================
// EMPLOYEE PORTAL VIEW — published posts only
// ==========================================
export function EmployeeBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const debounce = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (category !== "all") params.set("category", category);
        const result = await apiRequest(`${ROUTES.published}?${params.toString()}`);
        setBlogs(result.data || []);
      } catch (err) {
        setError(err.message || "Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, category]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0B1B45]">Company Blog</h2>
        <p className="text-slate-500 text-sm mt-1">Latest updates, published for everyone.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full max-w-xs">
          <Search size={15} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="bg-transparent outline-none text-sm w-full placeholder-slate-400"
          />
        </div>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none text-sm text-slate-600 bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading && (
        <div className="py-16 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          Loading posts...
        </div>
      )}

      {!loading && blogs.length === 0 && !error && (
        <div className="py-16 text-center text-sm text-slate-400">
          No published posts yet — check back soon.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loading && blogs.map((post) => (
          <article
            key={post._id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="h-36 bg-slate-100 flex items-center justify-center overflow-hidden">
              {post.image ? (
                <img src={`${UPLOADS_BASE}/${post.image}`} alt={post.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={22} className="text-slate-300" />
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-xs font-semibold text-amber-600 mb-1">{post.category}</span>
              <h3 className="text-sm font-bold text-[#0B1B45] leading-snug mb-2">{post.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
              {post.author && (
                <p className="text-[11px] text-slate-400 mt-3">By {post.author}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ROOT — toggle between the two surfaces
// ==========================================
export default function BlogSystem() {
  const [view, setView] = useState("admin");

  return (
    <div className="min-h-screen bg-[#F1F3F8] font-sans text-slate-800">
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center gap-2">
        <button
          onClick={() => setView("admin")}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
            view === "admin" ? "bg-[#0B1B45] text-white" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard size={14} />
          Admin
        </button>
        <button
          onClick={() => setView("portal")}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
            view === "portal" ? "bg-[#0B1B45] text-white" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Newspaper size={14} />
          Employee Portal
        </button>
      </div>

      {view === "admin" ? <BlogAdminPage /> : <EmployeeBlogList />}
    </div>
  );
}