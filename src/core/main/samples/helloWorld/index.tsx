import { Canvas, Image, Text } from "../../../unit/package/standardUix/main";

export const App = () => {
  return (
    <Canvas size={[1000, 1000]}>
      <Image tint={[0.5, 0.5, 0.5, 1]} />
      <Text content="HelloWorld!" />
    </Canvas>
  );
};
