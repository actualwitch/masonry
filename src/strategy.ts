import { getWallPlan, HORIZONTAL_CHOICES, HorizontalOptions } from "./planning";

export type Strategy = "breadth" | "height";

export type Bond = "stretcher" | "english";

export type BuiltStatus = number[][];

// this strategy aims to minimize vertical movement
export const breadthFirst = (
  built: BuiltStatus,
  wallPlan: ReturnType<typeof getWallPlan>
) => {
  // built status is expected to be partial here, so we can use length to determine the current row
  const selectedRowIndex = built.length - 1;
  // rows can be filled from either side, to make things simpler we will just filter out the empty spaces
  // and determine placement later
  const selectedRow = built[selectedRowIndex].filter(Boolean);
  if (selectedRow.length < wallPlan[selectedRowIndex].length) {
    // if the row is not fully built, we can add more bricks there
    // joints are also included in the plan, so we need to add 2 instead of 1
    const newLength = Math.min(
      selectedRow.length + 2,
      wallPlan[selectedRowIndex].length
    );
    // new row is generated entirely from selected length, with the rest being empty
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
  // here we know the length of the row is equal to the plan, so we can move to the next row
  if (selectedRowIndex < wallPlan.length - 1) {
    const newRowIndex = selectedRowIndex + 1;
    // next row is always one brick, so we can just add it
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

// alternative strategy that grows the height quickly
export function* heightFirst(
  wallPlan: ReturnType<typeof getWallPlan>,
  bond: Bond
) {
  let newBuilt = wallPlan.map((row) => row.map(() => 0));
  let stride = 1;
  let y = 0;
  while (true) {
    if (y > 0) {
      const prevRowWidth = getPlacedRowWidth(
        newBuilt[y - 1],
        wallPlan[y - 1],
        bond === "english" ? ((y - 1) % 2 === 0 ? 1 : 0) : 0
      );
      const nextBrickType = wallPlan[y]?.[0];
      const nextBrickWidth =
        HORIZONTAL_CHOICES[nextBrickType]?.[
          bond === "english" ? (y % 2 === 0 ? 1 : 0) : 0
        ];
      if (nextBrickType !== undefined && prevRowWidth <= nextBrickWidth) {
        y = 0;
        stride += 1;
        continue;
      }
    }
    const placedBricks = newBuilt[y].filter(Boolean).length;
    let advanceBy = 1;
    if (
      wallPlan[y]?.[placedBricks + advanceBy] === HorizontalOptions.HEAD_JOINT
    ) {
      advanceBy += 1;
    }
    const newRow = wallPlan[y]?.map((_, index) => {
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
    y += 1;
  }
}


/**
 * calculate width of the row based on the placed bricks and the wall plan
 */
function getPlacedRowWidth(
    row: number[],
    wallPlanRow: number[],
    orientation = 0
  ) {
    return row.reduce((acc, item, index) => {
      if (item) {
        const itemType = wallPlanRow[index];
        return acc + HORIZONTAL_CHOICES[itemType][orientation];
      }
      return acc;
    }, 0);
  }