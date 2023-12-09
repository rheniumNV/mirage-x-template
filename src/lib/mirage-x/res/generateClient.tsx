import { Slot } from "neos-script";
import RawResFeedbackJson from "./static/ResFeedback.json";
import { DynamicValueVariable_T } from "neos-script/components/Data/Dynamic/DynamicValueVariable_T";

type ResObject = unknown;

const ResFeedbackJson = RawResFeedbackJson as {
  Object: ResObject;
  Assets: ResObject[];
  TypeVersions: { [key: string]: number };
};

const getObject = (object: any) =>
  object.Name.Data === "Holder" ? object.Children[0] : object;

const isAppRoot = (object: any) =>
  object.Components.Data.find(
    (c: any) => c.Type === "FrooxEngine.DynamicVariableSpace"
  )?.Data.SpaceName.Data === "AppRoot";

export const generateClient = ({
  appCode,
  hostCVPath,
  useSSLCVPath,
  cvOwnerId,
  fallbackHost,
  fallbackUseSSL,
  currentVersion,
  units,
}: {
  appCode: string;
  hostCVPath: string;
  useSSLCVPath: string;
  cvOwnerId: string;
  fallbackHost: string;
  fallbackUseSSL: boolean;
  currentVersion: string;
  units: {
    [key: string]: { [key: string]: () => void };
  };
}) => {
  const feedback = getObject(ResFeedbackJson.Object);

  const staticRootId = feedback.ID;
  const staticPackageId = feedback.Children.find((c: any) =>
    isAppRoot(c)
  ).Children.find((c: any) => c.Name.Data === "Package").ID;

  const feedbackDV = feedback.Children.find((c: any) => c.Name.Data === "DV");
  const feedbackDVChildren = feedbackDV.Children.filter(
    (c: any) => c.Name.Data !== "ENV"
  );
  const feedbackChildren = feedback.Children.filter(
    (c: any) => c.Name.Data !== "DV" && c.Name.Data !== "Package"
  );

  const Package = (
    <Slot id={staticPackageId} name="Package" active={false}>
      {Object.keys(units).map((key: any) => {
        return (
          <Slot name={key}>
            {
              //@ts-ignore
              Object.keys(units[key]).map((key2: any) => {
                //@ts-ignore
                const Unit = units[key][key2];
                return <Unit />;
              })
            }
          </Slot>
        );
      })}
    </Slot>
  );

  return (
    <Slot
      id={staticRootId}
      name={`${appCode}Root`}
      components={feedback.Components.Data}
      assets={Package.Assets}
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
              VariableName="Env.Host.CVPath"
              Value={hostCVPath}
            />,
            <DynamicValueVariable_T
              type={{
                T: { name: "[System.String, mscorlib]" },
              }}
              VariableName="Env.Host.Fallback"
              Value={fallbackHost}
            />,
            <DynamicValueVariable_T
              type={{ T: { name: "[System.String, mscorlib]" } }}
              VariableName="Env.UseSSL.CVPath"
              Value={useSSLCVPath}
            />,
            <DynamicValueVariable_T
              type={{ T: { name: "[System.String, mscorlib]" } }}
              VariableName="Env.CVOwnerID"
              Value={cvOwnerId}
            />,
            <DynamicValueVariable_T
              type={{
                T: { name: "[System.Boolean, mscorlib]" },
              }}
              VariableName="Env.UseSSL.Fallback"
              Value={fallbackUseSSL}
            />,
            <DynamicValueVariable_T
              type={{ T: { name: "[System.String, mscorlib]" } }}
              VariableName="Env.Version.Current"
              Value={currentVersion}
            />,
            <DynamicValueVariable_T
              type={{ T: { name: "[System.String, mscorlib]" } }}
              VariableName="Env.AppCode"
              Value={appCode}
            />,
            <DynamicValueVariable_T
              type={{ T: { name: "[System.Boolean, mscorlib]" } }}
              VariableName="Env._IsCompatibleWithGeneralHub"
              Value={true}
            />,
          ]}
        />
      </Slot>
      {feedbackChildren.map((o: any, index: number) => {
        if (isAppRoot(o)) {
          return {
            Object: {
              ...o,
              Name: { ...o.Name, Data: appCode },
              Children: [
                ...o.Children.filter((c: any) => c.Name.Data !== "Package"),
                Package.Object,
              ],
            },
            Assets: index === 0 ? ResFeedbackJson.Assets : [],
            TypeVersions: index === 0 ? ResFeedbackJson.TypeVersions : {},
          };
        }
        return {
          Object: o,
          Assets: index === 0 ? ResFeedbackJson.Assets : [],
          TypeVersions: index === 0 ? ResFeedbackJson.TypeVersions : {},
        };
      })}
    </Slot>
  );
};
