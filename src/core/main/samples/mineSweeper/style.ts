import {
  createColor,
  createSprite,
  createStyle,
} from "../../../lib/styledUnit";

export const { StyledSpace, Color, Sprite } = createStyle({
  Color: {
    background: createColor([0.2, 0.2, 0.2, 1]),
    backgroundRev: createColor([0.8, 0.8, 0.8, 1]),
    buttonNormal: createColor([0.4, 0.4, 0.4, 1]),
    buttonNormalRev: createColor([0.8, 0.8, 0.8, 1]),
  },
  Sprite: {
    kadomaru: createSprite({
      url: "neosdb:///d8495d0372ef5bb0f9eec8ad864ebf7bf7f699e713176821e6ed0f7826b78091.png",
      rect: [1, 1, 1, 1],
      borders: [0.33333, 0.33333, 0.33333, 0.33333],
      scale: 0.1,
    }),
  },
});
