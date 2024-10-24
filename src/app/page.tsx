"use client";
import { FULL_BRICK_MM, HALF_BRICK_MM, HEAD_JOINT_MM, WALL_HEIGHT_MM, WALL_WIDTH_MM } from "@/const";
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
    flex-wrap: wrap;
`;


const Brick = styled.div<{width: string; height: string}>`
  background: blue;
  width: ${props => props.width};
  height: ${props => props.height};
`;

const HeadJoint = styled.div`
  background: red;
  width: ${HEAD_JOINT_MM * SCALING}mm;
  height: ${50 * SCALING}mm;
  `;

const CHOICES = [FULL_BRICK_MM, HALF_BRICK_MM, ] as const;

const [FULL_BRICK_WIDTH, FULL_BRICK_HEIGHT] = FULL_BRICK_MM;
const FullBrick = () => <Brick width={`${FULL_BRICK_WIDTH * SCALING}mm`} height={`${FULL_BRICK_HEIGHT * SCALING}mm`} />;

const [HALF_BRICK_WIDTH, HALF_BRICK_HEIGHT] = HALF_BRICK_MM;
const HalfBrick = () => <Brick width={`${HALF_BRICK_WIDTH * SCALING}mm`} height={`${HALF_BRICK_HEIGHT * SCALING}mm`} />;

function* generateRow() {
  const budget = WALL_WIDTH_MM;
  let built = 0;
  let counter = 0;
  const path: Array<0 | 1> = [];
  while (true) {
    const remaining = budget - built;
    if (remaining >= FULL_BRICK_WIDTH + HEAD_JOINT_MM) {
      built += FULL_BRICK_WIDTH + HEAD_JOINT_MM;
      path.push(0);
      continue;
    }
    if (remaining === FULL_BRICK_WIDTH) {
      built += FULL_BRICK_WIDTH;
      path.push(0);
      break;
    }
    if (remaining >= HALF_BRICK_WIDTH + HEAD_JOINT_MM) {
      built += HALF_BRICK_WIDTH + HEAD_JOINT_MM;
      path.push(1);
      continue;
    }
    if (remaining === HALF_BRICK_WIDTH) {
      built += HALF_BRICK_WIDTH;
      path.push(1);
      break;
    }
    console.log("remaining", remaining);
    throw new Error("unreachable");
  }
  console.log(path);
  for (const [key, choice] of path.entries()) {
    const [width, height] = CHOICES[choice];
    yield <Brick key={key} width={`${width * SCALING}mm`} height={`${height * SCALING}mm`} />;
    if 
  }
}

console.log([...generateRow()]);


export default function Home() {
  return (
    <div>
      <Container>
        <Wall><Row>{[...generateRow()]}</Row></Wall>
      </Container>
    </div>
  );
}
