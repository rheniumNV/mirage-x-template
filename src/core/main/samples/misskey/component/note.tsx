import { HyperLinkButton } from "../../../../unit/package/AdvancedUix/main";
import {
  HorizontalLayout,
  LayoutElement,
  VerticalLayout,
} from "../../../../unit/package/PrimitiveUix/main";
import {
  StyledImage,
  StyledMask,
  StyledRawImage,
  StyledScrollArea,
  StyledText,
} from "../../../../unit/package/StyledUix/main";
import { config } from "../config";
import { Color, Material, Sprite } from "../util/style";
import { Note } from "../util/type";

export const NoteView = ({
  note,
  isRenote,
}: {
  note: Note;
  isRenote?: boolean;
}) => {
  const content = note.cw != null ? note.cw : note.text;
  const time = new Date(note.createdAt).toLocaleString();
  const images = note.files.filter(
    (file) => !file.isSensitive && file.type.startsWith("image/"),
  );
  let height = note.cw == null && images.length > 0 ? 500 : 300;
  if (note.renote) height += 500;
  return (
    <LayoutElement preferredHeight={height}>
      <StyledImage styledColor={Color.white} styledSprite={Sprite.kadomaru}>
        <HorizontalLayout
          forceExpandChildWidth={false}
          paddingBottom={40}
          paddingLeft={40}
          paddingRight={40}
          paddingTop={40}
          spacing={20}
        >
          {/* Icon */}
          <LayoutElement minWidth={150} preferredWidth={150}>
            <VerticalLayout forceExpandChildHeight={false}>
              <LayoutElement minHeight={150} preferredHeight={150}>
                <StyledMask styledSprite={Sprite.circle}>
                  <StyledRawImage
                    styledMaterial={Material.front}
                    url={note.user.avatarUrl}
                  />
                </StyledMask>
              </LayoutElement>
            </VerticalLayout>
          </LayoutElement>
          {/* Content */}
          <LayoutElement flexibleWidth={1}>
            <VerticalLayout forceExpandChildHeight={false} spacing={15}>
              {/* Top */}
              <LayoutElement minHeight={40} preferredHeight={40}>
                <HorizontalLayout forceExpandChildWidth={false}>
                  <LayoutElement flexibleWidth={1}>
                    <StyledText
                      content={`${note.user.name ?? ""}@${note.user.username}`}
                      horizontalAutoSize
                      size={35}
                      styledColor={Color.black}
                      verticalAlign="Middle"
                      verticalAutoSize
                    />
                  </LayoutElement>
                  <LayoutElement minWidth={250} preferredWidth={250}>
                    <HyperLinkButton
                      reasonEn="Open Note"
                      reasonJa="ノートを開きます"
                      reasonKo="노트 열기"
                      styledColor={Color.white}
                      urlEn={`https://${config.misskey.host}/notes/${note.id}`}
                      urlJa={`https://${config.misskey.host}/notes/${note.id}`}
                      urlKo={`https://${config.misskey.host}/notes/${note.id}`}
                    >
                      <StyledText
                        content={time}
                        horizontalAlign="Right"
                        horizontalAutoSize
                        size={24}
                        styledColor={Color.black}
                        verticalAlign="Middle"
                        verticalAutoSize
                      />
                    </HyperLinkButton>
                  </LayoutElement>
                </HorizontalLayout>
              </LayoutElement>
              <LayoutElement flexibleHeight={1}>
                <VerticalLayout paddingLeft={5} paddingRight={5} spacing={10}>
                  <StyledText
                    content={content}
                    size={35}
                    styledColor={Color.black}
                  />
                  {note.cw == null && images.length > 0 && (
                    <LayoutElement minHeight={300} preferredHeight={300}>
                      <StyledImage styledSprite={Sprite.kadomaru}>
                        <StyledScrollArea horizontalFit="PreferredSize">
                          <HorizontalLayout
                            forceExpandChildWidth={false}
                            spacing={10}
                          >
                            {images.map((file, index) => (
                              <LayoutElement
                                key={index}
                                minWidth={300}
                                preferredWidth={300}
                              >
                                <StyledRawImage preserveAspect url={file.url} />
                              </LayoutElement>
                            ))}
                          </HorizontalLayout>
                        </StyledScrollArea>
                      </StyledImage>
                    </LayoutElement>
                  )}
                  {!isRenote && note.renote && (
                    <NoteView isRenote note={note.renote} />
                  )}
                </VerticalLayout>
              </LayoutElement>
            </VerticalLayout>
          </LayoutElement>
        </HorizontalLayout>
      </StyledImage>
    </LayoutElement>
  );
};
