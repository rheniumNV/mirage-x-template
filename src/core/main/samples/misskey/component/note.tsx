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
    (file) => !file.isSensitive && file.type.startsWith("image/")
  );
  let height = note.cw == null && images.length > 0 ? 500 : 300;
  if (note.renote) height += 500;
  return (
    <LayoutElement preferredHeight={height}>
      <StyledImage styledSprite={Sprite.kadomaru} styledColor={Color.white}>
        <HorizontalLayout
          forceExpandChildWidth={false}
          paddingTop={40}
          paddingBottom={40}
          paddingLeft={40}
          paddingRight={40}
          spacing={20}
        >
          {/* Icon */}
          <LayoutElement preferredWidth={150} minWidth={150}>
            <VerticalLayout forceExpandChildHeight={false}>
              <LayoutElement preferredHeight={150} minHeight={150}>
                <StyledMask styledSprite={Sprite.circle}>
                  <StyledRawImage
                    url={note.user.avatarUrl}
                    styledMaterial={Material.front}
                  />
                </StyledMask>
              </LayoutElement>
            </VerticalLayout>
          </LayoutElement>
          {/* Content */}
          <LayoutElement flexibleWidth={1}>
            <VerticalLayout forceExpandChildHeight={false} spacing={15}>
              {/* Top */}
              <LayoutElement preferredHeight={40} minHeight={40}>
                <HorizontalLayout forceExpandChildWidth={false}>
                  <LayoutElement flexibleWidth={1}>
                    <StyledText
                      content={`${note.user.name ?? ""}@${note.user.username}`}
                      styledColor={Color.black}
                      size={35}
                      verticalAlign="Middle"
                      verticalAutoSize={true}
                      horizontalAutoSize={true}
                    />
                  </LayoutElement>
                  <LayoutElement preferredWidth={250} minWidth={250}>
                    <HyperLinkButton
                      urlJa={`https://${config.misskey.host}/notes/${note.id}`}
                      urlEn={`https://${config.misskey.host}/notes/${note.id}`}
                      urlKo={`https://${config.misskey.host}/notes/${note.id}`}
                      reasonJa="ノートを開きます"
                      reasonEn="Open Note"
                      reasonKo="노트 열기"
                      styledColor={Color.white}
                    >
                      <StyledText
                        content={time}
                        styledColor={Color.black}
                        size={24}
                        verticalAlign="Middle"
                        horizontalAlign="Right"
                        verticalAutoSize={true}
                        horizontalAutoSize={true}
                      />
                    </HyperLinkButton>
                  </LayoutElement>
                </HorizontalLayout>
              </LayoutElement>
              <LayoutElement flexibleHeight={1}>
                <VerticalLayout paddingLeft={5} paddingRight={5} spacing={10}>
                  <StyledText
                    content={content}
                    styledColor={Color.black}
                    size={35}
                  />
                  {note.cw == null && images.length > 0 && (
                    <LayoutElement preferredHeight={300} minHeight={300}>
                      <StyledImage styledSprite={Sprite.kadomaru}>
                        <StyledScrollArea horizontalFit="PreferredSize">
                          <HorizontalLayout
                            forceExpandChildWidth={false}
                            spacing={10}
                          >
                            {images.map((file, index) => (
                              <LayoutElement
                                key={index}
                                preferredWidth={300}
                                minWidth={300}
                              >
                                <StyledRawImage
                                  url={file.url}
                                  preserveAspect={true}
                                />
                              </LayoutElement>
                            ))}
                          </HorizontalLayout>
                        </StyledScrollArea>
                      </StyledImage>
                    </LayoutElement>
                  )}
                  {!isRenote && note.renote && (
                    <NoteView note={note.renote} isRenote={true} />
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
