import XCTest
import SwiftTreeSitter
import TreeSitterVhs

final class TreeSitterVhsTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_vhs())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading VHS grammar")
    }
}
