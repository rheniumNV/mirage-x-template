import { useEffect, useState } from "react";
import {
  Canvas,
  LayoutElement,
  Text,
  VerticalLayout,
} from "../../../unit/package/standardUix/main";
import WebSocket from "ws";
import axios from "axios";

export const App = () => {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    axios
      .post("https://misskey.neos.love/api/channels/timeline", {
        channelId: "9aj12hvkn6",
      })
      .then((res) => {
        setTimeline(res.data);
      });
    // const ws = new WebSocket("wss://misskey.neos.love/streaming");
    // ws.on("open", () => {
    //   ws.send(
    //     JSON.stringify({
    //       type: "connect",
    //       body: {
    //         channel: "localTimeline",
    //         id: "testId",
    //       },
    //     })
    //   );
    // });
    // ws.on("message", (data) => {

    // })
  }, []);

  return (
    <Canvas size={[1000, 2000]}>
      <VerticalLayout>
        {timeline.map((item: any) => {
          return (
            // <LayoutElement minHeight={200}>
            <Text
              key={item.id}
              content={JSON.stringify(item, null, 2)}
              size={10}
            />
            // </LayoutElement>
          );
        })}
      </VerticalLayout>
    </Canvas>
  );
};
