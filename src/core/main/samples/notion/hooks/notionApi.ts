import { useState, useEffect, useCallback } from "react";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Config from "../config/config.private.json";

export type SchedulePageObject = PageObjectResponse & {
  properties: {
    "担当者/参加者": Extract<
      PageObjectResponse["properties"]["string"],
      { type: "people" }
    >;
    ステータス: Extract<
      PageObjectResponse["properties"]["string"],
      { type: "status" }
    >;
    日付: Extract<PageObjectResponse["properties"]["string"], { type: "date" }>;
    "関連トピック ": Extract<
      PageObjectResponse["properties"]["string"],
      { type: "relation" }
    >;
    配信リンク: Extract<
      PageObjectResponse["properties"]["string"],
      { type: "url" }
    >;
    作成者: Extract<
      PageObjectResponse["properties"]["string"],
      { type: "created_by" }
    >;
    議事録担当: Extract<
      PageObjectResponse["properties"]["string"],
      { type: "people" }
    >;
    作成日時: Extract<
      PageObjectResponse["properties"]["string"],
      { type: "created_time" }
    >;
    名前: Extract<
      PageObjectResponse["properties"]["string"],
      { type: "title" }
    >;
  };
};

const api_token = Config.notionApiToken;
const notion = new Client({ auth: api_token });

export const useNotionBlocks = (id: string) => {
  const [blocks, setBlocks] = useState<
    (BlockObjectResponse | PartialBlockObjectResponse)[]
  >([]);
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const reload = useCallback(() => {
    if (id === "") {
      return;
    }
    console.log("load", id);
    (async () => {
      try {
        setState("loading");
        const blocks = await notion.blocks.children.list({
          block_id: id,
          page_size: 50,
        });
        setBlocks(blocks.results);
        setState("success");
      } catch (e) {
        console.error(e);
        setState("error");
      }
    })();
  }, [id]);

  useEffect(() => {
    reload();
  }, [id]);

  return { blocks, state, reload };
};

export const useScheduleList = (id: string) => {
  const [schedules, setSchedules] = useState<SchedulePageObject[]>([]);
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );

  const reload = useCallback(() => {
    if (id === "") {
      return;
    }
    console.log("load", id);
    (async () => {
      try {
        setState("loading");
        const databases = await notion.databases.query({
          database_id: id,
        });
        setSchedules(
          databases.results.filter(
            (page) => "properties" in page
          ) as SchedulePageObject[]
        );
        setState("success");
      } catch (e) {
        console.error(e);
        setState("error");
      }
    })();
  }, [id]);

  useEffect(() => {
    reload();
  }, [id]);

  return { schedules, state, reload };
};
