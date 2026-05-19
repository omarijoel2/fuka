import { useState } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const API = `${BASE}/api/admissions-app`;

interface VerifyResult {
  verified: boolean;
  message?: string;
  verification_token?: string;
  multiple_matches?: boolean;
  letter_ready?: boolean;
  student?: {
    full_name: string;
    programme_name: string;
    school_name: string;
    academic_year: string;
    admission_status: string;
    index_number_masked: string;
  };
}

export default function KuccpsVerifyPage() {
  const [indexNumber, setIndexNumber] = useState("");
  const [kcseYear, setKcseYear] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indexNumber.trim() || !kcseYear.trim()) {
      setError("KCSE index number and year are required.");
      return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API}/kuccps/verify-placement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kcse_index_number: indexNumber.trim(),
          kcse_year: kcseYear.trim(),
          id_number: idNumber.trim() || undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Unable to connect to the verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadLetter = async () => {
    if (!result?.verification_token) return;
    setDownloading(true); setDownloadError(null);
    try {
      const res = await fetch(`${API}/kuccps/admission-letter/${result.verification_token}/download`);
      if (!res.ok) {
        const data = await res.json();
        setDownloadError(data.message ?? "Download failed. Please contact Admissions.");
        return;
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `KAFU-Admission-Letter-${indexNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("Download failed. Please try again or contact Admissions.");
    } finally {
      setDownloading(false);
    }
  };

  const schoolLabels: Record<string, string> = {
    SESS: "School of Education & Social Sciences",
    SBE:  "School of Business & Economics",
    SCIT: "School of Computing & Information Technology",
    SOS:  "School of Science",
    SHS:  "School of Health Sciences",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fdf9", fontFamily: "Inter, sans-serif" }}>
      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg, #1A5C38 0%, #0e3a24 100%)", color: "#fff", padding: "48px 24px", textAlign: "center" }}>
        <img
          src="https://kafu.ac.ke/wp-content/uploads/2025/10/logo-updated-750x126.png"
          alt="KAFU Logo"
          style={{ height: 50, marginBottom: 20, filter: "brightness(10)" }}
        />
        <h1 style={{ fontSize: 28, fontFamily: "Playfair Display, serif", margin: "0 0 8px" }}>
          KUCCPS Admission Verification Portal
        </h1>
        <p style={{ fontSize: 15, color: "#c8e6c9", maxWidth: 560, margin: "0 auto" }}>
          Use this portal only if you have been placed at Kaimosi Friends University through KUCCPS.
          Enter your KCSE details below to verify your placement and download your admission letter.
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>

        {/* Verification Form */}
        {!result && (
          <div style={{ background: "#fff", borderRadius: 12, padding: "32px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 18, color: "#1A5C38", fontFamily: "Playfair Display, serif" }}>
              Verify Your Placement
            </h2>
            <form onSubmit={handleVerify}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle} htmlFor="kcse-index">
                  KCSE Index Number <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  id="kcse-index"
                  data-testid="input-kcse-index"
                  type="text"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  placeholder="e.g. 12345678901 or 12345678901/2024"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle} htmlFor="kcse-year">
                  KCSE Examination Year <span style={{ color: "#dc3545" }}>*</span>
                </label>
                <input
                  id="kcse-year"
                  data-testid="input-kcse-year"
                  type="text"
                  value={kcseYear}
                  onChange={(e) => setKcseYear(e.target.value)}
                  placeholder="e.g. 2024"
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle} htmlFor="id-number">
                  National ID / Birth Certificate Number <span style={{ color: "#888", fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="id-number"
                  data-testid="input-id-number"
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="For additional verification if needed"
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{ background: "#fff3f3", border: "1px solid #dc3545", borderRadius: 6, padding: "10px 14px", marginBottom: 16, color: "#dc3545", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                data-testid="btn-verify-placement"
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", background: "#1A5C38", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Verifying…" : "Verify My Placement"}
              </button>
            </form>

            <div style={{ marginTop: 20, padding: "12px 16px", background: "#f0f7f3", borderRadius: 6, fontSize: 12, color: "#555" }}>
              <strong style={{ color: "#1A5C38" }}>Privacy Notice:</strong> Your details are only used to match your placement record.
              No personal data is displayed until verification is successful.
            </div>
          </div>
        )}

        {/* Verification Result */}
        {result && (
          <div>
            {/* Not verified */}
            {!result.verified && (
              <div style={{ background: "#fff3f3", border: "1px solid #dc3545", borderRadius: 12, padding: "28px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>&#9888;</div>
                <h3 style={{ color: "#dc3545", margin: "0 0 10px" }}>Placement Not Found</h3>
                <p style={{ color: "#555", fontSize: 14, margin: "0 0 20px" }}>{result.message}</p>
                {result.multiple_matches && (
                  <p style={{ color: "#856404", background: "#fff3cd", padding: "10px", borderRadius: 6, fontSize: 13, marginBottom: 20 }}>
                    Multiple records matched. Please provide your ID number for additional verification.
                  </p>
                )}
                <button
                  data-testid="btn-try-again"
                  onClick={() => setResult(null)}
                  style={{ padding: "10px 24px", background: "#1A5C38", color: "#fff", border: "none", borderRadius: 6, fontSize: 14, cursor: "pointer" }}
                >
                  Try Again
                </button>
                <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
                  Need help? Contact Admissions: <a href="mailto:admissions@kafu.ac.ke" style={{ color: "#1A5C38" }}>admissions@kafu.ac.ke</a> | +254 777 373 633
                </div>
              </div>
            )}

            {/* Verified */}
            {result.verified && result.student && (
              <div style={{ background: "#fff", border: "1px solid #c3e6cb", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <div style={{ background: "#1A5C38", padding: "20px 24px", color: "#fff" }}>
                  <div style={{ fontSize: 12, color: "#a8d5b8", marginBottom: 4 }}>Placement Verified</div>
                  <h2 style={{ margin: 0, fontFamily: "Playfair Display, serif", fontSize: 20 }}>
                    {result.student.full_name}
                  </h2>
                </div>

                <div style={{ padding: "20px 24px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <tbody>
                      {[
                        { label: "KCSE Index", value: result.student.index_number_masked },
                        { label: "Programme Offered", value: result.student.programme_name, bold: true, color: "#1A5C38" },
                        { label: "School / Faculty", value: schoolLabels[result.student.school_name] ?? result.student.school_name },
                        { label: "Academic Year", value: result.student.academic_year },
                        { label: "Admission Status", value: result.student.admission_status },
                      ].map(({ label, value, bold, color }) => (
                        <tr key={label} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "10px 0", color: "#666", width: "45%" }}>{label}</td>
                          <td style={{ padding: "10px 0", fontWeight: bold ? 600 : 400, color: color ?? "#222" }}>{value ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Letter status */}
                  {result.letter_ready ? (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ background: "#d4edda", border: "1px solid #c3e6cb", borderRadius: 6, padding: "12px 16px", marginBottom: 16 }}>
                        <strong style={{ color: "#155724" }}>Your admission letter is ready for download.</strong>
                      </div>
                      {downloadError && (
                        <div style={{ background: "#fff3f3", border: "1px solid #dc3545", borderRadius: 6, padding: "10px 14px", marginBottom: 12, color: "#dc3545", fontSize: 13 }}>
                          {downloadError}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                          data-testid="btn-download-letter"
                          onClick={handleDownloadLetter}
                          disabled={downloading}
                          style={{
                            padding: "11px 24px", background: "#1A5C38", color: "#fff",
                            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
                            cursor: downloading ? "not-allowed" : "pointer", opacity: downloading ? 0.7 : 1,
                          }}
                        >
                          {downloading ? "Downloading…" : "Download Admission Letter (PDF)"}
                        </button>
                        <a
                          data-testid="link-joining-instructions"
                          href="https://portal.kafu.ac.ke/joining-instructions"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: "11px 20px", background: "#fff", border: "1px solid #1A5C38", color: "#1A5C38", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                        >
                          Joining Instructions
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 20, background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 6, padding: "12px 16px", fontSize: 13, color: "#856404" }}>
                      <strong>Your placement has been verified</strong>, but your admission letter is being prepared.
                      Please check again later or contact Admissions if you need urgent assistance.
                    </div>
                  )}

                  <div style={{ marginTop: 20, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
                    <button
                      data-testid="btn-verify-new"
                      onClick={() => { setResult(null); setIndexNumber(""); setKcseYear(""); setIdNumber(""); }}
                      style={{ background: "none", border: "none", color: "#1A5C38", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Verify another student
                    </button>
                    <span style={{ color: "#ccc", margin: "0 10px" }}>|</span>
                    <a href="/admissions" style={{ color: "#1A5C38", fontSize: 13 }}>Admissions Home</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help section */}
        <div style={{ marginTop: 32, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "20px 24px" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, color: "#1A5C38" }}>Need Help?</h3>
          <ul style={{ margin: 0, padding: "0 0 0 20px", fontSize: 13, color: "#555", lineHeight: 2 }}>
            <li>Your KCSE index number is found on your KCSE statement of results or KUCCPS placement letter</li>
            <li>If you were recently placed, your data may take 24-48 hours to appear</li>
            <li>Contact Admissions: <a href="mailto:admissions@kafu.ac.ke" style={{ color: "#1A5C38" }}>admissions@kafu.ac.ke</a></li>
            <li>Phone: +254 777 373 633</li>
            <li>Visit: P.O. Box 385-50309, Kaimosi, Kenya</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 5,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 7,
  fontSize: 14, outline: "none", boxSizing: "border-box",
};
