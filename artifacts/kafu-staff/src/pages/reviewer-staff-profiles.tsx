import React, { useState, useEffect, useCallback, useRef } from "react";
import { reviewerFetch, reviewerFetchForm, STATUS_COLORS, STATUS_LABELS, fmtDate } from "@/lib/api";
import {
  Search, ChevronDown, UserPlus, RefreshCw, X, Save,
  ChevronRight, Users, AlertCircle, CheckCircle, RotateCcw,
  UserCheck, UserX, Eye, EyeOff, Copy, Loader2, Camera, FileText, Download
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StaffSummary {
  id: number;
  name: string;
  email: string;
  title: string | null;
  job_title: string | null;
  department: string | null;
  staff_number: string | null;
  status: "active" | "inactive" | "locked";
  submission: {
    id: number;
    workflow_status: string;
    completeness_score: number;
    submitted_at: string | null;
    updated_at: string | null;
  } | null;
}

interface ProfileData {
  personal?: Record<string, string>;
  bio?: { biography?: string };
  qualifications?: { qualifications?: string };
  teaching?: { teaching_areas?: string; courses_taught?: string };
  research?: { research_interests?: string; orcid?: string; google_scholar?: string; scopus_id?: string };
  contact?: { contact_email?: string; office_location?: string; office_hours?: string; personal_website?: string };
  uploads?: { photo_url?: string; cv_url?: string };
}

interface StaffDetail {
  user: StaffSummary & { school_code?: string; payroll_number?: string };
  submission: {
    id: number;
    workflow_status: string;
    completeness_score: number;
    section_completion: Record<string, number>;
    profile_data: ProfileData;
    submitted_at: string | null;
    updated_at: string | null;
    reviewer_summary: string | null;
    comments: { id: number; comment: string; comment_type: string; author: { name: string }; created_at: string }[];
  } | null;
}

const TABS = [
  { key: "personal", label: "Personal" },
  { key: "bio", label: "Bio" },
  { key: "qualifications", label: "Qualifications" },
  { key: "teaching", label: "Teaching" },
  { key: "research", label: "Research" },
  { key: "contact", label: "Contact" },
  { key: "uploads", label: "Uploads" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "no_profile", label: "No Profile" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "revision_requested", label: "Revision Requested" },
  { value: "approved", label: "Approved" },
];

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ type, text, onClose }: { type: "success" | "error"; text: string; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
      {type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {text}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── Add Staff Modal ──────────────────────────────────────────────────────────

function AddStaffModal({ onClose, onCreated }: { onClose: () => void; onCreated: (user: StaffSummary, temp: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", title: "", job_title: "", department: "", staff_number: "", payroll_number: "", school_code: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const res = await reviewerFetch("/staff", { method: "POST", body: JSON.stringify(form) });
      onCreated(res.user, res.temp_password);
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Failed to create account.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-900">Add New Staff Account</h2>
          <button onClick={onClose} data-testid="modal-close-btn" className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={set("name")} data-testid="new-staff-name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" placeholder="e.g. Dr. Jane Wanjiku" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
              <input required type="email" value={form.email} onChange={set("email")} data-testid="new-staff-email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" placeholder="name@kafu.ac.ke" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <select value={form.title} onChange={set("title")} data-testid="new-staff-title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none">
                <option value="">Select…</option>
                {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Staff Number</label>
              <input value={form.staff_number} onChange={set("staff_number")} data-testid="new-staff-number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" placeholder="KAFU/STAFF/000" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
              <input value={form.job_title} onChange={set("job_title")} data-testid="new-staff-job-title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" placeholder="e.g. Senior Lecturer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
              <input value={form.department} onChange={set("department")} data-testid="new-staff-department" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" placeholder="e.g. Dept. of Education" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Payroll No.</label>
              <input value={form.payroll_number} onChange={set("payroll_number")} data-testid="new-staff-payroll" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" placeholder="PAY/000" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} data-testid="modal-cancel-btn" className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} data-testid="modal-save-btn" className="px-4 py-2 text-sm font-semibold text-white bg-[#1A5C38] rounded-lg hover:bg-[#154a2c] disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Temp Password Modal ──────────────────────────────────────────────────────

function TempPasswordModal({ name, password, onClose }: { name: string; password: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(password).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md text-center p-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Account Created</h2>
        <p className="text-sm text-gray-500 mb-5">Share this temporary password with <strong>{name}</strong> securely. They will be required to change it on first login.</p>
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-4">
          <span className="font-mono text-base text-gray-900 tracking-wider">{password}</span>
          <button onClick={copy} data-testid="copy-password-btn" className="ml-3 text-xs text-[#1A5C38] font-medium flex items-center gap-1 hover:underline">
            <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <button onClick={onClose} data-testid="temp-password-done-btn" className="w-full px-4 py-2 text-sm font-semibold text-white bg-[#1A5C38] rounded-lg hover:bg-[#154a2c]">Done</button>
      </div>
    </div>
  );
}

// ─── Profile Section Editor ───────────────────────────────────────────────────

function UploadsSection({ staffId, photoUrl, cvUrl, onUploaded }: {
  staffId: number;
  photoUrl: string | undefined;
  cvUrl: string | undefined;
  onUploaded: (type: "photo" | "cv", url: string) => void;
}) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoErr, setPhotoErr] = useState("");

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvErr, setCvErr] = useState("");

  useEffect(() => {
    if (!photoFile) { setPhotoPreview(null); return; }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  async function doUploadPhoto() {
    if (!photoFile) return;
    setUploadingPhoto(true);
    setPhotoErr("");
    try {
      const fd = new FormData();
      fd.append("photo", photoFile);
      const res = await reviewerFetchForm(`/staff/${staffId}/upload-photo`, fd);
      onUploaded("photo", res.url);
      setPhotoFile(null);
    } catch (ex: unknown) {
      setPhotoErr(ex instanceof Error ? ex.message : "Upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function doUploadCv() {
    if (!cvFile) return;
    setUploadingCv(true);
    setCvErr("");
    try {
      const fd = new FormData();
      fd.append("cv", cvFile);
      const res = await reviewerFetchForm(`/staff/${staffId}/upload-cv`, fd);
      onUploaded("cv", res.url);
      setCvFile(null);
    } catch (ex: unknown) {
      setCvErr(ex instanceof Error ? ex.message : "Upload failed.");
    } finally {
      setUploadingCv(false);
    }
  }

  const displayPhoto = photoPreview ?? photoUrl ?? null;

  return (
    <div className="space-y-5">
      {/* Photo upload */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {displayPhoto ? (
              <img src={displayPhoto} alt="Profile photo" className="w-18 h-18 w-16 h-16 rounded-full object-cover ring-2 ring-[#1A5C38]/20" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Camera className="w-7 h-7 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Profile Photo</p>
            <p className="text-xs text-gray-500 mt-0.5">JPG or PNG, max 3 MB. Professional headshot required.</p>
            {photoUrl && !photoFile && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Photo on file
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <input
                type="file"
                accept="image/*"
                onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                data-testid="reviewer-photo-file-input"
                className="text-xs text-gray-600 file:mr-3 file:text-xs file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-200"
              />
              {photoFile && (
                <button
                  onClick={doUploadPhoto}
                  disabled={uploadingPhoto}
                  data-testid="reviewer-upload-photo-btn"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1A5C38] text-white rounded-lg hover:bg-[#154a2c] disabled:opacity-60"
                >
                  {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                  {uploadingPhoto ? "Uploading…" : "Upload Photo"}
                </button>
              )}
            </div>
            {photoErr && <p className="mt-1.5 text-xs text-red-600">{photoErr}</p>}
          </div>
        </div>
      </div>

      {/* CV upload */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-10 h-10 bg-[#1A5C38]/10 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#1A5C38]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Curriculum Vitae (CV)</p>
            <p className="text-xs text-gray-500 mt-0.5">PDF only, max 10 MB.</p>
            {cvUrl && !cvFile && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                data-testid="reviewer-cv-download-link"
                className="inline-flex items-center gap-1 text-xs text-[#1A5C38] mt-1 hover:underline"
              >
                <Download className="w-3 h-3" /> View current CV
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="file"
            accept=".pdf"
            onChange={e => setCvFile(e.target.files?.[0] ?? null)}
            data-testid="reviewer-cv-file-input"
            className="text-xs text-gray-600 file:mr-3 file:text-xs file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-200"
          />
          {cvFile && (
            <button
              onClick={doUploadCv}
              disabled={uploadingCv}
              data-testid="reviewer-upload-cv-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
            >
              {uploadingCv ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              {uploadingCv ? "Uploading…" : "Upload CV"}
            </button>
          )}
        </div>
        {cvErr && <p className="mt-1.5 text-xs text-red-600">{cvErr}</p>}
        {!cvFile && !cvUrl && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            No CV on file. Select a PDF above to upload.
          </p>
        )}
      </div>
    </div>
  );
}

function SectionEditor({ staffId, section, data, onSaved, onUploaded }: {
  staffId: number;
  section: string;
  data: Record<string, string | undefined>;
  onSaved: (submission: unknown) => void;
  onUploaded?: (type: "photo" | "cv", url: string) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const initial: Record<string, string> = {};
    Object.entries(data ?? {}).forEach(([k, v]) => { initial[k] = v ?? ""; });
    setForm(initial);
  }, [data, section]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    setErr("");
    try {
      const res = await reviewerFetch(`/staff/${staffId}/section/${section}`, {
        method: "PUT",
        body: JSON.stringify({ data: form }),
      });
      onSaved(res.submission);
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const field = (label: string, key: string, type: "text" | "email" | "url" | "textarea" = "text", placeholder = "") => (
    <div key={key}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea rows={5} value={form[key] ?? ""} onChange={set(key)} data-testid={`field-${key}`}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none resize-y" />
      ) : (
        <input type={type} value={form[key] ?? ""} onChange={set(key)} data-testid={`field-${key}`}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1A5C38]/30 focus:border-[#1A5C38] outline-none" />
      )}
    </div>
  );

  if (section === "uploads") {
    return (
      <UploadsSection
        staffId={staffId}
        photoUrl={data.photo_url}
        cvUrl={data.cv_url}
        onUploaded={(type, url) => onUploaded?.(type, url)}
      />
    );
  }

  const FIELDS: Record<string, React.ReactNode> = {
    personal: <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field("Full Name", "name", "text", "Dr. Jane Wanjiku")}
        {field("Title", "title", "text", "Dr.")}
        {field("Job Title", "job_title", "text", "Senior Lecturer")}
        {field("Department", "department", "text", "Dept. of Education")}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {field("School Code", "school_code", "text", "SAS")}
        {field("Staff Number", "staff_number", "text", "KAFU/STAFF/001")}
      </div>
    </div>,

    bio: <div className="space-y-4">
      {field("Biography", "biography", "textarea", "A brief professional biography…")}
      {field("Profile Tagline", "tagline", "text", "Expert in curriculum design…")}
    </div>,

    qualifications: <div className="space-y-4">
      {field("Academic Qualifications", "qualifications", "textarea", "PhD Education, University of Nairobi (2018)\nMEd Curriculum, Maseno University (2014)")}
      {field("Professional Certifications", "certifications", "textarea", "Certified Curriculum Developer (2019)")}
      {field("Memberships", "memberships", "textarea", "Kenya National Union of Teachers")}
    </div>,

    teaching: <div className="space-y-4">
      {field("Teaching Areas", "teaching_areas", "textarea", "Curriculum Development, Educational Psychology")}
      {field("Courses Taught", "courses_taught", "textarea", "EDU 101 – Foundations of Education\nEDU 302 – Curriculum Design")}
    </div>,

    research: <div className="space-y-4">
      {field("Research Interests", "research_interests", "textarea", "Early childhood learning, inclusive education")}
      {field("ORCID iD", "orcid", "text", "0000-0000-0000-0000")}
      {field("Google Scholar URL", "google_scholar", "url", "https://scholar.google.com/…")}
      {field("Scopus Author ID", "scopus_id", "text", "56789012345")}
      {field("Recent Publications", "publications", "textarea", "Wanjiku, J. (2023). Inclusive Education in Kenya. …")}
    </div>,

    contact: <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field("Contact Email", "contact_email", "email", "j.wanjiku@kafu.ac.ke")}
        {field("Office Location", "office_location", "text", "Block A, Room 204")}
      </div>
      {field("Office Hours", "office_hours", "text", "Mon–Fri 10:00–12:00")}
      {field("Personal Website", "personal_website", "url", "https://janewanjiku.ac.ke")}
    </div>,
  };

  return (
    <div>
      {FIELDS[section] ?? <p className="text-sm text-gray-400">No editable fields for this section.</p>}
      {err && <p className="mt-3 text-xs text-red-600">{err}</p>}
      <div className="mt-5 flex justify-end">
        <button onClick={save} disabled={saving} data-testid={`save-section-${section}`}
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#1A5C38] rounded-lg hover:bg-[#154a2c] disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Section
        </button>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ staffId, onAccountChanged }: { staffId: number; onAccountChanged: (updated: StaffSummary) => void }) {
  const [detail, setDetail] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [commentText, setCommentText] = useState("");

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewerFetch(`/staff/${staffId}`);
      setDetail(res);
    } catch {
      showToast("error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => { load(); setActiveTab("personal"); setConfirmDeactivate(false); }, [load]);

  async function workflowAction(action: string) {
    if (!detail?.submission) return;
    setProcessing(true);
    try {
      const res = await reviewerFetch(`/submissions/${detail.submission.id}/${action}`, {
        method: "POST",
        body: JSON.stringify({ notes: actionNote }),
      });
      showToast("success", "Action completed.");
      setActionNote("");
      setDetail(d => d ? { ...d, submission: res.submission } : d);
    } catch (ex: unknown) {
      showToast("error", ex instanceof Error ? ex.message : "Action failed.");
    } finally {
      setProcessing(false);
    }
  }

  async function toggleAccount() {
    if (!detail) return;
    setProcessing(true);
    const isActive = detail.user.status === "active";
    try {
      const res = await reviewerFetch(`/staff/${staffId}${isActive ? "" : "/reactivate"}`, {
        method: isActive ? "DELETE" : "POST",
      });
      const updated = res.user;
      setDetail(d => d ? { ...d, user: { ...d.user, status: updated.status } } : d);
      onAccountChanged(updated);
      showToast("success", isActive ? "Account deactivated." : "Account reactivated.");
      setConfirmDeactivate(false);
    } catch (ex: unknown) {
      showToast("error", ex instanceof Error ? ex.message : "Action failed.");
    } finally {
      setProcessing(false);
    }
  }

  async function addComment() {
    if (!detail?.submission || !commentText.trim()) return;
    setProcessing(true);
    try {
      await reviewerFetch(`/submissions/${detail.submission.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ comment: commentText, comment_type: "note" }),
      });
      setCommentText("");
      await load();
      showToast("success", "Comment added.");
    } catch (ex: unknown) {
      showToast("error", ex instanceof Error ? ex.message : "Failed to add comment.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full py-24 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
    </div>
  );
  if (!detail) return null;

  const { user, submission } = detail;
  const profileData = submission?.profile_data ?? {};
  const sectionCompletion = submission?.section_completion ?? {};
  const isActive = user.status === "active";
  const ws = submission?.workflow_status ?? null;

  const canWorkflow = ws && ["submitted", "under_review"].includes(ws);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {toast && <Toast type={toast.type} text={toast.text} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#1A5C38]/10 flex items-center justify-center text-lg font-bold text-[#1A5C38] shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">{user.title ? `${user.title} ` : ""}{user.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{user.job_title ?? "—"} {user.department ? `· ${user.department}` : ""}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user.email} {user.staff_number ? `· ${user.staff_number}` : ""}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
          {submission && (
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLORS[ws ?? ""] ?? "bg-gray-100 text-gray-500"}`}>
              {STATUS_LABELS[ws ?? ""] ?? ws}
            </span>
          )}
        </div>
      </div>

      {/* Completeness bar */}
      {submission && (
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-medium">Profile completeness</span>
            <span className="text-xs font-bold text-[#1A5C38]">{submission.completeness_score}%</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#1A5C38] rounded-full transition-all" style={{ width: `${submission.completeness_score}%` }} />
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {TABS.map(t => (
              <div key={t.key} className="flex items-center gap-1 text-[10px] text-gray-500">
                <div className={`w-1.5 h-1.5 rounded-full ${(sectionCompletion[t.key] ?? 0) === 100 ? "bg-green-500" : (sectionCompletion[t.key] ?? 0) > 0 ? "bg-amber-400" : "bg-gray-300"}`} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section tabs */}
      <div className="px-6 pt-4">
        <div className="flex gap-1 flex-wrap border-b border-gray-200 mb-5">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} data-testid={`tab-${t.key}`}
              className={`px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === t.key ? "border-[#1A5C38] text-[#1A5C38] bg-[#1A5C38]/5" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
              {sectionCompletion[t.key] !== undefined && (
                <span className={`ml-1.5 text-[10px] font-bold ${sectionCompletion[t.key] === 100 ? "text-green-500" : sectionCompletion[t.key] > 0 ? "text-amber-500" : "text-gray-400"}`}>
                  {sectionCompletion[t.key]}%
                </span>
              )}
            </button>
          ))}
        </div>

        <SectionEditor
          staffId={staffId}
          section={activeTab}
          data={(profileData[activeTab as keyof ProfileData] as Record<string, string | undefined>) ?? {}}
          onSaved={(sub) => {
            setDetail(d => d ? { ...d, submission: sub as StaffDetail["submission"] } : d);
            showToast("success", "Section saved.");
          }}
          onUploaded={(type, url) => {
            setDetail(d => {
              if (!d) return d;
              const sub = d.submission;
              const pd = sub?.profile_data ?? {};
              const updatedPd = {
                ...pd,
                uploads: {
                  ...(pd.uploads ?? {}),
                  ...(type === "photo" ? { photo_url: url } : { cv_url: url }),
                },
              };
              return {
                ...d,
                submission: sub
                  ? { ...sub, profile_data: updatedPd }
                  : { id: 0, workflow_status: "draft", completeness_score: 0, section_completion: {}, profile_data: updatedPd, submitted_at: null, updated_at: null, reviewer_summary: null, comments: [] },
              };
            });
            showToast("success", type === "photo" ? "Photo uploaded." : "CV uploaded.");
          }}
        />
      </div>

      {/* Workflow actions */}
      {submission && (
        <div className="mt-6 mx-6 rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Workflow Actions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Submission #{submission.id} · Last updated {fmtDate(submission.updated_at)}</p>
          </div>
          <div className="px-4 py-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Note (required for revision/reject)</label>
              <textarea rows={2} value={actionNote} onChange={e => setActionNote(e.target.value)} data-testid="action-note"
                placeholder="Explain what changes are needed or why…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#1A5C38]/20 focus:border-[#1A5C38] outline-none resize-none" />
            </div>
            <div className="flex flex-wrap gap-2">
              {ws === "submitted" && (
                <button onClick={() => workflowAction("review")} disabled={processing} data-testid="action-start-review"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-100 disabled:opacity-60">
                  <Eye className="w-3.5 h-3.5" /> Start Review
                </button>
              )}
              {canWorkflow && (
                <>
                  <button onClick={() => workflowAction("approve")} disabled={processing} data-testid="action-approve"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 border border-green-200 text-green-800 rounded-lg hover:bg-green-100 disabled:opacity-60">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => workflowAction("request-revision")} disabled={processing || !actionNote.trim()} data-testid="action-request-revision"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-800 rounded-lg hover:bg-orange-100 disabled:opacity-60">
                    <RotateCcw className="w-3.5 h-3.5" /> Request Revision
                  </button>
                  <button onClick={() => workflowAction("reject")} disabled={processing || !actionNote.trim()} data-testid="action-reject"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-800 rounded-lg hover:bg-red-100 disabled:opacity-60">
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      {submission && (
        <div className="mt-4 mx-6 rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Comments</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
            {(submission.comments ?? []).length === 0
              ? <p className="px-4 py-3 text-xs text-gray-400">No comments yet.</p>
              : (submission.comments ?? []).map(c => (
                <div key={c.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700">{c.author.name}</span>
                    <span className="text-[10px] text-gray-400">{fmtDate(c.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{c.comment}</p>
                </div>
              ))
            }
          </div>
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input value={commentText} onChange={e => setCommentText(e.target.value)} data-testid="comment-input"
              placeholder="Add a comment…"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-[#1A5C38]/20 focus:border-[#1A5C38] outline-none" />
            <button onClick={addComment} disabled={!commentText.trim() || processing} data-testid="comment-submit"
              className="px-3 py-1.5 text-xs font-semibold bg-[#1A5C38] text-white rounded-lg hover:bg-[#154a2c] disabled:opacity-50">Post</button>
          </div>
        </div>
      )}

      {/* Account actions */}
      <div className="mt-4 mb-8 mx-6 rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Account</h3>
        </div>
        <div className="px-4 py-4">
          {confirmDeactivate && isActive ? (
            <div className="space-y-3">
              <p className="text-xs text-red-700 font-medium">Deactivate this account? The staff member will no longer be able to log in.</p>
              <div className="flex gap-2">
                <button onClick={toggleAccount} disabled={processing} data-testid="confirm-deactivate-btn"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60">
                  <UserX className="w-3.5 h-3.5" /> Confirm Deactivate
                </button>
                <button onClick={() => setConfirmDeactivate(false)} data-testid="cancel-deactivate-btn"
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={isActive ? () => setConfirmDeactivate(true) : toggleAccount}
              disabled={processing}
              data-testid={isActive ? "deactivate-btn" : "reactivate-btn"}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border disabled:opacity-60 ${isActive ? "text-red-700 border-red-200 bg-red-50 hover:bg-red-100" : "text-green-700 border-green-200 bg-green-50 hover:bg-green-100"}`}>
              {isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate Account</> : <><UserCheck className="w-3.5 h-3.5" /> Reactivate Account</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewerStaffProfilesPage() {
  const [staffList, setStaffList] = useState<StaffSummary[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [tempPassword, setTempPassword] = useState<{ name: string; password: string } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q ?? search) params.set("search", q ?? search);
      if (filterStatus) params.set("status", filterStatus);
      if (filterDept) params.set("department", filterDept);
      if (filterAccount) params.set("account_status", filterAccount);
      const res = await reviewerFetch(`/staff?${params.toString()}`);
      setStaffList(res.staff?.data ?? []);
      setDepartments(res.departments ?? []);
    } catch {
      showToast("error", "Failed to load staff list.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDept, filterAccount, search]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(val), 400);
  }

  function handleCreated(user: StaffSummary, temp: string) {
    setShowAdd(false);
    setTempPassword({ name: user.name, password: temp });
    load();
  }

  function handleAccountChanged(updated: StaffSummary) {
    setStaffList(prev => prev.map(s => s.id === updated.id ? { ...s, status: updated.status } : s));
  }

  const statusBadge = (s: StaffSummary) => {
    if (!s.submission) return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">No profile</span>;
    const ws = s.submission.workflow_status;
    return <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${STATUS_COLORS[ws] ?? "bg-gray-100 text-gray-500"}`}>{STATUS_LABELS[ws] ?? ws}</span>;
  };

  return (
    <div className="flex flex-col h-full">
      {toast && <Toast type={toast.type} text={toast.text} onClose={() => setToast(null)} />}
      {showAdd && <AddStaffModal onClose={() => setShowAdd(false)} onCreated={handleCreated} />}
      {tempPassword && <TempPasswordModal name={tempPassword.name} password={tempPassword.password} onClose={() => setTempPassword(null)} />}

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Staff Profiles</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all staff academic profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => load()} data-testid="refresh-btn" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowAdd(true)} data-testid="add-staff-btn"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1A5C38] rounded-lg hover:bg-[#154a2c]">
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex gap-5 flex-1 min-h-0" style={{ height: "calc(100vh - 180px)" }}>

        {/* Left panel — staff list */}
        <div className="w-80 shrink-0 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white">
          {/* Filters */}
          <div className="px-3 py-3 border-b border-gray-100 space-y-2 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => handleSearch(e.target.value)}
                data-testid="staff-search"
                placeholder="Search name, email, dept…"
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#1A5C38]/20 focus:border-[#1A5C38] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="relative">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} data-testid="filter-status"
                  className="w-full text-[11px] border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 bg-white appearance-none focus:ring-2 focus:ring-[#1A5C38]/20 outline-none">
                  {STATUS_FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={filterAccount} onChange={e => setFilterAccount(e.target.value)} data-testid="filter-account"
                  className="w-full text-[11px] border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 bg-white appearance-none focus:ring-2 focus:ring-[#1A5C38]/20 outline-none">
                  <option value="">All Accounts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {departments.length > 0 && (
              <div className="relative">
                <select value={filterDept} onChange={e => setFilterDept(e.target.value)} data-testid="filter-dept"
                  className="w-full text-[11px] border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 bg-white appearance-none focus:ring-2 focus:ring-[#1A5C38]/20 outline-none">
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
              </div>
            ) : staffList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 px-4 text-center">
                <Users className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No staff found</p>
                <p className="text-xs mt-1">Try adjusting your filters.</p>
              </div>
            ) : staffList.map(s => {
              const isSelected = s.id === selectedId;
              return (
                <button key={s.id} onClick={() => setSelectedId(s.id)} data-testid={`staff-row-${s.id}`}
                  className={`w-full text-left px-3 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${isSelected ? "bg-[#1A5C38]/5 border-l-2 border-[#1A5C38]" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-[#1A5C38]/10 flex items-center justify-center text-xs font-bold text-[#1A5C38] shrink-0 mt-0.5">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-gray-900 truncate">{s.name}</p>
                      <span className={`text-[9px] px-1 py-0.5 rounded font-medium shrink-0 ${s.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">{s.job_title ?? s.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {statusBadge(s)}
                      {s.submission && (
                        <div className="flex items-center gap-1 flex-1">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#1A5C38] rounded-full" style={{ width: `${s.submission.completeness_score}%` }} />
                          </div>
                          <span className="text-[9px] text-gray-400 shrink-0">{s.submission.completeness_score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-2" />
                </button>
              );
            })}
          </div>

          {/* Footer count */}
          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400">{staffList.length} staff member{staffList.length !== 1 ? "s" : ""} shown</p>
          </div>
        </div>

        {/* Right panel — detail editor */}
        <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white">
          {selectedId ? (
            <DetailPanel key={selectedId} staffId={selectedId} onAccountChanged={handleAccountChanged} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-8 text-center">
              <Users className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium text-gray-500">Select a staff member</p>
              <p className="text-xs mt-1">Choose a staff member from the list to view and edit their profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
