import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { staffGet, staffPut, staffPost, staffPostForm, STATUS_COLORS, STATUS_LABELS } from "@/lib/api";
import {
  User, BookOpen, Briefcase, FlaskConical, Phone, Upload,
  Save, Send, CheckCircle, AlertCircle, RotateCcw, Camera
} from "lucide-react";

interface Submission {
  id: number;
  workflow_status: string;
  completeness_score: number;
  section_completion: Record<string, number>;
  profile_data: Record<string, Record<string, string | string[]>>;
  submitted_at: string | null;
  reviewer_summary: string | null;
}

type Section = "personal" | "bio" | "qualifications" | "teaching" | "research" | "contact" | "uploads";

const TABS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "personal",       label: "Personal",       icon: <User className="w-4 h-4" /> },
  { key: "bio",            label: "Biography",       icon: <BookOpen className="w-4 h-4" /> },
  { key: "qualifications", label: "Qualifications",  icon: <Briefcase className="w-4 h-4" /> },
  { key: "teaching",       label: "Teaching",        icon: <BookOpen className="w-4 h-4" /> },
  { key: "research",       label: "Research",        icon: <FlaskConical className="w-4 h-4" /> },
  { key: "contact",        label: "Contact",         icon: <Phone className="w-4 h-4" /> },
  { key: "uploads",        label: "Uploads",         icon: <Upload className="w-4 h-4" /> },
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
const INPUT = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";
const TEXTAREA = INPUT + " resize-none";

export default function ProfileEditorPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Section>("personal");
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [form, setForm] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffGet("/profile");
      const sub: Submission = res.submission;
      setSubmission(sub);
      const pd = sub.profile_data ?? {};
      const initialForm: Record<string, Record<string, string>> = {};
      for (const s of TABS.map(t => t.key)) {
        const sectionData = pd[s] ?? {};
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(sectionData)) {
          flat[k] = Array.isArray(v) ? v.join(", ") : String(v ?? "");
        }
        initialForm[s] = flat;
      }
      // Prefill personal from user record
      if (!initialForm.personal) initialForm.personal = {};
      if (!initialForm.personal.name) initialForm.personal.name = user?.name ?? "";
      if (!initialForm.personal.title) initialForm.personal.title = user?.title ?? "";
      if (!initialForm.personal.job_title) initialForm.personal.job_title = user?.job_title ?? "";
      if (!initialForm.personal.department) initialForm.personal.department = user?.department ?? "";
      setForm(initialForm);
    } catch {
      showToast("error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  function setField(section: Section, field: string, value: string) {
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }

  async function saveSection(section: Section) {
    setSaving(true);
    try {
      const data = form[section] ?? {};
      await staffPut(`/profile/section/${section}`, { data });
      await loadProfile();
      showToast("success", "Section saved.");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    if (!user?.has_consent) { showToast("error", "You must complete onboarding and accept consent first."); return; }
    setSubmitting(true);
    try {
      await staffPost("/profile/submit");
      await loadProfile();
      showToast("success", "Profile submitted for review.");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWithdraw() {
    try {
      await staffPost("/profile/withdraw");
      await loadProfile();
      showToast("success", "Submission withdrawn.");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Failed to withdraw.");
    }
  }

  async function uploadPhoto() {
    if (!photoFile) return;
    const fd = new FormData();
    fd.append("photo", photoFile);
    try {
      await staffPostForm("/upload-photo", fd);
      showToast("success", "Photo uploaded.");
      setPhotoFile(null);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Upload failed.");
    }
  }

  async function uploadCv() {
    if (!cvFile) return;
    const fd = new FormData();
    fd.append("cv", cvFile);
    try {
      await staffPostForm("/upload-cv", fd);
      showToast("success", "CV uploaded.");
      setCvFile(null);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Upload failed.");
    }
  }

  const canEdit = !submission || ["draft", "revision_requested"].includes(submission.workflow_status);
  const canSubmit = canEdit && (submission?.completeness_score ?? 0) >= 40 && user?.has_consent;
  const isSubmitted = submission && !["draft", "revision_requested"].includes(submission.workflow_status);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Academic Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in each section and save before submitting for review.</p>
        </div>
        {submission && (
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_COLORS[submission.workflow_status] ?? "bg-gray-100 text-gray-600"}`}>
            {STATUS_LABELS[submission.workflow_status] ?? submission.workflow_status}
          </span>
        )}
      </div>

      {/* Revision note */}
      {submission?.workflow_status === "revision_requested" && submission.reviewer_summary && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Revision Requested</p>
            <p className="text-sm text-orange-700 mt-1">{submission.reviewer_summary}</p>
          </div>
        </div>
      )}

      {!canEdit && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-blue-800 font-medium">Your profile is currently under review and cannot be edited.</p>
          </div>
          <button onClick={handleWithdraw} data-testid="btn-withdraw"
            className="flex items-center gap-1.5 text-xs text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Withdraw
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50">
          {TABS.map(tab => {
            const pct = submission?.section_completion?.[tab.key] ?? 0;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                data-testid={`tab-${tab.key}`}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.key ? "border-primary text-primary bg-white" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {tab.icon}
                {tab.label}
                {pct > 0 && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${pct >= 80 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{pct}%</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section content */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading profile…</div>
          ) : (
            <>
              {/* PERSONAL */}
              {activeTab === "personal" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Personal & Institutional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Title" required>
                      <select value={form.personal?.title ?? ""} onChange={e => setField("personal", "title", e.target.value)}
                        disabled={!canEdit} data-testid="select-personal-title" className={INPUT}>
                        <option value="">Select…</option>
                        {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Rev."].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Full Name" required>
                      <input type="text" value={form.personal?.name ?? ""} onChange={e => setField("personal", "name", e.target.value)}
                        disabled={!canEdit} data-testid="input-personal-name" className={INPUT} />
                    </Field>
                    <Field label="Job Title" required>
                      <input type="text" value={form.personal?.job_title ?? ""} onChange={e => setField("personal", "job_title", e.target.value)}
                        disabled={!canEdit} data-testid="input-personal-job-title" className={INPUT} placeholder="Senior Lecturer, Dept of..." />
                    </Field>
                    <Field label="Department / School" required>
                      <input type="text" value={form.personal?.department ?? ""} onChange={e => setField("personal", "department", e.target.value)}
                        disabled={!canEdit} data-testid="input-personal-department" className={INPUT} />
                    </Field>
                    <Field label="Staff Number">
                      <input type="text" value={form.personal?.staff_number ?? ""} onChange={e => setField("personal", "staff_number", e.target.value)}
                        disabled={!canEdit} data-testid="input-personal-staff-number" className={INPUT} />
                    </Field>
                    <Field label="ORCID iD">
                      <input type="text" value={form.personal?.orcid ?? ""} onChange={e => setField("personal", "orcid", e.target.value)}
                        disabled={!canEdit} data-testid="input-personal-orcid" className={INPUT} placeholder="0000-0000-0000-0000" />
                    </Field>
                  </div>
                </div>
              )}

              {/* BIO */}
              {activeTab === "bio" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Professional Biography</h3>
                  <Field label="Biography / Personal Statement" required>
                    <textarea rows={8} value={form.bio?.biography ?? ""} onChange={e => setField("bio", "biography", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-bio" className={TEXTAREA}
                      placeholder="Write a professional biography (200–500 words). Include your academic background, research focus, professional achievements, and teaching philosophy." />
                    <p className="text-xs text-gray-400 mt-1">{(form.bio?.biography ?? "").length} characters · Recommended: 300–800</p>
                  </Field>
                  <Field label="Professional Tagline (short)">
                    <input type="text" value={form.bio?.tagline ?? ""} onChange={e => setField("bio", "tagline", e.target.value)}
                      disabled={!canEdit} data-testid="input-bio-tagline" className={INPUT}
                      placeholder="e.g. Expert in Agricultural Economics and Rural Development" />
                  </Field>
                </div>
              )}

              {/* QUALIFICATIONS */}
              {activeTab === "qualifications" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Academic Qualifications</h3>
                  <Field label="Qualifications (one per line, e.g. PhD Education — Kenyatta University, 2019)" required>
                    <textarea rows={6} value={form.qualifications?.qualifications ?? ""} onChange={e => setField("qualifications", "qualifications", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-qualifications" className={TEXTAREA}
                      placeholder={"PhD Education — Kenyatta University, 2019\nMEd Curriculum Studies — Maseno University, 2013\nBEd Science — Moi University, 2009"} />
                  </Field>
                  <Field label="Professional Certifications / Trainings">
                    <textarea rows={4} value={form.qualifications?.certifications ?? ""} onChange={e => setField("qualifications", "certifications", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-certifications" className={TEXTAREA}
                      placeholder="e.g. Google Data Analytics Certificate, 2023" />
                  </Field>
                  <Field label="Professional Memberships">
                    <textarea rows={3} value={form.qualifications?.memberships ?? ""} onChange={e => setField("qualifications", "memberships", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-memberships" className={TEXTAREA}
                      placeholder="e.g. Kenya National Academy of Sciences (KNAS) — Fellow" />
                  </Field>
                </div>
              )}

              {/* TEACHING */}
              {activeTab === "teaching" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Teaching Areas</h3>
                  <Field label="Teaching Areas (comma-separated or one per line)" required>
                    <textarea rows={5} value={form.teaching?.teaching_areas ?? ""} onChange={e => setField("teaching", "teaching_areas", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-teaching" className={TEXTAREA}
                      placeholder={"Curriculum Development\nEducational Psychology\nResearch Methods in Education"} />
                  </Field>
                  <Field label="Postgraduate Supervision">
                    <textarea rows={3} value={form.teaching?.supervision ?? ""} onChange={e => setField("teaching", "supervision", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-supervision" className={TEXTAREA}
                      placeholder="e.g. 5 PhD completions (2019–2024); 12 Masters completions" />
                  </Field>
                  <Field label="Awards & Academic Recognition">
                    <textarea rows={3} value={form.teaching?.awards ?? ""} onChange={e => setField("teaching", "awards", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-awards" className={TEXTAREA}
                      placeholder="e.g. KAFU Best Lecturer Award 2022" />
                  </Field>
                </div>
              )}

              {/* RESEARCH */}
              {activeTab === "research" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Research Profile</h3>
                  <Field label="Research Interests (one per line or comma-separated)" required>
                    <textarea rows={5} value={form.research?.research_interests ?? ""} onChange={e => setField("research", "research_interests", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-research" className={TEXTAREA}
                      placeholder={"Educational equity in sub-Saharan Africa\nCurriculum reform\nTeacher professional development"} />
                  </Field>
                  <Field label="Selected Publications (one per line, APA format preferred)">
                    <textarea rows={5} value={form.research?.publications ?? ""} onChange={e => setField("research", "publications", e.target.value)}
                      disabled={!canEdit} data-testid="textarea-publications" className={TEXTAREA}
                      placeholder="Oduya, J. (2023). Teacher self-efficacy in rural Kenya. Journal of African Education, 12(2), 45–62." />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Google Scholar URL">
                      <input type="url" value={form.research?.scholar_url ?? ""} onChange={e => setField("research", "scholar_url", e.target.value)}
                        disabled={!canEdit} data-testid="input-scholar-url" className={INPUT} placeholder="https://scholar.google.com/..." />
                    </Field>
                    <Field label="ResearchGate URL">
                      <input type="url" value={form.research?.researchgate_url ?? ""} onChange={e => setField("research", "researchgate_url", e.target.value)}
                        disabled={!canEdit} data-testid="input-researchgate-url" className={INPUT} placeholder="https://researchgate.net/..." />
                    </Field>
                  </div>
                </div>
              )}

              {/* CONTACT */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Contact Information</h3>
                  <p className="text-xs text-gray-500 bg-amber-50 rounded-lg p-3">Visibility settings control what appears publicly. Mark only what you consent to display on the public profile.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Institutional Email" required>
                      <input type="email" value={form.contact?.contact_email ?? user?.email ?? ""} onChange={e => setField("contact", "contact_email", e.target.value)}
                        disabled={!canEdit} data-testid="input-contact-email" className={INPUT} />
                    </Field>
                    <Field label="Office Phone">
                      <input type="text" value={form.contact?.office_phone ?? ""} onChange={e => setField("contact", "office_phone", e.target.value)}
                        disabled={!canEdit} data-testid="input-office-phone" className={INPUT} placeholder="+254 57 ..." />
                    </Field>
                    <Field label="Office Location / Building">
                      <input type="text" value={form.contact?.office_location ?? ""} onChange={e => setField("contact", "office_location", e.target.value)}
                        disabled={!canEdit} data-testid="input-office-location" className={INPUT} placeholder="Main Block, Room 204" />
                    </Field>
                    <Field label="Consultation Hours">
                      <input type="text" value={form.contact?.consultation_hours ?? ""} onChange={e => setField("contact", "consultation_hours", e.target.value)}
                        disabled={!canEdit} data-testid="input-consultation-hours" className={INPUT} placeholder="Mon, Wed: 2–4 PM" />
                    </Field>
                  </div>
                  <Field label="Personal Website / LinkedIn (optional)">
                    <input type="url" value={form.contact?.website ?? ""} onChange={e => setField("contact", "website", e.target.value)}
                      disabled={!canEdit} data-testid="input-website" className={INPUT} placeholder="https://..." />
                  </Field>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Public Visibility</label>
                    <select value={form.contact?.visibility ?? "staff_only"} onChange={e => setField("contact", "visibility", e.target.value)}
                      disabled={!canEdit} data-testid="select-contact-visibility" className={INPUT}>
                      <option value="public">Public — show email and phone on website</option>
                      <option value="staff_only">Staff Only — email visible to logged-in users only</option>
                      <option value="private">Private — hide contact details from public profile</option>
                    </select>
                  </div>
                </div>
              )}

              {/* UPLOADS */}
              {activeTab === "uploads" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Photo & CV Uploads</h3>
                  {/* Photo */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        {user?.avatar_url
                          ? <img src={user.avatar_url} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                          : <Camera className="w-7 h-7 text-gray-400" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">Profile Photo</p>
                        <p className="text-xs text-gray-500 mt-0.5">JPG or PNG, max 3 MB. Professional headshot required.</p>
                        <div className="mt-3 flex items-center gap-3">
                          <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] ?? null)}
                            data-testid="input-photo-upload"
                            className="text-xs text-gray-600 file:mr-3 file:text-xs file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:cursor-pointer" />
                          {photoFile && (
                            <button onClick={uploadPhoto} data-testid="btn-upload-photo"
                              className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors">
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CV */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
                    <p className="text-sm font-semibold text-gray-900">Curriculum Vitae (CV)</p>
                    <p className="text-xs text-gray-500 mt-0.5">PDF only, max 10 MB.</p>
                    <div className="mt-3 flex items-center gap-3">
                      <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] ?? null)}
                        data-testid="input-cv-upload"
                        className="text-xs text-gray-600 file:mr-3 file:text-xs file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 file:cursor-pointer" />
                      {cvFile && (
                        <button onClick={uploadCv} data-testid="btn-upload-cv"
                          className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors">
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Save button */}
              {canEdit && activeTab !== "uploads" && (
                <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
                  <button onClick={() => saveSection(activeTab)} disabled={saving} data-testid={`btn-save-${activeTab}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" />
                    {saving ? "Saving…" : "Save Section"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Submit for review */}
      <div id="submit" className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-2">Submit for Review</h3>
        <p className="text-sm text-gray-500 mb-1">Completeness score: <strong>{submission?.completeness_score ?? 0}%</strong> (minimum 40% required)</p>
        {!user?.has_consent && <p className="text-xs text-amber-600 mb-3">You must complete onboarding and accept publication consent before submitting.</p>}
        {isSubmitted ? (
          <p className="text-sm text-gray-500">Your profile is currently {STATUS_LABELS[submission!.workflow_status]}.</p>
        ) : (
          <button onClick={handleSubmit} disabled={!canSubmit || submitting} data-testid="btn-submit-profile"
            className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
            <Send className="w-4 h-4" />
            {submitting ? "Submitting…" : "Submit Profile for Review"}
          </button>
        )}
      </div>
    </div>
  );
}
