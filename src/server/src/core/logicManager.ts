import { VirtualUnit } from "../../../common/types";
import { LogicCoreBase } from "./logicCoreBase";

export class LogicManager {
  logic: LogicCoreBase;
  render: (data: VirtualUnit) => any;

  constructor(init: {
    logic: LogicCoreBase;
    render: (data: VirtualUnit) => any;
  }) {
    this.logic = init.logic;
    this.render = init.render;
    this.logic.render = this.draw4Web.bind(this);
  }
  emitEvent(event: unknown) {
    this.logic.emitEvent(event);
    this.draw4Web();
  }

  draw4Web() {
    this.render(this.logic.draw());
  }

  close() {}
}
