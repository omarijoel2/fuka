import { useQuery } from "@tanstack/react-query";
import { FileText, ExternalLink, Download, BookOpen, Shield, FileCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "").replace(/\/api$/i, "") + "/api/staff";

interface PolicyDocument {
  title: string;
  type: string;
  url: string;
  size: string;
  description?: string;
}
interface PolicyData {
  intro: string;
  documents: PolicyDocument[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "Strategic Plan": <BookOpen className="w-5 h-5" />,
  "Policies":       <Shield className="w-5 h-5" />,
  "Service Charter": <FileCheck className="w-5 h-5" />,
};

function docIcon(title: string) {
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (title.includes(key)) return icon;
  }
  return <FileText className="w-5 h-5" />;
}

export default function PolicyDocumentsPage() {
  const { user } = useAuth();
  const token = localStorage.getItem("kafu_staff_token");

  const { data, isLoading, error } = useQuery<PolicyData>({
    queryKey: ["policy-documents"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/policy-documents`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed to load documents");
      return res.json();
    },
  });

  const docs = data?.documents ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Policy Documents</h1>
        <p className="text-sm text-gray-500 mt-1">
          {data?.intro || "Institutional policies, strategic documents, and guidelines for all staff."}
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Failed to load documents. Please try again later.
        </div>
      )}

      {!isLoading && !error && docs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No policy documents have been published yet.</p>
        </div>
      )}

      {!isLoading && docs.length > 0 && (
        <div className="space-y-3">
          {docs.map((doc, i) => {
            const isExternal = doc.url.startsWith("http");
            const isLink = !!doc.url;
            return (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:border-[#1A5C38]/40 hover:shadow-sm transition-all"
                data-testid={`doc-card-${i}`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#1A5C38]/10 text-[#1A5C38] flex items-center justify-center shrink-0">
                  {docIcon(doc.title)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                  {doc.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    {doc.type && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {doc.type}
                      </span>
                    )}
                    {doc.size && (
                      <span className="text-xs text-gray-400">{doc.size}</span>
                    )}
                  </div>
                </div>
                {isLink && (
                  <a
                    href={doc.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    download={!isExternal}
                    data-testid={`doc-link-${i}`}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-[#1A5C38] hover:text-[#154d2f] bg-[#1A5C38]/8 hover:bg-[#1A5C38]/15 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {isExternal ? (
                      <><ExternalLink className="w-3.5 h-3.5" /> View</>
                    ) : (
                      <><Download className="w-3.5 h-3.5" /> Download</>
                    )}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 pt-2">
        These documents are for internal staff use only. Contact the Registry if you need an older version or a certified copy.
      </p>
    </div>
  );
}
