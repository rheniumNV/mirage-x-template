import { MirrorProps, unitConfig } from "./detail";

export const o = (props: MirrorProps) => {
  return (
    <div style={{ color: `${props.defaultColor}` }}>
      {
        //@ts-ignore
        props.children
      }
    </div>
  );
};

export const web = { [unitConfig.code]: o };
