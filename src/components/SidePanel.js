import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { FlowContext } from "../context/FlowContext";
import CustomForm from "./CustomForm";
import "react-tabs/style/react-tabs.css";
import DraggableChildren from "./DraggableChildren";

const SidePanel = ({ deleteEmptyNode, setCenter }) => {
  const [show, setShow] = useState(false);
  const { currNode } = useContext(FlowContext);

  useEffect(() => {
    if (currNode) setShow(false);
  }, [currNode]);
  return (
    <>
      <Container
        style={{
          width: show ? 350 : 50,
          maxHeight: show ? 400 : 100,
          border: "2px solid #e5e5e5",
          borderRadius: 5,
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          right: 20,
          top: "50%",
          zIndex: 1000,
          transform: "translateY(-50%)",
          textAlign: "left",
          padding: show ? "10px 20px" : 0,
          transition: "width 0.2s, maxHeight 0.3s",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            opacity: show ? 100 : 0,
            width: "100%",
            transition: "opacity ",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="outline-primary"
              onClick={() => {
                setShow(false);
              }}
            >
              Hide
            </Button>
          </div>
          <Tabs>
            <TabList>
              <Tab>Information</Tab>
              {currNode.children?.length > 0 && <Tab>Children</Tab>}
            </TabList>

            <TabPanel>
              <CustomForm
                deleteEmptyNode={deleteEmptyNode}
                setCenter={setCenter}
              />
            </TabPanel>
            {currNode.children?.length > 0 && (
              <TabPanel>
                <DraggableChildren />
              </TabPanel>
            )}
          </Tabs>
        </div>
      </Container>
      <Button
        style={{
          width: 50,
          height: 100,
          position: "absolute",
          right: 20,
          top: "50%",
          zIndex: show ? 900 : 1100,
          transform: "translateY(-50%)",
          textAlign: "center",
          transition: "zIndex 0.3s",
          border: "2px solid #e5e5e5",
        }}
        variant="light"
        onClick={() => {
          setShow(true);
        }}
      >
        {"<"}
      </Button>
    </>
  );
};

export default SidePanel;
