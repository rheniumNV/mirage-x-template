import { v4 as uuidv4 } from "uuid";
import { Slot } from "neos-script";
import { DetailBase, UnitConfig } from "../common";
import { DynamicReferenceVariable_T } from "neos-script/components/Data/Dynamic/DynamicReferenceVariable_T";
import { DynamicField_T } from "neos-script/components/Data/Dynamic/DynamicField_T";
import { DynamicValueVariable_T } from "neos-script/components/Data/Dynamic/DynamicValueVariable_T";
import { DynamicVariableSpace } from "neos-script/components/Data/Dynamic/DynamicVariableSpace";

type getNeosProps<C extends DetailBase> = {
  [K in keyof C["propsConfig"]]: string;
} & (C["children"] extends "multi" ? { children?: string } : {}) & {
    root: string;
  };

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
    option?: {
      isRootChildrenParent?: boolean;
    };
  }) =>
  ({}) => {
    const staticOuterRefId = uuidv4();
    const staticInnerMainRootId = uuidv4();
    const staticInnerMainChildrenParentId = option?.isRootChildrenParent
      ? staticInnerMainRootId
      : uuidv4();

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
      root: staticInnerMainRootId,
    } as getNeosProps<C>;

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
          <InnerComponent {...compProps} />
        </Slot>
        {OuterComponent ? <OuterComponent {...compProps} /> : []}
      </Slot>
    );
  };
