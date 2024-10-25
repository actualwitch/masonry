"use client";
import { SCALING } from "@/const";
import { getWallPlan, HORIZONTAL_CHOICES } from "@/planning";
import {
  Bond,
  breadthFirst,
  BuiltStatus,
  heightFirst,
  Strategy,
} from "@/strategy";
import {
  Aside,
  BedJoint,
  Brick,
  Container,
  HeadJoint,
  Page,
  StyleoRow,
  Wall,
} from "@/style";
import { Fragment, useEffect, useMemo, useState } from "react";

export default function Home() {
  const [built, setBuilt] = useState<BuiltStatus>([[]]);
  const [strategy, setStrategy] = useState<Strategy>("breadth");
  const [bond, setBond] = useState<Bond>("stretcher");
  useEffect(() => {
    setBuilt([[]]);
  }, [strategy, bond]);

  // create plan first
  const wallPlan = useMemo(() => {
    return getWallPlan(bond);
  }, [bond]);

  // create advance function
  const advance = useMemo(() => {
    if (strategy === "breadth") {
      return () => {
        setBuilt((built) => breadthFirst(built, wallPlan));
      };
    }
    if (strategy === "height") {
      const iterator = heightFirst(wallPlan, bond);
      return () => {
        setBuilt(iterator.next().value);
      };
    }
  }, [strategy, wallPlan, bond]);

  // trigger advance on enter
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        advance?.();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [setBuilt, advance]);

  return (
    <Page>
      <Container>
        <Wall>
          {wallPlan.map((row, rowIndex) => {
            return (
              <Fragment key={String(rowIndex)}>
                <StyleoRow>
                  {row.map((choice, index) => {
                    if (choice === 0 || choice === 1 || choice === 3) {
                      const isEven = index % 2 === 0;
                      const orientation =
                        bond === "english" ? (isEven ? 0 : 1) : 0;
                      const builtStatus = built?.[rowIndex]?.[index] ?? 0;
                      return (
                        <Brick
                          key={index}
                          $width={`${
                            HORIZONTAL_CHOICES[choice][orientation] * SCALING
                          }mm`}
                          $height={`${
                            HORIZONTAL_CHOICES[choice][2] * SCALING
                          }mm`}
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
      <Aside>
        <label>
          Bond
          <select
            value={bond}
            onChange={(event) => setBond(event.target.value as Bond)}
          >
            <option value="stretcher">Stretcher</option>
            <option value="english">English</option>
          </select>
        </label>
        <label>
          Strategy
          <select
            value={strategy}
            onChange={(event) => setStrategy(event.target.value as Strategy)}
          >
            <option value="breadth">Breadth</option>
            <option value="height">Height</option>
          </select>
        </label>
      </Aside>
    </Page>
  );
}
