const TYPES = [
  { label: "MAIN", value: 0 },
  { label: "OPTION", value: 1 },
  { label: "ASSIGN_TO", value: 2 },
  { label: "INFO", value: 3 },
];

export const TWILIO_TYPES = {
  "gather-input-on-call": 1,
  "connect-call-to": 2,
  "say-play": 3,
  "split-based-on": -1,
};

export default TYPES;
