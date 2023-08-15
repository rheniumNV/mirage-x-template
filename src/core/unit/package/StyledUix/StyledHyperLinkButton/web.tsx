import { MirrorProps, unitConfig } from "./detail";

export const o = (props: MirrorProps) => {
  return (
    <div>
      {
        //@ts-ignore
        props.children
      }
    </div>
  );
};

export const web = { [unitConfig.code]: o };
