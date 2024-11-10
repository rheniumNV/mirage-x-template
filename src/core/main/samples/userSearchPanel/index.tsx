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
import { FunctionEnv } from "../../../../lib/miragex/common/interactionEvent";

type User = {
  id: string;
  username: string;
  profile?: {
    iconUrl: string;
  };
};

export const UserSearchPanel = () => {
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
    [setSearchText],
  );

  return (
    <StyledSpace>
      <Canvas size={[800, 1000]}>
        <StyledImage
          styledColor={Color.background}
          styledMaterial={Material.base}
          styledSprite={Sprite.kadomaru}
        />
        <VerticalLayout
          paddingBottom={20}
          paddingLeft={20}
          paddingRight={20}
          paddingTop={20}
          spacing={10}
        >
          <LayoutElement preferredHeight={100}>
            <StyledText
              content="Resonite User Search Panel"
              horizontalAlign="Center"
              size={48}
              styledColor={Color.text}
              verticalAlign="Middle"
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
                    onClick={searchButtonOnClick}
                    styledColor={Color.button}
                  >
                    <StyledText
                      content="🔍"
                      horizontalAlign="Center"
                      styledColor={Color.text}
                      verticalAlign="Middle"
                    />
                  </StyledButton>
                </LayoutElement>
              </HorizontalLayout>
            </StyledMask>
          </LayoutElement>
          <LayoutElement flexibleHeight={1}>
            <StyledScrollArea verticalFit="PreferredSize">
              <VerticalLayout
                forceExpandChildHeight={false}
                spacing={10}
                verticalAlign="Top"
              >
                {searchResult.map((user, index) => {
                  return (
                    <LayoutElement key={index} preferredHeight={100}>
                      <HorizontalLayout spacing={10}>
                        <LayoutElement preferredWidth={100}>
                          <StyledMask styledSprite={Sprite.maru}>
                            {user.profile?.iconUrl ? (
                              <StyledRawImage url={user.profile?.iconUrl} />
                            ) : (
                              <StyledText
                                content="👤"
                                horizontalAlign="Center"
                                styledColor={Color.text}
                                verticalAlign="Middle"
                              />
                            )}
                          </StyledMask>
                        </LayoutElement>
                        <LayoutElement flexibleWidth={1}>
                          <StyledText
                            content={user.username}
                            horizontalAlign="Left"
                            size={36}
                            styledColor={Color.text}
                            verticalAlign="Middle"
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
