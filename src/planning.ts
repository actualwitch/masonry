import {
  FULL_BRICK_MM,
  HALF_BRICK_MM,
  HEAD_JOINT_MM,
  WALL_WIDTH_MM,
  BED_JOINT_MM,
  WALL_HEIGHT_MM,
} from "./const";

export const HORIZONTAL_CHOICES = [
  FULL_BRICK_MM,
  HALF_BRICK_MM,
  HEAD_JOINT_MM,
] as const;

enum HorizontalOptions {
  FULL_BRICK = 0,
  HALF_BRICK = 1,
  HEAD_JOINT = 2,
}

const [HEAD_JOINT_WIDTH, HEAD_JOINT_HEIGHT] = HEAD_JOINT_MM;

const [FULL_BRICK_WIDTH, FULL_BRICK_HEIGHT] = FULL_BRICK_MM;

const [HALF_BRICK_WIDTH, HALF_BRICK_HEIGHT] = HALF_BRICK_MM;

const validatePath = (path: Array<0 | 1 | 2>) => {
  const width = path.reduce<number>((acc, choice) => {
    const width = HORIZONTAL_CHOICES[choice][0];
    return acc + width;
  }, 0);
  return width === WALL_WIDTH_MM;
};

const planRow = (shouldStartWithHalfBrick: boolean) => {
  const budget = WALL_WIDTH_MM;
  let built = 0;
  const path: Array<HorizontalOptions> = [];
  if (shouldStartWithHalfBrick) {
    built += HALF_BRICK_WIDTH + HEAD_JOINT_WIDTH;
    path.push(HorizontalOptions.HALF_BRICK);
    path.push(HorizontalOptions.HEAD_JOINT);
  }
  while (true) {
    const remaining = budget - built;
    if (remaining >= FULL_BRICK_WIDTH + HEAD_JOINT_WIDTH) {
      built += FULL_BRICK_WIDTH + HEAD_JOINT_WIDTH;
      path.push(HorizontalOptions.FULL_BRICK);
      path.push(HorizontalOptions.HEAD_JOINT);
      continue;
    }
    if (remaining === FULL_BRICK_WIDTH) {
      built += FULL_BRICK_WIDTH;
      path.push(HorizontalOptions.FULL_BRICK);
      break;
    }
    if (remaining >= HALF_BRICK_WIDTH + HEAD_JOINT_WIDTH) {
      built += HALF_BRICK_WIDTH + HEAD_JOINT_WIDTH;
      path.push(HorizontalOptions.HALF_BRICK);
      path.push(HorizontalOptions.HEAD_JOINT);
      continue;
    }
    if (remaining === HALF_BRICK_WIDTH) {
      built += HALF_BRICK_WIDTH;
      path.push(1);
      break;
    }
    console.log("remaining", remaining);
    // todo backtracking
    throw new Error("unreachable");
  }
  if (!validatePath(path)) {
    console.error("invalid path", path);
  }
  return path;
};
export const VERTICAL_CHOICES = [FULL_BRICK_MM, BED_JOINT_MM] as const;

enum VerticalOptions {
  FULL_BRICK = 0,
  BED_JOINT = 1,
}

export function getWallPlan() {
  const budget = WALL_HEIGHT_MM;
  let built = 0;
  const path: Array<VerticalOptions> = [];

  // iteratively build row by row using greedy algorithm to choose type of brick with optional joint
  while (true) {
    const remaining = budget - built;
    if (remaining >= FULL_BRICK_HEIGHT + BED_JOINT_MM) {
      built += FULL_BRICK_HEIGHT + BED_JOINT_MM;
      path.push(VerticalOptions.FULL_BRICK);
      path.push(VerticalOptions.BED_JOINT);
      continue;
    }
    if (remaining === FULL_BRICK_HEIGHT) {
      built += FULL_BRICK_HEIGHT;
      path.push(VerticalOptions.FULL_BRICK);
      break;
    }
    if (remaining >= BED_JOINT_MM) {
      built += BED_JOINT_MM;
      path.push(VerticalOptions.BED_JOINT);
      continue;
    }
    if (remaining === 0) {
      break;
    }
    // todo backtracking
    throw new Error("unreachable");
  }
  // remove joints, they were only used to calculate solution and are later added visually using css
  const filtered = path.filter((choice) => choice === 0);
  // plan each row alternating between starting with full brick and half brick
  return filtered.map((_, index) => [...planRow(index % 2 === 0)]);
}
