import styled from "styled-components";
import {
  BED_JOINT_MM,
  HEAD_JOINT_MM,
  SCALING,
  WALL_HEIGHT_MM,
  WALL_WIDTH_MM,
} from "./const";

const [HEAD_JOINT_WIDTH, _, HEAD_JOINT_HEIGHT] = HEAD_JOINT_MM;

export const Container = styled.main`
  display: grid;
  place-items: center;
`;

export const Wall = styled.div`
  width: ${WALL_WIDTH_MM * SCALING}mm;
  height: ${WALL_HEIGHT_MM * SCALING}mm;
  display: flex;
  flex-direction: column-reverse;
`;

export const StyleoRow = styled.div`
  display: flex;
`;

export const Brick = styled.div<{
  $width: string;
  $height: string;
  $isBuilt: boolean;
}>`
  background: ${(props) => (props.$isBuilt ? "red" : "#4f7dea80")};
  color: black;
  font-size: 10px;
  display: grid;
  place-items: center;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
`;

export const HeadJoint = styled.div`
  background: #ffcbf980;
  width: ${HEAD_JOINT_WIDTH * SCALING}mm;
  height: ${HEAD_JOINT_HEIGHT * SCALING}mm;
`;

export const BedJoint = styled.div`
  background: #ffcbf980;
  width: 100%;
  height: ${BED_JOINT_MM[1] * SCALING}mm;
`;

export const Page = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  ${Container} {
    flex: 1;
  }
  aside {
    flex: 0 0 200px;
  }
`;

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  select {
    margin-left: 1rem;
  }
`;
