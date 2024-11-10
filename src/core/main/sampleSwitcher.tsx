import { useCallback, useState } from "react";
import {
  createColor,
  createSprite,
  createStyle,
  createUiUnlitMaterial,
} from "../lib/styledUnit";
import {
  Canvas,
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../unit/package/PrimitiveUix/main";
import {
  StyledButton,
  StyledImage,
  StyledText,
} from "../unit/package/StyledUix/main";
import { MineSweeper } from "./samples/mineSweeper";
import { SimpleCounter } from "./samples/simpleCounter";
import { Misskey } from "./samples/misskey";
import { UserSearchPanel } from "./samples/userSearchPanel";

type SampleCode =
  | "MineSweeper"
  | "Misskey"
  | "SimpleCounter"
  | "UserSearchPanel";

export const { StyledSpace, Sprite, Color, Material } = createStyle({
  Sprite: {
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
    selectedButton: createColor([0.2, 0.6, 0.2, 1]),
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

const SelectButton = ({
  sampleCode,
  currentSampleCode,
  label,
  setSampleCode,
}: {
  sampleCode: SampleCode;
  currentSampleCode: SampleCode;
  label: string;
  setSampleCode: (code: SampleCode) => void;
}) => {
  const onClick = useCallback(() => {
    setSampleCode(sampleCode);
  }, [setSampleCode, sampleCode]);

  return (
    <LayoutElement minWidth={300}>
      <StyledButton
        onClick={onClick}
        styledColor={
          currentSampleCode === sampleCode ? Color.selectedButton : Color.button
        }
        styledSprite={Sprite.kadomaru}
      >
        <VerticalLayout
          paddingBottom={20}
          paddingLeft={20}
          paddingRight={20}
          paddingTop={20}
        >
          <StyledText
            content={label}
            horizontalAlign="Center"
            horizontalAutoSize
            styledColor={Color.text}
            verticalAlign="Middle"
            verticalAutoSize
          />
        </VerticalLayout>
      </StyledButton>
    </LayoutElement>
  );
};

const Swtich = ({ sampleCode }: { sampleCode: SampleCode }) => {
  switch (sampleCode) {
    case "MineSweeper":
      return <MineSweeper />;
    case "SimpleCounter":
      return <SimpleCounter />;
    case "Misskey":
      return <Misskey />;
    case "UserSearchPanel":
      return <UserSearchPanel />;
    default:
      return <></>;
  }
};

export const SampleSwitcher = () => {
  const [sampleCode, setSampleCode] = useState<SampleCode>("MineSweeper");

  return (
    <>
      <Swtich sampleCode={sampleCode} />
      <StyledSpace>
        <Canvas position={[0, 1, 0]} size={[1300, 200]}>
          <StyledImage
            styledColor={Color.background}
            styledMaterial={Material.base}
            styledSprite={Sprite.kadomaru}
          />
          <VerticalLayout>
            <LayoutElement minHeight={100}>
              <StyledText
                content="Samples"
                horizontalAlign="Center"
                size={48}
                styledColor={Color.text}
                verticalAlign="Middle"
              />
            </LayoutElement>
            <LayoutElement minHeight={100}>
              <HorizontalLayout
                forceExpandChildWidth={false}
                horizontalAlign="Center"
                paddingBottom={10}
                paddingLeft={10}
                paddingRight={10}
                paddingTop={10}
                spacing={10}
              >
                <SelectButton
                  currentSampleCode={sampleCode}
                  label="MineSweeper"
                  sampleCode="MineSweeper"
                  setSampleCode={setSampleCode}
                />
                <SelectButton
                  currentSampleCode={sampleCode}
                  label="SimpleCounter"
                  sampleCode="SimpleCounter"
                  setSampleCode={setSampleCode}
                />

                <SelectButton
                  currentSampleCode={sampleCode}
                  label="Misskey"
                  sampleCode="Misskey"
                  setSampleCode={setSampleCode}
                />
                <SelectButton
                  currentSampleCode={sampleCode}
                  label="UserSearchPanel"
                  sampleCode="UserSearchPanel"
                  setSampleCode={setSampleCode}
                />
              </HorizontalLayout>
            </LayoutElement>
          </VerticalLayout>
        </Canvas>
      </StyledSpace>
    </>
  );
};
