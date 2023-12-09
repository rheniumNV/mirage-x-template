import { useEffect, useRef, useState } from "react";
import { UpdatableTextField } from "../../unit/package/NexusUix/main";

export const StyledTextFieldV2 = ({
  setValueRef: setValue,
  defaultValue,
  ...props
}: Omit<Parameters<typeof UpdatableTextField>[0], "value"> & {
  setValueRef?: ReturnType<typeof useRef<(text: string) => void>>;
}) => {
  const [rawValue, setRawValue] = useState(defaultValue ?? "");
  const newValue = useRef<string>(defaultValue ?? "");

  useEffect(() => {
    if (setValue) {
      setValue.current = (text: string) => {
        newValue.current = text;
        setRawValue("init" + text);
      };
    }
  }, [setValue]);

  useEffect(() => {
    if (newValue.current !== rawValue) {
      setRawValue(newValue.current);
    }
  }, [rawValue]);

  return <UpdatableTextField {...props} defaultValue={rawValue} />;
};
