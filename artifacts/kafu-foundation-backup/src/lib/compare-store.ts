const COMPARE_KEY = "kafu_compare_progs";

export interface CompareItem {
  school: string;
  code: string;
  name: string;
}

export function getCompareList(): CompareItem[] {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addToCompare(item: CompareItem): boolean {
  const list = getCompareList();
  if (list.length >= 3) return false;
  if (list.some((l) => l.school === item.school && l.code === item.code)) return true;
  localStorage.setItem(COMPARE_KEY, JSON.stringify([...list, item]));
  return true;
}

export function removeFromCompare(school: string, code: string) {
  const list = getCompareList().filter((l) => !(l.school === school && l.code === code));
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
}

export function isInCompare(school: string, code: string): boolean {
  return getCompareList().some((l) => l.school === school && l.code === code);
}

export function clearCompare() {
  localStorage.setItem(COMPARE_KEY, "[]");
}
