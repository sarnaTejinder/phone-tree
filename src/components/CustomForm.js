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

  const {
    currNode,
    removeNode,
    updateData,
    dirty,
    editData,
    addChild,
    setCurrNode,
    nodes,
  } = useContext(FlowContext);
  const optionRef = useRef();

  const reset = (data) => {
    setOptionSelected(JSON.stringify(data?.value) || "1");
    setMemberSelected(JSON.stringify(data?.user) || 0);
    setText(data?.text || "");
    setLabel(data?.label || "");
  };

  const clear = () => {
    setOptionSelected("1");
    setMemberSelected("0");
    setText("");
    setLabel("");
  };

  useEffect(() => {
    reset(currNode);
  }, [currNode.index]);

  const isMain = useMemo(() => currNode?.value === TYPES[0].value, [currNode]);
  const isNew = useMemo(() => !currNode?.index, [currNode]);

  const onSubmit = () => {
    if (currNode !== null) {
      if (currNode.type !== "empty") {
        editData();
      }
      if (currNode.type === "empty" && typeof currNode.id === "string") {
        editData({
          type: "node",
          value: parseInt(optionSelected),
          text,
          label,
          user: parseInt(memberSelected),
          num: currNode.relIndex + 1,
        });
      } else if (currNode.type === "empty" && typeof currNode.id !== "string")
        addChild(currNode.parent, currNode, {
          value: parseInt(optionSelected),
          text,
          label,
          user: parseInt(memberSelected),
          type: "node",
        });
    }
    clear();
  };

  const onDelete = () => {
    currNode.type === "empty" && typeof currNode.id !== "string"
      ? deleteEmptyNode(currNode.index)
      : removeNode(currNode.index);
    clear();
    setCenter();
  };

  return (
    <Form style={{ width: "100%" }} className="mt-3">
      <Form.Select
        ref={optionRef}
        onInput={() => {
          setOptionSelected(optionRef.current.value);
          updateData({ value: optionRef.current.value });
        }}
        value={optionSelected}
        disabled={isMain}
      >
        {isMain ? (
          <option value={TYPES[0].value}>Main Greeting</option>
        ) : (
          TYPES.filter((i) => i.value !== 0).map((type, i) => (
            <option value={type.value} key={`${i}-${type.label}`}>
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
              updateData({ user: e.target.value });
            }}
          >
            {TEAM_MEMBERS.map((member, i) => (
              <option value={i} key={`${i}-${member.phone}`}>
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
          {currNode.index || currNode.index === 0
            ? currNode?.type === "empty"
              ? "Add"
              : "Save"
            : "Add"}
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
