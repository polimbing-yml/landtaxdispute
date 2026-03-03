// src/constants/reasons.js

export const PRIMARY_REASONS = [
  { id: "cb_a", value: "Incorrect land value" },
  { id: "cb_b", value: "Incorrect area or dimension errors" },
  { id: "cb_c", value: "Incorrect apportionment" },
  {
    id: "cb_d",
    value: "Failure to consider property-specific constraints, including:",
    hasSub: true,
  },
];

export const SUB_CONSTRAINTS = [
  { id: "sc1", value: "Heritage listing or overlay" },
  { id: "sc2", value: "Flood zone or flood-prone classification" },
  { id: "sc3", value: "Bushfire Attack Level (BAL) restrictions" },
  { id: "sc4", value: "Easements or rights of way" },
  { id: "sc5", value: "Environmental or conservation overlay" },
  { id: "sc6", value: "Zoning or planning restrictions" },
  { id: "sc7", value: "Access restrictions or landlocked status" },
  { id: "sc8", value: "Contamination or remediation requirements" },
];