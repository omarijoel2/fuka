import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit, Trash2, BookOpen, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface RepositoryItem {
  id: number;
  title: string;
  slug: string;
  abstract?: string;
  type: string;
  department?: string;
  school?: string;
  authors: string[];
  supervisors: string[];
  keywords: string[];
  year_published?: number;
  journal_name?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  conference_name?: string;
  conference_location?: string;
  isbn_issn?: string;
  doi?: string;
  language?: string;
  access_type: string;
  embargo_until?: string;
  license?: string;
  status: string;
  file_url?: string;
  thumbnail_url?: string;
  external_url?: string;
  citation_count: number;
  download_count: number;
  is_featured: boolean;
  sort_order: number;
  seo_meta?: { title?: string; description?: string } | null;
}

const TYPE_LABELS: Record<string, string> = {
  thesis: "Thesis",
  dissertation: "Dissertation",
  journal_article: "Journal Article",
  conference_paper: "Conference Paper",
  book_chapter: "Book Chapter",
  research_report: "Research Report",
  working_paper: "Working Paper",
  dataset: "Dataset",
};

const TYPE_COLOR: Record<string, string> = {
  thesis: "bg-blue-100 text-blue-800",
  dissertation: "bg-indigo-100 text-indigo-800",
  journal_article: "bg-green-100 text-green-800",
  conference_paper: "bg-purple-100 text-purple-800",
  book_chapter: "bg-amber-100 text-amber-800",
  research_report: "bg-orange-100 text-orange-800",
  working_paper: "bg-teal-100 text-teal-800",
  dataset: "bg-cyan-100 text-cyan-800",
};

const ACCESS_COLOR: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  restricted: "bg-red-100 text-red-800",
  embargo: "bg-amber-100 text-amber-800",
};

const STATUS_COLOR: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-600",
  under_review: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
};

const SCHOOLS = ["SESS", "SBE", "SCIT", "SOS", "SHS"];
const DEPARTMENTS: Record<string, string[]> = {
  SESS: ["Education", "Sociology", "Peace Studies"],
  SBE: ["Business", "Economics", "Accounting"],
  SCIT: ["Computer Science", "Information Technology", "Mathematics"],
  SOS: ["Biology", "Chemistry", "Physics", "Environmental Science"],
  SHS: ["Nursing", "Public Health", "Clinical Medicine"],
};

const EMPTY_FORM = {
  title: "",
  slug: "",
  meta_title: "",
  meta_description: "",
  abstract: "",
  type: "thesis",
  department: "",
  school: "",
  authors_raw: "",
  supervisors_raw: "",
  keywords_raw: "",
  year_published: new Date().getFullYear(),
  journal_name: "",
  volume: "",
  issue: "",
  pages: "",
  conference_name: "",
  conference_location: "",
  isbn_issn: "",
  doi: "",
  language: "English",
  access_type: "open",
  embargo_until: "",
  license: "cc_by",
  status: "draft",
  file_url: "",
  thumbnail_url: "",
  external_url: "",
  citation_count: 0,
  download_count: 0,
  is_featured: false,
  sort_order: 0,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function RepositoryCmsPage() {
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RepositoryItem | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RepositoryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterType) params.set("type", filterType);
      if (filterStatus) params.set("status", filterStatus);
      if (filterSchool) params.set("school", filterSchool);
      params.set("per_page", "50");
      const data = await apiFetch(`/repository?${params.toString()}`);
      setItems(data.data || data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load repository items");
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterStatus, filterSchool]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openCreate() {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(item: RepositoryItem) {
    setEditingItem(item);
    setForm({
      title: item.title,
      slug: item.slug,
      abstract: item.abstract || "",
      type: item.type,
      department: item.department || "",
      school: item.school || "",
      authors_raw: item.authors.join("; "),
      supervisors_raw: item.supervisors.join("; "),
      keywords_raw: item.keywords.join(", "),
      year_published: item.year_published ?? new Date().getFullYear(),
      journal_name: item.journal_name || "",
      volume: item.volume || "",
      issue: item.issue || "",
      pages: item.pages || "",
      conference_name: item.conference_name || "",
      conference_location: item.conference_location || "",
      isbn_issn: item.isbn_issn || "",
      doi: item.doi || "",
      language: item.language || "English",
      access_type: item.access_type,
      embargo_until: item.embargo_until || "",
      license: item.license || "cc_by",
      status: item.status,
      file_url: item.file_url || "",
      thumbnail_url: item.thumbnail_url || "",
      external_url: item.external_url || "",
      citation_count: item.citation_count,
      download_count: item.download_count,
      is_featured: item.is_featured,
      sort_order: item.sort_order,
      meta_title: item.seo_meta?.title || "",
      meta_description: item.seo_meta?.description || "",
    });
    setShowModal(true);
  }

  function setField(key: string, value: unknown) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !editingItem) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        authors: form.authors_raw.split(";").map((s) => s.trim()).filter(Boolean),
        supervisors: form.supervisors_raw.split(";").map((s) => s.trim()).filter(Boolean),
        keywords: form.keywords_raw.split(",").map((s) => s.trim()).filter(Boolean),
        seo_meta: (form.meta_title || form.meta_description)
          ? { title: form.meta_title || form.title, description: form.meta_description || form.abstract?.slice(0, 155) }
          : null,
      };
      if (editingItem) {
        await apiFetch(`/repository/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/repository`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      fetchItems();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await apiFetch(`/repository/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchItems();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const isJournal = form.type === "journal_article";
  const isConference = form.type === "conference_paper";
  const isThesisDiss = form.type === "thesis" || form.type === "dissertation";
  const schoolDepts = form.school ? (DEPARTMENTS[form.school] || []) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Institutional Repository</h1>
            <p className="text-sm text-gray-500">{items.length} record{items.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>
        <button
          data-testid="btn-add-repository-item"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              data-testid="input-repo-search"
              type="text"
              placeholder="Search by title, author, keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            data-testid="btn-toggle-filters"
            onClick={() => setShowFilters((p) => !p)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <select
              data-testid="select-filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Types</option>
              {Object.entries(TYPE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <select
              data-testid="select-filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="under_review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              data-testid="select-filter-school"
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Schools</option>
              {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No records found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">School</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Year</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Access</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 line-clamp-2 max-w-xs">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.authors.slice(0, 2).join(", ")}{item.authors.length > 2 ? " et al." : ""}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLOR[item.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {TYPE_LABELS[item.type] ?? item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{item.school}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{item.year_published}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ACCESS_COLOR[item.access_type] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.access_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[item.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          data-testid={`btn-edit-repo-${item.id}`}
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          data-testid={`btn-delete-repo-${item.id}`}
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? "Edit Repository Record" : "Add Repository Record"}
              </h2>
              <button
                data-testid="btn-close-repo-modal"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Core fields */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Core Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title <span className="text-red-500">*</span></label>
                    <input
                      data-testid="input-repo-title"
                      type="text"
                      value={form.title}
                      onChange={(e) => setField("title", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Full title of the work"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                      <input
                        data-testid="input-repo-slug"
                        type="text"
                        value={form.slug}
                        onChange={(e) => setField("slug", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Year Published</label>
                      <input
                        data-testid="input-repo-year"
                        type="number"
                        min="1990"
                        max="2030"
                        value={form.year_published}
                        onChange={(e) => setField("year_published", parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Abstract</label>
                    <textarea
                      data-testid="input-repo-abstract"
                      value={form.abstract}
                      onChange={(e) => setField("abstract", e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Brief summary of the work…"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <select
                        data-testid="select-repo-type"
                        value={form.type}
                        onChange={(e) => setField("type", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {Object.entries(TYPE_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                      <input
                        data-testid="input-repo-language"
                        type="text"
                        value={form.language}
                        onChange={(e) => setField("language", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Authorship */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Authorship</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Authors <span className="text-gray-400 text-xs">(separate by semicolon)</span></label>
                    <input
                      data-testid="input-repo-authors"
                      type="text"
                      value={form.authors_raw}
                      onChange={(e) => setField("authors_raw", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="John Doe; Jane Smith"
                    />
                  </div>
                  {isThesisDiss && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Supervisors <span className="text-gray-400 text-xs">(separate by semicolon)</span></label>
                      <input
                        data-testid="input-repo-supervisors"
                        type="text"
                        value={form.supervisors_raw}
                        onChange={(e) => setField("supervisors_raw", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Prof. Alice Ochieng"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Keywords <span className="text-gray-400 text-xs">(comma-separated)</span></label>
                    <input
                      data-testid="input-repo-keywords"
                      type="text"
                      value={form.keywords_raw}
                      onChange={(e) => setField("keywords_raw", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="machine learning, healthcare, Kenya"
                    />
                  </div>
                </div>
              </section>

              {/* School / Dept */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Affiliation</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">School</label>
                    <select
                      data-testid="select-repo-school"
                      value={form.school}
                      onChange={(e) => { setField("school", e.target.value); setField("department", ""); }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Select school…</option>
                      {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                    {schoolDepts.length > 0 ? (
                      <select
                        data-testid="select-repo-department"
                        value={form.department}
                        onChange={(e) => setField("department", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="">Select dept…</option>
                        {schoolDepts.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    ) : (
                      <input
                        data-testid="input-repo-department"
                        type="text"
                        value={form.department}
                        onChange={(e) => setField("department", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Department name"
                      />
                    )}
                  </div>
                </div>
              </section>

              {/* Type-specific fields */}
              {(isJournal || isConference) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    {isJournal ? "Journal Details" : "Conference Details"}
                  </h3>
                  <div className="space-y-3">
                    {isJournal && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Journal Name</label>
                          <input
                            data-testid="input-repo-journal"
                            type="text"
                            value={form.journal_name}
                            onChange={(e) => setField("journal_name", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Volume</label>
                            <input data-testid="input-repo-volume" type="text" value={form.volume} onChange={(e) => setField("volume", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Issue</label>
                            <input data-testid="input-repo-issue" type="text" value={form.issue} onChange={(e) => setField("issue", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Pages</label>
                            <input data-testid="input-repo-pages" type="text" value={form.pages} onChange={(e) => setField("pages", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                        </div>
                      </>
                    )}
                    {isConference && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Conference Name</label>
                          <input data-testid="input-repo-conf-name" type="text" value={form.conference_name} onChange={(e) => setField("conference_name", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                          <input data-testid="input-repo-conf-location" type="text" value={form.conference_location} onChange={(e) => setField("conference_location", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Identifiers */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Identifiers &amp; Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">DOI</label>
                    <input data-testid="input-repo-doi" type="text" value={form.doi} onChange={(e) => setField("doi", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="10.xxxx/xxxxx" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">ISBN / ISSN</label>
                    <input data-testid="input-repo-isbn" type="text" value={form.isbn_issn} onChange={(e) => setField("isbn_issn", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">File URL</label>
                    <input data-testid="input-repo-file-url" type="url" value={form.file_url} onChange={(e) => setField("file_url", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://…" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">External URL</label>
                    <input data-testid="input-repo-external-url" type="url" value={form.external_url} onChange={(e) => setField("external_url", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://…" />
                  </div>
                </div>
              </section>

              {/* Access & Status */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Access &amp; Publishing</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Access Type</label>
                    <select data-testid="select-repo-access" value={form.access_type} onChange={(e) => setField("access_type", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="open">Open Access</option>
                      <option value="restricted">Restricted</option>
                      <option value="embargo">Embargo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">License</label>
                    <select data-testid="select-repo-license" value={form.license} onChange={(e) => setField("license", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="cc_by">CC BY</option>
                      <option value="cc_by_nc">CC BY-NC</option>
                      <option value="cc_by_sa">CC BY-SA</option>
                      <option value="open_access">Open Access</option>
                      <option value="all_rights_reserved">All Rights Reserved</option>
                    </select>
                  </div>
                  {form.access_type === "embargo" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Embargo Until</label>
                      <input data-testid="input-repo-embargo" type="date" value={form.embargo_until} onChange={(e) => setField("embargo_until", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select data-testid="select-repo-status" value={form.status} onChange={(e) => setField("status", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        data-testid="check-repo-featured"
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) => setField("is_featured", e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-gray-700">Feature on repository homepage</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Metrics */}
              <section>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Metrics</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Citations</label>
                    <input data-testid="input-repo-citations" type="number" min="0" value={form.citation_count} onChange={(e) => setField("citation_count", parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Downloads</label>
                    <input data-testid="input-repo-downloads" type="number" min="0" value={form.download_count} onChange={(e) => setField("download_count", parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                    <input data-testid="input-repo-sort" type="number" value={form.sort_order} onChange={(e) => setField("sort_order", parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
              </section>

              {/* SEO Overrides */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">SEO Overrides <span className="font-normal text-gray-500">(optional — defaults to title/abstract)</span></h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={form.meta_title}
                      onChange={(e) => setField("meta_title", e.target.value)}
                      placeholder={form.title || "Auto-generated from title"}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      data-testid="input-meta-title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={form.meta_description}
                      onChange={(e) => setField("meta_description", e.target.value)}
                      placeholder="Auto-generated from abstract"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                      data-testid="input-meta-desc"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
              <button
                data-testid="btn-cancel-repo-modal"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="btn-save-repo-item"
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : editingItem ? "Save Changes" : "Create Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Record?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to permanently delete <strong>"{deleteTarget.title}"</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                data-testid="btn-cancel-delete"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="btn-confirm-delete"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
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
