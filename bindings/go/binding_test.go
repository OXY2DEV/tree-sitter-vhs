package tree_sitter_vhs_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_vhs "github.com/oxy2dev/tree-sitter-vhs/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_vhs.Language())
	if language == nil {
		t.Errorf("Error loading VHS grammar")
	}
}
