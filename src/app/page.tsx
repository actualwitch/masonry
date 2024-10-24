"use client";
import {
  BED_JOINT_MM,
  FULL_BRICK_MM,
  HALF_BRICK_MM,
  HEAD_JOINT_MM,
  WALL_HEIGHT_MM,
  WALL_WIDTH_MM,
} from "@/const";
import { useMemo } from "react";
import styled from "styled-components";

const Container = styled.main`
  display: grid;
  place-items: center;
`;

const SCALING = 0.075;

const Wall = styled.div`
  background: gray;
  width: ${WALL_WIDTH_MM * SCALING}mm;
  height: ${WALL_HEIGHT_MM * SCALING}mm;
  display: flex;
  flex-direction: column-reverse;
`;

const Row = styled.div`
  display: flex;
`;


const [HEAD_JOINT_WIDTH, HEAD_JOINT_HEIGHT] = HEAD_JOINT_MM;
const CHOICES = [FULL_BRICK_MM, HALF_BRICK_MM, HEAD_JOINT_MM] as const;

const [FULL_BRICK_WIDTH, FULL_BRICK_HEIGHT] = FULL_BRICK_MM;

const [HALF_BRICK_WIDTH, HALF_BRICK_HEIGHT] = HALF_BRICK_MM;

const Brick = styled.div<{ width: string; height: string }>`
  background: blue;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const HeadJoint = styled.div`
  background: red;
  width: ${HEAD_JOINT_WIDTH * SCALING}mm;
  height: ${HEAD_JOINT_HEIGHT * SCALING}mm;
`;

const BedJoint = styled.div`
  background: green;
  width: 100%;
  height: ${BED_JOINT_MM * SCALING}mm;
`;

function* generateRow() {
  const budget = WALL_WIDTH_MM;
  let built = 0;
  const path: Array<0 | 1 | 2> = [];
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
  for (const [key, choice] of path.entries()) {
    if (choice === 0 || choice === 1) {
      const [width, height] = CHOICES[choice];
      yield (
        <Brick
          key={key}
          width={`${width * SCALING}mm`}
          height={`${height * SCALING}mm`}
        />
      );
      continue;
    }
    if (choice === 2) {
      yield <HeadJoint key={key} />;
      continue;
    }
  }
}


const VERTICAL_CHOICES = [FULL_BRICK_MM, BED_JOINT_MM] as const;

function* generateWall() {
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
    console.log("remaining", remaining);
    // todo backtracking
    throw new Error("unreachable");
  }
  for (const [key, choice] of path.entries()) {
    if (choice === 0 ) {
      yield (
        <Row key={key}>
          {[...generateRow()]}
        </Row>
      )
      continue;
    }
    if (choice === 1) {
      yield <BedJoint key={key} />;
      continue;
    }
  }
}

export default function Home() {
  const model = useMemo(() => {
    return [...generateWall()];
  }, []);
  return (
    <div>
      <Container>
        <Wall>
          {[...model]}
        </Wall>
      </Container>
    </div>
  );
}
