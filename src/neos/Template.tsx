import { v4 as uuidv4 } from "uuid";
import { Slot } from "neos-script";
import { DynamicVariableSpace } from "neos-script/components/Data/Dynamic/DynamicVariableSpace";
import { DynamicReferenceVariable_T } from "neos-script/components/Data/Dynamic/DynamicReferenceVariable_T";
import { DynamicField_T } from "neos-script/components/Data/Dynamic/DynamicField_T";
import { DynamicReference_T } from "neos-script/components/Data/Dynamic/DynamicReference_T";
import { Grabbable } from "neos-script/components/Transform/Interaction/Grabbable";
import { WebsocketClient } from "neos-script/components/Network/WebsocketClient";
import NeosFeedbackJson from "./static/NeosFeedback.json";
import { DynamicValueVariable_T } from "neos-script/components/Data/Dynamic/DynamicValueVariable_T";

const getObject = (object: any) =>
  object.Name.Data === "Holder" ? object.Children[0] : object;

const funcSlotJson = {
  Object: getObject(NeosFeedbackJson.Object)
    .Children.find((c: any) => c.Name.Data === "System")
    ?.Children.find((c: any) => c.Name.Data === "Func"),
};

const debugSlotJson = {
  Object: getObject(NeosFeedbackJson.Object).Children.find(
    (c: any) => c.Name.Data === "Debug"
  ),
};

export const Template = ({
  apiHost,
  useSSL,
  version,
  children,
}: {
  apiHost: string;
  useSSL: boolean;
  version: string;
  children: JSX.IntrinsicElements[];
}) => {
  const feedback = getObject(NeosFeedbackJson.Object);

  const staticRootId = feedback.ID;
  const staticPackageId = feedback.Children.find(
    (c: any) => c.Name.Data === "Package"
  ).ID;

  const feedbackDV = feedback.Children.find((c: any) => c.Name.Data === "DV");
  const feedbackDVChildren = feedbackDV.Children.filter(
    (c: any) => c.Name.Data !== "ENV"
  );
  const feedbackSystem = feedback.Children.find(
    (c: any) => c.Name.Data === "System"
  );
  const feedbackWS = feedback.Children.find((c: any) => c.Name.Data === "WS");
  const feedbackRefList = feedback.Children.find(
    (c: any) => c.Name.Data === "RefList"
  );
  const feedbackObjectRoot = feedback.Children.find(
    (c: any) => c.Name.Data === "ObjectRoot"
  );
  const feedbackDebug = feedback.Children.find(
    (c: any) => c.Name.Data === "Debug"
  );

  return (
    <Slot
      id={staticRootId}
      name="MirageX"
      components={[<Grabbable />, <DynamicVariableSpace SpaceName={"MX"} />]}
    >
      <Slot name="DV">
        {feedbackDVChildren.map((c: any) => ({
          Object: c,
          Assets: [],
          TypeVersions: {},
        }))}
        <Slot
          name="ENV"
          components={[
            <DynamicValueVariable_T
              type={{ T: { name: "[System.String, mscorlib]" } }}
              VariableName="Static.Web.Host"
              Value={apiHost}
            />,
            <DynamicValueVariable_T
              type={{
                T: { name: "[System.Boolean, mscorlib]" },
              }}
              VariableName="Static.Web.UseSSL"
              Value={useSSL}
            />,
            <DynamicValueVariable_T
              type={{ T: { name: "[System.String, mscorlib]" } }}
              VariableName="Static.Hub.Version"
              Value={version}
            />,
          ]}
        />
      </Slot>
      {{
        Object: feedbackSystem,
        Assets: NeosFeedbackJson.Assets,
        TypeVersions: NeosFeedbackJson.TypeVersions,
      }}
      {{ Object: feedbackWS, Assets: [], TypeVersions: {} }}
      <Slot id={staticPackageId} name="Package" active={false}>
        {children}
      </Slot>
      {{ Object: feedbackRefList, Assets: [], TypeVersions: {} }}
      {{ Object: feedbackObjectRoot, Assets: [], TypeVersions: {} }}
      {{ Object: feedbackDebug, Assets: [], TypeVersions: {} }}
    </Slot>
  );
};

export const TemplateOld = ({
  children,
}: {
  children: JSX.IntrinsicElements[];
}) => {
  const staticRootId = uuidv4();
  const staticPackageId = uuidv4();
  const staticSystemId = uuidv4();
  const staticObjectRootId = uuidv4();
  const staticRefListId = uuidv4();
  const staticWSDataId = uuidv4();

  const websocketClient = WebsocketClient({
    HandlingUser: { isRaw: true, ID: uuidv4(), User: { ID: uuidv4() } },
  });

  const funcSlot = <raw json={funcSlotJson} />;
  const debugSlot = debugSlotJson.Object ? (
    <raw json={debugSlotJson} />
  ) : (
    <Slot name="Debug" />
  );

  return (
    <Slot
      id={staticRootId}
      name="MirageX"
      components={[<Grabbable />, <DynamicVariableSpace SpaceName={"MX"} />]}
    >
      <Slot name="DV">
        <Slot
          name="Static"
          components={[
            <DynamicReferenceVariable_T
              type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
              VariableName={"Static.Root"}
              Reference={staticRootId}
            />,
          ]}
        >
          <Slot
            name="System"
            components={[
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.System"}
                Reference={staticSystemId}
              />,
              ...funcSlot.Object.Children.map((child: any) => {
                switch (child.Name.Data) {
                  case "Func.ResolveEvent":
                    const target = child.Children.find(
                      (c: any) =>
                        c.Name.Data ===
                        "Dynamic Impulse Receiver With Value<Slot>"
                    );
                    return (
                      <DynamicReferenceVariable_T
                        type={{
                          T: { name: "[FrooxEngine.Slot, FrooxEngine]" },
                        }}
                        VariableName={`Static.System.${child.Name.Data}`}
                        Reference={target.ID}
                      />
                    );
                  default:
                    return (
                      <DynamicReferenceVariable_T
                        type={{
                          T: { name: "[FrooxEngine.Slot, FrooxEngine]" },
                        }}
                        VariableName={`Static.System.${child.Name.Data}`}
                        Reference={child.ID}
                      />
                    );
                }
              }),
            ]}
          ></Slot>
          <Slot
            name="WS"
            components={[
              <DynamicReferenceVariable_T
                type={{
                  T: { name: "[FrooxEngine.WebsocketClient, FrooxEngine]" },
                }}
                VariableName={"Static.WS.Client"}
                Reference={websocketClient.Data.ID}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.WS.Data"}
                Reference={staticWSDataId}
              />,
            ]}
          />
          <Slot
            name="Unit"
            components={[
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Unit.Package"}
                Reference={staticPackageId}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Unit.ObjectRoot"}
                Reference={staticObjectRootId}
              />,
              <DynamicReferenceVariable_T
                type={{ T: { name: "[FrooxEngine.Slot, FrooxEngine]" } }}
                VariableName={"Static.Unit.RefList"}
                Reference={staticRefListId}
              />,
            ]}
          />
        </Slot>
        <Slot name="State">
          <Slot
            name="WS"
            components={[
              <DynamicField_T
                type={{
                  T: { name: "[System.Uri, System]" },
                }}
                VariableName={"State.WS.Url"}
                TargetField={websocketClient.Data.URL.ID}
              />,
              <DynamicReference_T
                type={{
                  T: { name: "[FrooxEngine.User, FrooxEngine]" },
                }}
                VariableName={"State.WS.Owner"}
                TargetReference={websocketClient.Data.HandlingUser.User.ID}
              />,
              <DynamicField_T
                type={{
                  T: { name: "[System.Boolean, mscorlib]" },
                }}
                VariableName={"State.WS.IsConnected"}
                TargetField={websocketClient.Data.IsConnected.ID}
              />,
            ]}
          />
        </Slot>
        <Slot name="Data">
          <Slot
            id={staticWSDataId}
            name="WSData"
            components={[<DynamicVariableSpace SpaceName={"Data"} />]}
          ></Slot>
        </Slot>
      </Slot>
      <Slot id={staticSystemId} name="System">
        {funcSlot}
      </Slot>
      <Slot name="WS" components={[websocketClient]} />
      <Slot id={staticPackageId} name="Package" active={false}>
        {children}
      </Slot>
      <Slot id={staticRefListId} name="RefList"></Slot>
      <Slot id={staticObjectRootId} name="ObjectRoot" />
      {debugSlot}
    </Slot>
  );
};
