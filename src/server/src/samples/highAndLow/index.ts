import { VirtualUnit } from "../../../../common/types";
import { LogicCoreBase } from "../../core/logicCoreBase";

export class HighAndLowGame extends LogicCoreBase {
  override updatable: boolean = false;
  private score: number;
  private currentNumber: number;
  private hiddenNumber: number;

  constructor() {
    super();
    this.score = 0;
    this.currentNumber = Math.floor(Math.random() * 100);
    this.hiddenNumber = Math.floor(Math.random() * 100);
  }

  override update(deltaTime: number) {}

  override emitEvent(event: { type: "select"; data: "high" | "low" }) {
    if (event.type === "select") {
      if (event.data === "high") {
        if (this.currentNumber < this.hiddenNumber) {
          this.score++;
        } else {
          this.score--;
        }
      } else {
        if (this.currentNumber > this.hiddenNumber) {
          this.score++;
        } else {
          this.score--;
        }
      }
      this.currentNumber = Math.floor(Math.random() * 100);
      this.hiddenNumber = Math.floor(Math.random() * 100);
    }
    this.render();
  }

  override draw(): VirtualUnit {
    return {
      code: "VerticalLayout",
      props: {
        Padding: {
          type: "float",
          value: "10",
        },
      },
      children: [
        {
          code: "Text",
          props: {
            Content: { type: "string", value: `Score: ${this.currentNumber}` },
          },
          children: [],
        },
        {
          code: "HorizontalLayout",
          props: {
            Padding: {
              type: "float",
              value: "10",
            },
          },
          children: [
            {
              code: "Button",
              props: {
                Content: { type: "string", value: "High" },
                OnClick: { type: "string", value: "high" },
              },
              children: [],
            },
            {
              code: "Button",
              props: {
                Content: { type: "string", value: "Low" },
                OnClick: { type: "string", value: "low" },
              },
              children: [],
            },
          ],
        },
      ],
    };
  }
}
