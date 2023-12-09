import { useEffect, useState } from "react";
import {
  StyledText,
  StyledButton,
  StyledImage,
} from "../../../unit/package/StyledUix/main";
import {
  HorizontalLayout,
  VerticalLayout,
  LayoutElement,
  Canvas,
} from "../../../unit/package/PrimitiveUix/main";
import { Cell, GameState, initBoard, open, putMinesRandomly } from "./game";
import {
  createColor,
  createSprite,
  createStyle,
  createUiUnlitMaterial,
} from "../../../lib/styledUnit";

const { StyledSpace, Color, Sprite, Material } = createStyle({
  Color: {
    background: createColor([0.2, 0.2, 0.2, 1]),
    backgroundRev: createColor([0.8, 0.8, 0.8, 1]),
  },
  Sprite: {
    kadomaru: createSprite({
      url: "resdb:///d8495d0372ef5bb0f9eec8ad864ebf7bf7f699e713176821e6ed0f7826b78091.png",
      rect: [1, 1, 1, 1],
      borders: [0.33333, 0.33333, 0.33333, 0.33333],
      scale: 0.1,
      filterMode: "Anisotropic",
      wrapModeU: "Mirror",
      wrapModeV: "Mirror",
    }),
  },
  Material: {
    background: createUiUnlitMaterial({}),
  },
});

const CellView = ({
  cell,
  open,
  forceOpen,
}: {
  cell: Cell;
  open: () => unknown;
  forceOpen: boolean;
}) => {
  return (
    <LayoutElement minHeight={50} minWidth={50}>
      <StyledButton onClick={open}>
        <StyledImage
          defaultColor={
            cell.isOpened || forceOpen
              ? cell.hasMine
                ? [1, 0, 0, 1]
                : cell.isOpened
                ? [0.8, 0.8, 0.8, 1]
                : [0.5, 0.5, 0.5, 1]
              : [0.4, 0.4, 0.4, 1]
          }
        >
          <StyledText
            content={
              cell.isOpened || forceOpen
                ? cell.hasMine
                  ? "*"
                  : `${cell.surroundingMines}`
                : ""
            }
            verticalAlign="Middle"
            horizontalAlign="Center"
          />
        </StyledImage>
      </StyledButton>
    </LayoutElement>
  );
};

const TimerView = ({
  startTime,
  resultTime,
}: {
  startTime: number;
  resultTime?: number;
}) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    setTime(Math.round((Date.now() - startTime) / 1000));
    const interval = setInterval(() => {
      setTime(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  return (
    <StyledText
      content={(resultTime ? resultTime : time).toString()}
      styledColor={Color.backgroundRev}
      verticalAlign="Middle"
      horizontalAlign="Center"
    />
  );
};

export const Main = ({}) => {
  const width = 8;
  const height = 8;
  const mineCount = 8;

  const [state, setState] = useState<GameState>({
    board: putMinesRandomly(initBoard(width, height), mineCount, 0, 0),
    isStarted: false,
    isGameOver: false,
  });
  const [startTime, setStartTime] = useState(Date.now());
  const [resultTime, setResultTime] = useState(0);

  useEffect(() => {
    setResultTime(Math.round((Date.now() - startTime) / 1000));
  }, [state.isGameOver]);

  const restart = () => {
    setState({
      board: putMinesRandomly(initBoard(width, height), mineCount, 0, 0),
      isStarted: true,
      isGameOver: false,
    });
    setStartTime(Date.now());
  };

  const openCell = (x: number, y: number) => {
    setState(open(state, x, y));
  };

  return (
    <StyledSpace>
      <Canvas size={[1100, 1500]}>
        <StyledImage
          styledColor={Color.background}
          styledMaterial={Material.background}
          styledSprite={Sprite.kadomaru}
        />
        <VerticalLayout
          paddingBottom={50}
          paddingLeft={50}
          paddingRight={50}
          paddingTop={50}
          forceExpandChildHeight={false}
          spacing={20}
        >
          <LayoutElement minHeight={100}>
            <StyledText
              content="Minesweeper"
              styledColor={Color.backgroundRev}
              verticalAlign="Middle"
              horizontalAlign="Center"
            />
          </LayoutElement>
          <LayoutElement minHeight={100}>
            <TimerView
              startTime={startTime}
              resultTime={state.isGameOver ? resultTime : undefined}
            />
          </LayoutElement>
          <LayoutElement minHeight={100}>
            <HorizontalLayout forceExpandChildWidth={false}>
              <LayoutElement flexibleWidth={1}>
                <StyledText
                  content={state.isGameOver ? "GameOver" : "Playing"}
                  styledColor={Color.backgroundRev}
                  verticalAlign="Middle"
                  horizontalAlign="Center"
                />
              </LayoutElement>
              <LayoutElement minWidth={200}>
                <StyledButton
                  onClick={restart}
                  defaultColor={[0.6, 0.6, 0.6, 1]}
                  styledSprite={Sprite.kadomaru}
                >
                  <StyledText
                    content="Restart"
                    styledColor={Color.backgroundRev}
                    verticalAlign="Middle"
                    horizontalAlign="Center"
                    size={48}
                  />
                </StyledButton>
              </LayoutElement>
            </HorizontalLayout>
          </LayoutElement>
          <LayoutElement minHeight={1000}>
            <VerticalLayout spacing={5}>
              {Array.from({ length: height }, (_, i) => i).map((y) => (
                <HorizontalLayout key={y} spacing={5}>
                  {Array.from({ length: width }, (_, i) => i).map((x) => (
                    <CellView
                      key={x}
                      cell={state.board.cells[y * height + x]}
                      open={() => {
                        openCell(x, y);
                      }}
                      forceOpen={state.isGameOver}
                    />
                  ))}
                </HorizontalLayout>
              ))}
            </VerticalLayout>
          </LayoutElement>
        </VerticalLayout>
      </Canvas>
    </StyledSpace>
  );
};
