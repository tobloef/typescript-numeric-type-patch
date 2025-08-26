const replacements: FileReplacement[] = [
  {
    filePath: "node_modules/typescript/lib/lib.es5.d.ts",
    replacementGroups: [
      {
        sectionPattern: /\/\/\/ <reference lib="decorators.legacy" \/>\n/g,
        replacements: [
          {
            pattern: /$/,
            replacement: `
/////////////////////////////
/// Patched branding types
/////////////////////////////
declare const __brand: unique symbol;
type __StrictBrand<Name extends string> = { [__brand]: Name };
type __LooseBrand<Name extends string> = { [__brand]?: Name };
type __StrictlyBranded<T, Name extends string> = T & __StrictBrand<Name>;
type __LooselyBranded<T, Name extends string> = T & __LooseBrand<Name>;
type __Branded<T, Name extends string> = __StrictlyBranded<T, Name>;

/////////////////////////////
/// Patched data types
/////////////////////////////
type Int8 = __Branded<number, "Int8">;
type Uint8 = __Branded<number, "Uint8">;
type Int16 = __Branded<number, "Int16">;
type Uint16 = __Branded<number, "Uint16">;
type Int32 = __Branded<number, "Int32">;
type Uint32 = __Branded<number, "Uint32">;
type Float16 = __Branded<number, "Float16">;
type Float32 = __Branded<number, "Float32">;
type Float64 = __Branded<number, "Float64">;
`,
          },
        ],
      },
      {
        sectionPattern: /interface DataView<[\w\W]+declare var DataView:/,
        replacements: [
          ...["Float32", "Float64", "Int16", "Int32", "Uint16", "Uint32"].map(
            (type): Replacement => ({
              pattern: `get${type}(byteOffset: number, littleEndian?: boolean): number;`,
              replacement: `get${type}(byteOffset: number, littleEndian?: boolean): ${type};`,
            })
          ),
          ...["Float32", "Float64", "Int16", "Int32", "Uint16", "Uint32"].map(
            (type): Replacement => ({
              pattern: `set${type}(byteOffset: number, value: number, littleEndian?: boolean): void;`,
              replacement: `set${type}(byteOffset: number, value: ${type}, littleEndian?: boolean): void;`,
            })
          ),
          ...["Int8", "Uint8"].map(
            (type): Replacement => ({
              pattern: `get${type}(byteOffset: number): number;`,
              replacement: `get${type}(byteOffset: number): ${type};`,
            })
          ),
          ...["Int8", "Uint8"].map(
            (type): Replacement => ({
              pattern: `set${type}(byteOffset: number, value: number): void;`,
              replacement: `set${type}(byteOffset: number, value: ${type}): void;`,
            })
          ),
        ],
      },
      ...[
        ["Float32", "Float32"],
        ["Float64", "Float64"],
        ["Int8", "Int8"],
        ["Int16", "Int16"],
        ["Int32", "Int32"],
        ["Uint8", "Uint8"],
        ["Uint8Clamped", "Uint8"],
        ["Uint16", "Uint16"],
        ["Uint32", "Uint32"],
      ].map(
        ([arrayType, numericType]): ReplacementGroup => ({
          sectionPattern: new RegExp(
            `interface ${arrayType}Array[\\w\\W]+declare var ${arrayType}Array:`
          ),
          replacements: [
            {
              pattern: "[index: number]: number;",
              replacement: `[index: number]: ${numericType};`,
            },
            {
              pattern:
                "every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;",
              replacement: `every(predicate: (value: ${numericType}, index: number, array: this) => unknown, thisArg?: any): boolean;`,
            },
            {
              pattern:
                "fill(value: number, start?: number, end?: number): this;",
              replacement: `fill(value: ${numericType}, start?: number, end?: number): this;`,
            },
            {
              pattern:
                "filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any):",
              replacement: `filter(predicate: (value: ${numericType}, index: number, array: this) => any, thisArg?: any):`,
            },
            {
              pattern:
                "find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;",
              replacement: `find(predicate: (value: ${numericType}, index: number, obj: this) => boolean, thisArg?: any): ${numericType} | undefined;`,
            },
            {
              pattern:
                "findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;",
              replacement: `findIndex(predicate: (value: ${numericType}, index: number, obj: this) => boolean, thisArg?: any): number;`,
            },
            {
              pattern:
                "forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;",
              replacement: `forEach(callbackfn: (value: ${numericType}, index: number, array: this) => void, thisArg?: any): void;`,
            },
            {
              pattern:
                "indexOf(searchElement: number, fromIndex?: number): number;",
              replacement: `indexOf(searchElement: ${numericType}, fromIndex?: number): number;`,
            },
            {
              pattern:
                "lastIndexOf(searchElement: number, fromIndex?: number): number;",
              replacement: `lastIndexOf(searchElement: ${numericType}, fromIndex?: number): number;`,
            },
            {
              pattern:
                "map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any):",
              replacement: `map(callbackfn: (value: ${numericType}, index: number, array: this) => ${numericType}, thisArg?: any):`,
            },
            {
              pattern:
                "reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;",
              replacement: `reduce(callbackfn: (previousValue: ${numericType}, currentValue: ${numericType}, currentIndex: number, array: this) => ${numericType}): ${numericType};`,
            },
            {
              pattern:
                "reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;",
              replacement: `reduce(callbackfn: (previousValue: ${numericType}, currentValue: ${numericType}, currentIndex: number, array: this) => ${numericType}, initialValue: ${numericType}): ${numericType};`,
            },
            {
              pattern:
                "reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;",
              replacement: `reduce<U>(callbackfn: (previousValue: U, currentValue: ${numericType}, currentIndex: number, array: this) => U, initialValue: U): U;`,
            },
            {
              pattern:
                "reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;",
              replacement: `reduceRight(callbackfn: (previousValue: ${numericType}, currentValue: ${numericType}, currentIndex: number, array: this) => ${numericType}): ${numericType};`,
            },
            {
              pattern:
                "reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;",
              replacement: `reduceRight(callbackfn: (previousValue: ${numericType}, currentValue: ${numericType}, currentIndex: number, array: this) => ${numericType}, initialValue: ${numericType}): ${numericType};`,
            },
            {
              pattern:
                "reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;",
              replacement: `reduceRight<U>(callbackfn: (previousValue: U, currentValue: ${numericType}, currentIndex: number, array: this) => U, initialValue: U): U;`,
            },
            {
              pattern: "set(array: ArrayLike<number>, offset?: number): void;",
              replacement: `set(array: ArrayLike<${numericType}>, offset?: number): void;`,
            },
            {
              pattern:
                "some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;",
              replacement: `some(predicate: (value: ${numericType}, index: number, array: this) => unknown, thisArg?: any): boolean;`,
            },
            {
              pattern:
                "sort(compareFn?: (a: number, b: number) => number): this;",
              replacement: `sort(compareFn?: (a: ${numericType}, b: ${numericType}) => number): this;`,
            },
            {
              pattern: "new (array: ArrayLike<number>):",
              replacement: `new (array: ArrayLike<${numericType}>):`,
            },
            {
              pattern: "new (array: ArrayLike<number> | ArrayBuffer):",
              replacement: `new (array: ArrayLike<${numericType}> | ArrayBuffer):`,
            },
            {
              pattern: "of(...items: number[]):",
              replacement: `of(...items: ${numericType}[]):`,
            },
            {
              pattern: "from(arrayLike: ArrayLike<number>):",
              replacement: `from(arrayLike: ArrayLike<${numericType}>):`,
            },
            {
              pattern:
                "from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any):",
              replacement: `from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => ${numericType}, thisArg?: any):`,
            },
          ],
        })
      ),
    ],
  },
  {
    filePath: "node_modules/typescript/lib/lib.es2015.iterable.d.ts",
    replacementGroups: [
      ...[
        ["Float32", "Float32"],
        ["Float64", "Float64"],
        ["Int8", "Int8"],
        ["Int16", "Int16"],
        ["Int32", "Int32"],
        ["Uint8", "Uint8"],
        ["Uint8Clamped", "Uint8"],
        ["Uint16", "Uint16"],
        ["Uint32", "Uint32"],
      ].map(
        ([arrayType, numericType]): ReplacementGroup => ({
          sectionPattern: new RegExp(
            `interface ${arrayType}Array[\\w\\W]+?(interface |$)`
          ),
          replacements: [
            {
              pattern: `[Symbol.iterator](): ArrayIterator<number>;`,
              replacement: `[Symbol.iterator](): ArrayIterator<${numericType}>;`,
            },
            {
              pattern: `entries(): ArrayIterator<[number, number]>;`,
              replacement: `entries(): ArrayIterator<[number, ${numericType}]>;`,
            },
            {
              pattern: `values(): ArrayIterator<number>;`,
              replacement: `values(): ArrayIterator<${numericType}>;`,
            },
          ],
        })
      ),
    ],
  },
  {
    filePath: "node_modules/typescript/lib/lib.es2016.array.include.d.ts",
    replacementGroups: [
      ...[
        ["Float32", "Float32"],
        ["Float64", "Float64"],
        ["Int8", "Int8"],
        ["Int16", "Int16"],
        ["Int32", "Int32"],
        ["Uint8", "Uint8"],
        ["Uint8Clamped", "Uint8"],
        ["Uint16", "Uint16"],
        ["Uint32", "Uint32"],
      ].map(
        ([arrayType, numericType]): ReplacementGroup => ({
          sectionPattern: new RegExp(
            `interface ${arrayType}Array[\\w\\W]+?(interface |$)`
          ),
          replacements: [
            {
              pattern: `includes(searchElement: number, fromIndex?: number): boolean;`,
              replacement: `includes(searchElement: ${numericType}, fromIndex?: number): boolean;`,
            },
          ],
        })
      ),
    ],
  },
  {
    filePath: "node_modules/typescript/lib/lib.es2022.array.d.ts",
    replacementGroups: [
      ...[
        ["Float32", "Float32"],
        ["Float64", "Float64"],
        ["Int8", "Int8"],
        ["Int16", "Int16"],
        ["Int32", "Int32"],
        ["Uint8", "Uint8"],
        ["Uint8Clamped", "Uint8"],
        ["Uint16", "Uint16"],
        ["Uint32", "Uint32"],
      ].map(
        ([arrayType, numericType]): ReplacementGroup => ({
          sectionPattern: new RegExp(
            `interface ${arrayType}Array[\\w\\W]+?(interface |$)`
          ),
          replacements: [
            {
              pattern: `at(index: number): number | undefined;`,
              replacement: `at(index: number): ${numericType} | undefined;`,
            },
          ],
        })
      ),
    ],
  },
  {
    filePath: "node_modules/typescript/lib/lib.es2023.array.d.ts",
    replacementGroups: [
      ...[
        ["Float32", "Float32"],
        ["Float64", "Float64"],
        ["Int8", "Int8"],
        ["Int16", "Int16"],
        ["Int32", "Int32"],
        ["Uint8", "Uint8"],
        ["Uint8Clamped", "Uint8"],
        ["Uint16", "Uint16"],
        ["Uint32", "Uint32"],
      ].map(
        ([arrayType, numericType]): ReplacementGroup => ({
          sectionPattern: new RegExp(
            `interface ${arrayType}Array[\\w\\W]+?(interface |$)`
          ),
          replacements: [
            {
              pattern:
                /findLast<S extends number>\([\w\W]+?\): S \| undefined;/,
              replacement: `
    findLast<S extends ${numericType}>(
        predicate: (
            value: ${numericType},
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
              `.trim(),
            },
            {
              pattern: /findLast\([\w\W]+?\): number \| undefined;/,
              replacement: `
    findLast(
        predicate: (
            value: ${numericType},
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): ${numericType} | undefined;
              `.trim(),
            },
            {
              pattern: /findLastIndex\([\w\W]+?\): number;/,
              replacement: `
    findLastIndex(
        predicate: (
            value: ${numericType},
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
              `.trim(),
            },
            {
              pattern:
                "toSorted(compareFn?: (a: number, b: number) => number): ",
              replacement: `toSorted(compareFn?: (a: ${numericType}, b: ${numericType}) => number): `,
            },
            {
              pattern: "with(index: number, value: number): ",
              replacement: `with(index: number, value: ${numericType}): `,
            },
          ],
        })
      ),
    ],
  },
  {
    filePath: "node_modules/typescript/lib/lib.esnext.float16.d.ts",
    replacementGroups: [
      {
        sectionPattern: /^[\w\W]+$/,
        replacements: [
          {
            pattern: "at(index: number): number | undefined;",
            replacement: "at(index: number): Float16 | undefined;",
          },
          {
            pattern:
              "every(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;",
            replacement:
              "every(predicate: (value: Float16, index: number, array: this) => unknown, thisArg?: any): boolean;",
          },
          {
            pattern: "fill(value: number, start?: number, end?: number): this;",
            replacement:
              "fill(value: Float16, start?: number, end?: number): this;",
          },
          {
            pattern:
              "filter(predicate: (value: number, index: number, array: this) => any, thisArg?: any): Float16Array<ArrayBuffer>;",
            replacement:
              "filter(predicate: (value: Float16, index: number, array: this) => any, thisArg?: any): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined;",
            replacement:
              "find(predicate: (value: Float16, index: number, obj: this) => boolean, thisArg?: any): Float16 | undefined;",
          },
          {
            pattern:
              "findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number;",
            replacement:
              "findIndex(predicate: (value: Float16, index: number, obj: this) => boolean, thisArg?: any): number;",
          },
          {
            pattern: /findLast<S extends number>\([\w\W]+?\): S \| undefined;/,
            replacement: `
    findLast<S extends Float16>(
        predicate: (
            value: Float16,
            index: number,
            array: this,
        ) => value is S,
        thisArg?: any,
    ): S | undefined;
    `.trim(),
          },
          {
            pattern: /findLast\([\w\W]+?\): number \| undefined;/,
            replacement: `
    findLast(
        predicate: (
            value: Float16,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): Float16 | undefined;
            `.trim(),
          },
          {
            pattern: /findLastIndex\([\w\W]+?\): number;/,
            replacement: `
    findLastIndex(
        predicate: (
            value: Float16,
            index: number,
            array: this,
        ) => unknown,
        thisArg?: any,
    ): number;
            `.trim(),
          },
          {
            pattern:
              "forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void;",
            replacement:
              "forEach(callbackfn: (value: Float16, index: number, array: this) => void, thisArg?: any): void;",
          },
          {
            pattern:
              "includes(searchElement: number, fromIndex?: number): boolean;",
            replacement:
              "includes(searchElement: Float16, fromIndex?: number): boolean;",
          },
          {
            pattern:
              "indexOf(searchElement: number, fromIndex?: number): number;",
            replacement:
              "indexOf(searchElement: Float16, fromIndex?: number): number;",
          },
          {
            pattern:
              "lastIndexOf(searchElement: number, fromIndex?: number): number;",
            replacement:
              "lastIndexOf(searchElement: Float16, fromIndex?: number): number;",
          },
          {
            pattern:
              "map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): Float16Array<ArrayBuffer>;",
            replacement:
              "map(callbackfn: (value: Float16, index: number, array: this) => Float16, thisArg?: any): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;",
            replacement:
              "reduce(callbackfn: (previousValue: Float16, currentValue: Float16, currentIndex: number, array: this) => Float16): Float16;",
          },
          {
            pattern:
              "reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;",
            replacement:
              "reduce(callbackfn: (previousValue: Float16, currentValue: Float16, currentIndex: number, array: this) => Float16, initialValue: Float16): Float16;",
          },
          {
            pattern:
              "reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;",
            replacement:
              "reduce<U>(callbackfn: (previousValue: U, currentValue: Float16, currentIndex: number, array: this) => U, initialValue: U): U;",
          },
          {
            pattern:
              "reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;",
            replacement:
              "reduceRight(callbackfn: (previousValue: Float16, currentValue: Float16, currentIndex: number, array: this) => Float16): Float16;",
          },
          {
            pattern:
              "reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number, initialValue: number): number;",
            replacement:
              "reduceRight(callbackfn: (previousValue: Float16, currentValue: Float16, currentIndex: number, array: this) => Float16, initialValue: Float16): Float16;",
          },
          {
            pattern:
              "reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;",
            replacement:
              "reduceRight<U>(callbackfn: (previousValue: U, currentValue: Float16, currentIndex: number, array: this) => U, initialValue: U): U;",
          },
          {
            pattern: "set(array: ArrayLike<number>, offset?: number): void;",
            replacement:
              "set(array: ArrayLike<Float16>, offset?: number): void;",
          },
          {
            pattern:
              "some(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean;",
            replacement:
              "some(predicate: (value: Float16, index: number, array: this) => unknown, thisArg?: any): boolean;",
          },
          {
            pattern:
              "sort(compareFn?: (a: number, b: number) => number): this;",
            replacement:
              "sort(compareFn?: (a: Float16, b: Float16) => number): this;",
          },
          {
            pattern:
              "toSorted(compareFn?: (a: number, b: number) => number): Float16Array<ArrayBuffer>;",
            replacement:
              "toSorted(compareFn?: (a: Float16, b: Float16) => number): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "with(index: number, value: number): Float16Array<ArrayBuffer>;",
            replacement:
              "with(index: number, value: Float16): Float16Array<ArrayBuffer>;",
          },
          {
            pattern: "[index: number]: number;",
            replacement: "[index: number]: Float16;",
          },
          {
            pattern: "[Symbol.iterator](): ArrayIterator<number>;",
            replacement: "[Symbol.iterator](): ArrayIterator<Float16>;",
          },
          {
            pattern: "entries(): ArrayIterator<[number, number]>;",
            replacement: "entries(): ArrayIterator<[number, Float16]>;",
          },
          {
            pattern: "values(): ArrayIterator<number>;",
            replacement: "values(): ArrayIterator<Float16>;",
          },
          {
            pattern:
              "new (array: ArrayLike<number> | Iterable<number>): Float16Array<ArrayBuffer>;",
            replacement:
              "new (array: ArrayLike<Float16> | Iterable<Float16>): Float16Array<ArrayBuffer>;",
          },
          {
            pattern: "of(...items: number[]): Float16Array<ArrayBuffer>;",
            replacement: "of(...items: Float16[]): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "from(arrayLike: ArrayLike<number>): Float16Array<ArrayBuffer>;",
            replacement:
              "from(arrayLike: ArrayLike<Float16>): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => number, thisArg?: any): Float16Array<ArrayBuffer>;",
            replacement:
              "from<T>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => Float16, thisArg?: any): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "from(elements: Iterable<number>): Float16Array<ArrayBuffer>;",
            replacement:
              "from(elements: Iterable<Float16>): Float16Array<ArrayBuffer>;",
          },
          {
            pattern:
              "from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => number, thisArg?: any): Float16Array<ArrayBuffer>;",
            replacement:
              "from<T>(elements: Iterable<T>, mapfn?: (v: T, k: number) => Float16, thisArg?: any): Float16Array<ArrayBuffer>;",
          },
          {
            pattern: "f16round(x: number): number;",
            replacement: "f16round(x: number): Float16;",
          },
          {
            pattern:
              "getFloat16(byteOffset: number, littleEndian?: boolean): number;",
            replacement:
              "getFloat16(byteOffset: number, littleEndian?: boolean): Float16;",
          },
          {
            pattern:
              "setFloat16(byteOffset: number, value: number, littleEndian?: boolean): void;",
            replacement:
              "setFloat16(byteOffset: number, value: Float16, littleEndian?: boolean): void;",
          },
        ],
      },
    ],
  },
];

const directory = Bun.argv[2] ?? ".";

for (const fileReplacement of replacements) {
  try {
    await applyFileReplacement(directory, fileReplacement);
  } catch (error) {
    throw new Error(
      `Error applying file replacement: ${fileReplacement.filePath}`,
      { cause: error }
    );
  }
}

type FileReplacement = {
  /** Path of the file to modify. */
  filePath: string;
  /** List of replacement groups to apply to the file. */
  replacementGroups: ReplacementGroup[];
};

type ReplacementGroup = {
  /** Pattern matching the section to search for replacements in. */
  sectionPattern: RegExp;
  /** List of replacements to apply to the matched section. */
  replacements: Replacement[];
};

type Replacement = {
  /** Pattern matching the string to replace. */
  pattern: RegExp | string;
  /** String to replace the matched pattern with. */
  replacement: string;
};

async function applyFileReplacement(
  directory: string,
  fileReplacement: FileReplacement
) {
  const path = `${directory}/${fileReplacement.filePath}`;
  const file = Bun.file(path);

  let content = await file.text();

  for (const groupReplacement of fileReplacement.replacementGroups) {
    content = applyReplacementGroup(content, groupReplacement);
  }

  await file.write(content);
}

function applyReplacementGroup(
  string: string,
  groupReplacement: ReplacementGroup
) {
  if (!string.match(groupReplacement.sectionPattern)) {
    throw new Error(
      `Section pattern not found: ${groupReplacement.sectionPattern}`
    );
  }

  const start = string.search(groupReplacement.sectionPattern);
  const end = start + string.match(groupReplacement.sectionPattern)![0].length;

  const before = string.slice(0, start);
  const after = string.slice(end);

  let modified = string.slice(start, end);
  for (const replacement of groupReplacement.replacements) {
    try {
      modified = applyReplacement(modified, replacement);
    } catch (error) {
      throw new Error(
        `Error applying replacement group.\nPattern: ${groupReplacement.sectionPattern}`,
        { cause: error }
      );
    }
  }

  return before + modified + after;
}

function applyReplacement(string: string, replacement: Replacement) {
  if (replacement.pattern instanceof RegExp) {
    const res = string.match(replacement.pattern);
    if (!res) {
      throw new Error(
        `Replacement pattern not found.\nPattern: ${replacement.pattern}\nReplacement: ${replacement.replacement}`
      );
    }
  } else {
    if (!string.includes(replacement.pattern)) {
      throw new Error(
        `Replacement pattern not found.\nPattern: ${replacement.pattern}\nReplacement: ${replacement.replacement}`
      );
    }
  }

  return string.replace(replacement.pattern, replacement.replacement);
}
