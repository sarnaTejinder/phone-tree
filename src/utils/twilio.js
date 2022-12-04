import { TWILIO_TYPES } from "../constants/types";

export const convertToTwilioFormat = (nodes) => {
  let i = 0;
  let formatedNodes = [];
  while (i < nodes.length) {
    let curr = nodes[i];
    switch (curr.type) {
      case 0:
        formatedNodes.push(convertOption(curr));
        break;
      case 1:
        formatedNodes.push(convertOption(curr));
        break;
      case 2:
        formatedNodes.push(convertCallTo(curr));
        break;
      case 3:
        formatedNodes.push(convertBotMessage(curr));
        break;
      default:
        break;
    }
  }
  return formatedNodes;
};

const snakeCase = (string) => {
  return string
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
};

const titleCase = (s) =>
  s
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase());

const convertOption = (nodes, node) => {
  const name = snakeCase(node.label);
  const splitName = `${name}_split`;
  let childrenString = `${node.text} `;
  let transitions = [];
  if (node.children.length > 0) {
    for (let i = 0; i < node.children.length; i++) {
      const currNode = nodes[i];
      const currName = snakeCase(currNode.label);
      childrenString.concat(
        `Press ${i + 1} for ${currNode.label}${
          i === node.children.length - 1 ? "." : ","
        }`
      );
      transitions.push({
        next: currName,
        event: "match",
        conditions: [
          {
            friendly_name: `${i + 1}`,
            arguments: [`{{widgets.${name}.Digits}}`],
            type: "equal_to",
            value: `${i + 1}`,
          },
        ],
      });
    }
  }

  if (node.parent) {
    const parentName = snakeCase(nodes[node.parent].label);
    transitions.push({
      next: parentName,
      event: "match",
      conditions: [
        {
          friendly_name: "If value equal_to #",
          arguments: [`{{widgets.${name}.Digits}}`],
          type: "equal_to",
          value: "#",
        },
      ],
    });
  }

  return [
    {
      name,
      label: node.label,
      type: "gather-input-on-call",
      transitions: [
        {
          next: splitName,
          event: "keypress",
        },
      ],
      properties: {
        voice: "alice",
        speech_timeout: "auto",
        loop: 1,
        finish_on_key: "",
        say: childrenString,
        language: "en",
        stop_gather: false,
        gather_language: "en",
        profanity_filter: "true",
        timeout: 5,
      },
    },
    {
      name: splitName,
      type: "split-based-on",
      transitions: [
        {
          next: name,
          event: "noMatch",
        },
        ...transitions,
      ],
      properties: {
        input: `{{widgets.${name}.Digits}}`,
      },
    },
  ];
};

const convertBotMessage = (node) => {
  const name = snakeCase(node.label);
  return {
    name,
    label: node.label,
    type: "say-play",
    transitions: [
      {
        event: "audioComplete",
      },
    ],
    properties: {
      loop: 1,
      say: node.text,
    },
  };
};

const convertCallTo = (node) => {
  const name = snakeCase(node.label);
  return {
    name,
    label: node.label,
    type: "connect-call-to",
    user_id: node.user.id,
    transitions: [
      {
        event: "callCompleted",
      },
      {
        event: "hangup",
      },
    ],
    properties: {
      caller_id: "{{contact.channel.address}}",

      noun: "number",
      to: node.user.number,
      timeout: 30,
    },
  };
};

export const convertBackToNode = (data) => {
  const transitions = data.states;
  let nodes = [];
  let splits = [];

  for (let i = 1; i < transitions.length; i++) {
    const curr = transitions[i];
    let type = TWILIO_TYPES[curr.type];
    if (type > -1) {
      const label = titleCase(curr.label);
      let node = { label, type, id: nodes.length + 1, children: [] };
      if (type === 1 || type === 3) node.text = curr.say;
      else if (type === 2) node.user.id = curr.user_id;
    } else {
      splits.push({ curr, index: nodes.length - 1 });
    }
  }

  for (let i = 1; i < splits.length; i++) {
    const curr = splits[i].curr;
    const parentIndex = splits[i].index;
    for (let j = 0; j < curr.transitions?.length; j++) {
      const currTransition = curr.transitions[j];
      if (
        currTransition.event === "match" &&
        currTransition?.conditions[0]?.value !== "#"
      ) {
        const childLabel = titleCase(currTransition.next);
        const parentNode = nodes[parentIndex - 1];
        const currNodeIndex = nodes.findIndex(
          (node) => node.label === childLabel
        );
        parentNode.children.push(currNodeIndex);
      }
    }
  }
};
