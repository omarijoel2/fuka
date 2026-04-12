import React, { useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Save,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Banknote,
  UserCheck,
  Eye,
  EyeOff,
  Globe,
  Download,
  Award,
} from "lucide-react";

const SCHOOLS = ["SESS", "SBE", "SCIT", "SOS", "SHS"];

const RANKS = [
  "Professor",
  "Associate Professor",
  "Senior Lecturer",
  "Lecturer",
  "Tutorial Fellow",
  "Assistant Lecturer",
];

const DESIGNATION_OPTIONS = [
  "Vice-Chancellor",
  "Deputy Vice-Chancellor (Academic Affairs)",
  "Deputy Vice-Chancellor (Finance & Administration)",
  "Registrar",
  "Dean",
  "Professor",
  "Associate Professor",
  "Senior Lecturer",
  "Lecturer",
  "Tutorial Fellow",
  "Assistant Lecturer",
];

interface StaffRecord {
  id?: number;
  slug: string;
  name: string;
  title_prefix: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  designation: string;
  rank: string;
  school: string;
  department: string;
  email: string;
  phone: string;
  phone_visible: boolean;
  photo: string;
  bio: string;
  orcid_id: string;
  google_scholar_url: string;
  scopus_id: string;
  linkedin_url: string;
  cv_url: string;
  research_interests: string;
  specializations: string;
  teaching_areas: string;
  publications_text: string;
  awards_text: string;
  memberships_text: string;
  status: string;
}

const EMPTY_RECORD: StaffRecord = {
  slug: "",
  name: "",
  title_prefix: "Dr.",
  first_name: "",
  middle_name: "",
  last_name: "",
  designation: "Lecturer",
  rank: "Lecturer",
  school: "SCIT",
  department: "",
  email: "",
  phone: "",
  phone_visible: false,
  photo: "",
  bio: "",
  orcid_id: "",
  google_scholar_url: "",
  scopus_id: "",
  linkedin_url: "",
  cv_url: "",
  research_interests: "",
  specializations: "",
  teaching_areas: "",
  publications_text: "",
  awards_text: "",
  memberships_text: "",
  status: "draft",
};

interface ApiStaffItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  status: string;
  school_code: string;
  department: string;
  structured_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function staffToForm(item: ApiStaffItem): StaffRecord {
  const sd = item.structured_data ?? {};
  return {
    id: item.id,
    slug: item.slug,
    name: item.title,
    title_prefix: (sd.title_prefix as string) ?? "Dr.",
    first_name: (sd.first_name as string) ?? "",
    middle_name: (sd.middle_name as string) ?? "",
    last_name: (sd.last_name as string) ?? "",
    designation: (sd.designation as string) ?? "",
    rank: (sd.rank as string) ?? "",
    school: item.school_code ?? "",
    department: item.department ?? "",
    email: (sd.email as string) ?? "",
    phone: (sd.phone as string) ?? "",
    phone_visible: (sd.phone_visible as boolean) ?? false,
    photo: (item as any).featured_image ?? (sd.photo as string) ?? "",
    bio: item.summary ?? "",
    orcid_id: (sd.orcid_id as string) ?? "",
    google_scholar_url: (sd.google_scholar_url as string) ?? "",
    scopus_id: (sd.scopus_id as string) ?? "",
    linkedin_url: (sd.linkedin_url as string) ?? "",
    cv_url: (sd.cv_url as string) ?? "",
    research_interests: Array.isArray(sd.research_interests)
      ? (sd.research_interests as string[]).join("\n")
      : (sd.research_interests as string) ?? "",
    specializations: Array.isArray(sd.specializations)
      ? (sd.specializations as string[]).join("\n")
      : (sd.specializations as string) ?? "",
    teaching_areas: Array.isArray(sd.teaching_areas)
      ? (sd.teaching_areas as string[]).join("\n")
      : (sd.teaching_areas as string) ?? "",
    publications_text: Array.isArray(sd.publications)
      ? (sd.publications as { citation: string }[]).map((p) => p.citation).join("\n---\n")
      : "",
    awards_text: Array.isArray(sd.awards)
      ? (sd.awards as string[]).join("\n")
      : (sd.awards as string) ?? "",
    memberships_text: Array.isArray(sd.memberships)
      ? (sd.memberships as string[]).join("\n")
      : (sd.memberships as string) ?? "",
    status: item.status ?? "draft",
  };
}

function formToPayload(form: StaffRecord) {
  const splitLines = (s: string) =>
    s.split("\n").map((l) => l.trim()).filter(Boolean);

  return {
    title: form.name,
    slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    summary: form.bio,
    status: form.status,
    type: "staff_profile",
    school_code: form.school || null,
    department: form.department,
    featured_image: form.photo || null,
    structured_data: {
      title_prefix: form.title_prefix,
      first_name: form.first_name,
      middle_name: form.middle_name,
      last_name: form.last_name,
      designation: form.designation,
      rank: form.rank,
      email: form.email,
      phone: form.phone,
      phone_visible: form.phone_visible,
      photo: form.photo || null,
      orcid_id: form.orcid_id || null,
      google_scholar_url: form.google_scholar_url || null,
      scopus_id: form.scopus_id || null,
      linkedin_url: form.linkedin_url || null,
      cv_url: form.cv_url || null,
      research_interests: splitLines(form.research_interests),
      specializations: splitLines(form.specializations),
      teaching_areas: splitLines(form.teaching_areas),
      publications: form.publications_text
        ? form.publications_text.split("---").map((s) => ({ citation: s.trim(), url: null })).filter((p) => p.citation)
        : [],
      awards: splitLines(form.awards_text),
      memberships: splitLines(form.memberships_text),
    },
  };
}

type Section = "basic" | "identity" | "research" | "teaching" | "service";

function FormSection({
  id,
  label,
  icon,
  open,
  onToggle,
  children,
}: {
  id: Section;
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-3.5 bg-muted/50 hover:bg-muted transition-colors text-left"
        onClick={onToggle}
        data-testid={`section-toggle-${id}`}
      >
        <span className="flex items-center gap-2 font-semibold text-sm text-foreground">
          {icon} {label}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export default function StaffProfilesCmsPage() {
  const [staffList, setStaffList] = useState<ApiStaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [editing, setEditing] = useState<StaffRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiStaffItem | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(["basic", "identity", "research"]));

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStaff = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet("/content", { type: "staff_profile", per_page: 100 });
      setStaffList(res.data ?? []);
    } catch {
      showToast("error", "Failed to load staff profiles.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const toggleSection = (id: Section) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleEdit = (item: ApiStaffItem) => {
    setIsNew(false);
    setEditing(staffToForm(item));
  };

  const handleNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY_RECORD });
    setOpenSections(new Set(["basic", "identity", "research", "teaching", "service"]));
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = formToPayload(editing);
      if (isNew) {
        await apiPost("/content", payload);
        showToast("success", "Staff profile created successfully.");
      } else {
        await apiPut(`/content/${editing.id}`, payload);
        showToast("success", "Staff profile updated successfully.");
      }
      setEditing(null);
      setIsNew(false);
      await fetchStaff();
    } catch (e: unknown) {
      showToast("error", (e as Error)?.message ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiDelete(`/content/${deleteTarget.id}`);
      showToast("success", "Profile deleted.");
      setDeleteTarget(null);
      await fetchStaff();
    } catch {
      showToast("error", "Failed to delete profile.");
    }
  };

  const updateField = (field: keyof StaffRecord, value: string | boolean) => {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const filtered = staffList.filter((s) => {
    const matchSearch = !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase());
    const matchSchool = !schoolFilter || s.school_code === schoolFilter;
    return matchSearch && matchSchool;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-destructive text-white"
        }`} data-testid="toast-message">
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="font-bold text-foreground mb-2">Delete Profile</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={handleDelete} data-testid="btn-confirm-delete">
                Delete
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} data-testid="btn-cancel-delete">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Academic Profiles
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage staff academic profiles — ORCID, publications, supervision, grants, and teaching.
          </p>
        </div>
        {!editing && (
          <Button onClick={handleNew} data-testid="btn-new-profile">
            <Plus className="w-4 h-4 mr-2" /> New Profile
          </Button>
        )}
      </div>

      {/* Edit / Create Panel */}
      {editing && (
        <div className="bg-card border rounded-2xl shadow-sm mb-8">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-lg text-foreground">
              {isNew ? "Create Staff Profile" : `Editing: ${editing.name}`}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} data-testid="btn-cancel-edit">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} data-testid="btn-save-profile">
                <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">

            {/* Basic Information */}
            <FormSection
              id="basic"
              label="Basic Information"
              icon={<Users className="w-4 h-4" />}
              open={openSections.has("basic")}
              onToggle={() => toggleSection("basic")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Title">
                  <select
                    className="w-full h-9 border rounded-md px-3 text-sm bg-background"
                    value={editing.title_prefix}
                    onChange={(e) => updateField("title_prefix", e.target.value)}
                    data-testid="field-title-prefix"
                  >
                    {["Prof.", "Dr.", "Mr.", "Ms.", "Mrs.", "Rev.", "Eng."].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="First Name">
                  <Input
                    value={editing.first_name}
                    onChange={(e) => updateField("first_name", e.target.value)}
                    placeholder="e.g. Jane"
                    data-testid="field-first-name"
                  />
                </Field>
                <Field label="Last Name">
                  <Input
                    value={editing.last_name}
                    onChange={(e) => updateField("last_name", e.target.value)}
                    placeholder="e.g. Wesonga"
                    data-testid="field-last-name"
                  />
                </Field>
              </div>

              <Field label="Full Display Name">
                <Input
                  value={editing.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Dr. Jane A. Wesonga"
                  data-testid="field-name"
                />
              </Field>

              <Field label="URL Slug" hint="Auto-generated from name if left blank.">
                <Input
                  value={editing.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="e.g. dr-jane-wesonga"
                  className="font-mono text-xs"
                  data-testid="field-slug"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Designation">
                  <select
                    className="w-full h-9 border rounded-md px-3 text-sm bg-background"
                    value={editing.designation}
                    onChange={(e) => updateField("designation", e.target.value)}
                    data-testid="field-designation"
                  >
                    {DESIGNATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Academic Rank">
                  <select
                    className="w-full h-9 border rounded-md px-3 text-sm bg-background"
                    value={editing.rank}
                    onChange={(e) => updateField("rank", e.target.value)}
                    data-testid="field-rank"
                  >
                    <option value="">— Select Rank —</option>
                    {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="School">
                  <select
                    className="w-full h-9 border rounded-md px-3 text-sm bg-background"
                    value={editing.school}
                    onChange={(e) => updateField("school", e.target.value)}
                    data-testid="field-school"
                  >
                    <option value="">— Select School —</option>
                    {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Department">
                  <Input
                    value={editing.department}
                    onChange={(e) => updateField("department", e.target.value)}
                    placeholder="e.g. Computer Science"
                    data-testid="field-department"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <Input
                    type="email"
                    value={editing.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="e.g. j.wesonga@kafu.ac.ke"
                    data-testid="field-email"
                  />
                </Field>
                <Field label="Phone">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editing.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+254..."
                      data-testid="field-phone"
                    />
                    <button
                      type="button"
                      onClick={() => updateField("phone_visible", !editing.phone_visible)}
                      className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded border ${editing.phone_visible ? "bg-primary text-white border-primary" : "border-border text-muted-foreground"}`}
                      title={editing.phone_visible ? "Visible on website" : "Hidden from website"}
                      data-testid="toggle-phone-visible"
                    >
                      {editing.phone_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </Field>
              </div>

              <Field label="Photo URL">
                <Input
                  value={editing.photo}
                  onChange={(e) => updateField("photo", e.target.value)}
                  placeholder="https://..."
                  data-testid="field-photo"
                />
              </Field>

              <Field label="Biography (Short Summary)">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[100px]"
                  value={editing.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Brief biography shown in the profile header and staff directory..."
                  data-testid="field-bio"
                />
              </Field>

              <Field label="Publication Status">
                <select
                  className="w-full h-9 border rounded-md px-3 text-sm bg-background"
                  value={editing.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  data-testid="field-status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
            </FormSection>

            {/* Academic Identity */}
            <FormSection
              id="identity"
              label="Academic Identity & Links"
              icon={<Globe className="w-4 h-4" />}
              open={openSections.has("identity")}
              onToggle={() => toggleSection("identity")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="ORCID iD" hint="Format: 0000-0000-0000-0000">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-[#A6CE39] flex items-center justify-center text-white text-[9px] font-bold">iD</span>
                    <Input
                      className="pl-10 font-mono text-xs"
                      value={editing.orcid_id}
                      onChange={(e) => updateField("orcid_id", e.target.value)}
                      placeholder="0000-0000-0000-0000"
                      data-testid="field-orcid"
                    />
                  </div>
                </Field>
                <Field label="Scopus Author ID">
                  <Input
                    className="font-mono text-xs"
                    value={editing.scopus_id}
                    onChange={(e) => updateField("scopus_id", e.target.value)}
                    placeholder="e.g. 57218934765"
                    data-testid="field-scopus"
                  />
                </Field>
              </div>

              <Field label="Google Scholar Profile URL">
                <Input
                  value={editing.google_scholar_url}
                  onChange={(e) => updateField("google_scholar_url", e.target.value)}
                  placeholder="https://scholar.google.com/citations?user=..."
                  data-testid="field-scholar-url"
                />
              </Field>

              <Field label="LinkedIn Profile URL">
                <Input
                  value={editing.linkedin_url}
                  onChange={(e) => updateField("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  data-testid="field-linkedin-url"
                />
              </Field>

              <Field label="CV / Resume URL">
                <div className="relative">
                  <Download className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={editing.cv_url}
                    onChange={(e) => updateField("cv_url", e.target.value)}
                    placeholder="https://... (PDF link)"
                    data-testid="field-cv-url"
                  />
                </div>
              </Field>
            </FormSection>

            {/* Research */}
            <FormSection
              id="research"
              label="Research"
              icon={<TrendingUp className="w-4 h-4" />}
              open={openSections.has("research")}
              onToggle={() => toggleSection("research")}
            >
              <Field label="Fields of Specialization" hint="One specialization per line.">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[80px]"
                  value={editing.specializations}
                  onChange={(e) => updateField("specializations", e.target.value)}
                  placeholder={"Artificial Intelligence\nMachine Learning\nComputer Vision"}
                  data-testid="field-specializations"
                />
              </Field>

              <Field label="Research Interests" hint="One interest per line.">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[80px]"
                  value={editing.research_interests}
                  onChange={(e) => updateField("research_interests", e.target.value)}
                  placeholder={"Deep learning for crop disease detection\nFederated learning\nMalaria surveillance"}
                  data-testid="field-research-interests"
                />
              </Field>

              <Field
                label="Selected Publications"
                hint="Enter full citations separated by a line with --- (three dashes). DOI links can be included inline."
              >
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[120px] font-mono text-xs"
                  value={editing.publications_text}
                  onChange={(e) => updateField("publications_text", e.target.value)}
                  placeholder={"Omieno, K.K. et al. (2022). Machine learning for malaria... Journal of Healthcare Informatics, 14(3), 201–218.\n---\nOmieno, K.K. (2017). Software Engineering Pedagogy... IEEE Transactions on Education."}
                  data-testid="field-publications"
                />
              </Field>
            </FormSection>

            {/* Teaching */}
            <FormSection
              id="teaching"
              label="Teaching"
              icon={<BookOpen className="w-4 h-4" />}
              open={openSections.has("teaching")}
              onToggle={() => toggleSection("teaching")}
            >
              <Field label="Teaching Areas" hint="One area per line.">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[80px]"
                  value={editing.teaching_areas}
                  onChange={(e) => updateField("teaching_areas", e.target.value)}
                  placeholder={"Artificial Intelligence\nMachine Learning\nAlgorithm Design"}
                  data-testid="field-teaching-areas"
                />
              </Field>
            </FormSection>

            {/* Service */}
            <FormSection
              id="service"
              label="Service & Recognition"
              icon={<Award className="w-4 h-4" />}
              open={openSections.has("service")}
              onToggle={() => toggleSection("service")}
            >
              <Field label="Awards & Recognition" hint="One award per line.">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[80px]"
                  value={editing.awards_text}
                  onChange={(e) => updateField("awards_text", e.target.value)}
                  placeholder={"Kenya ICT Authority Research Excellence Award 2021\nKAFU Distinguished Researcher Award 2019"}
                  data-testid="field-awards"
                />
              </Field>

              <Field label="Professional Memberships" hint="One membership per line.">
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y min-h-[80px]"
                  value={editing.memberships_text}
                  onChange={(e) => updateField("memberships_text", e.target.value)}
                  placeholder={"IEEE Computer Society\nAssociation for Computing Machinery (ACM)"}
                  data-testid="field-memberships"
                />
              </Field>
            </FormSection>

          </div>
        </div>
      )}

      {/* List */}
      {!editing && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search by name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="search-staff-list"
              />
              {search && (
                <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearch("")} data-testid="clear-search">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <select
              className="h-10 border rounded-md px-3 text-sm bg-background"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              data-testid="filter-school"
            >
              <option value="">All Schools</option>
              {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border rounded-xl">
              <Users className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
              <p className="font-semibold text-foreground mb-1">No profiles found</p>
              <p className="text-muted-foreground text-sm mb-4">Create a new profile or adjust your filters.</p>
              <Button onClick={handleNew} data-testid="btn-new-profile-empty">
                <Plus className="w-4 h-4 mr-2" /> Create Profile
              </Button>
            </div>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase hidden sm:table-cell">School</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase hidden md:table-cell">Department</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-xs text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const sd = item.structured_data ?? {};
                    const hasOrcid = !!(sd as any).orcid_id;
                    return (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors" data-testid={`staff-row-${item.slug}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-semibold text-foreground">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{(sd as any).designation ?? ""}</p>
                            </div>
                            {hasOrcid && (
                              <span className="w-4 h-4 rounded bg-[#A6CE39] flex items-center justify-center text-white text-[8px] font-bold shrink-0" title="ORCID linked">iD</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs px-2 py-0.5 bg-muted rounded font-medium">{item.school_code ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                          {item.department ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.status === "published" ? "bg-emerald-100 text-emerald-700" :
                            item.status === "archived" ? "bg-muted text-muted-foreground" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`/staff/${item.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                              title="View on site"
                              data-testid={`btn-view-${item.slug}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                              onClick={() => handleEdit(item)}
                              title="Edit profile"
                              data-testid={`btn-edit-${item.slug}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteTarget(item)}
                              title="Delete profile"
                              data-testid={`btn-delete-${item.slug}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2.5 bg-muted/30 border-t text-xs text-muted-foreground">
                {filtered.length} profile{filtered.length !== 1 ? "s" : ""} shown · Supervision data and grants managed per-profile via API
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
