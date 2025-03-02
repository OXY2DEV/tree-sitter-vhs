/**
 * @file Tree-sitter grammer for the CLI video recorder(.tape files)
 * @author MD. Mouinul Hossain <mdmouinulhossainshawon@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "vhs",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
