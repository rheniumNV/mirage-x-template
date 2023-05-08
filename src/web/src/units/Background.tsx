export const Background = (props: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundColor: "red",
        height: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </div>
  );
};
