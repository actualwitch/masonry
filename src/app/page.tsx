"use client";
import { SCALING } from "@/const";
import { getWallPlan, HORIZONTAL_CHOICES } from "@/planning";
import { BuiltStatus, greedyStrategy, Strategy, stridesStrategy } from "@/strategy";
import {
  Container,
  Wall,
  StyleoRow,
  Brick,
  HeadJoint,
  BedJoint,
  Page,
} from "@/style";
import { Fragment, useEffect, useState } from "react";


export const useBuiltState = (
  wallPlan: ReturnType<typeof getWallPlan>,
  strategy: Strategy
) => {
  const [built, setBuilt] = useState<BuiltStatus>([[]]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (strategy === "greedy") {
          setBuilt((built) => greedyStrategy(built, wallPlan));
        }
        if (strategy === "strides") {
          setBuilt((built) => stridesStrategy(built, wallPlan));
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [setBuilt, strategy]);

  return built;
};

export default function Home() {
  const [strategy, setStrategy] = useState<Strategy>("greedy");
  const wallPlan = getWallPlan();
  const built = useBuiltState(wallPlan, strategy);
  return (
    <Page>
      <Container>
        <Wall>
          {wallPlan.map((row, rowIndex) => {
            return (
              <Fragment key={String(rowIndex)}>
                <StyleoRow>
                  {row.map((choice, index) => {
                    if (choice === 0 || choice === 1) {
                      const [width, height] = HORIZONTAL_CHOICES[choice];
                      return (
                        <Brick
                          key={index}
                          $width={`${width * SCALING}mm`}
                          $height={`${height * SCALING}mm`}
                          $isBuilt={built?.[rowIndex]?.[index] || false}
                        />
                      );
                    }
                    if (choice === 2) {
                      return <HeadJoint key={index} />;
                    }
                  })}
                </StyleoRow>
                <BedJoint />
              </Fragment>
            );
          })}
        </Wall>
      </Container>
      <aside>
        <select
          value={strategy}
          onChange={(event) => setStrategy(event.target.value as Strategy)}
        >
          <option value="greedy">Greedy</option>
          <option value="strides">Strides</option>
        </select>
      </aside>
    </Page>
  );
}
