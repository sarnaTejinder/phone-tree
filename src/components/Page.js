import { useContext } from "react";
import { Button } from "react-bootstrap";
import { ReactFlowProvider } from "reactflow";
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
        position: "relative",
      }}
    >
      {enabled ? (
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      ) : (
        <Button onClick={() => setEnabled(true)}>Enable Phone Tree</Button>
      )}
    </div>
  );
};

export default Page;
