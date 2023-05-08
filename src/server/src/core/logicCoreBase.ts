import { VirtualUnit } from "../../../common/types";

export abstract class LogicCoreBase {
  frameRate: number = 5;
  updatable: boolean = true;
  render: () => any = () => {};

  abstract emitEvent(event: unknown): void;
  abstract update(deltaTime: number): void;
  abstract draw(): VirtualUnit;
}
