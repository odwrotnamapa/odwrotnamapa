#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(
  path.join(root, "app.js"),
  "utf8"
);
const style = fs.readFileSync(
  path.join(root, "style.css"),
  "utf8"
);

const finalSection =
  style.split(
    "Ostateczna, wspólna wysokość mobilnego panelu Informacje"
  )[1] || "";

const checks = [
  [
    "final override exists after global rules",
    finalSection.includes(
      "body:has(.place-panel:not([hidden])) .place-panel"
    )
  ],
  [
    "height is fixed to 42 dynamic viewport units",
    finalSection.includes(
      "height: 42dvh !important"
    )
  ],
  [
    "360 pixel cap is overridden",
    finalSection.includes(
      "max-height: 42dvh !important"
    )
  ],
  [
    "minimum height cannot shrink",
    finalSection.includes(
      "min-height: 42dvh !important"
    )
  ],
  [
    "collapsed class cannot shorten open panel",
    finalSection.includes(
      ".place-panel.is-collapsed"
    ) &&
    finalSection.includes(
      "> :not(.place-sheet-handle)"
    )
  ],
  [
    "JavaScript uses the same height",
    app.includes(
      'const height = "42dvh"'
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
  `Place panel final height: ${
    checks.length - failures
  }/${checks.length} PASS`
);

process.exit(failures ? 1 : 0);
