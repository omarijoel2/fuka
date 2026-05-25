import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";

interface SlideSD {
  accent: string;
  badge: string;
  cta1_label: string;
  cta1_href: string;
  cta1_external: boolean;
  cta2_label: string;
  cta2_href: string;
  cta2_external: boolean;
  object_position: string;
  sort_order: number;
}

interface HeroSlide {
  id: number;
  headline: string;
  accent: string;
  badge: string;
  body: string;
  image: string;
  objectPosition: string;
  sortOrder: number;
  cta1: { label: string; href: string; external: boolean };
  cta2: { label: string; href: string; external: boolean };
  status: "published" | "draft";
  featured: boolean;
}

interface SlideForm {
  headline: string;
  accent: string;
  badge: string;
  body: string;
  image: string;
  object_position: string;
  sort_order: number;
  cta1_label: string;
  cta1_href: string;
  cta1_external: boolean;
  cta2_label: string;
  cta2_href: string;
  cta2_external: boolean;
  status: "published" | "draft";
  featured: boolean;
}

const EMPTY_FORM: SlideForm = {
  headline: "",
  accent: "",
  badge: "",
  body: "",
  image: "",
  object_position: "center center",
  sort_order: 99,
  cta1_label: "Apply for Admissions",
  cta1_href: "/admissions",
  cta1_external: false,
  cta2_label: "About KAFU",
  cta2_href: "/about",
  cta2_external: false,
  status: "draft",
  featured: false,
};

const OBJECT_POSITIONS = [
  "center center",
  "center top",
  "center bottom",
  "left center",
  "left top",
  "right center",
  "right top",
];

function Badge({ status }: { status: string }) {
  const cls =
    status === "published"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

export default function HeroSlidesCmsPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; edit?: HeroSlide }>({ open: false });
  const [form, setForm] = useState<SlideForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiGet("/admin/hero-slides");
      setSlides((d.data ?? []).sort((a: HeroSlide, b: HeroSlide) => a.sortOrder - b.sortOrder));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, sort_order: slides.length });
    setFormError("");
    setModal({ open: true });
  };

  const openEdit = (slide: HeroSlide) => {
    setForm({
      headline: slide.headline,
      accent: slide.accent,
      badge: slide.badge,
      body: slide.body,
      image: slide.image,
      object_position: slide.objectPosition,
      sort_order: slide.sortOrder,
      cta1_label: slide.cta1.label,
      cta1_href: slide.cta1.href,
      cta1_external: slide.cta1.external,
      cta2_label: slide.cta2.label,
      cta2_href: slide.cta2.href,
      cta2_external: slide.cta2.external,
      status: slide.status,
      featured: slide.featured,
    });
    setFormError("");
    setModal({ open: true, edit: slide });
  };

  const closeModal = () => {
    if (saving) return;
    setModal({ open: false });
    setFormError("");
  };

  const handleSave = async () => {
    if (!form.headline.trim()) {
      setFormError("Headline is required.");
      return;
    }
    if (!form.image.trim()) {
      setFormError("Image URL is required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (modal.edit) {
        await apiPut(`/admin/hero-slides/${modal.edit.id}`, form as unknown as Record<string, unknown>);
      } else {
        await apiPost("/admin/hero-slides", form as unknown as Record<string, unknown>);
      }
      await load();
      setModal({ open: false });
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDelete(`/admin/hero-slides/${id}`);
      await load();
    } catch {
      // silent
    } finally {
      setDeleteId(null);
    }
  };

  const move = async (index: number, direction: "up" | "down") => {
    const arr = [...slides];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    const optimistic = arr.map((s, i) => ({ ...s, sortOrder: i }));
    setSlides(optimistic);
    setReordering(true);
    try {
      const order = optimistic.map((s) => s.id);
      await apiPost("/admin/hero-slides/reorder", { order });
    } catch {
      await load();
    } finally {
      setReordering(false);
    }
  };

  const toggleStatus = async (slide: HeroSlide) => {
    const newStatus = slide.status === "published" ? "draft" : "published";
    try {
      await apiPut(`/admin/hero-slides/${slide.id}`, { status: newStatus } as Record<string, unknown>);
      await load();
    } catch {
      // silent
    }
  };

  const setField = <K extends keyof SlideForm>(k: K, v: SlideForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the rotating hero carousel on the homepage. Drag to reorder using the arrow buttons.
          </p>
        </div>
        <button
          data-testid="btn-add-hero-slide"
          onClick={openCreate}
          className="px-4 py-2 bg-[#1A5C38] text-white text-sm font-medium rounded-lg hover:bg-[#154d2f] transition-colors"
        >
          Add Slide
        </button>
      </div>

      {/* Slides Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            No hero slides yet. Click "Add Slide" to create the first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 w-14">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 w-24">Photo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Headline</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Badge</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 w-24">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide, i) => (
                <tr key={slide.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  {/* Order controls */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        data-testid={`btn-move-up-${slide.id}`}
                        onClick={() => move(i, "up")}
                        disabled={i === 0 || reordering}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <span className="text-xs text-gray-400 text-center">{i + 1}</span>
                      <button
                        data-testid={`btn-move-down-${slide.id}`}
                        onClick={() => move(i, "down")}
                        disabled={i === slides.length - 1 || reordering}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-16 h-10 rounded overflow-hidden bg-gray-100">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.headline}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: slide.objectPosition }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Headline + accent */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{slide.headline}</div>
                    {slide.accent && (
                      <div className="text-xs text-[#1A5C38] font-semibold mt-0.5">{slide.accent}</div>
                    )}
                    {slide.featured && (
                      <span className="inline-block mt-1 text-xs bg-[#C9A227]/10 text-[#a07c12] px-1.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </td>

                  {/* Badge */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 leading-snug block max-w-xs">{slide.badge}</span>
                  </td>

                  {/* Status toggle */}
                  <td className="px-4 py-3">
                    <button
                      data-testid={`btn-toggle-status-${slide.id}`}
                      onClick={() => toggleStatus(slide)}
                      title={slide.status === "published" ? "Click to unpublish" : "Click to publish"}
                    >
                      <Badge status={slide.status} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        data-testid={`btn-edit-slide-${slide.id}`}
                        onClick={() => openEdit(slide)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        data-testid={`btn-delete-slide-${slide.id}`}
                        onClick={() => setDeleteId(slide.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-base font-semibold text-gray-900">
                {modal.edit ? "Edit Slide" : "Add New Slide"}
              </h2>
              <button
                data-testid="btn-close-slide-modal"
                onClick={closeModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {formError}
                </div>
              )}

              {/* Image preview */}
              {form.image && (
                <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: form.object_position }}
                  />
                </div>
              )}

              {/* Headline + Accent */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="input-slide-headline"
                    type="text"
                    value={form.headline}
                    onChange={(e) => setField("headline", e.target.value)}
                    placeholder="e.g. Vision. Leadership."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accent Word / Phrase
                  </label>
                  <input
                    data-testid="input-slide-accent"
                    type="text"
                    value={form.accent}
                    onChange={(e) => setField("accent", e.target.value)}
                    placeholder="e.g. Excellence."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                <input
                  data-testid="input-slide-badge"
                  type="text"
                  value={form.badge}
                  onChange={(e) => setField("badge", e.target.value)}
                  placeholder="e.g. Vice-Chancellor · Prof. Peter N. Mwita"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
                <textarea
                  data-testid="input-slide-body"
                  rows={3}
                  value={form.body}
                  onChange={(e) => setField("body", e.target.value)}
                  placeholder="Short description shown on the slide..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38] resize-none"
                />
              </div>

              {/* Image URL + Object Position */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    data-testid="input-slide-image"
                    type="text"
                    value={form.image}
                    onChange={(e) => setField("image", e.target.value)}
                    placeholder="/imgs/vc.jpeg or https://kafu.ac.ke/..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Object Position</label>
                  <select
                    data-testid="select-slide-position"
                    value={form.object_position}
                    onChange={(e) => setField("object_position", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  >
                    {OBJECT_POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CTA 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA</label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    data-testid="input-cta1-label"
                    type="text"
                    value={form.cta1_label}
                    onChange={(e) => setField("cta1_label", e.target.value)}
                    placeholder="Label"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                  <input
                    data-testid="input-cta1-href"
                    type="text"
                    value={form.cta1_href}
                    onChange={(e) => setField("cta1_href", e.target.value)}
                    placeholder="URL / Path"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      data-testid="check-cta1-external"
                      type="checkbox"
                      checked={form.cta1_external}
                      onChange={(e) => setField("cta1_external", e.target.checked)}
                      className="rounded"
                    />
                    External link
                  </label>
                </div>
              </div>

              {/* CTA 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA</label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    data-testid="input-cta2-label"
                    type="text"
                    value={form.cta2_label}
                    onChange={(e) => setField("cta2_label", e.target.value)}
                    placeholder="Label"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                  <input
                    data-testid="input-cta2-href"
                    type="text"
                    value={form.cta2_href}
                    onChange={(e) => setField("cta2_href", e.target.value)}
                    placeholder="URL / Path"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      data-testid="check-cta2-external"
                      type="checkbox"
                      checked={form.cta2_external}
                      onChange={(e) => setField("cta2_external", e.target.checked)}
                      className="rounded"
                    />
                    External link
                  </label>
                </div>
              </div>

              {/* Status + Sort Order + Featured */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    data-testid="select-slide-status"
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value as "published" | "draft")}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    data-testid="input-slide-sort"
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setField("sort_order", Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5C38]"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      data-testid="check-slide-featured"
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setField("featured", e.target.checked)}
                      className="rounded"
                    />
                    Mark as featured
                  </label>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                data-testid="btn-cancel-slide"
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                data-testid="btn-save-slide"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1A5C38] rounded-lg hover:bg-[#154d2f] disabled:opacity-50"
              >
                {saving ? "Saving..." : modal.edit ? "Save Changes" : "Create Slide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Delete slide?</h3>
            <p className="text-sm text-gray-500">
              This will permanently remove the slide from the homepage carousel. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                data-testid="btn-cancel-delete"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                data-testid="btn-confirm-delete"
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
