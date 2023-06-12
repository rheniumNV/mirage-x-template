import { useState } from "react";
import {
  Button,
  Canvas,
  HorizontalLayout,
  Image,
  LayoutElement,
  Text,
  VerticalLayout,
} from "../unit/package/standardUix/main";

export const App = () => {
  const [state, setState] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = useState<"○" | "×">("○");

  const checkCell = (x: number, y: number) => {
    setState((state) => {
      if (state[y][x] !== "") return state;
      const newState = [...state];
      newState[y][x] = turn;

      return newState;
    });
    setTurn((turn) => (turn === "○" ? "×" : "○"));
  };

  return (
    <Canvas>
      <VerticalLayout>
        <LayoutElement minHeight={100}>
          <Image tint={[1, 0, 0, 1]} />
          <Text content="マルバツゲーム" />
        </LayoutElement>
        <LayoutElement minHeight={100}>
          <Button
            onClick={() => {
              setState([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ]);
            }}
          >
            <Text content="リセット" />
          </Button>
        </LayoutElement>
        <LayoutElement flexibleHeight={1}>
          <VerticalLayout
            spacing={5}
            paddingTop={100}
            paddingBottom={100}
            paddingLeft={100}
            paddingRight={100}
          >
            {state.map((row, y) => {
              return (
                <HorizontalLayout spacing={5}>
                  {row.map((cell, x) => {
                    return (
                      <LayoutElement>
                        {cell === "" && (
                          <Button
                            baseColor={[0.8, 0.8, 0.8, 1]}
                            onClick={() => checkCell(x, y)}
                          ></Button>
                        )}
                        {cell !== "" && <Text content={cell} />}
                      </LayoutElement>
                    );
                  })}
                </HorizontalLayout>
              );
            })}
          </VerticalLayout>
        </LayoutElement>
      </VerticalLayout>
    </Canvas>
  );
};
