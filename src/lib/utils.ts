/**
 * utils.ts
 *
 * 프로젝트 전반에서 공통으로 사용하는 유틸리티 함수 모음입니다.
 *
 * cn() 함수 하나만 있지만, 앞으로 날짜 포맷, 문자열 처리 등
 * 공통 유틸리티가 생기면 여기에 추가합니다.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn() — Tailwind CSS 클래스를 안전하게 조합하는 함수
 *
 * 두 가지 문제를 동시에 해결합니다:
 * 1. clsx: 조건부로 클래스를 붙이거나 뗄 수 있습니다.
 *    예) cn("text-sm", isActive && "font-bold")
 *       → isActive가 true면 "text-sm font-bold", false면 "text-sm"
 *
 * 2. twMerge: 충돌하는 Tailwind 클래스를 나중 것으로 덮어씁니다.
 *    예) cn("p-4", "p-8") → "p-8"  (앞의 p-4는 무시됨)
 *
 * 사용법: className={cn("기본클래스", 조건 && "조건부클래스", props.className)}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
