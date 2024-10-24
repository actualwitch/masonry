import { getWallPlan } from "./planning";

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
    const newRow = wallPlan[newRowIndex].map((_, index) => (index < 1 ? newRowIndex + 1 : 0));
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
  const newBuilt = built.map((row) => [...row]);
//   if (built.length === 1 && built[0].length === 0) {
//     return wallPlan.map((row, rowIndex) => row.map)
//   console.log(built, wallPlan)
//   let stride = 0;
//   let x = 0;
//   let y = wallPlan.length - 1;
//   while (true) {
//     const selectedRow = newBuilt[y];
//     if (selectedRow.length === wallPlan[y].length) {
//       y += 1;
//       stride += built[y].length;
//       continue;
//     }
    
//   }

  return wallPlan.map((row) => row.map(() => 0));
};
