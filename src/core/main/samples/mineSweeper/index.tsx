import { useEffect, useState } from "react";
import {
  StyledText,
  StyledButton,
  StyledImage,
  StyledCanvas,
} from "../../../unit/package/StyledUix/main";
import {
  HorizontalLayout,
  VerticalLayout,
  LayoutElement,
} from "../../../unit/package/PrimitiveUix/main";
import {
  Board,
  Cell,
  GameState,
  initBoard,
  open,
  putMinesRandomly,
} from "./game";
import { Color, Sprite, StyledSpace } from "./style";

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
      <StyledButton
        onClick={open}
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
          size={60}
          verticalAlign="Middle"
          horizontalAlign="Center"
        />
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
      verticalAlign="Middle"
      horizontalAlign="Center"
      styledColor={Color.backgroundRev}
    />
  );
};

export const App = ({}) => {
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
    console.info(`open ${x}, ${y}`);
    setState(open(state, x, y));
  };

  return (
    <StyledSpace>
      <StyledCanvas
        size={[1000, 1300]}
        styledBackgroundColor={Color.background}
        styledBackgroundSprite={Sprite.kadomaru}
      >
        <VerticalLayout
          paddingBottom={100}
          paddingLeft={100}
          paddingRight={100}
          paddingTop={100}
          spacing={10}
        >
          <VerticalLayout>
            <StyledText
              content="Minesweeper"
              horizontalAlign="Center"
              size={100}
              styledColor={Color.backgroundRev}
            />
            <LayoutElement minHeight={100}>
              <HorizontalLayout forceExpandChildHeight={false}>
                <LayoutElement minHeight={80} flexibleWidth={1}>
                  <TimerView
                    startTime={startTime}
                    resultTime={state.isGameOver ? resultTime : undefined}
                  />
                </LayoutElement>
                <LayoutElement minHeight={80} minWidth={150}>
                  <StyledButton
                    onClick={restart}
                    styledColor={Color.buttonNormal}
                    styledSprite={Sprite.kadomaru}
                  >
                    <VerticalLayout
                      paddingBottom={10}
                      paddingLeft={10}
                      paddingRight={10}
                      paddingTop={10}
                    >
                      <StyledText
                        content="Restart"
                        horizontalAlign="Center"
                        verticalAlign="Middle"
                        styledColor={Color.buttonNormalRev}
                        verticalAutoSize={true}
                        horizontalAutoSize={true}
                      />
                    </VerticalLayout>
                  </StyledButton>
                </LayoutElement>
              </HorizontalLayout>
            </LayoutElement>
          </VerticalLayout>
          <LayoutElement minHeight={800}>
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
      </StyledCanvas>
    </StyledSpace>
  );
};
