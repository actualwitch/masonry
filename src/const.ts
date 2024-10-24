export const WALL_WIDTH_MM = 2300;
export const WALL_HEIGHT_MM = 2000;

export type BrickSize = [width: number, height: number];
export const FULL_BRICK_MM: BrickSize = [210, 50] as const;
export const HALF_BRICK_MM: BrickSize = [100, 50] as const;

export const HEAD_JOINT_MM = [10, 50];
export const BED_JOINT_MM = 12.5;