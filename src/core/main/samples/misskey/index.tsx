import {
  Canvas,
  LayoutElement,
  RectTransform,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  StyledButton,
  StyledImage,
  StyledMask,
  StyledRawImage,
  StyledText,
} from "../../../unit/package/StyledUix/main";
import { Timeline } from "./component/timeline";
import { Color, Material, Sprite, StyledSpace } from "./util/style";
import { useMisskey } from "./util/misskey";
import { HyperLinkButton } from "../../../unit/package/AdvancedUix/main";
import { config } from "./config";

export const Main = ({}) => {
  const { notes } = useMisskey();

  return (
    <StyledSpace>
      <Canvas size={[850, 1580]}>
        <StyledImage
          styledColor={Color.background}
          styledMaterial={Material.base}
          styledSprite={Sprite.kadomaru}
        />
        <StyledMask styledSprite={Sprite.kadomaru}>
          <VerticalLayout forceExpandChildHeight={false}>
            {/* Header */}
            <LayoutElement preferredHeight={200}>
              <StyledMask>
                <RectTransform offsetMin={[0, 20]} offsetMax={[0, -20]}>
                  <HyperLinkButton
                    urlJa={`https://${config.misskey.host}/`}
                    urlEn={`https://${config.misskey.host}/`}
                    urlKo={`https://${config.misskey.host}/`}
                    reasonJa="Misskey を開きます"
                    reasonEn="Open Misskey"
                    reasonKo="Misskey 열기"
                    styledSprite={Sprite.logo}
                    preserveAspect={true}
                  />
                </RectTransform>
              </StyledMask>
            </LayoutElement>
            {/* Body */}
            <LayoutElement flexibleHeight={1}>
              <Timeline notes={notes} />
              <RectTransform anchorMin={[0, 1]} offsetMin={[0, -50]}>
                <StyledImage
                  styledSprite={Sprite.gradient2}
                  styledColor={Color.background}
                  preserveAspect={false}
                />
              </RectTransform>
            </LayoutElement>
            {/* Footer */}
            <LayoutElement preferredHeight={200}>
              <RectTransform anchorMin={[0, 1]} offsetMin={[0, -50]}>
                <StyledImage
                  styledSprite={Sprite.gradient}
                  styledColor={Color.white}
                  preserveAspect={false}
                />
              </RectTransform>
              <RectTransform offsetMax={[0, -50]}>
                <StyledImage styledColor={Color.white} preserveAspect={false} />
              </RectTransform>
              <VerticalLayout
                forceExpandChildHeight={false}
                paddingTop={40}
                paddingBottom={30}
                paddingLeft={30}
                paddingRight={30}
                spacing={30}
              >
                <LayoutElement preferredHeight={120}>
                  <StyledMask styledSprite={Sprite.maru} preserveAspect={false}>
                    <HyperLinkButton
                      styledSprite={Sprite.gradientGreen}
                      preserveAspect={false}
                      urlEn={`https://${config.misskey.host}/share?`}
                      urlJa={`https://${config.misskey.host}/share?`}
                      urlKo={`https://${config.misskey.host}/share?`}
                      reasonEn="note"
                      reasonJa="ノート"
                      reasonKo="노트"
                    >
                      <StyledText
                        content="ノート"
                        styledColor={Color.white}
                        verticalAlign="Middle"
                        horizontalAlign="Center"
                      />
                    </HyperLinkButton>
                  </StyledMask>
                </LayoutElement>
              </VerticalLayout>
            </LayoutElement>
          </VerticalLayout>
        </StyledMask>
      </Canvas>
    </StyledSpace>
  );
};
