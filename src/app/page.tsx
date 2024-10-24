"use client";
import {
  BED_JOINT_MM,
  FULL_BRICK_MM,
  HALF_BRICK_MM,
  HEAD_JOINT_MM,
  WALL_HEIGHT_MM,
  WALL_WIDTH_MM,
} from "@/const";
import path from "path";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const Container = styled.main`
  display: grid;
  place-items: center;
`;

const SCALING = 0.075;

const Wall = styled.div`
  width: ${WALL_WIDTH_MM * SCALING}mm;
  height: ${WALL_HEIGHT_MM * SCALING}mm;
  display: flex;
  flex-direction: column-reverse;
`;

const StyleoRow = styled.div`
  display: flex;
`;

const [HEAD_JOINT_WIDTH, HEAD_JOINT_HEIGHT] = HEAD_JOINT_MM;
const CHOICES = [FULL_BRICK_MM, HALF_BRICK_MM, HEAD_JOINT_MM] as const;

const [FULL_BRICK_WIDTH, FULL_BRICK_HEIGHT] = FULL_BRICK_MM;

const [HALF_BRICK_WIDTH, HALF_BRICK_HEIGHT] = HALF_BRICK_MM;

const Brick = styled.div<{ width: string; height: string; isBuilt: boolean }>`
  background: ${(props) => (props.isBuilt ? "red" : "#4f7dea80")};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const HeadJoint = styled.div`
  background: #ffcbf980;
  width: ${HEAD_JOINT_WIDTH * SCALING}mm;
  height: ${HEAD_JOINT_HEIGHT * SCALING}mm;
`;

const BedJoint = styled.div`
  background: #ffcbf980;
  width: 100%;
  height: ${BED_JOINT_MM * SCALING}mm;
`;

const validatePath = (path: Array<0 | 1 | 2>) => {
  const width = path.reduce<number>((acc, choice) => {
    const width = CHOICES[choice][0];
    return acc + width;
  }, 0);
  return width === WALL_WIDTH_MM;
};

const planRow = (shouldStartWithHalfBrick: boolean) => {
  const budget = WALL_WIDTH_MM;
  let built = 0;
  const path: Array<0 | 1 | 2> = [];
  if (shouldStartWithHalfBrick) {
    built += HALF_BRICK_WIDTH + HEAD_JOINT_WIDTH;
    path.push(1);
    path.push(2);
  }
  while (true) {
    const remaining = budget - built;
    if (remaining >= FULL_BRICK_WIDTH + HEAD_JOINT_WIDTH) {
      built += FULL_BRICK_WIDTH + HEAD_JOINT_WIDTH;
      path.push(0);
      path.push(2);
      continue;
    }
    if (remaining === FULL_BRICK_WIDTH) {
      built += FULL_BRICK_WIDTH;
      path.push(0);
      break;
    }
    if (remaining >= HALF_BRICK_WIDTH + HEAD_JOINT_WIDTH) {
      built += HALF_BRICK_WIDTH + HEAD_JOINT_WIDTH;
      path.push(1);
      path.push(2);
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
const VERTICAL_CHOICES = [FULL_BRICK_MM, BED_JOINT_MM] as const;

function planWall() {
  const budget = WALL_HEIGHT_MM;
  let built = 0;
  const path: Array<0 | 1> = [];
  while (true) {
    const remaining = budget - built;
    if (remaining >= FULL_BRICK_HEIGHT + BED_JOINT_MM) {
      built += FULL_BRICK_HEIGHT + BED_JOINT_MM;
      path.push(0);
      path.push(1);
      continue;
    }
    if (remaining === FULL_BRICK_HEIGHT) {
      built += FULL_BRICK_HEIGHT;
      path.push(0);
      break;
    }
    if (remaining >= BED_JOINT_MM) {
      built += BED_JOINT_MM;
      path.push(1);
      continue;
    }
    if (remaining === 0) {
      break;
    }
    // todo backtracking
    throw new Error("unreachable");
  }
  return path
    .filter((choice) => choice === 0)
    .map((_, index) => [...planRow(index % 2 === 0)]);
}

export default function Home() {
  const wallPlan = planWall();

  const [built, setBuilt] = useState<boolean[][]>([[]]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setBuilt((built) => {
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
            if (selectedRowIndex % 2 === 1) {
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
            if (newRowIndex % 2 === 1) {
              newRow.reverse();
            }
            return [...built, newRow];
          }
          return built;
        });
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [setBuilt]);
  return (
    <div>
      <Container>
        <Wall>
          {wallPlan.map((row, rowIndex) => {
            return (
              <>
                <StyleoRow key={String(rowIndex) + "bricks"}>
                  {row.map((choice, index) => {
                    if (choice === 0 || choice === 1) {
                      const [width, height] = CHOICES[choice];
                      return (
                        <Brick
                          key={index}
                          width={`${width * SCALING}mm`}
                          height={`${height * SCALING}mm`}
                          isBuilt={built?.[rowIndex]?.[index]}
                        />
                      );
                    }
                    if (choice === 2) {
                      return <HeadJoint key={index} />;
                    }
                  })}
                </StyleoRow>
                <BedJoint key={String(rowIndex) + "joint"} />
              </>
            );
          })}
        </Wall>
      </Container>
    </div>
  );
}
