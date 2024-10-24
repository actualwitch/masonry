import { getWallPlan } from "./planning";

export type Strategy = "greedy" | "strides";

export type BuiltStatus = boolean[][];

export const greedyStrategy = (
  built: BuiltStatus,
  wallPlan: ReturnType<typeof getWallPlan>
) => {
  const selectedRowIndex = built.length - 1;
  const selectedRow = built[selectedRowIndex].filter(Boolean);
  if (selectedRow.length < wallPlan[selectedRowIndex].length) {
    const newLength = Math.min(
      selectedRow.length + 2,
      wallPlan[selectedRowIndex].length
    );
    const newRow = wallPlan[selectedRowIndex].map(
      (_, index) => index < newLength
    );
    const shouldAlternate = selectedRowIndex % 2 === 1;
    if (shouldAlternate) {
      newRow.reverse();
    }
    return built.map((row, index) => {
      if (index === selectedRowIndex) {
        return newRow;
      }
      return row;
    });
  }
  if (selectedRowIndex < wallPlan.length - 1) {
    const newRowIndex = selectedRowIndex + 1;
    const newRow = wallPlan[newRowIndex].map((_, index) => index < 1);
    const shouldAleternate = newRowIndex % 2 === 1;
    if (shouldAleternate) {
      newRow.reverse();
    }
    return [...built, newRow];
  }
  return built;
};

export const stridesStrategy = (
  built: BuiltStatus,
  wallPlan: ReturnType<typeof getWallPlan>
) => {
  return wallPlan.map((row) => row.map(() => true));
};