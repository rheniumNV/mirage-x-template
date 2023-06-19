import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  Button,
  HorizontalLayout,
  Image,
  LayoutElement,
  RawImage,
  Text,
  VerticalLayout,
} from "../../../../../unit/package/standardUix/main";
import { ToggleView } from "./ToggleView";
import { NotionBlocks } from ".";

export const BlockView = ({
  block,
}: {
  block: BlockObjectResponse | PartialBlockObjectResponse;
}) => {
  if ("type" in block) {
    switch (block.type) {
      case "paragraph":
        return (
          <Text
            verticalAlign="Center"
            size={32}
            content={block.paragraph.rich_text
              .map((v) => v.plain_text)
              .join("")}
          />
        );
      case "image":
        switch (block.image.type) {
          case "external":
            return (
              <LayoutElement minHeight={200}>
                <RawImage
                  preserveAspect={true}
                  url={block.image.external.url}
                />
              </LayoutElement>
            );
          case "file":
            return (
              <LayoutElement minHeight={200}>
                <RawImage preserveAspect={true} url={block.image.file.url} />
              </LayoutElement>
            );
          default:
            return (
              <LayoutElement minHeight={100}>
                <Image tint={[1, 0.4, 0.4, 1]} />
                <Text content={JSON.stringify(block)} autoSizeMin={0} />
              </LayoutElement>
            );
        }
      case "heading_1":
        return (
          <>
            <LayoutElement minHeight={10} />
            <Text
              size={64}
              verticalAlign="Center"
              content={block.heading_1.rich_text
                .map((v) => v.plain_text)
                .join("")}
            />
          </>
        );
      case "heading_2":
        return (
          <>
            <LayoutElement minHeight={10} />
            <Text
              size={48}
              verticalAlign="Center"
              content={block.heading_2.rich_text
                .map((v) => v.plain_text)
                .join("")}
            />
          </>
        );
      case "heading_3":
        return (
          <>
            <LayoutElement minHeight={10} />
            <Text
              size={42}
              verticalAlign="Center"
              content={block.heading_3.rich_text
                .map((v) => v.plain_text)
                .join("")}
            />
          </>
        );
      case "divider":
        return (
          <LayoutElement minHeight={5}>
            <Image tint={[0.8, 0.8, 0.8, 1]} />
          </LayoutElement>
        );
      case "bulleted_list_item":
        return (
          <VerticalLayout>
            <HorizontalLayout>
              <LayoutElement minWidth={50}>
                <Text
                  size={32}
                  content="-"
                  verticalAlign="Center"
                  horizontalAlign="Center"
                />
              </LayoutElement>
              <Text
                size={32}
                horizontalAlign="Left"
                verticalAlign="Center"
                content={block.bulleted_list_item.rich_text
                  .map((v) => v.plain_text)
                  .join("")}
              />
              <LayoutElement flexibleWidth={1} />
            </HorizontalLayout>
            {block.has_children && (
              <VerticalLayout paddingLeft={50}>
                <NotionBlocks id={block.id} />
              </VerticalLayout>
            )}
          </VerticalLayout>
        );
      case "numbered_list_item":
        return (
          <VerticalLayout>
            <HorizontalLayout>
              <LayoutElement minWidth={50}>
                <Text
                  size={32}
                  content={"1."}
                  verticalAlign="Center"
                  horizontalAlign="Center"
                />
              </LayoutElement>
              <Text
                size={32}
                horizontalAlign="Left"
                verticalAlign="Center"
                content={block.numbered_list_item.rich_text
                  .map((v) => v.plain_text)
                  .join("")}
              />
              <LayoutElement flexibleWidth={1} />
            </HorizontalLayout>
            {block.has_children && (
              <VerticalLayout paddingLeft={50}>
                <NotionBlocks id={block.id} />
              </VerticalLayout>
            )}
          </VerticalLayout>
        );
      case "to_do":
        return (
          <LayoutElement minHeight={100}>
            <Text
              verticalAlign="Center"
              content={block.to_do.rich_text
                .map((v) => v.plain_text)
                .join(", ")}
            />
          </LayoutElement>
        );
      case "toggle":
        return <ToggleView block={block} />;
      case "column_list":
        return (
          <HorizontalLayout>
            <NotionBlocks id={block.id} />
          </HorizontalLayout>
        );
      case "synced_block":
        return (
          <VerticalLayout>
            {block.has_children && <NotionBlocks id={block.id} />}
          </VerticalLayout>
        );
      case "column":
        return (
          <VerticalLayout verticalAlign="Top">
            <VerticalLayout>
              <NotionBlocks id={block.id} />
            </VerticalLayout>
            <LayoutElement flexibleHeight={1} minWidth={300} />
          </VerticalLayout>
        );
      case "child_page":
        return (
          <LayoutElement minHeight={100}>
            <Text verticalAlign="Center" content={block.child_page.title} />
          </LayoutElement>
        );
      case "unsupported":
        return (
          <LayoutElement minHeight={100}>
            <Image tint={[1, 0.4, 0.4, 1]} />
            <Text verticalAlign="Center" content={block.unsupported.type} />
          </LayoutElement>
        );
      default:
        return (
          <LayoutElement minHeight={100}>
            <Image tint={[0.8, 0.8, 0.8, 1]} />
            <Text
              verticalAlign="Center"
              content={JSON.stringify(block, null, 2)}
              verticalAutoSize={true}
              horizontalAutoSize={true}
              autoSizeMin={0}
            />
          </LayoutElement>
        );
    }
  } else {
    return (
      <LayoutElement minHeight={100}>
        <Image tint={[0.8, 0.8, 0.8, 1]} />
        <Text
          verticalAlign="Center"
          content={JSON.stringify(block, null, 2)}
          verticalAutoSize={true}
          horizontalAutoSize={true}
          autoSizeMin={0}
        />
      </LayoutElement>
    );
  }
};
