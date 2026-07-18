#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const app = fs.readFileSync(
  path.join(__dirname, "..", "app.js"),
  "utf8"
);

const checks = [
  [
    "search preparation helper exists",
    app.includes(
      "function prepareMobilePlacePanelAfterSearch()"
    )
  ],
  [
    "mobile search input is blurred",
    app.includes("active.blur()")
  ],
  [
    "autocomplete is hidden before panel sizing",
    /prepareMobilePlacePanelAfterSearch[\s\S]*?hideAllAutocomplete\(\)/.test(app)
  ],
  [
    "clicked autocomplete result uses preparation",
    /setPlacePanelReturnTarget\("search"[\s\S]*?prepareMobilePlacePanelAfterSearch\(\)[\s\S]*?showSelectedPlaceInformation\(result\)/.test(app)
  ],
  [
    "Enter search uses preparation",
    (
      app.match(/prepareMobilePlacePanelAfterSearch\(\);/g) || []
    ).length >= 2
  ],
  [
    "height is retried after keyboard animation",
    app.includes("const delays = [80, 180, 320, 520]") &&
    app.includes("}, 700)")
  ],
  [
    "visual viewport resize is observed",
    app.includes("window.visualViewport.addEventListener") &&
    app.includes('"resize"')
  ],
  [
    "manual dragging is not overridden",
    app.includes(
      '!panel.classList.contains("is-dragging")'
    )
  ],
  [
    "collapsed panel is not automatically expanded",
    app.includes(
      '!panel.classList.contains("is-collapsed")'
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
  `Mobile keyboard panel height: ${
    checks.length - failures
  }/${checks.length} PASS`
);

process.exit(failures ? 1 : 0);
