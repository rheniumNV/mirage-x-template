import { useMemo } from "react";
import { VerticalLayout } from "../../../../unit/package/PrimitiveUix/main";
import { StyledScrollArea } from "../../../../unit/package/StyledUix/main";
import { Note } from "../util/type";
import { NoteView } from "./note";

export const Timeline = ({ notes }: { notes: Note[] }) => {
  const limitedNotes = useMemo(() => notes.slice(0, 30), [notes]);

  return (
    <StyledScrollArea verticalFit="PreferredSize">
      <VerticalLayout
        forceExpandChildHeight={false}
        paddingTop={50}
        paddingBottom={50}
        paddingLeft={25}
        paddingRight={25}
        spacing={5}
      >
        {limitedNotes.map((note, index) => (
          <NoteView key={index} note={note} />
        ))}
      </VerticalLayout>
    </StyledScrollArea>
  );
};
