import { MirrorProps, unitConfig } from "./detail";

export const o = (props: MirrorProps) => {
  return (
    <div>
      {
        // @ts-ignore
        props.content
      }
    </div>
  );
};

export const web = { [unitConfig.code]: o };
