export const Text = (props: { Content: string }) => {
  console.log(props);
  return <p>{props.Content}</p>;
};
