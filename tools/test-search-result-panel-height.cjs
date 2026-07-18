#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const app = fs.readFileSync(
  path.join(__dirname, "..", "app.js"),
  "utf8"
);

const selectedBlock =
  app.match(
    /async function showSelectedPlaceInformation\(result\) \{[\s\S]*?\n  function renderPlaceInformation/
  )?.[0] || "";

const checks = [
  [
    "shared mobile height normalizer exists",
    app.includes(
      "function normalizeMobilePlacePanelHeight()"
    )
  ],
  [
    "height is stabilized over two layout frames",
    app.includes(
      "function stabilizeMobilePlacePanelHeight()"
    ) &&
    (
      app.match(/requestAnimationFrame/g) || []
    ).length >= 2
  ],
  [
    "every opening uses stabilizer",
    /function openPlacePanel\(\)[\s\S]*?stabilizeMobilePlacePanelHeight\(\)/.test(app)
  ],
  [
    "clicked search result stabilizes after render",
    selectedBlock.includes(
      "renderPlaceInformation(details, lngLat);"
    ) &&
    selectedBlock.includes(
      "stabilizeMobilePlacePanelHeight();"
    )
  ],
  [
    "height remains 42 percent",
    app.includes(
      'const height = "42dvh"'
    )
  ],
  [
    "collapsed state is removed",
    app.includes(
      'el.placePanel.classList.remove("is-collapsed")'
    )
  ]
];

let failures = 0;
for (const [name, passed] of checks) {
  if (!passed) {
    failures += 1;
    console.error(`FAIL: ${name}`);
  }
}

console.log(
  `Search result panel height: ${
    checks.length - failures
  }/${checks.length} PASS`
);

process.exit(failures ? 1 : 0);
