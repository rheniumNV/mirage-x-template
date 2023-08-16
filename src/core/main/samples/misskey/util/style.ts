import {
  createColor,
  createSprite,
  createStyle,
} from "../../../../lib/styledUnit";

export const { StyledSpace, Color, Sprite } = createStyle({
  Color: {
    background: createColor([0.83, 0.83, 0.83, 1]),
    white: createColor([0.92, 0.92, 0.92, 1]),
    black: createColor([0.27, 0.27, 0.27, 1]),
  },
  Sprite: {
    gradient: createSprite({
      url: "neosdb:///a533460140ea02f8eabadc756b8a8bd0233cddcf75c8ef253ed4cc1d69e253b4.webp",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
    }),
    gradient2: createSprite({
      url: "neosdb:///68f975dbbdadf8e71a883905c3a05facebf8d1bb93f7ca6915fb9abcfa6eff50.webp",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
    }),
    logo: createSprite({
      url: "neosdb:///4028494b50269de822a9f48216447f7bbde390c3f610699fb9409b33f68702cf.webp",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
    }),
    gradientGreen: createSprite({
      url: "neosdb:///ca054d38974a35107231ee3538b6888f9b6dbf0f3a4aa9d75d199739ca1a3135.png",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
    }),
    circle: createSprite({
      url: "neosdb:///427a01c03424b86b4b8ffba936e4eb6cbf4be4d6773fa1f45ec004cfb526d016.png",
      rect: [0, 0, 1, 1],
      borders: [0, 0, 0, 0],
      scale: 1,
    }),
    maru: createSprite({
      url: "neosdb:///427a01c03424b86b4b8ffba936e4eb6cbf4be4d6773fa1f45ec004cfb526d016.png",
      rect: [0, 0, 1, 1],
      borders: [0.5, 0.5, 0.5, 0.5],
      scale: 0.25,
    }),
    kadomaru: createSprite({
      url: "neosdb:///d8495d0372ef5bb0f9eec8ad864ebf7bf7f699e713176821e6ed0f7826b78091.png",
      rect: [1, 1, 1, 1],
      borders: [0.33333, 0.33333, 0.33333, 0.33333],
      scale: 0.1,
    }),
  },
});
