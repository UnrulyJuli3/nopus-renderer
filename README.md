# nopus-renderer

Basic usage:

```js
const fs = require("node:fs");
const payload = require("./payload.json");
const { render } = require("nopus-render");

render(payload, "./backing.ogg")
    .then(res => fs.writeFileSync("render.wav", res));
```