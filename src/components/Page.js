import { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { FlowContext } from "../context/FlowContext";
import Flow from "./Flow";

const Page = () => {
  const { enabled, setEnabled } = useContext(FlowContext);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {enabled ? (
        <Flow />
      ) : (
        <Button onClick={() => setEnabled(true)}>Enable Phone Tree</Button>
      )}
    </div>
  );
};

export default Page;
