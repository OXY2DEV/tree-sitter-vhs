/**
 * @file Tree-sitter grammer for the CLI video recorder(.tape files)
 * @author MD. Mouinul Hossain <mdmouinulhossainshawon@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "vhs",
  extras: $ => [
    /\n/,
    /\r?\n/,
    $.comment,
  ],

  rules: {
    tape: $ => repeat(
      choice(
        $.output,
        $.require,

        alias($.literal_settings, $.settings),
        alias($.string_settings, $.settings),
        alias($.duration_settings, $.settings),
        alias($.numeric_settings, $.settings),
        alias($.boolean_settings, $.settings),
        alias($.theme_settings, $.settings),
        alias($.windowbar_settings, $.settings),
        alias($.loopoffset_settings, $.settings),

        $.type,
        $.key_command,
        $.wait,
        $.sleep,

        $.show,
        $.hide,

        $.screenshot,

        $.copy,
        $.paste,

        $.environment,
        $.source
      )
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Output <path>:
      * Outputs the recording to path.
    */

    output: $ => seq(
      "Output",
      / +/,
      $.destination
    ),

    // TODO, Find better path detection pattern(s).
    destination: _ => choice(
      /[\w.-]+\.\w+/,
      /[\w.-]+[/\\]/
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Require <module>:
      * Checks existence of dependency in $PATH. Assume dependency is
      * a command.
    */

    require: $ => seq(
      "Require",
      / +/,
      alias(/[a-zA-Z0-9_-]+/, $.dependency)
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set Shell <literal>:
      * Sets the shell. The value is a literal string(without whitespace
      * & #).
    */

    literal_settings: $ => seq(
      "Set",
      / +/,
      alias($.literal_settings_name, $.settings_name),
      / +/,
      alias($.literal_settings_value, $.settings_value)
    ),

    literal_settings_name: _ => "Shell",
    literal_settings_value: $ => $.literal,

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set FontFamily <string>:
      * Sets the font family, value is a string
    */

    string_settings: $ => seq(
      "Set",
      / +/,
      alias($.string_settings_name, $.settings_name),
      / +/,
      alias($.string_settings_value, $.settings_value)
    ),

    string_settings_name: _ => choice(
      "FontFamily",
      "MarginFill",
    ),
    string_settings_value: $ => $.string,

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set TypingSpeed <duration>:
      * Sets the typing duration. Duration should be in seconds/milliseconds.
    */

    duration_settings: $ => seq(
      "Set",
      / +/,
      alias($.duration_settings_name, $.settings_name),
      / +/,
      alias($.duration_settings_value, $.settings_value)
    ),

    duration_settings_name: _ => "TypingSpeed",
    duration_settings_value: $ => $.duration,

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set Width <number>:
      * Sets the option value to a number(integer or float).
    */

    numeric_settings: $ => seq(
      "Set",
      / +/,
      alias($.numeric_settings_name, $.settings_name),
      / +/,
      alias($.numeric_settings_value, $.settings_value)
    ),

    numeric_settings_name: _ => choice(
      "FontSize",
      "Width",
      "Height",
      "LetterSpacing",
      "LineHeight",
      "Padding",
      "Margin",
      "BorderRadius",
      "FrameRate",
      "PlaybackSpeed",
    ),

    numeric_settings_value: $ => $.number,

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set CursorBlink <boolean>:
      * Sets cursor blinking(to `true` or `false`).
    */

    boolean_settings: $ => seq(
      "Set",
      / +/,
      alias($.boolean_settings_name, $.settings_name),
      / +/,
      alias($.boolean_settings_value, $.settings_value)
    ),

    boolean_settings_name: _ => "CursorBlink",
    boolean_settings_value: $ => $.boolean,

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set Theme <string> | Set Theme <json>:
      * Sets the terminal theme. Either to a predefined theme or with a JSON
      * string as the theme.
    */

    theme_settings: $ => seq(
      "Set",
      / +/,
      alias("Theme", $.settings_name),
      / +/,
      alias($.theme_settings_value, $.settings_value)
    ),

    theme_settings_value: $ => choice(
      $.json,
      $.string
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set WindowBar <value>:
      * Changes window bar style(when set).
    */

    windowbar_settings: $ => seq(
      "Set",
      / +/,
      alias("WindowBar", $.settings_name),
      / +/,
      alias($.windowbar_settings_value, $.settings_value)
    ),

    windowbar_settings_value: $ => alias(
      choice(
        "Colorful",
        "ColorfulRight",
        "Rings",
        "RingsRight"
      ),
      $.literal
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Set LoopOffset <number> | Set LoopOffset <percentage>:
      * Changes loop offset to a frame count or % value.
    */

    loopoffset_settings: $ => seq(
      "Set",
      / +/,
      alias("LoopOffset", $.settings_name),
      / +/,
      alias($.loopoffset_settings_value, $.settings_value)
    ),

    loopoffset_settings_value: $ => choice(
      $.percentage,
      $.number
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Type <string> | Type@<duration> <string>:
      * Types the given string with the given speed.
      * Use `` to escape string.
    */

    // TODO, See if we can prevent whitespace(s)
    // between "Type" and "@50ms"
    type: $ => seq(
      "Type",
      optional(
        seq(
          "@",
          $.duration
        )
      ),
      / +/,
      choice(
        $.string,
        $.escaped_string,
      )
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Key@<duration> <times>
      * Presses key <times> across <duration>
    */

    // TODO, See if we can prevent whitespace(s)
    // between "Type" and "@50ms"
    key_command: $ => seq(
      $.key,
      optional(
        seq(
          "@",
          $.duration
        )
      ),
      optional(
        seq(
          / +/,
          $.number
        )
      ),
    ),

    // NOTE, VHS doesn't support keymaps like
    // CTRL-ALT-a
    key: _ => choice(
      "Backspace",
      /Ctrl\+./,
      /Alt\+./,
      "Enter",
      "Up",
      "Down",
      "Left",
      "Right",
      "Tab",
      "Space",
      "PageUp",
      "PageDown",
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Wait+<scope>@<duration> <pattern>
      * On the given scope waits till duration for the pattern to match.
    */

    wait: $ => seq(
      "Wait",
      optional($.scope),
      optional(
        seq(
          "@",
          $.duration
        )
      ),
      optional(
        seq(
          / +/,
          $.pattern
        )
      )
    ),

    scope: _ => seq(
      "+",
      choice(
        "Screen",
        "Line"
      )
    ),

    pattern: $ => seq(
      "/",
      /[^/]*/,
      "/",
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Sleep <duration>
      * Sleeps for duration. When duration is a number it's assumed to be
      * in seconds
    */

    sleep: $ => seq(
      "Sleep",
      / +/,
      choice(
        $.number,
        $.duration
      )
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Show | Hide
      * Shows/hides the recording.
    */

    show: _ => "Show",
    hide: _ => "Hide",

    ////////////////////////////////////////////////////////////////////////
    /*
      * Screenshot <destination>.png
      * Saves a screenshot to the destination.
    */

    screenshot: $ => seq(
      "Screenshot",
      / +/,
      alias(/[\w.-/\\]+\.png/, $.destination)
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Copy <string> | Paste
      * Copies & pastes the given string.
    */

    copy: $ => seq(
      "Copy",
      / +/,
      $.string
    ),
    paste: _ => "Paste",

    ////////////////////////////////////////////////////////////////////////
    /*
      * Env <variable> <value>
      * Sets an environment variable.
    */

    environment: $ => seq(
      "Env",
      / +/,
      alias($.literal, $.variable),
      / +/,
      alias($.env_value, $.value),
    ),

    env_value: $ => choice(
      $.number,
      $.boolean,
      $.string,
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Source <destination>.tape
      * Sources given tape file.
    */

    source: $ => seq(
      "Source",
      / +/,
      alias(/[\w.-/\\]+\.tape/, $.destination)
    ),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Primitive data types.
    */

    string: _ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'"),
    ),

    escaped_string: _ => seq("`", /[^`]+/, "`"),

    number: _ => /[0-9\.]+/,

    boolean: _ => choice("true", "false"),

    ////////////////////////////////////////////////////////////////////////
    /*
      * Extended data types.
    */

    percentage: _ => /[0-9\.]+%/,

    json: _ => /\{[^\}]+\}/,

    literal: _ => /[^\s#]+/,

    duration: _ => /[0-9\.]+m?s/,

    ////////////////////////////////////////////////////////////////////////

    comment: _ => seq(
      "#",
      /.*/
    )
  }
});
