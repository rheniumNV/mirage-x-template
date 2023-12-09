import {
  UnitProp,
  generateUnitConfig,
  getMainProps,
  getMirrorProps,
  getWebProps,
} from "../../../../../lib/mirage-x/unit/common";

const detail = {
  code: "StyledUnit/StyledDVFont",
  propsConfig: {
    name: UnitProp.String("Name"),
    url0: UnitProp.Uri(""),
    url1: UnitProp.Uri(""),
    url2: UnitProp.Uri(""),
    url3: UnitProp.Uri(""),
    url4: UnitProp.Uri(""),
    url5: UnitProp.Uri(""),
    url6: UnitProp.Uri(""),
    url7: UnitProp.Uri(""),
    url8: UnitProp.Uri(""),
    url9: UnitProp.Uri(""),
  },
  children: "multi" as const,
};

export type MainProps = getMainProps<typeof detail>;
export type MirrorProps = getMirrorProps<typeof detail>;
export type WebProps = getWebProps<typeof detail>;
export const unitConfig = generateUnitConfig(detail);
