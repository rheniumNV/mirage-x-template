import { useEffect, useState } from "react";
import {
  VerticalLayout,
  HorizontalLayout,
  Text,
  Button,
  Image,
  LayoutElement,
  Canvas,
} from "../../../unit/package/standardUix/main";
import {
  Board,
  Cell,
  GameState,
  initBoard,
  open,
  putMinesRandomly,
} from "./game";

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
      <Button onClick={open}>
        <Image
          tint={
            cell.isOpened || forceOpen
              ? cell.hasMine
                ? [1, 0, 0, 1]
                : cell.isOpened
                ? [0.8, 0.8, 0.8, 1]
                : [0.5, 0.5, 0.5, 1]
              : [0.4, 0.4, 0.4, 1]
          }
        >
          <Text
            content={
              cell.isOpened || forceOpen
                ? cell.hasMine
                  ? "*"
                  : `${cell.surroundingMines}`
                : ""
            }
          />
        </Image>
      </Button>
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
  return <Text content={(resultTime ? resultTime : time).toString()} />;
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
    setState(open(state, x, y));
  };

  return (
    <Canvas size={[1000, 2000]}>
      <VerticalLayout>
        <VerticalLayout>
          <Text content="Minesweeper" />
          <TimerView
            startTime={startTime}
            resultTime={state.isGameOver ? resultTime : undefined}
          />
          <Text content={`${state.isGameOver}`} />
          <Text content={`${state.isStarted}`} />
          <LayoutElement minHeight={40} minWidth={100}>
            <Button onClick={restart}>
              <Image tint={[0.6, 0.6, 0.6, 1]}>
                <Text content="Restart" />
              </Image>
            </Button>
          </LayoutElement>
        </VerticalLayout>
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
      </VerticalLayout>
    </Canvas>
  );
};
