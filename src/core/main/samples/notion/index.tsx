import { useState, useMemo, useEffect, useRef } from "react";
import {
  Button,
  Canvas,
  HorizontalLayout,
  LayoutElement,
  ScrollArea,
  Text,
  TextField,
  VerticalLayout,
} from "../../../unit/package/standardUix/main";
import { NotionBlocks } from "./components/blockView";
import { ScheduleSelector } from "./components/ScheduleSelector";

export const App = () => {
  const [url, setUrl] = useState<string>(
    "https://www.notion.so/neos-shared/f0b42e8eaf97445998914f7a8af4ca03?pvs=4"
  );
  const page_id = useMemo(() => {
    const id = url.match(/[a-z0-9]{32}/)?.[0];
    if (id) {
      return id;
    } else {
      return "";
    }
  }, [url]);
  const reloadRef = useRef<() => void>();

  // return (
  //   <Canvas size={[2000, 4000]} position={[-1, 0, 0]} scale={[0.5, 0.5, 0.5]}>
  //     <ScrollArea>
  //       <VerticalLayout>
  //         <ScheduleSelector start={new Date()} />
  //       </VerticalLayout>
  //     </ScrollArea>
  //   </Canvas>
  // );

  return (
    <Canvas size={[2000, 4000]} scale={[0.5, 0.5, 0.5]}>
      <VerticalLayout
        paddingBottom={20}
        paddingLeft={20}
        paddingRight={20}
        paddingTop={20}
      >
        <VerticalLayout>
          <LayoutElement minHeight={100}>
            <Text
              content="Notion Viewer"
              verticalAlign="Center"
              horizontalAlign="Center"
            />
          </LayoutElement>
          <LayoutElement minHeight={100}>
            <HorizontalLayout>
              <LayoutElement flexibleWidth={1}>
                <TextField
                  defaultValue={url}
                  onChange={(text) => {
                    setUrl(text);
                  }}
                />
              </LayoutElement>
              <LayoutElement minWidth={200}>
                <Button
                  onClick={() => {
                    reloadRef.current?.();
                  }}
                  baseColor={[1, 0, 0, 1]}
                >
                  <VerticalLayout
                    paddingBottom={10}
                    paddingLeft={10}
                    paddingRight={10}
                    paddingTop={10}
                  >
                    <Text
                      content="Reload"
                      horizontalAlign="Center"
                      verticalAlign="Center"
                      color={[1, 1, 0, 1]}
                      verticalAutoSize={true}
                      horizontalAutoSize={true}
                    />
                  </VerticalLayout>
                </Button>
              </LayoutElement>
            </HorizontalLayout>
          </LayoutElement>
          <LayoutElement flexibleHeight={1}>
            <ScrollArea>
              <VerticalLayout spacing={10}>
                <NotionBlocks id={page_id} reloadRef={reloadRef} />
              </VerticalLayout>
            </ScrollArea>
          </LayoutElement>
        </VerticalLayout>
      </VerticalLayout>
    </Canvas>
  );
};
