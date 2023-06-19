import { LayoutElement, Text } from "../../../../unit/package/standardUix/main";
import { useScheduleList } from "../hooks/notionApi";
import Config from "../config/config.private.json";

export const ScheduleSelector = ({ start }: { start: Date }) => {
  const { schedules } = useScheduleList(Config.notionScheduleDatabaseId);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <>
      {schedules.map((page) => {
        const name = page.properties.名前.title
          .map((v) => v.plain_text)
          .join("");
        const startDateTimeString = page.properties.日付.date?.start;
        const startDateTime = startDateTimeString
          ? new Date(startDateTimeString)
          : undefined;

        const formatDateTime = (date: Date) => {
          return `${
            date.getMonth() + 1
          }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        };

        return (
          <Text
            content={`${name} ${
              startDateTime ? formatDateTime(startDateTime) : ""
            }`}
          />
        );
      })}
    </>
  );
};
