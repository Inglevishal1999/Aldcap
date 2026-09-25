
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";

// =====================================================
// LIVE BACKEND API
// =====================================================
const API_URL = "https://elaap-backend-live.onrender.com/api/news";

// =====================================================
// GET AUTH TOKEN
// =====================================================
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

// =====================================================
// AXIOS CONFIG
// =====================================================
const getAuthConfig = () => {
  const token = getToken();

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
};

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    status: "Published",
    imageUrl: "",
  });

  // =====================================================
  // FETCH NEWS
  // =====================================================
  const fetchNews = useCallback(async () => {
    setLoading(true);

    try {
      const token = getToken();

      if (!token) {
        console.warn("No authentication token found.");
      }

      const res = await axios.get(`${API_URL}/admin`, getAuthConfig());

      console.log("News API response:", res.data);

      if (res.data?.data && Array.isArray(res.data.data)) {
        setNewsList(res.data.data);
      } else if (Array.isArray(res.data)) {
        setNewsList(res.data);
      } else {
        setNewsList([]);
      }
    } catch (err) {
      console.error("Error fetching news list:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // LOAD NEWS ON PAGE OPEN
  // =====================================================
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // =====================================================
  // OPEN ADD / EDIT MODAL
  // =====================================================
  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingId(article._id);

      setFormData({
        title: article.title || "",
        content: article.content || "",
        date: article.date || new Date().toISOString().split("T")[0],
        status: article.status || "Published",
        imageUrl: article.imageUrl || "",
      });
    } else {
      setEditingId(null);

      setFormData({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        status: "Published",
        imageUrl: "",
      });
    }

    setIsModalOpen(true);
  };

  // =====================================================
  // DELETE NEWS
  // =====================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());

      await fetchNews();
    } catch (err) {
      console.error("Failed to delete news:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      }

      alert(
        err.response?.data?.message ||
          "Failed to delete news article."
      );
    }
  };

  // =====================================================
  // CREATE / UPDATE NEWS
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      if (editingId) {
        // UPDATE
        await axios.put(
          `${API_URL}/${editingId}`,
          formData,
          getAuthConfig()
        );
      } else {
        // CREATE
        await axios.post(
          API_URL,
          formData,
          getAuthConfig()
        );
      }

      setIsModalOpen(false);
      setEditingId(null);

      setFormData({
        title: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        status: "Published",
        imageUrl: "",
      });

      await fetchNews();
    } catch (err) {
      console.error("Failed to save news article:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);
      }

      alert(
        err.response?.data?.message ||
          "Failed to save news article."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================
  const filteredNews = newsList.filter((item) =>
    (item.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-6xl mx-auto">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            News Management
          </h1>

          <p className="text-slate-500 text-sm mt-0.5">
            Manage live articles and internal drafts
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <Plus size={18} />
          Add News
        </button>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}
      <div className="my-6 relative max-w-md">

        <Search
          size={18}
          className="absolute left-3.5 top-3 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
        />
      </div>

      {/* =================================================
          TABLE
      ================================================= */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase border-b border-slate-200">

              <th className="py-3.5 px-6">
                Title
              </th>

              <th className="py-3.5 px-6">
                Date
              </th>

              <th className="py-3.5 px-6">
                Status
              </th>

              <th className="py-3.5 px-6 text-right">
                Action
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">

            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-slate-400"
                >
                  Loading news...
                </td>
              </tr>
            ) : filteredNews.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-slate-400"
                >
                  No news records found.
                </td>
              </tr>
            ) : (
              filteredNews.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-slate-50/50 transition"
                >

                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {item.title}
                  </td>

                  <td className="py-4 px-6 text-slate-500">
                    {item.date}
                  </td>

                  <td className="py-4 px-6">

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="py-4 px-6 text-right space-x-2">

                    {/* EDIT */}
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-6 border-b">

              <h3 className="text-lg font-bold text-slate-800">
                {editingId
                  ? "Edit News Article"
                  : "Add New Article"}
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* TITLE */}
              <div>

                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Title
                </label>

                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                />

              </div>

              {/* DATE + STATUS */}
              <div className="grid grid-cols-2 gap-4">

                {/* DATE */}
                <div>

                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Date
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g. 16 Aug 2026"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                  />

                </div>

                {/* STATUS */}
                <div>

                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                  >
                    <option value="Published">
                      Published
                    </option>

                    <option value="Draft">
                      Draft
                    </option>
                  </select>

                </div>

              </div>

              {/* IMAGE URL */}
              <div>

                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Image URL (Optional)
                </label>

                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                />

              </div>

              {/* CONTENT */}
              <div>

                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Content Body
                </label>

                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 resize-y"
                />

              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update News"
                    : "Save News"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}