"use client"

import { cn } from "@/lib/utils"
import { DOC_SCHEMAS, FieldDef, SectionDef } from "../config/docSchemas"

type Item = Record<string, unknown>
type EtcItem = { custom_key: string; custom_content: string }

type Props = {
  docType: string
  data: Record<string, unknown>
}

// 구 DB 데이터: etc가 단일 객체로 저장된 경우 배열로 정규화 (DocumentForm과 동일 규칙)
function toEtcArray(val: unknown): EtcItem[] {
  if (!val) return []
  if (Array.isArray(val)) return val as EtcItem[]
  return [val as EtcItem]
}

function FieldValue({ field, value }: { field: FieldDef; value: unknown }) {
  const display =
    field.type === "boolean"
      ? value
        ? "예"
        : "아니오"
      : value === null || value === undefined || value === ""
        ? "-"
        : String(value)

  return (
    <div>
      <p className="text-disabled text-xs">{field.label}</p>
      <p
        className={cn(
          "text-ink mt-0.5 text-sm",
          field.type === "textarea" && "leading-relaxed whitespace-pre-wrap"
        )}
      >
        {display}
      </p>
    </div>
  )
}

function EtcRows({ list }: { list: EtcItem[] }) {
  if (list.length === 0) return null
  return (
    <div className="border-warm-border mt-3 space-y-2 border-t pt-3">
      {list.map((etc, i) => (
        <div key={i}>
          <p className="text-disabled text-xs">{etc.custom_key || "기타"}</p>
          <p className="text-ink mt-0.5 text-sm">{etc.custom_content || "-"}</p>
        </div>
      ))}
    </div>
  )
}

function SectionView({ sec, items }: { sec: SectionDef; items: Item[] }) {
  if (items.length === 0) {
    return (
      <p className="text-disabled border-warm-border rounded-2xl border border-dashed bg-white px-4 py-6 text-center text-sm">
        등록된 {sec.label} 정보가 없습니다.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="border-warm-border rounded-2xl border bg-white p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sec.fields.map((field) => (
              <FieldValue key={field.key} field={field} value={item[field.key]} />
            ))}
          </div>

          {sec.strListKey && (
            <div className="mt-3">
              <p className="text-disabled text-xs">{sec.strListLabel}</p>
              <ul className="mt-1 space-y-1">
                {((item[sec.strListKey] as string[]) ?? []).map((line, i) => (
                  <li key={i} className="text-ink flex items-start gap-1.5 text-sm">
                    <span className="bg-primary mt-1.5 size-1 shrink-0 rounded-full" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sec.subKey && (
            <div className="mt-3">
              <p className="text-muted mb-1 text-xs font-medium">{sec.subLabel}</p>
              <div className="space-y-2">
                {((item[sec.subKey] as Item[]) ?? []).map((sub, subIdx) => (
                  <div key={subIdx} className="bg-warm-bg border-warm-border rounded-xl border p-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(sec.subFields ?? []).map((field) => (
                        <FieldValue key={field.key} field={field} value={sub[field.key]} />
                      ))}
                    </div>
                    {sec.subHasItemEtc && <EtcRows list={toEtcArray(sub.etc)} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sec.hasItemEtc && <EtcRows list={toEtcArray(item.etc)} />}
        </div>
      ))}
    </div>
  )
}

// 편집 폼(DocumentForm)과 같은 DOC_SCHEMAS를 읽기 전용으로 렌더링한다.
export default function DocumentView({ docType, data }: Props) {
  const config = DOC_SCHEMAS[docType]
  if (!config) return <p className="text-error p-5 text-sm">알 수 없는 문서 타입입니다.</p>

  const topEtc = toEtcArray(data.etc)
  const showTopEtc = docType !== "portfolio" && docType !== "work_experience" && topEtc.length > 0

  return (
    <div className="space-y-8">
      {config.sections.map((sec) => (
        <section key={sec.key}>
          <h2 className="text-ink mb-2 text-base font-bold">{sec.label}</h2>
          <SectionView sec={sec} items={(data[sec.key] as Item[]) ?? []} />
        </section>
      ))}

      {showTopEtc && (
        <section>
          <h2 className="text-ink mb-2 text-base font-bold">기타</h2>
          <div className="border-warm-border space-y-2 rounded-2xl border bg-white p-4">
            {topEtc.map((etc, i) => (
              <div key={i}>
                <p className="text-disabled text-xs">{etc.custom_key || "기타"}</p>
                <p className="text-ink mt-0.5 text-sm">{etc.custom_content || "-"}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
