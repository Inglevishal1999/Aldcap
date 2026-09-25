import { useEffect, useMemo, useRef, useState } from "react";

// ============================================================
// API CONFIG
// ============================================================

const API_ORIGIN =
  import.meta.env.VITE_API_URL || "https://elaap-backend-live.onrender.com";

const API_BASE = `${API_ORIGIN}/api/blogs`;

const PAGE_SIZE = 5;

// ============================================================
// AUTH
// ============================================================

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("adminToken") ||
    ""
  );
}

// ============================================================
// IMAGE URL
// ============================================================

function resolveImage(image) {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/${image}`;
}

// ============================================================
// API REQUEST
// ============================================================

async function apiRequest(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "You are not logged in. Please login as an admin."
    );
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // FormData automatically sets Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text || "Invalid server response",
    };
  }

  if (response.status === 401) {
    // Remove invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");

    throw new Error(
      "Your login session has expired. Please login again."
    );
  }

  if (response.status === 403) {
    throw new Error(
      data.message || "You do not have admin permission."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed (${response.status})`
    );
  }

  return data;
}

// ============================================================
// EMPTY FORM
// ============================================================

const emptyForm = {
  id: null,
  title: "",
  category: "",
  excerpt: "",
  content: "",
  status: "Draft",
  image: "",
};

// ============================================================
// BLOG ADMIN PAGE
// ============================================================

export function BlogAdminPage() {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);

  const [form, setForm] = useState(emptyForm);

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // ==========================================================
  // FETCH BLOGS
  // ==========================================================

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(
        `${API_BASE}/admin/all`
      );

      const blogData = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.blogs)
        ? data.blogs
        : [];

      setBlogs(blogData);
    } catch (err) {
      console.error("Fetch blogs error:", err);

      setError(
        err.message || "Failed to fetch blogs."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const values = blogs
      .map((blog) => blog.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [blogs]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredBlogs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesSearch =
        !searchText ||
        String(blog.title || "")
          .toLowerCase()
          .includes(searchText) ||
        String(blog.excerpt || "")
          .toLowerCase()
          .includes(searchText) ||
        String(blog.category || "")
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        !categoryFilter ||
        String(blog.category || "") === categoryFilter;

      const matchesStatus =
        !statusFilter ||
        String(blog.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    blogs,
    search,
    categoryFilter,
    statusFilter,
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / PAGE_SIZE)
  );

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filteredBlogs.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredBlogs, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ==========================================================
  // FORM
  // ==========================================================

  const isEditing = form.id !== null;

  function resetForm() {
    setForm({ ...emptyForm });

    setImageFile(null);

    setImagePreview("");

    setError("");

    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==========================================================
  // IMAGE
  // ==========================================================

  function handleFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");

    setImageFile(file);

    setImagePreview(URL.createObjectURL(file));
  }

  function handleFileChange(event) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();

    setIsDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  }

  // ==========================================================
  // EDIT
  // ==========================================================

  function handleEdit(blog) {
    const id = blog._id || blog.id;

    setForm({
      id,
      title: blog.title || "",
      category: blog.category || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      status: blog.status || "Draft",
      image: blog.image || "",
    });

    setImageFile(null);

    setImagePreview(resolveImage(blog.image));

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await apiRequest(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      setBlogs((previous) =>
        previous.filter(
          (blog) => (blog._id || blog.id) !== id
        )
      );

      if (form.id === id) {
        resetForm();
      }

      setSuccess(
        "Blog deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Delete blog error:", err);

      setError(
        err.message || "Failed to delete blog."
      );
    }
  }

  // ==========================================================
  // CREATE / UPDATE
  // ==========================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!form.content.trim()) {
      setError("Blog content is required.");
      return;
    }

    if (!isEditing && !imageFile) {
      setError("Please select a blog image.");
      return;
    }

    setSubmitting(true);

    try {
      const body = new FormData();

      body.append("title", form.title.trim());

      body.append(
        "category",
        form.category.trim()
      );

      body.append(
        "excerpt",
        form.excerpt.trim()
      );

      body.append(
        "content",
        form.content.trim()
      );

      body.append("status", form.status);

      if (imageFile) {
        body.append("image", imageFile);
      }

      const url = isEditing
        ? `${API_BASE}/${form.id}`
        : API_BASE;

      const method = isEditing ? "PUT" : "POST";

      const data = await apiRequest(url, {
        method,
        body,
      });

      const savedBlog =
        data.data ||
        data.blog ||
        data;

      if (isEditing) {
        setBlogs((previous) =>
          previous.map((blog) => {
            const blogId =
              blog._id || blog.id;

            return blogId === form.id
              ? savedBlog
              : blog;
          })
        );

        setSuccess(
          "Blog updated successfully."
        );
      } else {
        setBlogs((previous) => [
          savedBlog,
          ...previous,
        ]);

        setPage(1);

        setSuccess(
          "Blog created successfully."
        );
      }

      resetForm();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Save blog error:", err);

      setError(
        err.message || "Failed to save blog."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==========================================================
  // DATE
  // ==========================================================

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  // ==========================================================
  // STATUS
  // ==========================================================

  function StatusBadge({ status }) {
    const normalized = String(
      status || ""
    ).toLowerCase();

    let className =
      "bg-slate-100 text-slate-600";

    if (
      normalized === "published" ||
      normalized === "active"
    ) {
      className =
        "bg-green-50 text-green-700";
    }

    if (normalized === "draft") {
      className =
        "bg-yellow-50 text-yellow-700";
    }

    if (normalized === "inactive") {
      className =
        "bg-red-50 text-red-700";
    }

    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
      >
        {status || "Unknown"}
      </span>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F2A52]">
              Blog Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, publish and manage blog posts.
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F2A52] hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* MAIN */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_390px]">

          {/* ==================================================
              BLOG LIST
          ================================================== */}

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.03] sm:p-6">

            {/* SEARCH */}

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search blogs..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-10 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />

              </div>

              {/* CATEGORY */}

              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(
                    event.target.value
                  );
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value
                  );
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
              >
                <option value="">
                  All Status
                </option>

                <option value="Published">
                  Published
                </option>

                <option value="Draft">
                  Draft
                </option>
              </select>

              {/* ADD */}

              <button
                type="button"
                onClick={() => {
                  resetForm();

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="rounded-lg bg-[#f9ad00] px-5 py-3 text-sm font-semibold text-[#0F2A52] hover:bg-[#e99f00]"
              >
                + Add New Blog
              </button>

            </div>

            {/* TABLE */}

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[760px] text-left text-sm">

                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">

                    <th className="px-3 py-3">
                      Image
                    </th>

                    <th className="px-3 py-3">
                      Title
                    </th>

                    <th className="px-3 py-3">
                      Category
                    </th>

                    <th className="px-3 py-3">
                      Status
                    </th>

                    <th className="px-3 py-3">
                      Date
                    </th>

                    <th className="px-3 py-3 text-right">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-slate-500"
                      >
                        Loading blogs...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    pageItems.map((blog) => {
                      const id =
                        blog._id || blog.id;

                      return (
                        <tr
                          key={id}
                          className="hover:bg-slate-50"
                        >

                          <td className="px-3 py-4">

                            {blog.image ? (
                              <img
                                src={resolveImage(
                                  blog.image
                                )}
                                alt={
                                  blog.title || ""
                                }
                                className="h-14 w-20 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                                No image
                              </div>
                            )}

                          </td>

                          <td className="max-w-[260px] px-3 py-4">

                            <p className="line-clamp-2 font-medium text-[#0F2A52]">
                              {blog.title ||
                                "Untitled Blog"}
                            </p>

                            {blog.excerpt && (
                              <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                                {blog.excerpt}
                              </p>
                            )}

                          </td>

                          <td className="px-3 py-4 text-slate-500">
                            {blog.category ||
                              "—"}
                          </td>

                          <td className="px-3 py-4">
                            <StatusBadge
                              status={blog.status}
                            />
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                            {formatDate(
                              blog.createdAt ||
                                blog.date ||
                                blog.publishedAt
                            )}
                          </td>

                          <td className="px-3 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(blog)
                                }
                                className="rounded-lg px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(id)
                                }
                                className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  {!loading &&
                    pageItems.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-slate-500"
                        >
                          No blogs found.
                        </td>
                      </tr>
                    )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">

              <p className="text-sm text-slate-500">
                Showing{" "}
                {filteredBlogs.length === 0
                  ? 0
                  : (page - 1) *
                      PAGE_SIZE +
                    1}{" "}
                -
                {Math.min(
                  page * PAGE_SIZE,
                  filteredBlogs.length
                )}{" "}
                of {filteredBlogs.length}
              </p>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"
                >
                  ‹
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) =>
                    index + 1
                ).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() =>
                      setPage(number)
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium ${
                      number === page
                        ? "bg-[#0F2A52] text-white"
                        : "text-[#0F2A52] hover:bg-slate-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30"
                >
                  ›
                </button>

              </div>

            </div>

          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <div className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5">

              <h2 className="text-lg font-semibold text-[#0F2A52]">
                {isEditing
                  ? "Edit Blog"
                  : "Add New Blog"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Update the selected blog post."
                  : "Create a new blog post."}
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* IMAGE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-[#0F2A52]">
                  Blog Image
                  {!isEditing && (
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  )}
                </label>

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() =>
                    setIsDragging(false)
                  }
                  onDrop={handleDrop}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className={`flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center ${
                    isDragging
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-2 text-3xl">
                        🖼️
                      </div>

                      <p className="text-sm font-medium text-[#0F2A52]">
                        Drag & drop image here
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        or click to browse
                      </p>
                    </>
                  )}

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </div>

              {/* TITLE */}

              <div>

                <label
                  htmlFor="title"
                  className="mb-1.5 block text-sm font-medium text-[#0F2A52]"
                >
                  Title *
                </label>

                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-[#0F2A52]"
                >
                  Category *
                </label>

                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Energy, Technology"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />

              </div>

              {/* STATUS */}

              <div>

                <label
                  htmlFor="status"
                  className="mb-1.5 block text-sm font-medium text-[#0F2A52]"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
                >
                  <option value="Draft">
                    Draft
                  </option>

                  <option value="Published">
                    Published
                  </option>
                </select>

              </div>

              {/* EXCERPT */}

              <div>

                <label
                  htmlFor="excerpt"
                  className="mb-1.5 block text-sm font-medium text-[#0F2A52]"
                >
                  Short Description
                </label>

                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="Short description..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
                />

              </div>

              {/* CONTENT */}

              <div>

                <label
                  htmlFor="content"
                  className="mb-1.5 block text-sm font-medium text-[#0F2A52]"
                >
                  Content *
                </label>

                <textarea
                  id="content"
                  name="content"
                  rows={9}
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Write your blog content..."
                  className="w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#0F2A52] hover:bg-slate-50"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-[#0F2A52] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#173c70] disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Blog"
                    : "Save Blog"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}

export default BlogAdminPage;