import { MutableRefObject, useEffect } from "react";
import {
  Button,
  HorizontalLayout,
  Image,
  LayoutElement,
  Text,
} from "../../../../../unit/package/standardUix/main";
import { useNotionBlocks } from "../../hooks/notionApi";
import { BlockView } from "./BlockView";

export const NotionBlocks = ({
  id,
  hide,
  reloadRef,
}: {
  id: string;
  reloadRef?: MutableRefObject<(() => void) | undefined>;
  hide?: boolean;
}) => {
  const { blocks, state, reload } = useNotionBlocks(hide ? "" : id);

  useEffect(() => {
    if (reloadRef) {
      reloadRef.current = reload;
    }
  }, [reload, reloadRef]);

  if (hide) {
    return <></>;
  }

  if (blocks.length > 0) {
    return (
      <>
        {blocks.map((block) => (
          <BlockView key={block.id} block={block} />
        ))}
      </>
    );
  } else {
    switch (state) {
      case "loading":
        return (
          <LayoutElement minHeight={100}>
            <Image tint={[0.8, 0.8, 0.8, 1]} />
            <Text
              content={`loading...`}
              verticalAlign="Center"
              horizontalAlign="Center"
            />
          </LayoutElement>
        );
      case "error":
        return (
          <LayoutElement minHeight={100}>
            <HorizontalLayout>
              <Text content="error" />
              <Button onClick={reload}>
                <Text
                  content="reload"
                  horizontalAlign="Center"
                  verticalAlign="Center"
                />
              </Button>
            </HorizontalLayout>
          </LayoutElement>
        );
      case "success":
      default:
        return <></>;
    }
  }
};
