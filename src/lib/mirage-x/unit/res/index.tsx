import { v4 as uuidv4 } from "uuid";
import { Slot } from "neos-script";
import { DetailBase, UnitConfig } from "../common";
import { DynamicReferenceVariable_T } from "neos-script/components/Data/Dynamic/DynamicReferenceVariable_T";
import { DynamicField_T } from "neos-script/components/Data/Dynamic/DynamicField_T";
import { DynamicValueVariable_T } from "neos-script/components/Data/Dynamic/DynamicValueVariable_T";
import { DynamicVariableSpace } from "neos-script/components/Data/Dynamic/DynamicVariableSpace";

type getResProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: string;
} & (C["children"] extends "multi" ? { children?: string } : {});

export const generateResUnit =
  <C extends DetailBase>({
    config,
    main: InnerComponent,
    outer: OuterComponent,
    option,
  }: {
    config: UnitConfig<C>;
    main: (props: getResProps<C>) => JSX.IntrinsicElements;
    outer?: (props: getResProps<C>) => JSX.IntrinsicElements;
    option?: {};
  }) =>
  ({}) => {
    const staticOuterRefId = uuidv4();
    const staticInnerMainChildrenParentId = uuidv4();

    const idList = config.syncPropConfigList.map((propConfig) => ({
      name: propConfig.name,
      id: uuidv4(),
      resDVType: propConfig.resDVType,
      dvMode: propConfig.dvMode,
    }));

    const dvs = idList.map(({ name, id, resDVType: resDVType, dvMode }) =>
      dvMode === "Field" ? (
        <DynamicField_T
          type={{ T: { name: resDVType } }}
          VariableName={`Props.${name}`}
          TargetField={id}
        />
      ) : (
        <DynamicValueVariable_T
          type={{ T: { name: resDVType } }}
          VariableName={`Props.${name}`}
        />
      )
    );

    const compProps = {
      ...idList.reduce(
        (acc, { name, id }) => ({
          ...acc,
          [name]: id,
        }),
        {} as { [key: string]: string }
      ),
      children: staticInnerMainChildrenParentId,
    } as getResProps<C>;

    const innerComponent = <InnerComponent {...compProps} />;

    const staticInnerMainRootId = innerComponent.Object.ID;

    return (
      <Slot name={config.code} components={[<DynamicVariableSpace />]}>
        <Slot
          name="DV"
          components={[
            <DynamicReferenceVariable_T
              type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
              VariableName={"Static.Ref"}
              Reference={staticOuterRefId}
            />,
          ]}
        />
        <Slot
          id={staticOuterRefId}
          name={"Ref"}
          components={[<DynamicVariableSpace />]}
        >
          <Slot
            name="DV/Static"
            components={[
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Root"}
                Reference={staticOuterRefId}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Main"}
                Reference={staticInnerMainRootId}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.ChildrenParent"}
                Reference={staticInnerMainChildrenParentId}
              />,
            ]}
          />
          <Slot name="DV/Props" components={dvs} />
          {innerComponent}
        </Slot>
        {OuterComponent ? <OuterComponent {...compProps} /> : []}
      </Slot>
    );
  };

type Slot = {
  ID: string;
  Name: {
    ID: string;
    Data: string;
  };
  Children: Slot[];
  Components: {
    ID: string;
    Data: any[];
  };
};

type ResJson = {
  Object: Slot;
  Assets: any[];
  TypeVersions: any[];
};

export const generateResUnitFromFeedback =
  <C extends DetailBase>({
    config,
    rawFeedback,
  }: {
    rawFeedback: any;
    config: UnitConfig<C>;
  }) =>
  () => {
    const feedback = (rawFeedback as ResJson)?.Object ?? {
      Name: { ID: uuidv4() },
      Children: [],
    };

    const feedbackRef = feedback.Children.find(
      (o: Slot) => o.Name.Data === "Ref"
    );
    const feedbackDV = feedback.Children.find(
      (o: Slot) => o.Name.Data === "DV"
    );
    const feedbackDVStatic = feedbackRef?.Children.find(
      (o: Slot) => o.Name.Data === "DV/Static"
    );
    const feedbackDVProps = feedbackRef?.Children.find(
      (o: Slot) => o.Name.Data === "DV/Props"
    );
    const feedbackOuters =
      feedbackDV?.Children.filter(
        (o: Slot) => !["Ref"].includes(o.Name.Data)
      ) ?? [];

    const staticOuterRefId = uuidv4();
    const staticInnerMainRootId =
      feedbackDVStatic?.Components.Data.find(
        (o: any) => o.Data.VariableName?.Data === "Static.Main"
      )?.Data.Reference.Data ?? uuidv4();
    const staticInnerMainChildrenParentId =
      feedbackDVStatic?.Components.Data.find(
        (o: any) => o.Data.VariableName.Data === "Static.ChildrenParent"
      )?.Data.Reference.Data ?? staticInnerMainRootId;

    const feedbackMain =
      feedback.Children.find((o: any) => o.Name.Data === "Ref")?.Children.find(
        (o: any) => o.ID === staticInnerMainRootId
      ) ?? (<Slot id={staticInnerMainRootId} name="Main" />).Object;

    const idList = config.syncPropConfigList.map((propConfig) => ({
      name: propConfig.name,
      id:
        feedbackDVProps?.Components.Data.find(
          (o: any) => o.Data.VariableName?.Data === `Props.${propConfig.name}`
        )?.Data[propConfig.dvMode === "Field" ? "TargetField" : "Value"]
          ?.Data ?? uuidv4(),
      resDVType: propConfig.resDVType,
      dvMode: propConfig.dvMode,
    }));

    const dvs = idList.map(({ name, id, resDVType: resDVType, dvMode }) =>
      dvMode === "Field" ? (
        <DynamicField_T
          type={{ T: { name: resDVType } }}
          VariableName={`Props.${name}`}
          TargetField={id}
        />
      ) : (
        <DynamicValueVariable_T
          type={{ T: { name: resDVType } }}
          VariableName={`Props.${name}`}
        />
      )
    );

    return (
      <Slot name={config.code} components={[<DynamicVariableSpace />]}>
        <Slot
          name="DV"
          components={[
            <DynamicReferenceVariable_T
              type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
              VariableName={"Static.Ref"}
              Reference={staticOuterRefId}
            />,
          ]}
        />
        <Slot
          id={staticOuterRefId}
          name={"Ref"}
          components={[<DynamicVariableSpace />]}
        >
          <Slot
            name="DV/Static"
            components={[
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Root"}
                Reference={staticOuterRefId}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Main"}
                Reference={staticInnerMainRootId}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.ChildrenParent"}
                Reference={staticInnerMainChildrenParentId}
              />,
            ]}
          />
          <Slot name="DV/Props" components={dvs} />
          {feedbackMain && (
            <raw
              json={{
                Object: feedbackMain,
                Assets: rawFeedback.Assets,
                TypeVersions: rawFeedback.TypeVersions,
              }}
            />
          )}
        </Slot>
        {feedbackOuters.map((outer: any) => (
          <raw
            json={{
              Object: outer,
            }}
          />
        ))}
      </Slot>
    );
  };
