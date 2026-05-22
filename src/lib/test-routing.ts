import type { ReadingTest } from "@/data/types";

export function getTestRouteParam(test: Pick<ReadingTest, "slug" | "testId">) {
  return test.slug || test.testId;
}

export function getTestPath(test: Pick<ReadingTest, "slug" | "testId">, suffix = "instructions") {
  return `/tests/${getTestRouteParam(test)}/${suffix}`;
}
