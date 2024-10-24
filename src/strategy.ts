import { getWallPlan, HORIZONTAL_CHOICES, HorizontalOptions } from "./planning";

export type Strategy = "greedy" | "strides";

export type BuiltStatus = number[][];

// this strategy aims to minimize vertical movement
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
    const newRow = wallPlan[selectedRowIndex].map((_, index) =>
      index < newLength ? selectedRowIndex + 1 : 0
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
    const newRow = wallPlan[newRowIndex].map((_, index) =>
      index < 1 ? newRowIndex + 1 : 0
    );
    const shouldAleternate = newRowIndex % 2 === 1;
    if (shouldAleternate) {
      newRow.reverse();
    }
    return [...built, newRow];
  }
  return built;
};

function getPlacedRowWidth(row: number[], wallPlanRow: number[]) {
  return row.reduce((acc, item, index) => {
    if (item) {
      const itemType = wallPlanRow[index];
      return acc + HORIZONTAL_CHOICES[itemType][0];
    }
    return acc;
  }, 0);
}

// alternative strategy that grows the height quickly
export function* stridesStrategy(wallPlan: ReturnType<typeof getWallPlan>) {
  let newBuilt = wallPlan.map((row) => row.map(() => 0));
  let stride = 1;
  let x = 0;
  let y = 0;
  while (true) {
    if (y > 0) {
      const prevRowWidth = getPlacedRowWidth(newBuilt[y - 1], wallPlan[y - 1]);
      const newBrickWidth = HORIZONTAL_CHOICES[wallPlan[y][0]][0];
      console.log(prevRowWidth, newBrickWidth);
      if (prevRowWidth <= newBrickWidth) {
        y = 0;
        stride += 1;
        continue;
      }
    }
    const placedBricks = newBuilt[y].filter(Boolean).length;
    let advanceBy = 1;
    if (
      wallPlan[y][placedBricks + advanceBy] === HorizontalOptions.HEAD_JOINT
    ) {
      advanceBy += 1;
    }
    const newRow = wallPlan[y].map((_, index) => {
      if (newBuilt[y][index]) {
        return newBuilt[y][index];
      }
      if (index < placedBricks + advanceBy) {
        return stride;
      }
      return 0;
    });

    newBuilt = [
      ...newBuilt.map((row, index) => [...(index === y ? newRow : row)]),
    ];
    yield newBuilt;
    // const canPlaceBrick = thisRowWidth
    y += 1;
  }
}
