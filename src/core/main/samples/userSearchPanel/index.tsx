import { useCallback, useState } from "react";
import {
  Canvas,
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../unit/package/PrimitiveUix/main";
import {
  StyledButton,
  StyledImage,
  StyledMask,
  StyledRawImage,
  StyledScrollArea,
  StyledText,
  StyledTextField,
} from "../../../unit/package/StyledUix/main";
import { Color, Material, Sprite, StyledSpace } from "./style";
import axios from "axios";
import { FunctionEnv } from "../../../../lib/mirage-x/common/interactionEvent";

type User = {
  id: string;
  username: string;
  profile?: {
    iconUrl: string;
  };
};

export const Main = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);

  const searchButtonOnClick = useCallback(() => {
    axios
      .get(`https://api.resonite.com/users?name=${searchText}`)
      .then((res) => {
        setSearchResult(res.data);
      });
  }, [searchText]);

  const searchTextFieldOnChange = useCallback(
    (_env: FunctionEnv, value: string) => {
      setSearchText(value);
    },
    [setSearchText]
  );

  return (
    <StyledSpace>
      <Canvas size={[800, 1000]}>
        <StyledImage
          styledMaterial={Material.base}
          styledColor={Color.background}
          styledSprite={Sprite.kadomaru}
        />
        <VerticalLayout
          spacing={10}
          paddingBottom={20}
          paddingLeft={20}
          paddingRight={20}
          paddingTop={20}
        >
          <LayoutElement preferredHeight={100}>
            <StyledText
              content="Resonite User Search Panel"
              verticalAlign="Middle"
              horizontalAlign="Center"
              styledColor={Color.text}
              size={48}
            />
          </LayoutElement>
          <LayoutElement preferredHeight={100}>
            <StyledMask styledSprite={Sprite.kadomaru}>
              <HorizontalLayout spacing={10}>
                <LayoutElement flexibleWidth={1}>
                  <StyledTextField onChange={searchTextFieldOnChange} />
                </LayoutElement>
                <LayoutElement preferredWidth={100}>
                  <StyledButton
                    styledColor={Color.button}
                    onClick={searchButtonOnClick}
                  >
                    <StyledText
                      content="🔍"
                      verticalAlign="Middle"
                      horizontalAlign="Center"
                      styledColor={Color.text}
                    />
                  </StyledButton>
                </LayoutElement>
              </HorizontalLayout>
            </StyledMask>
          </LayoutElement>
          <LayoutElement flexibleHeight={1}>
            <StyledScrollArea verticalFit="PreferredSize">
              <VerticalLayout
                spacing={10}
                verticalAlign="Top"
                forceExpandChildHeight={false}
              >
                {searchResult.map((user) => {
                  return (
                    <LayoutElement preferredHeight={100}>
                      <HorizontalLayout spacing={10}>
                        <LayoutElement preferredWidth={100}>
                          <StyledMask styledSprite={Sprite.maru}>
                            {user.profile?.iconUrl ? (
                              <StyledRawImage url={user.profile?.iconUrl} />
                            ) : (
                              <StyledText
                                content="👤"
                                verticalAlign="Middle"
                                horizontalAlign="Center"
                                styledColor={Color.text}
                              />
                            )}
                          </StyledMask>
                        </LayoutElement>
                        <LayoutElement flexibleWidth={1}>
                          <StyledText
                            content={user.username}
                            verticalAlign="Middle"
                            horizontalAlign="Left"
                            styledColor={Color.text}
                            size={36}
                          />
                        </LayoutElement>
                      </HorizontalLayout>
                    </LayoutElement>
                  );
                })}
              </VerticalLayout>
            </StyledScrollArea>
          </LayoutElement>
        </VerticalLayout>
      </Canvas>
    </StyledSpace>
  );
};
