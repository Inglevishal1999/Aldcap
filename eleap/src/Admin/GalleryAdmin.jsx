
import { useEffect, useMemo, useRef, useState } from "react";
import { useAdmin } from "./AdminContext";
import API from "../Api/Axios.js";

const PAGE_SIZE = 5;

const emptyForm = {
  id: null,
  caption: "",
};

// =====================================================
// IMAGE URL
// =====================================================
function resolveImage(path) {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `https://elaap-backend-live.onrender.com${cleanPath}`;
}

// =====================================================
// COMPONENT
// =====================================================
export default function GalleryAdmin() {
  const { logActivity } = useAdmin();

  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [form, setForm] = useState(emptyForm);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const activeBlobUrl = useRef(null);

  // =====================================================
  // CLEANUP BLOB URL
  // =====================================================
  function cleanupBlobUrl() {
    if (activeBlobUrl.current) {
      URL.revokeObjectURL(activeBlobUrl.current);
      activeBlobUrl.current = null;
    }
  }

  // =====================================================
  // AUTH HEADER
  // =====================================================
  function getAuthHeaders() {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // =====================================================
  // LOAD GALLERY
  // =====================================================
  useEffect(() => {
    fetchItems();

    return () => {
      cleanupBlobUrl();
    };
  }, []);

  async function fetchItems() {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/gallery", {
        headers: {
          ...getAuthHeaders(),
        },
      });

      console.log("Gallery response:", response.data);

      const galleryData = response.data?.data ?? [];

      setItems(Array.isArray(galleryData) ? galleryData : []);
    } catch (err) {
      console.error(
        "Error loading gallery:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load gallery items"
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // PAGINATION
  // =====================================================
  const totalPages = Math.max(
    1,
    Math.ceil(items.length / PAGE_SIZE)
  );

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  // =====================================================
  // EDITING
  // =====================================================
  const isEditing = form.id !== null;

  // =====================================================
  // RESET FORM
  // =====================================================
  function resetForm() {
    cleanupBlobUrl();

    setForm({
      id: null,
      caption: "",
    });

    setImageFile(null);
    setImagePreview("");
    setIsDragging(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // =====================================================
  // SELECT IMAGE
  // =====================================================
  function handleFile(file) {
    if (!file) {
      return;
    }

    console.log("Selected image:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Check image type
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Image size must be less than 10 MB."
      );
      return;
    }

    setError("");

    cleanupBlobUrl();

    const previewUrl = URL.createObjectURL(file);

    activeBlobUrl.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
  }

  // =====================================================
  // EDIT IMAGE
  // =====================================================
  function handleEdit(item) {
    cleanupBlobUrl();

    const id = item._id ?? item.id;

    setForm({
      id,
      caption: item.caption || "",
    });

    // No new file selected yet
    setImageFile(null);

    // Show existing image
    setImagePreview(
      resolveImage(item.image)
    );

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =====================================================
  // DELETE IMAGE
  // =====================================================
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this image? This can't be undone."
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const response = await API.delete(
        `/gallery/${id}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      console.log(
        "Delete response:",
        response.data
      );

      const json = response.data;

      if (!json?.success) {
        throw new Error(
          json?.message ||
            "Failed to delete gallery image"
        );
      }

      setItems((previousItems) => {
        const updatedItems =
          previousItems.filter(
            (item) =>
              (item._id ?? item.id) !== id
          );

        const newTotalPages = Math.max(
          1,
          Math.ceil(
            updatedItems.length / PAGE_SIZE
          )
        );

        if (page > newTotalPages) {
          setPage(newTotalPages);
        }

        return updatedItems;
      });

      if (form.id === id) {
        resetForm();
      }

      logActivity(
        "Gallery",
        "1 image deleted",
        "bg-rose-50 text-rose-700"
      );

      window.dispatchEvent(
        new Event("admin_data_changed")
      );
    } catch (err) {
      console.error(
        "Error deleting gallery image:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete image"
      );
    }
  }

  // =====================================================
  // SUBMIT FORM
  // =====================================================
  async function handleSubmit(event) {
    event.preventDefault();

    // -----------------------------------------------
    // Validate caption
    // -----------------------------------------------
    if (!form.caption.trim()) {
      setError("Caption is required.");
      return;
    }

    // -----------------------------------------------
    // New image requires file
    // -----------------------------------------------
    if (!isEditing && !(imageFile instanceof File)) {
      setError("Please select an image.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // ---------------------------------------------
      // CREATE FORMDATA
      // ---------------------------------------------
      const body = new FormData();

      body.append(
        "caption",
        form.caption.trim()
      );

      // IMPORTANT:
      // Backend expects:
      // upload.single("image")
      //
      // Therefore frontend MUST send:
      // image
      if (imageFile instanceof File) {
        body.append("image", imageFile);
      }

      // ---------------------------------------------
      // DEBUG
      // ---------------------------------------------
      console.log(
        "Uploading gallery image:",
        imageFile
      );

      for (const [key, value] of body.entries()) {
        if (value instanceof File) {
          console.log("FormData:", key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(
            "FormData:",
            key,
            value
          );
        }
      }

      // ---------------------------------------------
      // IMPORTANT
      //
      // Do NOT manually set:
      // Content-Type: application/json
      //
      // Browser/Axios needs to generate:
      // multipart/form-data; boundary=...
      // ---------------------------------------------
      const uploadHeaders = {
        ...getAuthHeaders(),

        "Content-Type": undefined,
      };

      let response;

      // ---------------------------------------------
      // UPDATE
      // ---------------------------------------------
      if (isEditing) {
        response = await API.put(
          `/gallery/${form.id}`,
          body,
          {
            headers: uploadHeaders,
          }
        );
      }

      // ---------------------------------------------
      // CREATE
      // ---------------------------------------------
      else {
        response = await API.post(
          "/gallery",
          body,
          {
            headers: uploadHeaders,
          }
        );
      }

      console.log(
        "Gallery save response:",
        response.data
      );

      const json = response.data;

      if (!json?.success) {
        throw new Error(
          json?.message ||
            "Failed to save gallery image"
        );
      }

      const savedItem = json.data;

      // ---------------------------------------------
      // UPDATE LOCAL LIST
      // ---------------------------------------------
      if (isEditing) {
        setItems((previousItems) =>
          previousItems.map((item) =>
            (item._id ?? item.id) === form.id
              ? savedItem
              : item
          )
        );

        logActivity(
          "Gallery",
          "Image updated",
          "bg-purple-50 text-purple-700"
        );
      }

      // ---------------------------------------------
      // ADD NEW IMAGE
      // ---------------------------------------------
      else {
        setItems((previousItems) => [
          savedItem,
          ...previousItems,
        ]);

        setPage(1);

        logActivity(
          "Gallery",
          "1 image added",
          "bg-purple-50 text-purple-700"
        );
      }

      // Notify other admin components
      window.dispatchEvent(
        new Event("admin_data_changed")
      );

      // Reset form
      resetForm();
    } catch (err) {
      console.error(
        "Error saving gallery item:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save gallery image"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="flex flex-col gap-6 lg:flex-row">

      {/* =================================================
          GALLERY TABLE
      ================================================= */}
      <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/60 ring-1 ring-black/[0.03]">

        {/* HEADER */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F2A52]">
              Manage Gallery
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View, edit, delete and manage all gallery images.
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#0F2A52] transition-colors hover:bg-gray-100"
            >
              Cancel edit
            </button>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">

            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="py-3 pr-3 font-medium">
                  #
                </th>

                <th className="py-3 pr-3 font-medium">
                  Preview
                </th>

                <th className="py-3 pr-3 font-medium">
                  Caption
                </th>

                <th className="py-3 pr-3 font-medium">
                  Date
                </th>

                <th className="py-3 pr-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {/* LOADING */}
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}

              {/* ITEMS */}
              {!loading &&
                pageItems.map((item, index) => {
                  const id =
                    item._id ?? item.id;

                  return (
                    <tr
                      key={id}
                      className="group transition-colors hover:bg-gray-50/80"
                    >

                      {/* NUMBER */}
                      <td className="py-3.5 pr-3 text-slate-400">
                        {(page - 1) *
                          PAGE_SIZE +
                          index +
                          1}
                      </td>

                      {/* IMAGE */}
                      <td className="py-3.5 pr-3">
                        {item.image ? (
                          <img
                            src={resolveImage(
                              item.image
                            )}
                            alt={
                              item.caption ||
                              "Gallery image"
                            }
                            className="h-11 w-16 rounded-lg object-cover ring-1 ring-black/5"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-11 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </td>

                      {/* CAPTION */}
                      <td className="max-w-xs py-3.5 pr-3 text-[#0F2A52]">
                        <p className="line-clamp-2">
                          {item.caption}
                        </p>
                      </td>

                      {/* DATE */}
                      <td className="whitespace-nowrap py-3.5 pr-3 text-slate-500">
                        {item.date
                          ? new Date(
                              item.date
                            ).toLocaleDateString(
                              undefined,
                              {
                                month:
                                  "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )
                          : item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString(
                              undefined,
                              {
                                month:
                                  "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 pr-3">
                        <div className="flex justify-end gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(item)
                            }
                            aria-label="Edit"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.75"
                            >
                              <path
                                d="M12 20h9"
                                strokeLinecap="round"
                              />

                              <path
                                d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(id)
                            }
                            aria-label="Delete"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.75"
                            >
                              <path
                                d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}

              {/* EMPTY */}
              {!loading &&
                pageItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-slate-500"
                    >
                      No images yet — upload one
                      to get started.
                    </td>
                  </tr>
                )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-gray-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center">

          <span>
            Showing{" "}
            {items.length === 0
              ? 0
              : (page - 1) *
                  PAGE_SIZE +
                1}
            –
            {Math.min(
              page * PAGE_SIZE,
              items.length
            )}{" "}
            of {items.length} entries
          </span>

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(
                    1,
                    current - 1
                  )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F2A52] transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              ‹
            </button>

            {/* PAGE NUMBERS */}
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
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  number === page
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "text-[#0F2A52] hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            ))}

            {/* NEXT */}
            <button
              type="button"
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F2A52] transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              ›
            </button>

          </div>
        </div>
      </div>

      {/* =================================================
          UPLOAD / EDIT FORM
      ================================================= */}
      <div className="w-full shrink-0 rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/60 ring-1 ring-black/[0.03] lg:w-96">

        <h2 className="text-lg font-semibold text-[#0F2A52]">
          {isEditing
            ? "Edit Image"
            : "Upload New Image"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >

          {/* IMAGE */}
          <div>

            <label className="mb-1.5 block text-sm font-medium text-[#0F2A52]">
              Image{" "}
              {!isEditing && (
                <span className="text-red-500">
                  *
                </span>
              )}
            </label>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();

                setIsDragging(false);

                const file =
                  event.dataTransfer
                    .files?.[0];

                handleFile(file);
              }}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className={`flex h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors ${
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/40"
              }`}
            >

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected gallery preview"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">

                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path
                        d="M12 16V4m0 0 4 4m-4-4-4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                  </div>

                  <p className="mt-2.5 text-xs font-medium text-[#0F2A52]">
                    Drag & drop image here
                  </p>

                  <p className="text-xs text-slate-500">
                    or click to browse
                  </p>
                </>
              )}

            </div>

            {isEditing && (
              <p className="mt-1.5 text-xs text-slate-500">
                Leave as-is to keep the current image,
                or choose a new one.
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                handleFile(file);
              }}
            />

          </div>

          {/* CAPTION */}
          <div>

            <label
              htmlFor="caption"
              className="mb-1.5 block text-sm font-medium text-[#0F2A52]"
            >
              Caption{" "}
              <span className="text-red-500">
                *
              </span>
            </label>

            <textarea
              id="caption"
              required
              rows={3}
              value={form.caption}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  caption:
                    event.target.value,
                }))
              }
              placeholder="Say what's happening in this photo…"
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium text-[#0F2A52] transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving…"
                : isEditing
                ? "Save changes"
                : "Upload Image"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
