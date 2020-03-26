// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "mocha";
import { CommentKind, LineTokenKind, TokenKind } from "../../../lexer";
import {
    AbridgedComments,
    AbridgedLineTokens,
    AbridgedSnapshot,
    AbridgedTokens,
    expectAbridgedSnapshotMatch,
    expectLineTokenMatch,
    expectSnapshotAbridgedComments,
    expectSnapshotAbridgedTokens,
} from "./common";

const LINE_TERMINATOR: string = "\n";

describe(`Lexer`, () => {
    describe(`MultilineTokens Abridged LineToken`, () => {
        describe(`MultilineComment`, () => {
            it(`/**/`, () => {
                const text: string = `/**/`;
                const expected: AbridgedLineTokens = [[LineTokenKind.MultilineComment, `/**/`]];
                expectLineTokenMatch(text, expected, true);
            });

            it(`/*/*/`, () => {
                const text: string = `/*/*/`;
                const expected: AbridgedLineTokens = [[LineTokenKind.MultilineComment, `/*/*/`]];
                expectLineTokenMatch(text, expected, true);
            });

            it(`/*\\n*/`, () => {
                const text: string = `/*${LINE_TERMINATOR}*/`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.MultilineCommentStart, `/*`],
                    [LineTokenKind.MultilineCommentEnd, `*/`],
                ];
                expectLineTokenMatch(text, expected, true);
            });

            it(`/*\\nfoobar\\n*/`, () => {
                const text: string = `/*${LINE_TERMINATOR}foobar${LINE_TERMINATOR}*/`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.MultilineCommentStart, `/*`],
                    [LineTokenKind.MultilineCommentContent, `foobar`],
                    [LineTokenKind.MultilineCommentEnd, `*/`],
                ];
                expectLineTokenMatch(text, expected, true);
            });

            it(`/*\\n\nfoobar\\n\\n*/`, () => {
                const text: string = `/*${LINE_TERMINATOR}${LINE_TERMINATOR}foobar${LINE_TERMINATOR}${LINE_TERMINATOR}*/`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.MultilineCommentStart, `/*`],
                    [LineTokenKind.MultilineCommentContent, `foobar`],
                    [LineTokenKind.MultilineCommentEnd, `*/`],
                ];
                expectLineTokenMatch(text, expected, true);
            });
        });

        describe(`TextLiteral`, () => {
            it(`""`, () => {
                const text: string = `""`;
                const expected: AbridgedLineTokens = [[LineTokenKind.TextLiteral, `""`]];
                expectLineTokenMatch(text, expected, true);
            });

            it(`"\\n"`, () => {
                const text: string = `"${LINE_TERMINATOR}"`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.TextLiteralStart, `"`],
                    [LineTokenKind.TextLiteralEnd, `"`],
                ];
                expectLineTokenMatch(text, expected, true);
            });

            it(`"\\nfoobar\\n"`, () => {
                const text: string = `"${LINE_TERMINATOR}foobar${LINE_TERMINATOR}"`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.TextLiteralStart, `"`],
                    [LineTokenKind.TextLiteralContent, `foobar`],
                    [LineTokenKind.TextLiteralEnd, `"`],
                ];
                expectLineTokenMatch(text, expected, true);
            });
        });

        describe(`QuotedIdentifer`, () => {
            it(`""`, () => {
                const text: string = `#""`;
                const expected: AbridgedLineTokens = [[LineTokenKind.Identifier, `#""`]];
                expectLineTokenMatch(text, expected, true);
            });

            it(`#"\\n"`, () => {
                const text: string = `#"${LINE_TERMINATOR}"`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.QuotedIdentifierStart, `#"`],
                    [LineTokenKind.QuotedIdentifierEnd, `"`],
                ];
                expectLineTokenMatch(text, expected, true);
            });

            it(`#"\\nfoobar\\n"`, () => {
                const text: string = `#"${LINE_TERMINATOR}foobar${LINE_TERMINATOR}"`;
                const expected: AbridgedLineTokens = [
                    [LineTokenKind.QuotedIdentifierStart, `#"`],
                    [LineTokenKind.QuotedIdentifierContent, `foobar`],
                    [LineTokenKind.QuotedIdentifierEnd, `"`],
                ];
                expectLineTokenMatch(text, expected, true);
            });
        });
    });

    describe(`MultilineTokens Abridged LexerSnapshot`, () => {
        describe(`MultilineComment`, () => {
            it(`/**/`, () => {
                const text: string = `/**/`;
                const expected: AbridgedComments = [[CommentKind.Multiline, `/**/`]];
                expectSnapshotAbridgedComments(text, expected, true);
            });

            it(`/* */`, () => {
                const text: string = `/* */`;
                const expected: AbridgedComments = [[CommentKind.Multiline, `/* */`]];
                expectSnapshotAbridgedComments(text, expected, true);
            });

            it(`/* X */`, () => {
                const text: string = `/* X */`;
                const expected: AbridgedComments = [[CommentKind.Multiline, `/* X */`]];
                expectSnapshotAbridgedComments(text, expected, true);
            });

            it(`/*X\\nX\\nX*/`, () => {
                const text: string = `/*X${LINE_TERMINATOR}X${LINE_TERMINATOR}X*/`;
                const expected: AbridgedComments = [
                    [CommentKind.Multiline, `/*X${LINE_TERMINATOR}X${LINE_TERMINATOR}X*/`],
                ];
                expectSnapshotAbridgedComments(text, expected, true);
            });

            it(`abc /*X\\nX\\nX*/`, () => {
                const text: string = `abc /*X${LINE_TERMINATOR}X${LINE_TERMINATOR}X*/`;
                const expected: AbridgedSnapshot = {
                    comments: [[CommentKind.Multiline, `/*X${LINE_TERMINATOR}X${LINE_TERMINATOR}X*/`]],
                    tokens: [[TokenKind.Identifier, `abc`]],
                };
                expectAbridgedSnapshotMatch(text, expected, true);
            });

            it(`/*X\\nX\\nX*/ abc`, () => {
                const text: string = `/*X${LINE_TERMINATOR}X${LINE_TERMINATOR}X*/ abc`;
                const expected: AbridgedSnapshot = {
                    tokens: [[TokenKind.Identifier, `abc`]],
                    comments: [[CommentKind.Multiline, `/*X${LINE_TERMINATOR}X${LINE_TERMINATOR}X*/`]],
                };
                expectAbridgedSnapshotMatch(text, expected, true);
            });
        });

        describe(`TextLiteral`, () => {
            it(`"X"`, () => {
                const text: string = `"X"`;
                const expected: AbridgedTokens = [[TokenKind.TextLiteral, `"X"`]];
                expectSnapshotAbridgedTokens(text, expected, true);
            });

            it(`"X\\nX\\nX"`, () => {
                const text: string = `"X${LINE_TERMINATOR}X${LINE_TERMINATOR}X"`;
                const expected: AbridgedTokens = [[TokenKind.TextLiteral, `"X${LINE_TERMINATOR}X${LINE_TERMINATOR}X"`]];
                expectSnapshotAbridgedTokens(text, expected, true);
            });

            it(`abc "X\\nX\\nX"`, () => {
                const text: string = `abc "X${LINE_TERMINATOR}X${LINE_TERMINATOR}X"`;
                const expected: AbridgedTokens = [
                    [TokenKind.Identifier, `abc`],
                    [TokenKind.TextLiteral, `"X${LINE_TERMINATOR}X${LINE_TERMINATOR}X"`],
                ];
                expectSnapshotAbridgedTokens(text, expected, true);
            });

            it(`"X\\nX\\nX" abc`, () => {
                const text: string = `"X${LINE_TERMINATOR}X${LINE_TERMINATOR}X" abc`;
                const expected: AbridgedTokens = [
                    [TokenKind.TextLiteral, `"X${LINE_TERMINATOR}X${LINE_TERMINATOR}X"`],
                    [TokenKind.Identifier, `abc`],
                ];
                expectSnapshotAbridgedTokens(text, expected, true);
            });
        });
    });
});