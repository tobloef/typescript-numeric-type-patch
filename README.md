# TypeScript Numeric Type Patcher

Patches built-in TypeScript library files to use more strongly typed numeric typed for `TypedArray` sub-types and `DataView`.

It's a Bun script, currently incompatible with Node.js.

To use it, simply run it with Bun and pass the path of a project folder with TypeScript installed.

```bash
bun index.ts ./path/to/project
```

This can be used in conjuction with `bun patch` or `patch-package` for Node.js, to generate patch files for TypeScript. Alternatively, you can just run this script every time you install TypeScript...
