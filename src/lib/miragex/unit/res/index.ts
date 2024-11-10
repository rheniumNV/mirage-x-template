import {
  dynamicField,
  dynamicReferenceVariable,
  dynamicVariableSpace,
  ObjectContext,
  VirtualContext,
  FieldDataPrimitive,
} from "../../../virtualObject";
import { DetailBase, UnitConfig } from "../common";
import { emptyFeedback } from "./emptyFeedback";

export const generateResUnitFromFeedback = <C extends DetailBase>({
  config,
  rawFeedback,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawFeedback: any;
  config: UnitConfig<C>;
}): VirtualContext => {
  // フィードバックオブジェクトを特定。存在しなければ、テンプレを使う
  const { context: feedback, warnings: feedbackGenerateWarnings } =
    VirtualContext.generate(
      typeof rawFeedback["VersionNumber"] === "string"
        ? (rawFeedback as ObjectContext)
        : emptyFeedback,
    );
  if (feedbackGenerateWarnings.length > 0) {
    console.warn("feedbackGenerateWarnings", feedbackGenerateWarnings);
  }
  const feedbackDvRef = feedback.object.children
    .find((slot) => slot.name.asPrimitive() === "DV")
    ?.components.find(
      (component) =>
        component.type ===
          "[FrooxEngine]FrooxEngine.DynamicReferenceVariable<[FrooxEngine]FrooxEngine.Slot>" &&
        component.data.VariableName?.asPrimitive() === "Static.Ref",
    )?.data.Reference?.data;
  if (
    !(
      feedbackDvRef &&
      feedbackDvRef.type === "Slot" &&
      feedbackDvRef.data.type === "Ref" &&
      feedbackDvRef.data.target
    )
  ) {
    throw new Error("Feedback Ref not found");
  }
  const feedbackSlotRef = feedbackDvRef.data.target;
  const feedbackSlotDvProps = feedbackSlotRef.children.find(
    (slot) => slot.name.data.data === "DV/Props",
  );
  const feedbackSlotDvStatic = feedbackSlotRef.children.find(
    (slot) => slot.name.data.data === "DV/Static",
  );

  const feedbackDvMain = feedbackSlotDvStatic?.components.find(
    (component) => component.data.VariableName?.asPrimitive() === "Static.Main",
  )?.data.Reference?.data;
  if (
    !(
      feedbackDvMain &&
      feedbackDvMain.type === "Slot" &&
      feedbackDvMain.data.type === "Ref" &&
      feedbackDvMain.data.target
    )
  ) {
    throw new Error("Feedback Main not found");
  }
  const feedbackSlotMain = feedbackDvMain.data.target;
  if (!feedbackSlotMain) {
    throw new Error("Feedback Main not found");
  }
  const feedbackDvChildrenParent = feedbackSlotDvStatic?.components.find(
    (component) =>
      component.data.VariableName?.asPrimitive() === "Static.ChildrenParent",
  )?.data.Reference?.data;
  if (
    !(
      feedbackDvChildrenParent &&
      feedbackDvChildrenParent.type === "Slot" &&
      feedbackDvChildrenParent.data.type === "Ref" &&
      feedbackDvChildrenParent.data.target
    )
  ) {
    throw new Error("Feedback ChildrenParent not found");
  }
  const feedbackSlotChildrenParent = feedbackDvChildrenParent.data.target;

  // 新しいコンテキストを作る
  const { context, warnings: contextGenerateWarnings } =
    VirtualContext.createEmpty();
  if (contextGenerateWarnings.length > 0) {
    console.warn("contextGenerateWarnings", contextGenerateWarnings);
  }
  context.object.name.data.data = config.code;
  context.object.createComponent(dynamicVariableSpace({}));

  // DVを作る。中身はStatic.Refを設定。
  const slotDv = context.object.createChild({ name: "DV" });
  const dvStaticRef = slotDv.createComponent(
    dynamicReferenceVariable({
      type: "[FrooxEngine]FrooxEngine.Slot",
      variableName: "Static.Ref",
    }),
  ).data.Reference;
  if (!dvStaticRef) {
    throw new Error("dvStaticRef not found");
  }

  // Static.Refを作る。中身はDV/Static,DV/Props,Main
  const slotRef = context.object.createChild({ name: "Ref" });
  slotRef.createComponent(dynamicVariableSpace({}));
  feedbackSlotMain.setParent(slotRef);
  dvStaticRef.data = {
    type: "Slot",
    data: { type: "Ref", target: slotRef },
  };

  // DV/StaticとDV/Props以外のSlotもRefに入れる
  feedbackSlotRef.children.forEach((slot) => {
    if (
      slot !== feedbackSlotMain &&
      slot.name.data.data !== "DV/Props" &&
      slot.name.data.data !== "DV/Static"
    ) {
      slot.setParent(slotRef);
    }
  });

  // DV/Staticを作る。
  const slotDvStatic = slotRef.createChild({ name: "DV/Static" });

  // DV/Staticの中身を作る
  // Static.Rootを作る。これに本体のリンクを入れる
  const slotDvStaticRootSlotDVReference = slotDvStatic.createComponent(
    dynamicReferenceVariable({
      type: "[FrooxEngine]FrooxEngine.Slot",
      variableName: "Static.Root",
    }),
  ).data.Reference;
  if (!slotDvStaticRootSlotDVReference) {
    throw new Error("slotDvStaticRootSlotDVReference not found");
  }
  slotDvStaticRootSlotDVReference.data = {
    type: "Slot",
    data: { type: "Ref", target: slotRef },
  };

  // Static.Mainを作る。
  const slotDvStaticMainSlotDVReference = slotDvStatic.createComponent(
    dynamicReferenceVariable({
      type: "[FrooxEngine]FrooxEngine.Slot",
      variableName: "Static.Main",
    }),
  ).data.Reference;
  if (!slotDvStaticMainSlotDVReference) {
    throw new Error("slotDvStaticMainSlotDVReference not found");
  }
  slotDvStaticMainSlotDVReference.data = {
    type: "Slot",
    data: { type: "Ref", target: feedbackSlotMain },
  };
  // Static.ChildrenParentを作る。
  const slotDvStaticChildrenParentSlotDVReference =
    slotDvStatic.createComponent(
      dynamicReferenceVariable({
        type: "[FrooxEngine]FrooxEngine.Slot",
        variableName: "Static.ChildrenParent",
      }),
    ).data.Reference;

  if (!slotDvStaticChildrenParentSlotDVReference) {
    throw new Error("slotDvStaticChildrenParentSlotDVReference not found");
  }
  slotDvStaticChildrenParentSlotDVReference.data = {
    type: "Slot",
    data: { type: "Ref", target: feedbackSlotChildrenParent },
  };

  // フィードバックの値で上書きする場所。Static.MainとStatic.ChildrenParent
  // DV/Propsを作る。中身はPropsの値。フィードバックに値があれば上書き
  const slotDvProps = slotRef.createChild({ name: "DV/Props" });
  const feedbackProps = feedbackSlotDvProps?.components
    .filter((component) =>
      component.type.startsWith("[FrooxEngine]FrooxEngine.DynamicField<"),
    )
    .reduce(
      (acc, component) => {
        const variableName = component.data.VariableName?.asPrimitive() as
          | string
          | null;
        const value =
          component.data["TargetField"]?.data ??
          component.data["TargetReference"]?.data;
        return {
          ...acc,
          ...(variableName ? { [variableName]: value } : {}),
        };
      },
      {} as { [key: string]: unknown },
    );
  config.syncPropConfigList.forEach((propConfig) => {
    const feedbackValue = feedbackProps?.[`Props.${propConfig.name}`];
    const dvField = slotDvProps.createComponent(
      dynamicField({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        type: propConfig.resDVType,
        variableName: `Props.${propConfig.name}`,
      }),
    );
    if (dvField.data.TargetField && feedbackValue) {
      dvField.data.TargetField.data = feedbackValue as FieldDataPrimitive;
    }
    if (dvField.data.TargetReference && feedbackValue) {
      dvField.data.TargetReference.data = feedbackValue as FieldDataPrimitive;
    }
  });

  return context;
};
