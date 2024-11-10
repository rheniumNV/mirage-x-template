import { VirtualComponentProps } from "../virtualSlot";

export const grabbable = (props: {
  enabled?: boolean;
  scalable?: boolean;
}): VirtualComponentProps => ({
  type: "[FrooxEngine]FrooxEngine.Grabbable",
  typeVersion: 2,
  data: {
    UpdateOrder: {
      type: "Primitive",
      data: 0,
    },
    Enabled: {
      type: "Primitive",
      data: props.enabled ?? true,
    },
    ReparentOnRelease: {
      type: "Primitive",
      data: true,
    },
    PreserveUserSpace: {
      type: "Primitive",
      data: true,
    },
    DestroyOnRelease: {
      type: "Primitive",
      data: false,
    },
    GrabPriority: {
      type: "Primitive",
      data: 0,
    },
    GrabPriorityWhenGrabbed: {
      type: "Primitive",
      data: 0,
    },
    CustomCanGrabCheck: {
      type: "Raw",
      raw: {
        data: {
          Target: null,
        },
      },
    },
    EditModeOnly: {
      type: "Primitive",
      data: false,
    },
    AllowSteal: {
      type: "Primitive",
      data: false,
    },
    DropOnDisable: {
      type: "Primitive",
      data: true,
    },
    ActiveUserFilter: {
      type: "Primitive",
      data: "Disabled",
    },
    OnlyUsers: {
      type: "FieldList",
      data: [],
    },
    Scalable: {
      type: "Primitive",
      data: props.scalable ?? false,
    },
    Receivable: {
      type: "Primitive",
      data: true,
    },
    AllowOnlyPhysicalGrab: {
      type: "Primitive",
      data: false,
    },
    _grabber: { type: "Primitive", data: null },
    _lastParent: {
      type: "Primitive",
      data: null,
    },
    _lastParentIsUserSpace: {
      type: "Primitive",
      data: false,
    },
  },
  legacyData: {
    "__legacyActiveUserRootOnly-ID": "0000002e-0000-0000-0000-000000000000",
  },
});
