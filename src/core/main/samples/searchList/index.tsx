import { useEffect, useState } from "react";
import {
  Canvas,
  HorizontalLayout,
  Image,
  LayoutElement,
  Mask,
  ScrollArea,
  Text,
  TextField,
  VerticalLayout,
} from "../../../unit/package/standardUix/main";
import axios from "axios";

export const App = () => {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([] as any[]);

  useEffect(() => {
    axios
      .get(`https://stg-nexus.kokoa.dev/item/fuzzy?q=${q}&json=true`)
      .then((res) => {
        setItems(res.data);
      });
  }, [q]);

  return (
    <Canvas size={[1000, 2000]}>
      <VerticalLayout
        paddingBottom={10}
        paddingLeft={10}
        paddingRight={10}
        paddingTop={10}
      >
        <LayoutElement minHeight={100}>
          <Text
            content="GeneralHub"
            verticalAlign="Center"
            horizontalAlign="Center"
          />
        </LayoutElement>
        <LayoutElement minHeight={100}>
          <HorizontalLayout>
            <LayoutElement flexibleWidth={1}>
              <VerticalLayout
                paddingBottom={10}
                paddingLeft={10}
                paddingRight={10}
                paddingTop={10}
              >
                <TextField
                  onChange={(text) => {
                    setQ(text);
                  }}
                  verticalAlign="Center"
                  horizontalAlign="Left"
                />
              </VerticalLayout>
            </LayoutElement>
            <LayoutElement minWidth={100}>
              <Text content={q} />
            </LayoutElement>
          </HorizontalLayout>
        </LayoutElement>
        <LayoutElement flexibleHeight={1}>
          <ScrollArea>
            <VerticalLayout spacing={10}>
              {items.map((item) => (
                <LayoutElement key={item.id} minHeight={100}>
                  <Image tint={[0.8, 0.8, 0.8, 1]} />
                  <Mask>
                    <VerticalLayout
                      paddingBottom={10}
                      paddingLeft={10}
                      paddingRight={10}
                      paddingTop={10}
                    >
                      <Text
                        content={item.title}
                        size={64}
                        horizontalAlign="Left"
                        verticalAlign="Center"
                      />
                    </VerticalLayout>
                  </Mask>
                </LayoutElement>
              ))}
            </VerticalLayout>
          </ScrollArea>
        </LayoutElement>
      </VerticalLayout>
    </Canvas>
  );
};
