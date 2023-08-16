import { useEffect, useState, useRef, useCallback } from "react";
import { StyledHyperLinkButton } from "../../../unit/package/StyledUix/main";
import {
  HorizontalLayout,
  LayoutElement,
  RectTransform,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  StyledButton,
  StyledCanvas,
  StyledImage,
  StyledMask,
  StyledRawImage,
  StyledText,
} from "../../../unit/package/StyledUix/main";
import { Timeline } from "./component/timeline";
import { Color, Sprite, StyledSpace } from "./util/style";
import { useMisskey } from "./util/misskey";

export const App = ({}) => {
  const { notes } = useMisskey();

  return (
    <StyledSpace>
      <StyledCanvas size={[850, 1580]} styledBackgroundColor={Color.background}>
        <VerticalLayout forceExpandChildHeight={false}>
          {/* Header */}
          <LayoutElement preferredHeight={200}>
            <StyledMask>
              <RectTransform offsetMin={[0, -150]} offsetMax={[0, 150]}>
                <StyledRawImage url="neosdb:///b53a9d6ad9750a7bdba62b8fe7bdcbfcf9d2b9303c5e988e7b92a6a3bb7952a5.png" />
              </RectTransform>
              <StyledImage
                styledSprite={Sprite.gradient}
                styledColor={Color.background}
                preserveAspect={false}
              />
              <RectTransform offsetMin={[0, 20]} offsetMax={[0, -20]}>
                <StyledHyperLinkButton
                  url="https://misskey.neos.love/"
                  reason="Misskey を開きます"
                  styledSprite={Sprite.logo}
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
                  <StyledButton
                    styledSprite={Sprite.gradientGreen}
                    preserveAspect={false}
                  >
                    <StyledText
                      content="ノート"
                      styledColor={Color.white}
                      verticalAlign="Middle"
                      horizontalAlign="Center"
                    />
                  </StyledButton>
                </StyledMask>
              </LayoutElement>
            </VerticalLayout>
          </LayoutElement>
        </VerticalLayout>
      </StyledCanvas>
    </StyledSpace>
  );
};
