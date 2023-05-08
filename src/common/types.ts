type VirtualType = "string" | "int" | "float";

type VirtualField = { type: VirtualType; value: string };

export type VirtualUnit = {
  code: string;
  props: { [key: string]: VirtualField };
  children: VirtualUnit[];
};

export type SyncUnit = {
  id: string;
  code: string;
  parentId?: string;
  props: { [key: string]: VirtualField };
};

export type CreateUnitData = {
  id: string;
  code: string;
  parentId: string;
  props: { key: string; type: VirtualType; value: string }[];
};

export type UpdateUnitData = {
  id: string;
  parentId: string;
  props: { [key: string]: VirtualField };
};
export type DeleteUnitData = { id: string };

export type SyncNeosMessage = {
  create: CreateUnitData[];
  update: UpdateUnitData[];
  delete: DeleteUnitData[];
};
