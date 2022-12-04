import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import TEAM_MEMBERS from "../constants/teamMembers";
import TYPES from "../constants/types";
import { FlowContext } from "../context/FlowContext";

const CustomForm = ({ deleteEmptyNode, setCenter }) => {
  const [optionSelected, setOptionSelected] = useState("1");
  const [memberSelected, setMemberSelected] = useState(0);
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");

  const { currNode, removeNode, updateData, dirty, editData, nodes } =
    useContext(FlowContext);
  const optionRef = useRef();

  const reset = (data) => {
    setOptionSelected(JSON.stringify(1));
    setMemberSelected(data?.user || 0);
    setText(data?.text || "");
    setLabel(data?.label || "");
  };

  useEffect(() => {
    reset(currNode);
  }, [currNode]);

  const isMain = useMemo(() => currNode?.type === 0, [currNode]);

  const onSubmit = () => {
    if (currNode !== null) {
      editData();
    }
  };

  const onDelete = () => {
    currNode.type === "empty"
      ? deleteEmptyNode(currNode.index)
      : removeNode(currNode.index);
    setCenter();
  };

  return (
    <Form style={{ width: "100%" }} className="mt-3">
      <Form.Select
        ref={optionRef}
        onInput={() => {
          setOptionSelected(optionRef.current.value);
          updateData({ type: optionRef.current.value });
        }}
        value={optionSelected}
        disabled={isMain}
      >
        {isMain ? (
          <option value={TYPES[0].value}>Main Greeting</option>
        ) : (
          TYPES.filter((i) => i.value !== 0).map((type, i) => (
            <option value={type.value} key={type.value}>
              {type.label}
            </option>
          ))
        )}
      </Form.Select>
      {!isMain && (
        <Form.Group className="mt-2" controlId="formBasicEmail">
          <Form.Label>Label</Form.Label>
          <Form.Control
            type="text"
            value={label}
            onInput={(e) => {
              setLabel(e.target.value);
              updateData({ label: e.target.value });
            }}
          />
        </Form.Group>
      )}
      {(isMain || optionSelected === "1" || optionSelected === "3") && (
        <Form.Group className="mt-2" controlId="formBasicEmail">
          <Form.Label>{isMain ? "Greeting Message" : "Text"}</Form.Label>
          <Form.Control
            type="text"
            value={text}
            onInput={(e) => {
              setText(e.target.value);
              updateData({ text: e.target.value });
            }}
          />
        </Form.Group>
      )}
      {optionSelected === "2" && (
        <Form.Group className="mt-2" controlId="formBasicEmail">
          <Form.Label>Assign To</Form.Label>
          <Form.Select
            value={memberSelected}
            onInput={(e) => {
              setMemberSelected(e.target.value);
            }}
          >
            {TEAM_MEMBERS.map((member, i) => (
              <option value={member.id} key={member.phone}>
                {member.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}
      <Col
        style={{ display: "flex", justifyContent: "space-between" }}
        className="mt-3"
      >
        <Button variant="primary" disabled={!dirty} onClick={onSubmit}>
          {currNode ? (currNode?.type === "empty" ? "Add" : "Save") : "Add"}
        </Button>
        {currNode && (
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
      </Col>
    </Form>
  );
};

export default CustomForm;
