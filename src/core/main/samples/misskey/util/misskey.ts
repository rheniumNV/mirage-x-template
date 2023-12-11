import WebSocket from "ws";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { MisskeyWsMessage, Note } from "./type";
import { config } from "../config";

export const useMisskey = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNotes = useCallback((notes: Note[]) => {
    setNotes((prevNotes) =>
      [
        // avatarUrlがNeosで正常に読まれないので、URLデコードしておく
        ...notes
          .map((note) => {
            const avatarUrl = decodeURIComponent(
              note.user.avatarUrl.match(/\?url=(.*)&/)?.[1] ?? ""
            );
            return {
              ...note,
              user: {
                ...note.user,
                avatarUrl,
              },
            };
          })
          .map((note) => {
            if (!note.renote) return note;
            const avatarUrl = decodeURIComponent(
              note.renote.user.avatarUrl.match(/\?url=(.*)&/)?.[1] ?? ""
            );
            return {
              ...note,
              renote: {
                ...note.renote,
                user: {
                  ...note.renote.user,
                  avatarUrl,
                },
              },
            };
          }),
        ...prevNotes,
      ].slice(-100)
    );
  }, []);

  useEffect(() => {
    // ストリーミングAPIに接続
    const ws = new WebSocket(`wss://${config.misskey.host}/streaming`);
    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "connect",
          body: {
            channel: "localTimeline",
            id: "testId",
          },
        })
      );
    });

    // ストリーミングAPIでメッセージを受け取ったらnotesに追加
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString()) as MisskeyWsMessage;
      addNotes([message.body.body]);
    });

    // 接続が切れないように定期的にpingを送る
    const interval = setInterval(() => {
      ws.ping();
    }, 30000);

    // 初回ロード
    axios
      .post(`https://${config.misskey.host}/api/notes/local-timeline`, {})
      .then((res) => {
        addNotes(res.data);
      });

    // unmount時にwsを閉じる
    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return { notes };
};
