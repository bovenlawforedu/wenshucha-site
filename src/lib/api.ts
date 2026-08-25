// 文书查 · 数据访问层（API 抽象）
// ★ 后续接入真实全量数据：只改本文件的内部实现（把演示数据换成 fetch 真实 API），
//   页面与组件代码零改动。getCaseData / searchCases 的签名保持稳定。

import { CASES, CASE_KEYS, DEFAULT_CASE, isDemo } from '../data/cases';
import type { CaseData, CaseItem } from '../data/cases';

export type { CaseData, CaseItem };

/** 当前是否为演示数据 */
export function isDemoData(): boolean {
  return isDemo;
}

/** 全部案由 key 列表（真实数据可改为拉取热门案由榜） */
export function getCaseKeys(): string[] {
  return CASE_KEYS;
}

/** 默认案由 */
export function getDefaultCase(): string {
  return DEFAULT_CASE;
}

/** 按案由名取完整数据（含分布/区间/案例列表） */
export function getCaseData(key: string): CaseData | null {
  return CASES[key] ?? null;
}

/**
 * 检索：输入案由/关键词，返回命中的演示案由数据。
 * 真实数据接入后：改为调后端 search 接口，返回真实命中列表。
 */
export function searchCases(query: string): { key: string; data: CaseData; matched: boolean } {
  const q = (query || '').trim();
  if (CASES[q]) return { key: q, data: CASES[q], matched: true };
  return { key: DEFAULT_CASE, data: CASES[DEFAULT_CASE], matched: false };
}

/** 按过滤条件筛案例（演示：前端过滤；真实数据：下推后端） */
export function filterItems(data: CaseData, filters: { level: string; prog: string; year: string }): CaseItem[] {
  return data.items.filter((it) => {
    if (filters.level !== '全部' && it.level !== filters.level) return false;
    if (filters.prog !== '全部' && it.prog !== filters.prog) return false;
    if (filters.year !== '全部' && it.year !== filters.year) return false;
    return true;
  });
}
