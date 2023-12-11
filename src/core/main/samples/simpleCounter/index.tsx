import { useState } from "react";
import {
  StyledButton,
  StyledImage,
  StyledText,
} from "../../../unit/package/StyledUix/main";
import {
  Canvas,
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  createColor,
  createSprite,
  createStyle,
  createUiUnlitMaterial,
} from "../../../lib/styledUnit";

const { StyledSpace, Sprite, Color, Material } = createStyle({
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
    background: createColor([0.1, 0.1, 0.1, 1]),
    button: createColor([0.2, 0.2, 0.2, 1]),
    text: createColor([0.9, 0.9, 0.9, 1]),
  },
  Material: {
    base: createUiUnlitMaterial({
      alphaClip: true,
      alphaCutoff: 0.5,
      offsetFactor: 10,
      offsetUnits: 500,
    }),
  },
});

const StandardText = (props: {
  text: string;
  horizontalAlign?: "Left" | "Center" | "Right";
  verticalAlign?: "Top" | "Middle" | "Bottom";
}) => (
  <StyledText
    content={props.text}
    horizontalAlign={props.horizontalAlign ?? "Center"}
    verticalAlign={props.verticalAlign ?? "Middle"}
    styledColor={Color.text}
  />
);

const StandardButton = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) => (
  <StyledButton
    onClick={onClick}
    styledSprite={Sprite.kadomaru}
    styledColor={Color.button}
  >
    <StandardText text={text} />
  </StyledButton>
);

export const Main = () => {
  const [count, setCount] = useState(0);
  return (
    <StyledSpace>
      <Canvas size={[600, 320]}>
        <StyledImage
          styledColor={Color.background}
          styledSprite={Sprite.kadomaru}
          styledMaterial={Material.base}
        />
        <VerticalLayout
          paddingBottom={30}
          paddingLeft={30}
          paddingRight={30}
          paddingTop={30}
        >
          <LayoutElement minHeight={100}>
            <StandardText text="Counter" />
          </LayoutElement>
          <LayoutElement minHeight={150}>
            <HorizontalLayout>
              <LayoutElement>
                <StandardButton
                  onClick={() => setCount((c) => c - 1)}
                  text="-"
                />
              </LayoutElement>
              <LayoutElement minWidth={100}>
                <StandardText text={`${count}`} />
              </LayoutElement>
              <StandardButton onClick={() => setCount((c) => c + 1)} text="+" />
            </HorizontalLayout>
          </LayoutElement>
          <LayoutElement flexibleHeight={1} />
        </VerticalLayout>
      </Canvas>
    </StyledSpace>
  );
};
