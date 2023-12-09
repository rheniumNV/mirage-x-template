import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  StyledDVColor,
  StyledDVFont,
  StyledDVSpace,
  StyledDVSprite,
  StyledDVUiTextUnlitMaterial,
  StyledDVUiUnlitMaterial,
} from "../../unit/package/StyledUnit/main";

const createId = () => uuidv4().replace(/-/g, "_");

type StyledColorConfig = {
  type: "Color";
  color: [number, number, number, number];
};

type StyledSpriteConfig = {
  type: "Sprite";
  url: string;
  rect?: [number, number, number, number];
  borders?: [number, number, number, number];
  scale?: number;
  filterMode?: "Bilinear" | "Trilinear" | "Anisotropic" | "Point";
  wrapModeU?: "Repeat" | "Clamp" | "Mirror" | "MirrorOnce";
  wrapModeV?: "Repeat" | "Clamp" | "Mirror" | "MirrorOnce";
};

type StyledUiUnlitMaterialConfig = {
  type: "UiUnlitMaterial";
  offsetFactor?: number;
  offsetUnits?: number;
  alphaCutoff?: number;
  alphaClip?: boolean;
  zWrite?: "Auto" | "On" | "Off";
};

type StyledUiTextUnlitMaterialConfig = {
  type: "UiTextUnlitMaterial";
  offsetFactor?: number;
  offsetUnits?: number;
  zWrite?: "Auto" | "On" | "Off";
};

type StyledMaterial =
  | StyledUiUnlitMaterialConfig
  | StyledUiTextUnlitMaterialConfig;

type StyledFontConfig = {
  type: "Font";
  urls: [
    string,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?
  ];
};

type StyledConfig = StyledColorConfig | StyledSpriteConfig;

export const createColor = (
  color: [number, number, number, number]
): StyledColorConfig => ({
  type: "Color",
  color,
});

export const createSprite = ({
  url,
  rect,
  borders,
  scale,
  filterMode,
  wrapModeU,
  wrapModeV,
}: {
  url: string;
  rect?: [number, number, number, number];
  borders?: [number, number, number, number];
  scale?: number;
  filterMode?: "Bilinear" | "Trilinear" | "Anisotropic" | "Point";
  wrapModeU?: "Repeat" | "Clamp" | "Mirror" | "MirrorOnce";
  wrapModeV?: "Repeat" | "Clamp" | "Mirror" | "MirrorOnce";
}): StyledSpriteConfig => ({
  type: "Sprite",
  url,
  rect,
  borders,
  scale,
  filterMode,
  wrapModeU,
  wrapModeV,
});

export const createUiUnlitMaterial = ({
  offsetFactor,
  offsetUnits,
  alphaCutoff,
  alphaClip,
  zWrite,
}: {
  offsetFactor?: number;
  offsetUnits?: number;
  alphaCutoff?: number;
  alphaClip?: boolean;
  zWrite?: "Auto" | "On" | "Off";
}): StyledUiUnlitMaterialConfig => ({
  type: "UiUnlitMaterial",
  offsetFactor,
  offsetUnits,
  alphaCutoff,
  alphaClip,
  zWrite,
});

export const createUiTextUnlitMaterial = ({
  offsetFactor,
  offsetUnits,
  zWrite,
}: {
  offsetFactor?: number;
  offsetUnits?: number;
  zWrite?: "Auto" | "On" | "Off";
}): StyledUiTextUnlitMaterialConfig => ({
  type: "UiTextUnlitMaterial",
  offsetFactor,
  offsetUnits,
  zWrite,
});

export const createFont = ({
  urls,
}: Omit<StyledFontConfig, "type">): StyledFontConfig => ({
  type: "Font",
  urls,
});

export type StyledColorVariable = {
  type: "Color";
  variableName: string;
};

export type StyledSpriteVariable = {
  type: "Sprite";
  variableName: string;
};

export type StyledMaterialVariable = {
  type: "UiUnlitMaterial" | "UiTextUnlitMaterial";
  variableName: string;
};

export type StyledFontVariable = {
  type: "Font";
  variableName: string;
};

export type StyledVariable =
  | StyledColorVariable
  | StyledSpriteVariable
  | StyledMaterialVariable
  | StyledFontVariable;

export const createStyle = <
  C extends { [key: string]: StyledColorConfig },
  S extends { [key: string]: StyledSpriteConfig },
  M extends { [key: string]: StyledMaterial },
  F extends { [key: string]: StyledFontConfig }
>(config: {
  Color?: C;
  Sprite?: S;
  Material?: M;
  Font?: F;
}): {
  StyledSpace: React.FC<{ children: React.ReactNode }>;
  Color: {
    [key in keyof C]: StyledColorVariable;
  };
  Sprite: {
    [key in keyof S]: StyledSpriteVariable;
  };
  Material: {
    [key in keyof M]: StyledMaterialVariable;
  };
  Font: {
    [key in keyof F]: StyledFontVariable;
  };
} => {
  const spaceName = createId();

  const colorVariables = Object.keys(config.Color ?? []).map(
    (key): { key: keyof C; variableName: string } & StyledColorConfig => ({
      ...(config.Color?.[key] ?? {
        type: "Color",
        color: [0, 0, 0, 0],
      }),
      variableName: `${spaceName}/${createId()}`,
      key,
    })
  );

  const spriteVariables = Object.keys(config.Sprite ?? []).map(
    (key): { key: keyof S; variableName: string } & StyledSpriteConfig => ({
      ...(config.Sprite?.[key] ?? {
        type: "Sprite",
        url: "",
      }),
      variableName: `${spaceName}/${createId()}`,
      key,
    })
  );

  const materialVariables = Object.keys(config.Material ?? []).map(
    (key): { key: keyof M; variableName: string } & StyledMaterial => ({
      ...(config.Material?.[key] ?? {
        type: "UiUnlitMaterial",
        offsetFactor: 0,
        offsetUnits: 0,
        alphaCutoff: 0,
        alphaClip: false,
        zWrite: "Auto",
      }),
      variableName: `${spaceName}/${createId()}`,
      key,
    })
  );

  const fontVariables = Object.keys(config.Font ?? []).map(
    (key): { key: keyof F; variableName: string } & StyledFontConfig => ({
      ...(config.Font?.[key] ?? {
        type: "Font",
        urls: ["", "", "", "", "", "", "", "", "", ""],
      }),
      variableName: `${spaceName}/${createId()}`,
      key,
    })
  );

  return {
    StyledSpace: ({ children }: { children: React.ReactNode }) => (
      <StyledDVSpace spaceName={spaceName}>
        {colorVariables.map((variable) => (
          <StyledDVColor
            key={variable.variableName}
            color={variable.color}
            name={variable.variableName}
          />
        ))}
        {spriteVariables.map((variable) => (
          <StyledDVSprite
            key={variable.variableName}
            url={variable.url}
            name={variable.variableName}
            rect={variable.rect}
            borders={variable.borders}
            scale={variable.scale}
            filterMode={variable.filterMode}
            wrapModeU={variable.wrapModeU}
            wrapModeV={variable.wrapModeV}
          />
        ))}
        {materialVariables.map((variable) => {
          switch (variable.type) {
            case "UiUnlitMaterial":
              return (
                <StyledDVUiUnlitMaterial
                  key={variable.variableName}
                  name={variable.variableName}
                  offsetFactor={variable.offsetFactor}
                  offsetUnits={variable.offsetUnits}
                  alphaCutoff={variable.alphaCutoff}
                  alphaClip={variable.alphaClip}
                  zWrite={variable.zWrite}
                />
              );
            case "UiTextUnlitMaterial":
              return (
                <StyledDVUiTextUnlitMaterial
                  key={variable.variableName}
                  name={variable.variableName}
                  offsetFactor={variable.offsetFactor}
                  offsetUnits={variable.offsetUnits}
                  zWrite={variable.zWrite}
                />
              );
          }
        })}
        {fontVariables.map((variable) => (
          <StyledDVFont
            key={variable.variableName}
            name={variable.variableName}
            url0={variable.urls[0]}
            url1={variable.urls[1]}
            url2={variable.urls[2]}
            url3={variable.urls[3]}
            url4={variable.urls[4]}
            url5={variable.urls[5]}
            url6={variable.urls[6]}
            url7={variable.urls[7]}
            url8={variable.urls[8]}
            url9={variable.urls[9]}
          />
        ))}
        {children}
      </StyledDVSpace>
    ),
    Color: colorVariables.reduce(
      (acc, variable) => (
        (acc[variable.key] = {
          type: variable.type,
          variableName: variable.variableName,
        }),
        acc
      ),
      {} as {
        [key in keyof C]: StyledColorVariable;
      }
    ),
    Sprite: spriteVariables.reduce(
      (acc, variable) => (
        (acc[variable.key] = {
          type: variable.type,
          variableName: variable.variableName,
        }),
        acc
      ),
      {} as {
        [key in keyof S]: StyledSpriteVariable;
      }
    ),
    Material: materialVariables.reduce(
      (acc, variable) => (
        (acc[variable.key] = {
          type: variable.type,
          variableName: variable.variableName,
        }),
        acc
      ),
      {} as {
        [key in keyof M]: StyledMaterialVariable;
      }
    ),
    Font: fontVariables.reduce(
      (acc, variable) => (
        (acc[variable.key] = {
          type: variable.type,
          variableName: variable.variableName,
        }),
        acc
      ),
      {} as {
        [key in keyof F]: StyledFontVariable;
      }
    ),
  };
};
