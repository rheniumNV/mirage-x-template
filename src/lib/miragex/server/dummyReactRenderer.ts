import Reconciler from "react-reconciler";

const emptyObject = {};
Object.freeze(emptyObject);

type DummyInstance = object;

const dummyInstance: DummyInstance = {};

type DummyTextInstance = object;
const dummyTextInstance: DummyTextInstance = {};

type DummyContext = object;

const TinyDOMRenderer = Reconciler({
  supportsMutation: false,
  supportsHydration: false,
  supportsPersistence: false,
  isPrimaryRenderer: true,
  createInstance: (
    _type: string,
    _props: object,
    _rootContainer: DummyInstance,
    _hostContext: DummyContext,
  ) => dummyInstance,
  createTextInstance: () => dummyTextInstance,
  finalizeInitialChildren: () => false,
  appendInitialChild: () => {},
  prepareForCommit: () => null,
  resetAfterCommit: () => {},
  getChildHostContext: () => emptyObject,
  getRootHostContext: () => emptyObject,
  shouldSetTextContent: () => false,
  scheduleTimeout: () => {},
  cancelTimeout: () => {},
  noTimeout: () => {},
  getInstanceFromNode: (_node: DummyInstance) => null, //?
  getCurrentEventPriority: () => 0,
  getInstanceFromScope: () => dummyInstance,
  getPublicInstance: (ins: DummyInstance) => ins,
  prepareUpdate: () => {},
  preparePortalMount: () => {},
  prepareScopeUpdate: () => {},
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  detachDeletedInstance: () => {},
});

export const DummyReactRenderer = {
  render(element: React.ReactElement) {
    const newRoot = TinyDOMRenderer.createContainer(
      dummyInstance,
      0,
      null,
      true,
      null,
      "",
      (err: Error) => {
        console.error(err);
      },
      {},
    );
    TinyDOMRenderer.updateContainer(element, newRoot, null);
    return newRoot;
  },
};
