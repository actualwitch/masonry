import {
  FULL_BRICK_MM,
  HALF_BRICK_MM,
  HEAD_JOINT_MM,
  WALL_WIDTH_MM,
  BED_JOINT_MM,
  WALL_HEIGHT_MM,
  QUEEN_CLOSER_MM,
  FULL_BRICK_DEPTH,
} from "./const";

export const HORIZONTAL_CHOICES = [
  FULL_BRICK_MM,
  HALF_BRICK_MM,
  HEAD_JOINT_MM,
  QUEEN_CLOSER_MM,
] as const;

export enum HorizontalOptions {
  FULL_BRICK = 0,
  HALF_BRICK = 1,
  HEAD_JOINT = 2,
  QUEEN_CLOSER = 3,
}

const [HEAD_JOINT_WIDTH, HEAD_JOINT_DEPTH] = HEAD_JOINT_MM;
const [_, __, BED_JOINT_HEIGHT] = BED_JOINT_MM;

const [FULL_BRICK_WIDTH, ___, FULL_BRICK_HEIGHT] = FULL_BRICK_MM;

const [HALF_BRICK_WIDTH] = HALF_BRICK_MM;

export const VERTICAL_CHOICES = [FULL_BRICK_MM, BED_JOINT_MM] as const;

enum VerticalOptions {
  FULL_BRICK = 0,
  BED_JOINT = 1,
}

const validatePath = (path: Array<HorizontalOptions>) => {
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

export const planHeaderRow = (index: number, orientation = 1) => {
  const budget = WALL_WIDTH_MM;
  // i looked up the header bond online and it seems to utilize queen closer element, although not sure if i use it correctly
  const path: Array<HorizontalOptions> = [
    HorizontalOptions.FULL_BRICK,
    HorizontalOptions.HEAD_JOINT,
    HorizontalOptions.QUEEN_CLOSER,
    HorizontalOptions.HEAD_JOINT,
  ];
  while (true) {
    // calculate length of the placed bricks in current row
    const placedLength = path.reduce<number>((acc, choice) => {
      return acc + HORIZONTAL_CHOICES[choice][orientation];
    }, 0);
    const remaining = budget - placedLength;
    // bricks are oriented perpendicularly to the wall so full brick is used (they are same effective width)
    if (remaining >= FULL_BRICK_DEPTH + HEAD_JOINT_DEPTH) {
      path.push(HorizontalOptions.FULL_BRICK);
      path.push(HorizontalOptions.HEAD_JOINT);
      continue;
    }
    if (remaining === FULL_BRICK_DEPTH) {
      path.push(HorizontalOptions.FULL_BRICK);
      break;
    }
    // it seems my math if a bit off, so here's magic number to make it work
    if (remaining === 40) {
      path.push(HorizontalOptions.QUEEN_CLOSER);
      path.push(HorizontalOptions.HEAD_JOINT);
      path.push(HorizontalOptions.FULL_BRICK);
      break;
    }
    if (remaining) console.log("remaining", remaining);
    // todo backtracking
    throw new Error("unreachable");
  }
  if (!validatePath(path)) {
    console.error("invalid path", path);
  }
  return path;
};

export function getWallPlan(bond = "stretcher" as "stretcher" | "english") {
  const budget = WALL_HEIGHT_MM;
  let built = 0;
  const path: Array<VerticalOptions> = [];

  // iteratively build row by row using greedy algorithm to choose type of brick with optional joint
  while (true) {
    const remaining = budget - built;
    if (remaining >= FULL_BRICK_HEIGHT + BED_JOINT_HEIGHT) {
      built += FULL_BRICK_HEIGHT + BED_JOINT_HEIGHT;
      path.push(VerticalOptions.FULL_BRICK);
      path.push(VerticalOptions.BED_JOINT);
      continue;
    }
    if (remaining === FULL_BRICK_HEIGHT) {
      built += FULL_BRICK_HEIGHT;
      path.push(VerticalOptions.FULL_BRICK);
      break;
    }
    if (remaining >= BED_JOINT_HEIGHT) {
      built += BED_JOINT_HEIGHT;
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
  if (bond === "english") {
    return filtered.map((_, index) => [
      ...(index % 2 === 0 ? planHeaderRow(index) : planRow(false)),
    ]);
  }
  // plan each row alternating between starting with full brick and half brick
  return filtered.map((_, index) => [...planRow(index % 2 === 1)]);
}
