import { useState } from "react";
import {
  StyledButton,
  StyledCanvas,
  StyledText,
} from "../../../unit/package/StyledUix/main";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  createColor,
  createSprite,
  createStyle,
} from "../../../lib/styledUnit";

const { StyledSpace, Sprite, Color } = createStyle({
  Sprite: {
    maru: createSprite({
      url: "neosdb:///427a01c03424b86b4b8ffba936e4eb6cbf4be4d6773fa1f45ec004cfb526d016.png",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
    }),
    kadomaru: createSprite({
      url: "neosdb:///d8495d0372ef5bb0f9eec8ad864ebf7bf7f699e713176821e6ed0f7826b78091.png",
      rect: [1, 1, 1, 1],
      borders: [0.33333, 0.33333, 0.33333, 0.33333],
      scale: 0.1,
    }),
  },
  Color: {
    background: createColor([0.8, 0.8, 0.8, 1]),
    button: createColor([0.5, 0.5, 0.5, 1]),
    text: createColor([0, 0, 0, 1]),
  },
});

export const App = () => {
  const [count, setCount] = useState(0);
  return (
    <StyledSpace>
      <StyledCanvas
        styledBackgroundColor={Color.background}
        styledBackgroundSprite={Sprite.kadomaru}
      >
        <VerticalLayout>
          <LayoutElement minHeight={100}>
            <StyledText
              content="Hello World!"
              verticalAlign="Middle"
              horizontalAlign="Center"
              styledColor={Color.text}
            />
          </LayoutElement>
          <LayoutElement minHeight={150}>
            <HorizontalLayout>
              <LayoutElement>
                <StyledButton
                  onClick={() => {
                    setCount((c) => c - 1);
                  }}
                >
                  <StyledText
                    content="-"
                    horizontalAlign="Center"
                    verticalAlign="Middle"
                  />
                </StyledButton>
              </LayoutElement>
              <LayoutElement minWidth={100}>
                <StyledText
                  content={`${count}`}
                  horizontalAlign="Center"
                  verticalAlign="Middle"
                />
              </LayoutElement>

              <StyledButton
                onClick={() => {
                  setCount((c) => c + 1);
                }}
              >
                <StyledText
                  content="+"
                  horizontalAlign="Center"
                  verticalAlign="Middle"
                />
              </StyledButton>
            </HorizontalLayout>
          </LayoutElement>
          <LayoutElement flexibleHeight={1} />
        </VerticalLayout>
      </StyledCanvas>
    </StyledSpace>
  );
};
