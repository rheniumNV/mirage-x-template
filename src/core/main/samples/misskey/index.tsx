import {
  Canvas,
  LayoutElement,
  RectTransform,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  StyledImage,
  StyledMask,
  StyledText,
} from "../../../unit/package/StyledUix/main";
import { Timeline } from "./component/timeline";
import { Color, Material, Sprite, StyledSpace } from "./util/style";
import { useMisskey } from "./util/misskey";
import { HyperLinkButton } from "../../../unit/package/AdvancedUix/main";
import { config } from "./config";

export const Misskey = () => {
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
                <RectTransform offsetMax={[0, -20]} offsetMin={[0, 20]}>
                  <HyperLinkButton
                    preserveAspect
                    reasonEn="Open Misskey"
                    reasonJa="Misskey を開きます"
                    reasonKo="Misskey 열기"
                    styledSprite={Sprite.logo}
                    urlEn={`https://${config.misskey.host}/`}
                    urlJa={`https://${config.misskey.host}/`}
                    urlKo={`https://${config.misskey.host}/`}
                  />
                </RectTransform>
              </StyledMask>
            </LayoutElement>
            {/* Body */}
            <LayoutElement flexibleHeight={1}>
              <Timeline notes={notes} />
              <RectTransform anchorMin={[0, 1]} offsetMin={[0, -50]}>
                <StyledImage
                  preserveAspect={false}
                  styledColor={Color.background}
                  styledSprite={Sprite.gradient2}
                />
              </RectTransform>
            </LayoutElement>
            {/* Footer */}
            <LayoutElement preferredHeight={200}>
              <RectTransform anchorMin={[0, 1]} offsetMin={[0, -50]}>
                <StyledImage
                  preserveAspect={false}
                  styledColor={Color.white}
                  styledSprite={Sprite.gradient}
                />
              </RectTransform>
              <RectTransform offsetMax={[0, -50]}>
                <StyledImage preserveAspect={false} styledColor={Color.white} />
              </RectTransform>
              <VerticalLayout
                forceExpandChildHeight={false}
                paddingBottom={30}
                paddingLeft={30}
                paddingRight={30}
                paddingTop={40}
                spacing={30}
              >
                <LayoutElement preferredHeight={120}>
                  <StyledMask preserveAspect={false} styledSprite={Sprite.maru}>
                    <HyperLinkButton
                      reasonEn="note"
                      reasonJa="ノート"
                      reasonKo="노트"
                      styledSprite={Sprite.gradientGreen}
                      urlEn={`https://${config.misskey.host}/share?`}
                      urlJa={`https://${config.misskey.host}/share?`}
                      urlKo={`https://${config.misskey.host}/share?`}
                    >
                      <StyledText
                        content="ノート"
                        horizontalAlign="Center"
                        styledColor={Color.white}
                        verticalAlign="Middle"
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
