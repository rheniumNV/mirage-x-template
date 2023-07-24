import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  StyledDVColor,
  StyledDVSpace,
  StyledDVSprite,
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
}: {
  url: string;
  rect?: [number, number, number, number];
  borders?: [number, number, number, number];
  scale?: number;
}): StyledSpriteConfig => ({
  type: "Sprite",
  url,
  rect,
  borders,
  scale,
});

export type StyledColorVariable = {
  type: "Color";
  variableName: string;
};

export type StyledSpriteVariable = {
  type: "Sprite";
  variableName: string;
};

export type StyledVariable = StyledColorVariable | StyledSpriteVariable;

export const createStyle = <
  C extends { [key: string]: StyledColorConfig },
  S extends { [key: string]: StyledSpriteConfig }
>(config: {
  Color?: C;
  Sprite?: S;
}): {
  StyledSpace: React.FC<{ children: React.ReactNode }>;
  Color: {
    [key in keyof C]: StyledColorVariable;
  };
  Sprite: {
    [key in keyof S]: StyledSpriteVariable;
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
  };
};
