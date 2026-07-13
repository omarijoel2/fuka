import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";

const API = "/api/admin";

// ─── types ────────────────────────────────────────────────────────────────────
interface Batch {
  id: number;
  batch_reference: string;
  original_filename: string;
  status: string;
  academic_year?: string;
  intake_id?: number;
  total_rows: number;
  valid_rows: number;
  warning_rows: number;
  invalid_rows: number;
  duplicate_rows: number;
  unmatched_programme_rows: number;
  imported_rows: number;
  mapping_json?: Record<string, string>;
  validation_summary_json?: Record<string, number>;
}

interface ValidationRow {
  row_number: number;
  id?: number;
  full_name: string;
  kcse_index_number: string;
  uploaded_programme: string;
  errors?: Array<{ field: string; message: string }>;
  warnings?: Array<{ field: string; message: string }>;
  match_status?: string;
  confidence?: number;
  duplicate_status?: string;
}

interface Programme {
  id: number;
  programme_code: string;
  programme_name: string;
  school_code: string;
  level: string;
}

interface Intake {
  id: number;
  name: string;
  academic_year: string;
  intake_period: string;
  status: string;
}

interface LetterTemplate {
  id: number;
  template_name: string;
  template_code: string;
}

// ─── field options for mapping ────────────────────────────────────────────────
const FIELD_OPTIONS: Array<{ value: string; label: string; required?: boolean }> = [
  { value: "full_name",                label: "Full Name",                required: true },
  { value: "kcse_index_number",        label: "KCSE Index Number",        required: true },
  { value: "kcse_year",                label: "KCSE Year" },
  { value: "assigned_programme",       label: "Assigned Programme/Course",required: true },
  { value: "gender",                   label: "Gender" },
  { value: "national_id_number",       label: "National ID Number" },
  { value: "birth_certificate_number", label: "Birth Certificate Number" },
  { value: "phone_number",             label: "Phone Number" },
  { value: "email",                    label: "Email Address" },
  { value: "kuccps_reference",         label: "KUCCPS Reference" },
  { value: "county",                   label: "County" },
  { value: "secondary_school_name",    label: "Secondary School" },
  { value: "mean_grade",               label: "Mean Grade" },
  { value: "cluster_points",           label: "Cluster Points" },
  { value: "placement_category",       label: "Placement Category" },
  { value: "",                         label: "-- Skip this column --" },
];

const REQUIRED_FIELDS = ["full_name", "kcse_index_number", "assigned_programme"];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  uploaded:                    { label: "Uploaded",           color: "#6c757d" },
  mapping_in_progress:         { label: "Mapping",            color: "#0d6efd" },
  mapped:                      { label: "Mapped",             color: "#0d6efd" },
  validation_failed:           { label: "Validation Failed",  color: "#dc3545" },
  validation_passed:           { label: "Passed w/ Warnings", color: "#fd7e14" },
  awaiting_approval:           { label: "Awaiting Approval",  color: "#DAA520" },
  approved:                    { label: "Approved",           color: "#198754" },
  import_queued:               { label: "Import Queued",      color: "#0dcaf0" },
  importing:                   { label: "Importing…",         color: "#0dcaf0" },
  imported:                    { label: "Imported",           color: "#198754" },
  imported_with_exceptions:    { label: "Imported (Exceptions)", color: "#fd7e14" },
  rolled_back:                 { label: "Rolled Back",        color: "#dc3545" },
  cancelled:                   { label: "Cancelled",          color: "#dc3545" },
};

async function parseResponse(r: Response) {
  let data: any = null;
  try {
    data = await r.json();
  } catch {
    if (r.status === 413) throw new Error("File is too large for the server. Maximum upload size exceeded.");
    throw new Error(`Server error (${r.status}). Please try again or contact ICT.`);
  }
  if (!r.ok) {
    const firstFieldError =
      data?.errors && typeof data.errors === "object"
        ? (Object.values(data.errors).flat() as string[])[0]
        : null;
    throw new Error(firstFieldError ?? data?.message ?? `Request failed (${r.status})`);
  }
  return data;
}

function apiFetch(path: string, opts?: RequestInit) {
  const token = localStorage.getItem("kafu_cms_token");
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts?.headers ?? {}) },
  }).then(parseResponse);
}

function apiFetchForm(path: string, body: FormData) {
  const token = localStorage.getItem("kafu_cms_token");
  return fetch(`${API}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  }).then(parseResponse);
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN WIZARD COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function KuccpsImportWizard() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Batch state
  const [batch, setBatch] = useState<Batch | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("Sheet1");
  const [headerRow, setHeaderRow] = useState(1);
  const [skipRows, setSkipRows] = useState(0);

  // Preview + mapping
  const [headers, setHeaders] = useState<string[]>([]);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [saveTemplate, setSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // Global settings
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [intakeId, setIntakeId] = useState("");
  const [letterTemplates, setLetterTemplates] = useState<LetterTemplate[]>([]);
  const [letterTemplateId, setLetterTemplateId] = useState("");
  const [reportingDate, setReportingDate] = useState("4th September 2026 at 8:00 AM");

  // Validation report
  const [validationReport, setValidationReport] = useState<{
    summary: Record<string, number>;
    invalid_rows: ValidationRow[];
    unmatched_programmes: ValidationRow[];
    duplicates: ValidationRow[];
  } | null>(null);

  // Exception resolution
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [resolutions, setResolutions] = useState<Record<number, { programme_id: string; save_alias: boolean }>>({});
  const [approvalComments, setApprovalComments] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const clearError = () => setError(null);
  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true); setError(null);
    try { await fn(); } catch (e: any) { setError(e.message ?? "An error occurred"); }
    finally { setLoading(false); }
  };

  // ── STEP 0: Upload ──────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (file: File) => {
    await withLoading(async () => {
      const fd = new FormData();
      fd.append("file", file);
      const data = await apiFetchForm("/kuccps/import-batches/upload", fd);
      if (data.batch) {
        setBatch(data.batch);
        setSheets(data.sheets ?? ["Sheet1"]);
        if (data.sheets?.length === 1) setSelectedSheet(data.sheets[0]);
        setStep(1);
      } else {
        throw new Error(data.message ?? "Upload failed");
      }
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  // ── STEP 1: Sheet selection ─────────────────────────────────────────────────
  const handleSelectSheet = async () => {
    if (!batch) return;
    await withLoading(async () => {
      const data = await apiFetch(`/kuccps/import-batches/${batch.id}/select-sheet`, {
        method: "POST",
        body: JSON.stringify({ sheet_name: selectedSheet, header_row: headerRow, skip_top_rows: skipRows }),
      });
      if (data.batch) {
        setBatch(data.batch);
        setHeaders(data.headers ?? []);
        setPreview(data.preview ?? []);
        setTotalRows(data.total_rows ?? 0);
        const autoSug = data.suggestions ?? {};
        setSuggestions(autoSug);
        setMapping({ ...autoSug });
        setStep(2);
      } else {
        throw new Error(data.message ?? "Sheet selection failed");
      }
    });
  };

  // ── STEP 3: Column mapping ──────────────────────────────────────────────────
  const requiredMapped = REQUIRED_FIELDS.every((f) => Object.values(mapping).includes(f));

  const handleSaveMapping = async () => {
    if (!batch || !requiredMapped) return;
    await withLoading(async () => {
      // Load intakes & letter templates for step 4
      const [intakesData, templatesData] = await Promise.all([
        apiFetch("/admissions/intakes"),
        apiFetch("/admission-letter-templates"),
      ]);
      setIntakes(intakesData ?? []);
      setLetterTemplates(templatesData?.templates ?? []);

      setStep(3);
    });
  };

  // ── STEP 4: Global settings ─────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    if (!batch) return;
    await withLoading(async () => {
      const data = await apiFetch(`/kuccps/import-batches/${batch.id}/map-columns`, {
        method: "POST",
        body: JSON.stringify({
          mapping,
          academic_year: academicYear,
          intake_id: intakeId || null,
          admission_letter_template_id: letterTemplateId || null,
          reporting_date_text: reportingDate,
          save_template: saveTemplate,
          template_name: templateName,
        }),
      });
      if (data.batch) {
        setBatch(data.batch);
        setStep(4);
      } else {
        throw new Error(data.message ?? "Settings save failed");
      }
    });
  };

  // ── STEP 5: Validate ────────────────────────────────────────────────────────
  const handleValidate = async () => {
    if (!batch) return;
    await withLoading(async () => {
      await apiFetch(`/kuccps/import-batches/${batch.id}/validate`, { method: "POST", body: "{}" });
      const rpt = await apiFetch(`/kuccps/import-batches/${batch.id}/validation-report`);
      setValidationReport({
        summary: rpt.summary ?? {},
        invalid_rows: rpt.invalid_rows ?? [],
        unmatched_programmes: rpt.unmatched_programmes ?? [],
        duplicates: rpt.duplicates ?? [],
      });
      setBatch(rpt.batch ?? batch);

      const hasExceptions = (rpt.unmatched_programmes?.length ?? 0) > 0 || (rpt.invalid_rows?.length ?? 0) > 0;
      if (hasExceptions) {
        // Load programmes for resolution
        const progs = await apiFetch("/programmes/catalogue");
        setProgrammes(progs ?? []);
        setStep(5);
      } else {
        setStep(6); // go straight to approve
      }
    });
  };

  // ── STEP 6: Exception resolution ───────────────────────────────────────────
  const handleResolve = async (rowId: number) => {
    if (!batch) return;
    const res = resolutions[rowId];
    if (!res?.programme_id) return;
    await withLoading(async () => {
      const data = await apiFetch(`/kuccps/import-batches/${batch.id}/resolve-programme`, {
        method: "POST",
        body: JSON.stringify({ row_id: rowId, programme_id: parseInt(res.programme_id), save_alias: res.save_alias }),
      });
      if (data.row) {
        const rpt = await apiFetch(`/kuccps/import-batches/${batch.id}/validation-report`);
        setValidationReport({
          summary: rpt.summary ?? {},
          invalid_rows: rpt.invalid_rows ?? [],
          unmatched_programmes: rpt.unmatched_programmes ?? [],
          duplicates: rpt.duplicates ?? [],
        });
        setBatch(rpt.batch ?? batch);
      }
    });
  };

  // ── STEP 7: Approve ─────────────────────────────────────────────────────────
  const handleApprove = async () => {
    if (!batch) return;
    await withLoading(async () => {
      const data = await apiFetch(`/kuccps/import-batches/${batch.id}/approve`, {
        method: "POST",
        body: JSON.stringify({ comments: approvalComments }),
      });
      if (data.batch) {
        setBatch(data.batch);
        setStep(7);
      } else {
        throw new Error(data.message ?? "Approval failed");
      }
    });
  };

  // ── STEP 8: Import ──────────────────────────────────────────────────────────
  const handleImport = async () => {
    if (!batch) return;
    await withLoading(async () => {
      const data = await apiFetch(`/kuccps/import-batches/${batch.id}/import`, {
        method: "POST", body: "{}",
      });
      if (data.batch) {
        setBatch(data.batch);
        setStep(8);
      } else {
        throw new Error(data.message ?? "Import failed");
      }
    });
  };

  // ── STEP 9: Generate letters ────────────────────────────────────────────────
  const handleGenerateLetters = async () => {
    if (!batch) return;
    await withLoading(async () => {
      await apiFetch(`/kuccps/import-batches/${batch.id}/generate-letters`, {
        method: "POST",
        body: JSON.stringify({ template_id: letterTemplateId || null }),
      });
      setStep(9);
    });
  };

  // ── STEP LABELS ─────────────────────────────────────────────────────────────
  const stepLabels = [
    "Upload File",
    "Select Sheet",
    "Preview Data",
    "Map Columns",
    "Global Settings",
    "Validate",
    "Resolve Exceptions",
    "Approve",
    "Import",
    "Generate Letters",
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <button
            data-testid="btn-back-to-admissions"
            onClick={() => navigate("/admissions/kuccps")}
            style={{ background: "none", border: "none", color: "#228B22", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 8 }}
          >
            &larr; Back to KUCCPS Dashboard
          </button>
          <h1 style={{ margin: 0, fontSize: 22, color: "#228B22", fontFamily: "Playfair Display, serif" }}>
            KUCCPS Placement Import Wizard
          </h1>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>
            Upload, map, validate, and import KUCCPS placement data
          </p>
        </div>
        {batch && (
          <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
            <div style={{ fontWeight: 600 }}>Batch: {batch.batch_reference}</div>
            <StatusBadge status={batch.status} />
          </div>
        )}
      </div>

      {/* Progress steps */}
      <StepProgressBar currentStep={step} labels={stepLabels} />

      {/* Error banner */}
      {error && (
        <div style={{ background: "#fff3f3", border: "1px solid #dc3545", borderRadius: 6, padding: "10px 16px", marginBottom: 16, color: "#dc3545", fontSize: 13 }}>
          {error}
          <button onClick={clearError} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#dc3545" }}>✕</button>
        </div>
      )}

      {/* ── STEP 0: Upload ─────────────────────────────── */}
      {step === 0 && (
        <div>
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            data-testid="kuccps-upload-dropzone"
            style={{
              border: "2px dashed #228B22", borderRadius: 10, padding: "60px 40px",
              textAlign: "center", cursor: "pointer", background: "#f8fdf9",
              transition: "background 0.2s",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>&#8659;</div>
            <div style={{ fontSize: 16, color: "#228B22", fontWeight: 600 }}>
              Drop your KUCCPS Excel or CSV file here
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
              Supports .xlsx, .xls, .csv — Max 10 MB
            </div>
            <button
              data-testid="btn-browse-file"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              style={{ marginTop: 20, padding: "8px 24px", background: "#228B22", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, cursor: "pointer" }}
            >
              Browse File
            </button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} style={{ display: "none" }} data-testid="input-file-upload" />
          </div>
          {loading && <LoadingSpinner label="Uploading file…" />}

          <InfoBox>
            Use this wizard to import KUCCPS undergraduate placement data. The file must come directly from the KUCCPS placement system. Only KUCCPS pathway records can be imported through this module.
          </InfoBox>
        </div>
      )}

      {/* ── STEP 1: Sheet selection ─────────────────────── */}
      {step === 1 && (
        <WizardCard title="Select Worksheet and Header Row">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <FormField label="Worksheet">
              <select
                data-testid="select-sheet"
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                style={selectStyle}
              >
                {sheets.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Header Row Number" hint="Row that contains column names">
              <input
                data-testid="input-header-row"
                type="number" min={1} max={20} value={headerRow}
                onChange={(e) => setHeaderRow(parseInt(e.target.value))}
                style={inputStyle}
              />
            </FormField>
            <FormField label="Skip Top Rows" hint="Rows to skip before header">
              <input
                data-testid="input-skip-rows"
                type="number" min={0} max={20} value={skipRows}
                onChange={(e) => setSkipRows(parseInt(e.target.value))}
                style={inputStyle}
              />
            </FormField>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={handleSelectSheet} loading={loading} testId="btn-select-sheet">
              Continue to Preview
            </WizardBtn>
            <WizardBtn variant="secondary" onClick={() => setStep(0)} testId="btn-back-to-upload">Back</WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 2: Preview ─────────────────────────────── */}
      {step === 2 && (
        <WizardCard title={`Data Preview — ${totalRows} rows detected`}>
          <div style={{ overflowX: "auto", maxHeight: 380, border: "1px solid #e5e7eb", borderRadius: 6, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#228B22", color: "#fff", position: "sticky", top: 0 }}>
                  <th style={thStyle}>#</th>
                  {headers.map((h) => <th key={h} style={thStyle}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8f9fa" }}>
                    <td style={tdStyle}>{i + 1}</td>
                    {headers.map((h) => <td key={h} style={tdStyle}>{row[h] ?? ""}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Showing first {preview.length} of {totalRows} rows</p>
          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={() => setStep(3)} testId="btn-proceed-to-mapping">Continue to Column Mapping</WizardBtn>
            <WizardBtn variant="secondary" onClick={() => setStep(1)} testId="btn-back-to-sheet">Back</WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 3: Column mapping ──────────────────────── */}
      {step === 3 && (
        <WizardCard title="Map Columns to System Fields">
          <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
            Map each spreadsheet column to the correct system field. Auto-suggestions are pre-filled based on header names.
            Fields marked with <span style={{ color: "#dc3545" }}>*</span> are required.
          </p>

          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f0f7f3", borderBottom: "2px solid #228B22" }}>
                  <th style={{ ...thStyle, color: "#228B22", background: "transparent" }}>Column Header</th>
                  <th style={{ ...thStyle, color: "#228B22", background: "transparent" }}>Sample Values</th>
                  <th style={{ ...thStyle, color: "#228B22", background: "transparent", minWidth: 230 }}>Map to Field</th>
                  <th style={{ ...thStyle, color: "#228B22", background: "transparent" }}>Auto-suggestion</th>
                </tr>
              </thead>
              <tbody>
                {headers.map((h, i) => {
                  const mapped = mapping[h] ?? "";
                  const suggested = suggestions[h] ?? "";
                  const samples = preview.slice(0, 3).map((r) => r[h]).filter(Boolean).join(", ");
                  const isRequired = mapped && REQUIRED_FIELDS.includes(mapped);
                  return (
                    <tr key={h} style={{ background: i % 2 === 0 ? "#fff" : "#f8f9fa", borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>
                        {h}
                        {isRequired && <span style={{ color: "#dc3545" }}> *</span>}
                      </td>
                      <td style={{ ...tdStyle, color: "#777", fontStyle: "italic", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {samples || "—"}
                      </td>
                      <td style={tdStyle}>
                        <select
                          data-testid={`mapping-select-${h.replace(/\s/g, "_")}`}
                          value={mapped}
                          onChange={(e) => {
                            const field = e.target.value;
                            const next = { ...mapping };
                            if (field) {
                              // A field can only be mapped to one column — clear it elsewhere
                              for (const key of Object.keys(next)) {
                                if (key !== h && next[key] === field) delete next[key];
                              }
                            }
                            next[h] = field;
                            setMapping(next);
                          }}
                          style={{ ...selectStyle, borderColor: isRequired ? "#198754" : (mapped ? "#ccc" : "#e5e7eb"), fontSize: 12 }}
                        >
                          {FIELD_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}{o.required ? " *" : ""}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ ...tdStyle, color: suggested ? "#198754" : "#999", fontSize: 12 }}>
                        {suggested
                          ? <span>&#10003; {FIELD_OPTIONS.find((o) => o.value === suggested)?.label ?? suggested}</span>
                          : <span style={{ color: "#bbb" }}>No suggestion</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Required fields checklist */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            {REQUIRED_FIELDS.map((f) => {
              const ok = Object.values(mapping).includes(f);
              const label = FIELD_OPTIONS.find((o) => o.value === f)?.label ?? f;
              return (
                <span key={f} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 12, background: ok ? "#d4edda" : "#fff3cd", color: ok ? "#155724" : "#856404" }}>
                  {ok ? "✓" : "!"} {label}
                </span>
              );
            })}
          </div>

          {/* Save as template */}
          <div style={{ background: "#f8fdf9", border: "1px solid #c3e6cb", borderRadius: 6, padding: "12px 16px", marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
              <input
                data-testid="chk-save-template"
                type="checkbox" checked={saveTemplate}
                onChange={(e) => setSaveTemplate(e.target.checked)}
              />
              Save this mapping as a reusable template for future imports
            </label>
            {saveTemplate && (
              <input
                data-testid="input-template-name"
                type="text" placeholder="Template name e.g. KUCCPS 2026 September"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                style={{ ...inputStyle, marginTop: 8, width: "100%", boxSizing: "border-box" }}
              />
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={handleSaveMapping} loading={loading} disabled={!requiredMapped} testId="btn-save-mapping">
              Continue to Settings
            </WizardBtn>
            {!requiredMapped && <span style={{ color: "#dc3545", fontSize: 12, alignSelf: "center" }}>Required fields not yet mapped</span>}
            <WizardBtn variant="secondary" onClick={() => setStep(2)} testId="btn-back-to-preview">Back</WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 4: Global settings ─────────────────────── */}
      {step === 4 && (
        <WizardCard title="Global Import Settings">
          <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>
            These settings apply to all records in this batch unless overridden by mapped columns.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <FormField label="Academic Year *">
              <input
                data-testid="input-academic-year"
                value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2026/2027" style={inputStyle}
              />
            </FormField>
            <FormField label="Intake">
              <select
                data-testid="select-intake"
                value={intakeId} onChange={(e) => setIntakeId(e.target.value)}
                style={selectStyle}
              >
                <option value="">-- Select intake (optional) --</option>
                {intakes.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </FormField>
            <FormField label="Admission Letter Template">
              <select
                data-testid="select-letter-template"
                value={letterTemplateId} onChange={(e) => setLetterTemplateId(e.target.value)}
                style={selectStyle}
              >
                <option value="">-- Select template --</option>
                {letterTemplates.map((t) => <option key={t.id} value={t.id}>{t.template_name}</option>)}
              </select>
            </FormField>
            <FormField label="Reporting Date Text">
              <input
                data-testid="input-reporting-date"
                value={reportingDate} onChange={(e) => setReportingDate(e.target.value)}
                placeholder="e.g. 4th September 2026 at 8:00 AM" style={inputStyle}
              />
            </FormField>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={handleSaveSettings} loading={loading} disabled={!academicYear} testId="btn-save-settings">
              Continue to Validation
            </WizardBtn>
            <WizardBtn variant="secondary" onClick={() => setStep(3)} testId="btn-back-to-mapping">Back</WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 5: Validate ────────────────────────────── */}
      {step === 4 && batch?.status === "mapped" && null /* handled above */}
      {step === 5 && !validationReport && (
        <WizardCard title="Run Validation">
          <p style={{ fontSize: 14, color: "#444", marginBottom: 24 }}>
            The system will validate all {totalRows} rows against KAFU programme catalogue, check for duplicates,
            verify required fields, and normalize data.
          </p>
          <WizardBtn onClick={handleValidate} loading={loading} testId="btn-run-validation">
            Run Validation Now
          </WizardBtn>
          {loading && <LoadingSpinner label="Validating records — this may take a moment…" />}
        </WizardCard>
      )}

      {step === 5 && validationReport && (
        <ExceptionResolutionPanel
          report={validationReport}
          programmes={programmes}
          resolutions={resolutions}
          setResolutions={setResolutions}
          onResolve={handleResolve}
          loading={loading}
          onContinue={() => setStep(6)}
          onBack={() => { setValidationReport(null); }}
          batch={batch}
        />
      )}

      {/* ── STEP 6: Approve ─────────────────────────────── */}
      {step === 6 && (
        <WizardCard title="Approve Batch for Import">
          {validationReport && <ValidationSummary summary={validationReport.summary} />}
          {batch && (
            <div style={{ background: "#f0f7f3", border: "1px solid #c3e6cb", borderRadius: 6, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: "#228B22" }}>Batch Summary</div>
              <table style={{ fontSize: 13 }}>
                <tbody>
                  <tr><td style={{ paddingRight: 20 }}>Total Rows:</td><td><strong>{batch.total_rows}</strong></td></tr>
                  <tr><td>Valid:</td><td style={{ color: "#198754" }}><strong>{batch.valid_rows}</strong></td></tr>
                  <tr><td>With Warnings:</td><td style={{ color: "#fd7e14" }}><strong>{batch.warning_rows}</strong></td></tr>
                  <tr><td>Invalid (will skip):</td><td style={{ color: "#dc3545" }}><strong>{batch.invalid_rows}</strong></td></tr>
                  <tr><td>Duplicates:</td><td style={{ color: "#fd7e14" }}><strong>{batch.duplicate_rows}</strong></td></tr>
                </tbody>
              </table>
            </div>
          )}
          <FormField label="Approval Comments (optional)">
            <textarea
              data-testid="input-approval-comments"
              value={approvalComments}
              onChange={(e) => setApprovalComments(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", width: "100%", boxSizing: "border-box" }}
              placeholder="Any comments for the audit record…"
            />
          </FormField>
          <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
            By approving this batch, you authorize the official import of {(batch?.valid_rows ?? 0) + (batch?.warning_rows ?? 0)} placement records into the admissions database.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={handleApprove} loading={loading} testId="btn-approve-batch" style={{ background: "#DAA520", color: "#fff" }}>
              Approve for Import
            </WizardBtn>
            <WizardBtn variant="secondary" onClick={() => setStep(5)} testId="btn-back-to-exceptions">Back</WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 7: Import ──────────────────────────────── */}
      {step === 7 && (
        <WizardCard title="Import Records">
          <div style={{ background: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 6, padding: "16px", marginBottom: 20 }}>
            <strong style={{ color: "#155724" }}>Batch Approved</strong>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#155724" }}>
              This batch has been approved. Click below to import {(batch?.valid_rows ?? 0) + (batch?.warning_rows ?? 0)} valid records into the official KUCCPS placement records.
            </p>
          </div>
          {loading && <LoadingSpinner label="Importing records — please wait…" />}
          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={handleImport} loading={loading} testId="btn-run-import">
              Run Import Now
            </WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 8: Generate letters ────────────────────── */}
      {step === 8 && (
        <WizardCard title="Generate Admission Letters">
          <div style={{ background: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 6, padding: "16px", marginBottom: 20 }}>
            <strong style={{ color: "#155724" }}>Import Complete</strong>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#155724" }}>
              {batch?.imported_rows ?? 0} placement records have been imported successfully.
              {batch?.status === "imported_with_exceptions" && " Some rows were skipped due to errors."}
            </p>
          </div>
          <p style={{ fontSize: 14, color: "#444", marginBottom: 16 }}>
            Generate PDF admission letters for all imported students. Students will be able to verify their placement
            and download their letter from the KUCCPS portal.
          </p>
          {loading && <LoadingSpinner label="Generating admission letters — please wait…" />}
          <div style={{ display: "flex", gap: 10 }}>
            <WizardBtn onClick={handleGenerateLetters} loading={loading} testId="btn-generate-letters">
              Generate Admission Letters
            </WizardBtn>
            <WizardBtn variant="secondary" onClick={() => setStep(9)} testId="btn-skip-letters">Skip for Now</WizardBtn>
          </div>
        </WizardCard>
      )}

      {/* ── STEP 9: Completion ──────────────────────────── */}
      {step === 9 && (
        <WizardCard title="Import Complete">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 56, color: "#228B22", marginBottom: 16 }}>&#10003;</div>
            <h2 style={{ color: "#228B22", fontFamily: "Playfair Display, serif", marginBottom: 8 }}>
              KUCCPS Import Successful
            </h2>
            <p style={{ fontSize: 14, color: "#666", maxWidth: 440, margin: "0 auto 24px" }}>
              {batch?.imported_rows ?? 0} students have been imported. Admission letters have been generated (if requested).
              Students can now verify their placement at the KUCCPS portal.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <WizardBtn onClick={() => navigate("/admissions/kuccps")} testId="btn-view-batches">
                View All Batches
              </WizardBtn>
              <WizardBtn variant="secondary" onClick={() => { setBatch(null); setStep(0); setValidationReport(null); }} testId="btn-new-import">
                Start New Import
              </WizardBtn>
            </div>
          </div>
        </WizardCard>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function StepProgressBar({ currentStep, labels }: { currentStep: number; labels: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
            background: i < currentStep ? "#228B22" : (i === currentStep ? "#DAA520" : "#e9ecef"),
            color: i <= currentStep ? "#fff" : "#888",
          }}>
            {i < currentStep ? "✓" : i + 1}
          </div>
          <span style={{ fontSize: 11, color: i === currentStep ? "#228B22" : (i < currentStep ? "#555" : "#aaa"), marginLeft: 4, fontWeight: i === currentStep ? 600 : 400, whiteSpace: "nowrap" }}>
            {label}
          </span>
          {i < labels.length - 1 && <div style={{ width: 20, height: 2, background: i < currentStep ? "#228B22" : "#e9ecef", margin: "0 6px" }} />}
        </div>
      ))}
    </div>
  );
}

function WizardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "24px 28px" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#228B22", fontFamily: "Playfair Display, serif", borderBottom: "2px solid #DAA520", paddingBottom: 8 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 4 }}>{label}</label>
      {hint && <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{hint}</div>}
      {children}
    </div>
  );
}

function WizardBtn({
  onClick, children, loading, disabled, testId, variant = "primary", style: extraStyle,
}: {
  onClick: () => void; children: React.ReactNode; loading?: boolean; disabled?: boolean;
  testId?: string; variant?: "primary" | "secondary"; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = variant === "primary"
    ? { background: "#228B22", color: "#fff" }
    : { background: "#fff", color: "#228B22", border: "1px solid #228B22" };
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: "9px 22px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        border: "none", opacity: disabled ? 0.5 : 1, ...base, ...extraStyle,
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", color: "#228B22", fontSize: 14 }}>
      <div style={{ width: 20, height: 20, border: "3px solid #228B22", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      {label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, color: "#6c757d" };
  return (
    <span style={{ padding: "2px 10px", borderRadius: 12, fontSize: 11, background: s.color + "22", color: s.color, fontWeight: 600, marginTop: 4, display: "inline-block" }}>
      {s.label}
    </span>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#e8f0fe", border: "1px solid #c5d0f5", borderRadius: 6, padding: "12px 16px", marginTop: 20, fontSize: 13, color: "#334" }}>
      {children}
    </div>
  );
}

function ValidationSummary({ summary }: { summary: Record<string, number> }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
      {[
        { key: "total",               label: "Total Rows",   color: "#228B22" },
        { key: "valid",               label: "Valid",        color: "#198754" },
        { key: "warning",             label: "Warnings",     color: "#fd7e14" },
        { key: "invalid",             label: "Invalid",      color: "#dc3545" },
        { key: "duplicate",           label: "Duplicates",   color: "#6f42c1" },
        { key: "unmatched_programme", label: "Unmatched Prog", color: "#DAA520" },
      ].map(({ key, label, color }) => (
        <div key={key} style={{ background: "#fff", border: `2px solid ${color}33`, borderRadius: 8, padding: "10px 18px", textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color }}>{summary[key] ?? 0}</div>
          <div style={{ fontSize: 11, color: "#666" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function ExceptionResolutionPanel({
  report, programmes, resolutions, setResolutions, onResolve, loading, onContinue, onBack, batch,
}: {
  report: { summary: Record<string, number>; invalid_rows: ValidationRow[]; unmatched_programmes: ValidationRow[]; duplicates: ValidationRow[] };
  programmes: Programme[];
  resolutions: Record<number, { programme_id: string; save_alias: boolean }>;
  setResolutions: React.Dispatch<React.SetStateAction<Record<number, { programme_id: string; save_alias: boolean }>>>;
  onResolve: (rowId: number) => void;
  loading: boolean;
  onContinue: () => void;
  onBack: () => void;
  batch: Batch | null;
}) {
  const [activeTab, setActiveTab] = useState<"unmatched" | "invalid" | "duplicates">("unmatched");

  const tabs = [
    { key: "unmatched", label: `Unmatched Programmes (${report.unmatched_programmes.length})` },
    { key: "invalid",   label: `Invalid Rows (${report.invalid_rows.length})` },
    { key: "duplicates",label: `Duplicates (${report.duplicates.length})` },
  ] as const;

  const canContinue = batch?.status !== "validation_failed" || report.invalid_rows.length === 0;

  return (
    <WizardCard title="Resolve Exceptions">
      <ValidationSummary summary={report.summary} />

      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            data-testid={`tab-${t.key}`}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "8px 16px", border: "none", cursor: "pointer", fontSize: 13,
              background: activeTab === t.key ? "#228B22" : "transparent",
              color: activeTab === t.key ? "#fff" : "#555",
              borderRadius: "6px 6px 0 0",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Unmatched programmes */}
      {activeTab === "unmatched" && (
        <div>
          {report.unmatched_programmes.length === 0
            ? <p style={{ color: "#198754", fontSize: 13 }}>No unmatched programmes.</p>
            : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={thStyle}>Row</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Uploaded Programme</th>
                    <th style={thStyle}>Match</th>
                    <th style={thStyle}>Resolve to Official Programme</th>
                    <th style={thStyle}>Save Alias</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {report.unmatched_programmes.map((row) => {
                    const res = resolutions[row.id ?? 0] ?? { programme_id: "", save_alias: true };
                    return (
                      <tr key={row.row_number} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={tdStyle}>{row.row_number}</td>
                        <td style={tdStyle}>{row.full_name}</td>
                        <td style={{ ...tdStyle, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>{row.uploaded_programme}</td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 11, color: row.match_status === "fuzzy_low" ? "#fd7e14" : "#dc3545" }}>
                            {row.match_status} ({row.confidence}%)
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <select
                            data-testid={`resolve-programme-${row.id}`}
                            value={res.programme_id}
                            onChange={(e) => setResolutions((r) => ({ ...r, [row.id ?? 0]: { ...res, programme_id: e.target.value } }))}
                            style={{ ...selectStyle, fontSize: 11, minWidth: 200 }}
                          >
                            <option value="">-- Select programme --</option>
                            {programmes.map((p) => (
                              <option key={p.id} value={p.id}>{p.programme_name} ({p.level})</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <input
                            data-testid={`save-alias-${row.id}`}
                            type="checkbox"
                            checked={res.save_alias}
                            onChange={(e) => setResolutions((r) => ({ ...r, [row.id ?? 0]: { ...res, save_alias: e.target.checked } }))}
                          />
                        </td>
                        <td style={tdStyle}>
                          <button
                            data-testid={`btn-resolve-${row.id}`}
                            onClick={() => onResolve(row.id ?? 0)}
                            disabled={!res.programme_id || loading}
                            style={{ padding: "4px 12px", background: "#228B22", color: "#fff", border: "none", borderRadius: 4, fontSize: 11, cursor: "pointer", opacity: !res.programme_id ? 0.5 : 1 }}
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* Invalid rows */}
      {activeTab === "invalid" && (
        <div>
          {report.invalid_rows.length === 0
            ? <p style={{ color: "#198754", fontSize: 13 }}>No invalid rows.</p>
            : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={thStyle}>Row</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Index No</th>
                    <th style={thStyle}>Programme</th>
                    <th style={thStyle}>Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {report.invalid_rows.map((row) => (
                    <tr key={row.row_number} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={tdStyle}>{row.row_number}</td>
                      <td style={tdStyle}>{row.full_name || "—"}</td>
                      <td style={tdStyle}>{row.kcse_index_number || "—"}</td>
                      <td style={{ ...tdStyle, maxWidth: 120, overflow: "hidden" }}>{row.uploaded_programme || "—"}</td>
                      <td style={tdStyle}>
                        {(row.errors ?? []).map((e, i) => (
                          <div key={i} style={{ color: "#dc3545", fontSize: 11 }}>&#9679; {e.message}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {/* Duplicates */}
      {activeTab === "duplicates" && (
        <div>
          {report.duplicates.length === 0
            ? <p style={{ color: "#198754", fontSize: 13 }}>No duplicate records detected.</p>
            : <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={thStyle}>Row</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Index Number</th>
                    <th style={thStyle}>Duplicate Type</th>
                  </tr>
                </thead>
                <tbody>
                  {report.duplicates.map((row) => (
                    <tr key={row.row_number} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={tdStyle}>{row.row_number}</td>
                      <td style={tdStyle}>{row.full_name}</td>
                      <td style={tdStyle}>{row.kcse_index_number}</td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 11, color: "#6f42c1", background: "#f3e8ff", padding: "2px 8px", borderRadius: 10 }}>
                          {row.duplicate_status === "file_duplicate" ? "Duplicate in file" : "Already in system"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <WizardBtn onClick={onContinue} testId="btn-continue-to-approve" style={canContinue ? {} : { opacity: 0.5 }}>
          Continue to Approval
        </WizardBtn>
        <WizardBtn variant="secondary" onClick={onBack} testId="btn-back-to-validate">Re-validate</WizardBtn>
      </div>
    </WizardCard>
  );
}

// Shared styles
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 5,
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 5,
  fontSize: 13, background: "#fff", boxSizing: "border-box",
};
const thStyle: React.CSSProperties = {
  padding: "8px 10px", textAlign: "left", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
  borderBottom: "1px solid #dee2e6",
};
const tdStyle: React.CSSProperties = {
  padding: "7px 10px", fontSize: 12, verticalAlign: "middle",
};
