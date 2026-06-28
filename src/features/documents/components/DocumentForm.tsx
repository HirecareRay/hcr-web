"use client"

import { useState } from "react"
import { DOC_SCHEMAS, FieldDef, SectionDef } from "../config/docSchemas"
// type은 추후 구조에 맞게 파일 생성하여 import
type EtcItem = { custom_key: string; custom_content: string }
type Item = Record<string, unknown>

type Props = {
  docType: string
  initialData: Record<string, unknown>
  saving: boolean
  error: string
  onSave: (data: Record<string, unknown>) => void
  onDelete: () => void
}

export default function DocumentForm({
  docType,
  initialData,
  saving,
  error,
  onSave,
  onDelete,
}: Props) {
  const config = DOC_SCHEMAS[docType]
  const [formData, setFormData] = useState<Record<string, unknown>>(() =>
    structuredClone(initialData)
  )

  if (!config) return <p className="p-5 text-red-500">알 수 없는 문서 타입입니다.</p>

  // ── 섹션 항목 helpers ──────────────────────────────────────────────
  const getItems = (key: string): Item[] => (formData[key] as Item[]) ?? []

  const setItems = (key: string, items: Item[]) =>
    setFormData((prev) => ({ ...prev, [key]: items }))

  const addItem = (sec: SectionDef) => {
    const empty: Item = Object.fromEntries(
      sec.fields.map((f) => [f.key, f.type === "boolean" ? false : null])
    )
    const item = { ...empty, ...(sec.itemDefaults ?? {}) }
    setItems(sec.key, [...getItems(sec.key), item])
  }

  const removeItem = (secKey: string, idx: number) =>
    setItems(
      secKey,
      getItems(secKey).filter((_, i) => i !== idx)
    )

  const updateField = (secKey: string, idx: number, field: string, value: unknown) =>
    setItems(
      secKey,
      getItems(secKey).map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    )

  // ── 중첩 프로젝트 helpers (work_experience) ───────────────────────
  const getSubItems = (secKey: string, parentIdx: number, subKey: string): Item[] =>
    (getItems(secKey)[parentIdx]?.[subKey] as Item[]) ?? []

  const addSubItem = (sec: SectionDef, parentIdx: number) => {
    const empty: Item = Object.fromEntries(
      (sec.subFields ?? []).map((f) => [f.key, f.type === "boolean" ? false : null])
    )
    const subItem = sec.subHasItemEtc ? { ...empty, etc: [] } : empty
    const updated = [...getSubItems(sec.key, parentIdx, sec.subKey!), subItem]
    updateField(sec.key, parentIdx, sec.subKey!, updated)
  }

  const removeSubItem = (sec: SectionDef, parentIdx: number, subIdx: number) => {
    const updated = getSubItems(sec.key, parentIdx, sec.subKey!).filter((_, i) => i !== subIdx)
    updateField(sec.key, parentIdx, sec.subKey!, updated)
  }

  const updateSubField = (
    sec: SectionDef,
    parentIdx: number,
    subIdx: number,
    field: string,
    value: unknown
  ) => {
    const updated = getSubItems(sec.key, parentIdx, sec.subKey!).map((sub, i) =>
      i === subIdx ? { ...sub, [field]: value } : sub
    )
    updateField(sec.key, parentIdx, sec.subKey!, updated)
  }

  // 구 DB 데이터: etc가 단일 객체로 저장된 경우 배열로 정규화
  const toEtcArray = (val: unknown): EtcItem[] => {
    if (!val) return []
    if (Array.isArray(val)) return val as EtcItem[]
    return [val as EtcItem]
  }

  // ── item-level etc helpers (portfolio / work_experience 항목) ─────
  const getItemEtc = (secKey: string, idx: number): EtcItem[] =>
    toEtcArray(getItems(secKey)[idx]?.etc)

  const addItemEtc = (secKey: string, idx: number) =>
    updateField(secKey, idx, "etc", [
      ...getItemEtc(secKey, idx),
      { custom_key: "", custom_content: "" },
    ])

  const removeItemEtc = (secKey: string, idx: number, etcIdx: number) =>
    updateField(
      secKey,
      idx,
      "etc",
      getItemEtc(secKey, idx).filter((_, i) => i !== etcIdx)
    )

  const updateItemEtcField = (
    secKey: string,
    idx: number,
    etcIdx: number,
    key: keyof EtcItem,
    val: string
  ) =>
    updateField(
      secKey,
      idx,
      "etc",
      getItemEtc(secKey, idx).map((e, i) => (i === etcIdx ? { ...e, [key]: val } : e))
    )

  // ── sub-item-level etc helpers (work_experience > project) ────────
  const getSubItemEtc = (sec: SectionDef, parentIdx: number, subIdx: number): EtcItem[] =>
    toEtcArray(getSubItems(sec.key, parentIdx, sec.subKey!)[subIdx]?.etc)

  const addSubItemEtc = (sec: SectionDef, parentIdx: number, subIdx: number) => {
    const subs = getSubItems(sec.key, parentIdx, sec.subKey!)
    const updated = subs.map((sub, i) =>
      i === subIdx
        ? {
            ...sub,
            etc: [...getSubItemEtc(sec, parentIdx, subIdx), { custom_key: "", custom_content: "" }],
          }
        : sub
    )
    updateField(sec.key, parentIdx, sec.subKey!, updated)
  }

  const removeSubItemEtc = (sec: SectionDef, parentIdx: number, subIdx: number, etcIdx: number) => {
    const subs = getSubItems(sec.key, parentIdx, sec.subKey!)
    const updated = subs.map((sub, i) =>
      i === subIdx ? { ...sub, etc: toEtcArray(sub.etc).filter((_, j) => j !== etcIdx) } : sub
    )
    updateField(sec.key, parentIdx, sec.subKey!, updated)
  }

  const updateSubItemEtcField = (
    sec: SectionDef,
    parentIdx: number,
    subIdx: number,
    etcIdx: number,
    key: keyof EtcItem,
    val: string
  ) => {
    const subs = getSubItems(sec.key, parentIdx, sec.subKey!)
    const updated = subs.map((sub, i) =>
      i === subIdx
        ? {
            ...sub,
            etc: toEtcArray(sub.etc).map((e, j) => (j === etcIdx ? { ...e, [key]: val } : e)),
          }
        : sub
    )
    updateField(sec.key, parentIdx, sec.subKey!, updated)
  }

  // ── etc (문서 최상위) helpers ──────────────────────────────────────
  const etcList = (): EtcItem[] => toEtcArray(formData.etc)
  const setEtc = (list: EtcItem[]) => setFormData((prev) => ({ ...prev, etc: list }))
  const addEtc = () => setEtc([...etcList(), { custom_key: "", custom_content: "" }])
  const removeEtc = (idx: number) => setEtc(etcList().filter((_, i) => i !== idx))
  const updateEtc = (idx: number, key: keyof EtcItem, value: string) =>
    setEtc(etcList().map((e, i) => (i === idx ? { ...e, [key]: value } : e)))

  // ── 필드 렌더 ─────────────────────────────────────────────────────
  function renderField(field: FieldDef, value: unknown, onChange: (v: unknown) => void) {
    const base = "w-full rounded border px-2 py-1 text-sm"
    if (field.type === "boolean") {
      return (
        <label key={field.key} className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      )
    }
    if (field.type === "textarea") {
      return (
        <div key={field.key}>
          <label className="mb-0.5 block text-xs text-gray-500">{field.label}</label>
          <textarea
            className={`${base} min-h-[80px]`}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
    }
    return (
      <div key={field.key}>
        <label className="mb-0.5 block text-xs text-gray-500">{field.label}</label>
        <input
          type={field.type === "number" ? "number" : "text"}
          className={base}
          value={(value as string | number) ?? ""}
          onChange={(e) =>
            onChange(field.type === "number" ? Number(e.target.value) || null : e.target.value)
          }
        />
      </div>
    )
  }

  // ── 항목 etc 렌더 (top-level etc와 동일한 스타일) ────────────────
  function renderEtcList(
    label: string,
    list: EtcItem[],
    onAdd: () => void,
    onRemove: (i: number) => void,
    onUpdate: (i: number, key: keyof EtcItem, val: string) => void
  ) {
    return (
      <div className="mt-3">
        <h2 className="mb-2 text-base font-bold">{label}</h2>
        <div className="space-y-2">
          {Array.isArray(list) &&
            list.map((etc, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="mb-0.5 block text-xs text-gray-500">항목명</label>
                  <input
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={etc.custom_key ?? ""}
                    onChange={(e) => onUpdate(i, "custom_key", e.target.value)}
                  />
                </div>
                <div className="flex-[2]">
                  <label className="mb-0.5 block text-xs text-gray-500">내용</label>
                  <input
                    className="w-full rounded border px-2 py-1 text-sm"
                    value={etc.custom_content ?? ""}
                    onChange={(e) => onUpdate(i, "custom_content", e.target.value)}
                  />
                </div>
                <button
                  onClick={() => onRemove(i)}
                  className="mt-5 text-xs text-red-400 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            ))}
        </div>
        <button
          onClick={onAdd}
          className="mt-2 rounded border px-3 py-1 text-sm text-gray-500 hover:bg-gray-50"
        >
          + 기타 추가
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 섹션 렌더 */}
      {config.sections.map((sec) => (
        <section key={sec.key}>
          <h2 className="mb-2 text-base font-bold">{sec.label}</h2>
          <div className="space-y-3">
            {getItems(sec.key).map((item, idx) => (
              <div key={idx} className="rounded-lg border p-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {sec.fields.map((field) =>
                    renderField(field, item[field.key], (v) =>
                      updateField(sec.key, idx, field.key, v)
                    )
                  )}
                </div>

                {/* List[str] 필드 (responsibilities) */}
                {sec.strListKey && (
                  <div className="mt-2">
                    <label className="mb-0.5 block text-xs text-gray-500">{sec.strListLabel}</label>
                    <textarea
                      className="min-h-[80px] w-full rounded border px-2 py-1 text-sm"
                      value={((item[sec.strListKey] as string[]) ?? []).join("\n")}
                      onChange={(e) =>
                        updateField(
                          sec.key,
                          idx,
                          sec.strListKey!,
                          e.target.value ? e.target.value.split("\n") : []
                        )
                      }
                    />
                  </div>
                )}

                {/* 중첩 프로젝트 (work_experience) */}
                {sec.subKey && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-medium text-gray-600">{sec.subLabel}</p>
                    <div className="space-y-2 pl-2">
                      {getSubItems(sec.key, idx, sec.subKey).map((sub, subIdx) => (
                        <div key={subIdx} className="rounded border border-gray-200 p-2">
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {(sec.subFields ?? []).map((field) =>
                              renderField(field, sub[field.key], (v) =>
                                updateSubField(sec, idx, subIdx, field.key, v)
                              )
                            )}
                          </div>
                          {sec.subHasItemEtc &&
                            renderEtcList(
                              "기타",
                              getSubItemEtc(sec, idx, subIdx),
                              () => addSubItemEtc(sec, idx, subIdx),
                              (ei) => removeSubItemEtc(sec, idx, subIdx, ei),
                              (ei, key, val) =>
                                updateSubItemEtcField(sec, idx, subIdx, ei, key, val)
                            )}
                          <button
                            onClick={() => removeSubItem(sec, idx, subIdx)}
                            className="mt-2 text-xs text-red-400 hover:text-red-600"
                          >
                            프로젝트 삭제
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addSubItem(sec, idx)}
                        className="rounded border px-2 py-1 text-xs text-gray-500 hover:bg-gray-50"
                      >
                        + {sec.subLabel} 추가
                      </button>
                    </div>
                  </div>
                )}

                {/* 항목 etc (portfolio 프로젝트 / work_experience 경력 항목) */}
                {sec.hasItemEtc &&
                  renderEtcList(
                    "기타",
                    getItemEtc(sec.key, idx),
                    () => addItemEtc(sec.key, idx),
                    (ei) => removeItemEtc(sec.key, idx, ei),
                    (ei, key, val) => updateItemEtcField(sec.key, idx, ei, key, val)
                  )}

                <button
                  onClick={() => removeItem(sec.key, idx)}
                  className="mt-2 text-xs text-red-400 hover:text-red-600"
                >
                  항목 삭제
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => addItem(sec)}
            className="mt-2 rounded border px-3 py-1 text-sm text-gray-500 hover:bg-gray-50"
          >
            + {sec.label} 추가
          </button>
        </section>
      ))}

      {/* 문서 최상위 etc — portfolio/work_experience는 항목별 etc를 사용하므로 제외 */}
      {docType !== "portfolio" && docType !== "work_experience" && (
        <section>
          {renderEtcList("기타 (사용자 정의)", etcList(), addEtc, removeEtc, updateEtc)}
        </section>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2 pb-8">
        <button
          onClick={() => onSave(formData)}
          disabled={saving}
          className="rounded bg-orange-400 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
        <button
          onClick={onDelete}
          className="rounded bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200"
        >
          문서 삭제
        </button>
      </div>
    </div>
  )
}
