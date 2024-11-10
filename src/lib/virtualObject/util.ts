import { v4 as uuidv4 } from "uuid";
import { VirtualContext } from "./virtualContext";
import { VirtualSlot } from "./virtualSlot";

export const generateId = () => {
  return uuidv4();
};

export const processVirtualSlot = (
  slot: VirtualSlot,
  callback: (slot: VirtualSlot) => void,
) => {
  callback(slot);
  slot.children.forEach((child) => {
    processVirtualSlot(child, callback);
  });
};

export const processVirtualSlotWithPath = (
  slot: VirtualSlot,
  parentPath: string,
  callback: (slot: VirtualSlot, path: string) => void,
) => {
  const currentPath = `${parentPath}/${slot.name.data.data}`;
  callback(slot, currentPath);
  slot.children.forEach((child) => {
    processVirtualSlotWithPath(child, currentPath, callback);
  });
};

export const deleteHolder = (context: VirtualContext): VirtualContext => {
  if (
    context.object.name.data.data === "Holder" &&
    context.object.children[0]
  ) {
    context.setRootObject(context.object.children[0]);
  }
  return context;
};
