import { v4 as uuidv4 } from "uuid";
import { Slot } from "neos-script";
import { DetailBase, UnitConfig } from "../common";
import { DynamicReferenceVariable_T } from "neos-script/components/Data/Dynamic/DynamicReferenceVariable_T";
import { DynamicField_T } from "neos-script/components/Data/Dynamic/DynamicField_T";
import { DynamicValueVariable_T } from "neos-script/components/Data/Dynamic/DynamicValueVariable_T";
import { DynamicVariableSpace } from "neos-script/components/Data/Dynamic/DynamicVariableSpace";

type getNeosProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: string;
} & (C["children"] extends "multi" ? { children?: string } : {});

export const generateNeosUnit =
  <C extends DetailBase>({
    config,
    main: InnerComponent,
    outer: OuterComponent,
    option,
  }: {
    config: UnitConfig<C>;
    main: (props: getNeosProps<C>) => JSX.IntrinsicElements;
    outer?: (props: getNeosProps<C>) => JSX.IntrinsicElements;
    option?: {};
  }) =>
  ({}) => {
    const staticOuterRefId = uuidv4();
    const staticInnerMainChildrenParentId = uuidv4();

    const idList = config.syncPropConfigList.map((propConfig) => ({
      name: propConfig.name,
      id: uuidv4(),
      neosDVType: propConfig.neosDVType,
      dvMode: propConfig.dvMode,
    }));

    const dvs = idList.map(({ name, id, neosDVType, dvMode }) =>
      dvMode === "Field" ? (
        <DynamicField_T
          type={{ T: { name: neosDVType } }}
          VariableName={`Props.${name}`}
          TargetField={id}
        />
      ) : (
        <DynamicValueVariable_T
          type={{ T: { name: neosDVType } }}
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
    } as getNeosProps<C>;

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

type NeosJson = {
  Object: Slot;
  Assets: any[];
  TypeVersions: any[];
};

export const generateNeosUnitFromFeedback =
  <C extends DetailBase>({
    config,
    rawFeedback,
  }: {
    rawFeedback: any;
    config: UnitConfig<C>;
  }) =>
  () => {
    const feedback = (rawFeedback as NeosJson)?.Object.Children.find(
      (o: Slot) => o.Name.Data === config.code
    ) ?? { Name: { ID: uuidv4() }, Children: [] };

    console.log(feedback.Children.map((o: Slot) => o.Name.Data));

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

    console.log(
      staticInnerMainRootId,
      feedbackDVStatic?.Components.Data.find(
        (o: any) => o.Data.VariableName?.Data === "Static.Main"
      )
    );
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
      neosDVType: propConfig.neosDVType,
      dvMode: propConfig.dvMode,
    }));

    const dvs = idList.map(({ name, id, neosDVType, dvMode }) =>
      dvMode === "Field" ? (
        <DynamicField_T
          type={{ T: { name: neosDVType } }}
          VariableName={`Props.${name}`}
          TargetField={id}
        />
      ) : (
        <DynamicValueVariable_T
          type={{ T: { name: neosDVType } }}
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
