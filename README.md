# tree-sitter-vhs

[![CI][ci]](https://github.com/OXY2DEV/tree-sitter-vhs/actions/workflows/ci.yml)
[![discord][discord]](https://discord.gg/w7nTvsVJhm)
[![matrix][matrix]](https://matrix.to/#/#tree-sitter-chat:matrix.org)

[Tree-sitter](https://github.com/tree-sitter/tree-sitter) grammar for the CLI video recorder.

[ci]: https://img.shields.io/github/actions/workflow/status/OXY2DEV/tree-sitter-vhs/ci.yml?logo=github&label=CI
[discord]: https://img.shields.io/discord/1063097320771698699?logo=discord&label=discord
[matrix]: https://img.shields.io/matrix/tree-sitter-chat%3Amatrix.org?logo=matrix&label=matrix

## 📥 Installation

### 💡 nvim-treesitter

Now, put this in your `nvim-treesitter` config,

```lua
local parser_configs = require("nvim-treesitter.parsers").get_parser_configs();

parser_configs.vhs = {
    install_info = {
        url = "https://github.com/OXY2DEV/tree-sitter-vhs",
        files = { "src/parser.c" },
        branch = "main",
    },
}
```

Now, quit & open Neovim and run this command,

```vim
:TSInstall vhs
```

### 💡 manual

1. Install the `tree-sitter` CLI tool.

2. Clone the repository in your machine and `cd` into it.

3. Run `tree-sitter build`(if it tells you to install dependencies then you should install them and retry).

4. Copy the `vhs.so` file to `~/.config/nvim/parser/`.

## 💥 Syntax highlighting

To get syntax highlighting you need to copy the `queries/highlights.scm` to `~/.config/nvim/queries/vhs/`.

