"use client";
import { SCALING } from "@/const";
import { getWallPlan, HORIZONTAL_CHOICES } from "@/planning";
import {
  BuiltStatus,
  greedyStrategy,
  Strategy,
  stridesStrategy,
} from "@/strategy";
import {
  Container,
  Wall,
  StyleoRow,
  Brick,
  HeadJoint,
  BedJoint,
  Page,
} from "@/style";
import { Fragment, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [built, setBuilt] = useState<BuiltStatus>([[]]);
  const [strategy, setStrategy] = useState<Strategy>("greedy");
  useEffect(() => {
    setBuilt([[]]);
  }, [strategy]);
  const wallPlan = getWallPlan();
  const advance = useMemo(() => {
    if (strategy === "greedy") {
      return () => {
        setBuilt((built) => greedyStrategy(built, wallPlan));
      };
    }
    if (strategy === "strides") {
      const iterator = stridesStrategy(wallPlan);
      return () => {
        setBuilt(iterator.next().value);
      };
    }
  }, [strategy]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        advance();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [setBuilt, strategy]);
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
                      const builtStatus = built?.[rowIndex]?.[index] ?? 0;
                      return (
                        <Brick
                          key={index}
                          $width={`${width * SCALING}mm`}
                          $height={`${height * SCALING}mm`}
                          $isBuilt={builtStatus > 0}
                        >
                          {builtStatus ? builtStatus : ""}
                        </Brick>
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
