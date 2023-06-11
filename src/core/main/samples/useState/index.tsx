import { useState } from "react";
import {
  Button,
  Canvas,
  HorizontalLayout,
  LayoutElement,
  Text,
  VerticalLayout,
} from "../../../unit/package/standardUix/main";
export const App = () => {
  const [state, setState] = useState(0);

  return (
    <Canvas>
      <VerticalLayout>
        <LayoutElement>
          <Text content="HelloWorld!" />
        </LayoutElement>
        <LayoutElement>
          <HorizontalLayout>
            <Button onClick={() => setState((v) => v - 1)}>
              <Text content="-" />
            </Button>
            <Text content={state.toString()} />
            <Button onClick={() => setState((v) => v + 1)}>
              <Text content="+" />
            </Button>
          </HorizontalLayout>
        </LayoutElement>
      </VerticalLayout>
    </Canvas>
  );
};
