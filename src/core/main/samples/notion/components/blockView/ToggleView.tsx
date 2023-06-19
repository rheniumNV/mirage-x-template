import { useState } from "react";
import { ToggleBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  Button,
  HorizontalLayout,
  LayoutElement,
  Text,
  VerticalLayout,
} from "../../../../../unit/package/standardUix/main";
import { NotionBlocks } from ".";

export const ToggleView = ({ block }: { block: ToggleBlockObjectResponse }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HorizontalLayout>
        <LayoutElement minWidth={50}>
          <Button
            onClick={() => {
              setOpen((o) => !o);
            }}
          >
            <Text
              size={32}
              content={open ? "v" : ">"}
              verticalAlign="Center"
              horizontalAlign="Center"
            />
          </Button>
        </LayoutElement>
        <Text
          size={32}
          horizontalAlign="Left"
          verticalAlign="Center"
          content={block.toggle.rich_text.map((v) => v.plain_text).join("")}
        />
        <LayoutElement flexibleWidth={1} />
      </HorizontalLayout>
      {block.has_children && (
        <HorizontalLayout paddingLeft={50}>
          <VerticalLayout>
            <NotionBlocks hide={!open} id={block.id} />
          </VerticalLayout>
        </HorizontalLayout>
      )}
    </>
  );
};
