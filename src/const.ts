export const WALL_WIDTH_MM = 2300;
export const WALL_HEIGHT_MM = 2000;

export type Size = [width: number, depth: number, height: number];
export const FULL_BRICK_MM: Size = [210, 100, 50] as const;
export const [FULL_BRICK_WIDTH, FULL_BRICK_DEPTH, FULL_BRICK_HEIGHT] = FULL_BRICK_MM;
export const HALF_BRICK_MM: Size = [100, 100, 50] as const;
export const [HALF_BRICK_WIDTH, HALF_BRICK_DEPTH, HALF_BRICK_HEIGHT] = HALF_BRICK_MM;
export const QUEEN_CLOSER_MM: Size = [100, 50, 50] as const;

export const HEAD_JOINT_MM: Size = [10, 10, 50];
export const BED_JOINT_MM = [Number.POSITIVE_INFINITY, 50, 12.5] as const;

export const SCALING = 0.075;