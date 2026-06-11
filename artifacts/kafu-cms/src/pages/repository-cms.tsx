import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Edit, Trash2, BookOpen, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface RepositoryItem {
  id: number;
  title: string;
  slug: string;
  abstract: string;
  type: string;
  department: string | null;
  research_theme: string | null;
  authors: string[];
  supervisor: string | null;
  student_name: string | null;
  degree: string | null;
  keywords: string[];
  year: number | null;
  publisher: string | null;
  journal_name: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  doi: string | null;
  isbn_issn: string | null;
  funded_by: string | null;
  language: string | null;
  access: string;
  embargo_until: string | null;
  license: string | null;
  file_url: string | null;
  citation_count: number;
  downloads: number;
  views: number;
  status: string;
  seo_meta: { title?: string; description?: string } | null;
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
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};

const DEPARTMENTS = ["SESS", "SBE", "SCIT", "SOS", "SHS"];

const EMPTY_FORM = {
  title: "",
  slug: "",
  abstract: "",
  type: "thesis" as string,
  department: "",
  research_theme: "",
  authors_raw: "",
  supervisor: "",
  student_name: "",
  degree: "",
  keywords_raw: "",
  year: new Date().getFullYear(),
  publisher: "",
  journal_name: "",
  volume: "",
  issue: "",
  pages: "",
  doi: "",
  isbn_issn: "",
  funded_by: "",
  language: "English",
  access: "open" as string,
  embargo_until: "",
  license: "cc_by" as string,
  file_url: "",
  citation_count: 0,
  status: "draft" as string,
  meta_title: "",
  meta_description: "",
};

type FormState = typeof EMPTY_FORM;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const SELECT_CLS = INPUT_CLS;

export default function RepositoryCmsPage() {
  const [items, setItems]             = useState<RepositoryItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editingItem, setEditingItem] = useState<RepositoryItem | null>(null);
  const [form, setForm]               = useState<FormState>({ ...EMPTY_FORM });
  const [saving, setSaving]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RepositoryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search)       params.set("search", search);
      if (filterType)   params.set("type", filterType);
      if (filterStatus) params.set("status", filterStatus);
      params.set("per_page", "50");
      const data = await apiFetch(`/repository?${params.toString()}`);
      setItems(data?.data ?? data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load repository items");
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterStatus]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openCreate() {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM });
    setFormError(null);
    setShowModal(true);
  }

  function openEdit(item: RepositoryItem) {
    setEditingItem(item);
    setForm({
      title:         item.title,
      slug:          item.slug,
      abstract:      item.abstract ?? "",
      type:          item.type,
      department:    item.department ?? "",
      research_theme: item.research_theme ?? "",
      authors_raw:   item.authors?.join("; ") ?? "",
      supervisor:    item.supervisor ?? "",
      student_name:  item.student_name ?? "",
      degree:        item.degree ?? "",
      keywords_raw:  item.keywords?.join(", ") ?? "",
      year:          item.year ?? new Date().getFullYear(),
      publisher:     item.publisher ?? "",
      journal_name:  item.journal_name ?? "",
      volume:        item.volume ?? "",
      issue:         item.issue ?? "",
      pages:         item.pages ?? "",
      doi:           item.doi ?? "",
      isbn_issn:     item.isbn_issn ?? "",
      funded_by:     item.funded_by ?? "",
      language:      item.language ?? "English",
      access:        item.access ?? "open",
      embargo_until: item.embargo_until ?? "",
      license:       item.license ?? "cc_by",
      file_url:      item.file_url ?? "",
      citation_count: item.citation_count ?? 0,
      status:        item.status,
      meta_title:    item.seo_meta?.title ?? "",
      meta_description: item.seo_meta?.description ?? "",
    });
    setFormError(null);
    setShowModal(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !editingItem) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim() || !form.abstract.trim()) {
      setFormError("Title and abstract are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        slug:           form.slug || slugify(form.title),
        title:          form.title,
        abstract:       form.abstract,
        type:           form.type,
        department:     form.department || null,
        research_theme: form.research_theme || null,
        authors:        form.authors_raw.split(";").map((s) => s.trim()).filter(Boolean),
        supervisor:     form.supervisor || null,
        student_name:   form.student_name || null,
        degree:         form.degree || null,
        keywords:       form.keywords_raw.split(",").map((s) => s.trim()).filter(Boolean),
        year:           form.year,
        publisher:      form.publisher || null,
        journal_name:   form.journal_name || null,
        volume:         form.volume || null,
        issue:          form.issue || null,
        pages:          form.pages || null,
        doi:            form.doi || null,
        isbn_issn:      form.isbn_issn || null,
        funded_by:      form.funded_by || null,
        language:       form.language,
        access:         form.access,
        embargo_until:  form.embargo_until || null,
        license:        form.license,
        file_url:       form.file_url || null,
        citation_count: form.citation_count,
        status:         form.status,
        seo_meta:       (form.meta_title || form.meta_description)
          ? { title: form.meta_title || form.title, description: form.meta_description || form.abstract.slice(0, 155) }
          : null,
      };
      if (editingItem) {
        await apiFetch(`/repository/${editingItem.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/repository`, { method: "POST", body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchItems();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Save failed");
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

  const isJournal    = form.type === "journal_article";
  const isConference = form.type === "conference_paper";
  const isThesisDiss = form.type === "thesis" || form.type === "dissertation";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Institutional Repository</h1>
            <p className="text-sm text-gray-500">{items.length} record{items.length !== 1 ? "s" : ""}</p>
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
              placeholder="Search by title, author, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchItems()}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <select
              data-testid="select-filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={SELECT_CLS}
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
              className={SELECT_CLS}
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4" data-testid="repo-error">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Dept</th>
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
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.authors?.slice(0, 2).join(", ")}
                        {(item.authors?.length ?? 0) > 2 ? " et al." : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLOR[item.type] ?? "bg-gray-100 text-gray-700"}`}>
                        {TYPE_LABELS[item.type] ?? item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{item.department ?? "—"}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600">{item.year ?? "—"}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ACCESS_COLOR[item.access] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.access}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[item.status] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.status.replace(/_/g, " ")}
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? "Edit Repository Record" : "Add Repository Record"}
              </h2>
              <button
                data-testid="btn-close-repo-modal"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 max-h-[72vh] overflow-y-auto">

              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              {/* Core */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Core Details</h3>
                <LabeledField label="Title *">
                  <input data-testid="input-repo-title" type="text" value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className={INPUT_CLS} placeholder="Full title of the work" />
                </LabeledField>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Slug">
                    <input data-testid="input-repo-slug" type="text" value={form.slug}
                      onChange={(e) => setField("slug", e.target.value)} className={INPUT_CLS} />
                  </LabeledField>
                  <LabeledField label="Year Published">
                    <input data-testid="input-repo-year" type="number" min="1990" max="2030"
                      value={form.year} onChange={(e) => setField("year", parseInt(e.target.value))}
                      className={INPUT_CLS} />
                  </LabeledField>
                </div>
                <LabeledField label="Abstract *">
                  <textarea data-testid="input-repo-abstract" value={form.abstract} rows={4}
                    onChange={(e) => setField("abstract", e.target.value)}
                    className={INPUT_CLS} placeholder="Brief summary..." />
                </LabeledField>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Type">
                    <select data-testid="select-repo-type" value={form.type}
                      onChange={(e) => setField("type", e.target.value)} className={SELECT_CLS}>
                      {Object.entries(TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </LabeledField>
                  <LabeledField label="Language">
                    <input data-testid="input-repo-language" type="text" value={form.language}
                      onChange={(e) => setField("language", e.target.value)} className={INPUT_CLS} />
                  </LabeledField>
                </div>
              </section>

              {/* Classification */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Classification</h3>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Department / School">
                    <select data-testid="select-repo-department" value={form.department}
                      onChange={(e) => setField("department", e.target.value)} className={SELECT_CLS}>
                      <option value="">— Select —</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </LabeledField>
                  <LabeledField label="Research Theme">
                    <input data-testid="input-repo-theme" type="text" value={form.research_theme}
                      onChange={(e) => setField("research_theme", e.target.value)}
                      className={INPUT_CLS} placeholder="e.g. Public Health" />
                  </LabeledField>
                </div>
                <LabeledField label="Keywords (comma-separated)">
                  <input data-testid="input-repo-keywords" type="text" value={form.keywords_raw}
                    onChange={(e) => setField("keywords_raw", e.target.value)}
                    className={INPUT_CLS} placeholder="machine learning, NLP, education" />
                </LabeledField>
              </section>

              {/* Authorship */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Authorship</h3>
                <LabeledField label="Authors (semicolon-separated)">
                  <input data-testid="input-repo-authors" type="text" value={form.authors_raw}
                    onChange={(e) => setField("authors_raw", e.target.value)}
                    className={INPUT_CLS} placeholder="Jane Ochieng; John Mwangi" />
                </LabeledField>
                {isThesisDiss && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <LabeledField label="Student Name">
                      <input data-testid="input-repo-student" type="text" value={form.student_name}
                        onChange={(e) => setField("student_name", e.target.value)} className={INPUT_CLS} />
                    </LabeledField>
                    <LabeledField label="Supervisor(s)">
                      <input data-testid="input-repo-supervisor" type="text" value={form.supervisor}
                        onChange={(e) => setField("supervisor", e.target.value)}
                        className={INPUT_CLS} placeholder="Prof. Alice, Dr. Bob" />
                    </LabeledField>
                    <LabeledField label="Degree">
                      <select data-testid="select-repo-degree" value={form.degree}
                        onChange={(e) => setField("degree", e.target.value)} className={SELECT_CLS}>
                        <option value="">— Select —</option>
                        <option value="PhD">PhD</option>
                        <option value="Masters">Masters</option>
                        <option value="Postgrad Diploma">Postgrad Diploma</option>
                        <option value="Undergraduate">Undergraduate</option>
                      </select>
                    </LabeledField>
                  </div>
                )}
              </section>

              {/* Publication Details */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Publication Details</h3>
                <LabeledField label="Publisher">
                  <input data-testid="input-repo-publisher" type="text" value={form.publisher}
                    onChange={(e) => setField("publisher", e.target.value)} className={INPUT_CLS} />
                </LabeledField>
                {(isJournal || isConference) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <LabeledField label={isJournal ? "Journal Name" : "Conference / Journal Name"}>
                        <input data-testid="input-repo-journal" type="text" value={form.journal_name}
                          onChange={(e) => setField("journal_name", e.target.value)} className={INPUT_CLS} />
                      </LabeledField>
                    </div>
                    <LabeledField label="Volume">
                      <input data-testid="input-repo-volume" type="text" value={form.volume}
                        onChange={(e) => setField("volume", e.target.value)} className={INPUT_CLS} />
                    </LabeledField>
                    <LabeledField label="Issue">
                      <input data-testid="input-repo-issue" type="text" value={form.issue}
                        onChange={(e) => setField("issue", e.target.value)} className={INPUT_CLS} />
                    </LabeledField>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Pages">
                    <input data-testid="input-repo-pages" type="text" value={form.pages}
                      onChange={(e) => setField("pages", e.target.value)}
                      className={INPUT_CLS} placeholder="e.g. 45–67" />
                  </LabeledField>
                  <LabeledField label="DOI">
                    <input data-testid="input-repo-doi" type="text" value={form.doi}
                      onChange={(e) => setField("doi", e.target.value)}
                      className={INPUT_CLS} placeholder="10.xxxx/xxxxx" />
                  </LabeledField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="ISBN / ISSN">
                    <input data-testid="input-repo-isbn" type="text" value={form.isbn_issn}
                      onChange={(e) => setField("isbn_issn", e.target.value)} className={INPUT_CLS} />
                  </LabeledField>
                  <LabeledField label="Funded By">
                    <input data-testid="input-repo-funded" type="text" value={form.funded_by}
                      onChange={(e) => setField("funded_by", e.target.value)}
                      className={INPUT_CLS} placeholder="Grant source / funder" />
                  </LabeledField>
                </div>
              </section>

              {/* Access & File */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Access &amp; File</h3>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Access Type">
                    <select data-testid="select-repo-access" value={form.access}
                      onChange={(e) => setField("access", e.target.value)} className={SELECT_CLS}>
                      <option value="open">Open Access</option>
                      <option value="restricted">Restricted</option>
                      <option value="embargo">Embargo</option>
                    </select>
                  </LabeledField>
                  <LabeledField label="License">
                    <select data-testid="select-repo-license" value={form.license}
                      onChange={(e) => setField("license", e.target.value)} className={SELECT_CLS}>
                      <option value="cc_by">CC BY</option>
                      <option value="cc_by_nc">CC BY-NC</option>
                      <option value="cc_by_sa">CC BY-SA</option>
                      <option value="open_access">Open Access</option>
                      <option value="all_rights_reserved">All Rights Reserved</option>
                    </select>
                  </LabeledField>
                </div>
                {form.access === "embargo" && (
                  <LabeledField label="Embargo Until">
                    <input data-testid="input-repo-embargo" type="date" value={form.embargo_until}
                      onChange={(e) => setField("embargo_until", e.target.value)} className={INPUT_CLS} />
                  </LabeledField>
                )}
                <LabeledField label="File URL (PDF or link)">
                  <input data-testid="input-repo-file" type="url" value={form.file_url}
                    onChange={(e) => setField("file_url", e.target.value)}
                    className={INPUT_CLS} placeholder="https://..." />
                </LabeledField>
              </section>

              {/* Workflow & Stats */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status &amp; Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <LabeledField label="Status">
                    <select data-testid="select-repo-status" value={form.status}
                      onChange={(e) => setField("status", e.target.value)} className={SELECT_CLS}>
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="published">Published</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                  </LabeledField>
                  <LabeledField label="Citation Count">
                    <input data-testid="input-repo-citations" type="number" min="0"
                      value={form.citation_count}
                      onChange={(e) => setField("citation_count", parseInt(e.target.value) || 0)}
                      className={INPUT_CLS} />
                  </LabeledField>
                </div>
              </section>

              {/* SEO */}
              <section className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO (optional)</h3>
                <LabeledField label="Meta Title">
                  <input data-testid="input-repo-meta-title" type="text" value={form.meta_title}
                    onChange={(e) => setField("meta_title", e.target.value)}
                    className={INPUT_CLS} placeholder="Defaults to title" />
                </LabeledField>
                <LabeledField label="Meta Description">
                  <textarea data-testid="input-repo-meta-desc" value={form.meta_description} rows={2}
                    onChange={(e) => setField("meta_description", e.target.value)}
                    className={INPUT_CLS} placeholder="Defaults to first 155 chars of abstract" />
                </LabeledField>
              </section>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                data-testid="btn-cancel-repo-modal"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="btn-save-repo"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : (editingItem ? "Save Changes" : "Add Record")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Record?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This will permanently delete <strong>{deleteTarget.title}</strong>. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                data-testid="btn-cancel-delete"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                data-testid="btn-confirm-delete"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
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
