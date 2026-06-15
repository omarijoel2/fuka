import React from "react";
import { Plus, Trash2 } from "lucide-react";
import MediaUploadField from "@/components/media-upload-field";

const MEDIA_KEY_RE =
  /(^|_)(url|file|files|document|documents|attachment|attachments|download|downloads|media|image|images|photo|photos|logo|icon|video|audio|pdf|doc|thumbnail|cover|href)$/i;

function isMediaKey(key: string): boolean {
  return MEDIA_KEY_RE.test(key);
}

const INPUT =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

type Json = unknown;

function humanize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function emptyLike(sample: Json): Json {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(sample as Record<string, Json>)) {
      out[k] = emptyLike(v);
    }
    return out;
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

function isPlainObject(v: Json): v is Record<string, Json> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function testid(path: string): string {
  return path.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

interface FieldProps {
  label: string;
  value: Json;
  onChange: (next: Json) => void;
  onRemove?: () => void;
  path: string;
  depth: number;
  media?: boolean;
}

function ScalarField({ label, value, onChange, onRemove, path, media }: FieldProps) {
  const isBool = typeof value === "boolean";
  const isNum = typeof value === "number";
  const str = value == null ? "" : String(value);
  const longText = !isBool && !isNum && (str.length > 60 || str.includes("\n"));
  const isMediaField = media && !isBool && !isNum;

  if (isMediaField) {
    return (
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {label && (
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{label}</label>
          )}
          <MediaUploadField value={str} onChange={(url) => onChange(url)} testid={testid(path)} />
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            data-testid={`sd-remove-${testid(path)}`}
            className="mt-6 text-gray-300 hover:text-red-500 transition-colors shrink-0"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        {label && (
          <label className="block text-[11px] font-medium text-gray-500 mb-1">{label}</label>
        )}
        {isBool ? (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              data-testid={`sd-bool-${testid(path)}`}
              className="rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            {value ? "Yes" : "No"}
          </label>
        ) : isNum ? (
          <input
            type="number"
            value={str}
            onChange={(e) => {
              if (e.target.value === "") return onChange(0);
              const n = Number(e.target.value);
              onChange(Number.isFinite(n) ? n : value);
            }}
            data-testid={`sd-num-${testid(path)}`}
            className={INPUT}
          />
        ) : longText ? (
          <textarea
            rows={3}
            value={str}
            onChange={(e) => onChange(e.target.value)}
            data-testid={`sd-text-${testid(path)}`}
            className={`${INPUT} resize-none`}
          />
        ) : (
          <input
            value={str}
            onChange={(e) => onChange(e.target.value)}
            data-testid={`sd-input-${testid(path)}`}
            className={INPUT}
          />
        )}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          data-testid={`sd-remove-${testid(path)}`}
          className="mt-6 text-gray-300 hover:text-red-500 transition-colors shrink-0"
          aria-label="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ArrayField({ label, value, onChange, path, depth, media }: FieldProps) {
  const arr = Array.isArray(value) ? value : [];
  const sample = arr.length > 0 ? arr[0] : "";
  const objectItems = arr.length > 0 && isPlainObject(arr[0]);

  const update = (i: number, next: Json) => {
    const copy = [...arr];
    copy[i] = next;
    onChange(copy);
  };
  const remove = (i: number) => onChange(arr.filter((_, idx) => idx !== i));
  const add = () => onChange([...arr, emptyLike(sample)]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        <span className="text-[10px] text-gray-400">{arr.length} item{arr.length === 1 ? "" : "s"}</span>
      </div>
      <div className="space-y-2">
        {arr.length === 0 && (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2" data-testid={`sd-empty-${testid(path)}`}>
            This list is empty. Use Advanced (JSON) to add the first entry, then continue editing here.
          </p>
        )}
        {arr.map((item, i) =>
          objectItems && isPlainObject(item) ? (
            <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-500">
                  {humanize(label.replace(/s$/, ""))} {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  data-testid={`sd-remove-${testid(`${path}-${i}`)}`}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <ObjectFields
                value={item}
                onChange={(next) => update(i, next)}
                path={`${path}-${i}`}
                depth={depth + 1}
              />
            </div>
          ) : (
            <ScalarField
              key={i}
              label=""
              value={item}
              onChange={(next) => update(i, next)}
              onRemove={() => remove(i)}
              path={`${path}-${i}`}
              depth={depth + 1}
              media={media}
            />
          )
        )}
      </div>
      {arr.length > 0 && (
        <button
          type="button"
          onClick={add}
          data-testid={`sd-add-${testid(path)}`}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add {humanize(label.replace(/s$/, "")).toLowerCase()}
        </button>
      )}
    </div>
  );
}

function Field(props: FieldProps) {
  const { value } = props;
  if (Array.isArray(value)) return <ArrayField {...props} />;
  if (isPlainObject(value)) {
    return (
      <div className="border border-gray-200 rounded-xl p-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">{props.label}</p>
        <ObjectFields
          value={value}
          onChange={props.onChange}
          path={props.path}
          depth={props.depth + 1}
        />
      </div>
    );
  }
  return <ScalarField {...props} />;
}

function ObjectFields({
  value,
  onChange,
  path,
  depth,
}: {
  value: Record<string, Json>;
  onChange: (next: Record<string, Json>) => void;
  path: string;
  depth: number;
}) {
  const entries = Object.entries(value).filter(([k]) => !k.startsWith("_"));
  return (
    <div className="space-y-3">
      {entries.map(([key, val]) => (
        <Field
          key={key}
          label={humanize(key)}
          value={val}
          onChange={(next) => onChange({ ...value, [key]: next })}
          path={`${path}-${key}`}
          depth={depth}
          media={isMediaKey(key)}
        />
      ))}
    </div>
  );
}

export default function StructuredDataEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const visibleKeys = Object.keys(value).filter((k) => !k.startsWith("_"));

  if (visibleKeys.length === 0) {
    return (
      <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3" data-testid="sd-empty">
        This page has no editable content fields. Use the Advanced (JSON) view to add fields.
      </p>
    );
  }

  return (
    <div className="space-y-3" data-testid="structured-data-form">
      <ObjectFields
        value={value as Record<string, Json>}
        onChange={(next) => onChange(next as Record<string, unknown>)}
        path="sd"
        depth={0}
      />
    </div>
  );
}
