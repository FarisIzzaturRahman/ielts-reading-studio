export function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueValues<T>(values: T[]) {
  return [...new Set(values)];
}
