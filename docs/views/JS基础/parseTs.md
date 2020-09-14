---
title: 分享typescript编译原理
date: 2020-09-13
tags:
  - js基础
categories:
  - 前端基础
---

## 前言

   本文是对《深入理解Typescript》中编译原理章节做了总结, 分享给大家, 如有错误, 欢迎指正！

## 编译器

  Typescript编译器主要分为以下五个关键部分:

  - Scanner 扫描器 (scanner.ts)
  - Parser 解析器 (parser.ts) 
  - Binder 绑定器 (binder.ts)
  - Checker 检查器 (checker.ts)
  - Emitter 发射器 (emitter.ts)

  每个部分的编译器代码在src/compiler都可以找到, 本文会对每个解析器进行一一讲解。在开始之前,我从网上找了一张图 能够帮助我们了解编译器是如何将上述几个关键部分组合在一起的。

  ![image](./img/parse.png)

  从上图我们可以发现, 编译器主要分了三条线路: 

  - 源代码 -> 扫描器 -> token流 -> 解析器 -> AST ->绑定器 -> Symbol(符号)
  - AST -> 检查器 ~~ Symbol(符号) -> 类型检查
  - AST -> 检查器 ~~ 发射器 -> js代码

  我先介绍每个解析器的工作原理, 最后我将会对每一条线路做一次概括。

## 扫描器

  ts扫描器的源代码均位于scanner.ts中。通过先前的流程图, 我们发现扫描器的作用就是将源代码生成token流。
  我们接下来直接进入到scanner.ts中的``` createScanner ``` 创建扫描器的函数进行逐一解读。为了便于大家理解大致流程, 我将会对一些代码进行删减。

  ```js
export function createScanner(languageVersion: ScriptTarget,
    skipTrivia: boolean,
    languageVariant = LanguageVariant.Standard,
    text?: string,
    onError?: ErrorCallback,
    start?: number,
    length?: number): Scanner {
        let pos: number;
        let end: number;
        let startPos: number;
        let tokenPos: number;
        let token: SyntaxKind;
        let tokenValue: string;
        setText(text, start, length);
        // ...
        return {
            getStartPos: () => startPos,
            getTextPos: () => pos,
            getToken: () => token,
            getTokenPos: () => tokenPos,
            getTokenText: () => text.substring(tokenPos, pos),
            getTokenValue: () => tokenValue,
            // ...
            scan,
            // ...
        };

  ```

  我们通过``` createScanner ```创建扫描器之后, 需要对源代码进行扫描操作, 对应源码中的```scan```函数。我们继续找到scan函数的逻辑, 因为createScanner函数里面只是定义了一些函数, 并没有实质上的逻辑流程进展。

  ```js
 function scan(): SyntaxKind {
      startPos = pos;
      hasExtendedUnicodeEscape = false;
      precedingLineBreak = false;
      tokenIsUnterminated = false;
      numericLiteralFlags = 0;
      while (true) {
          tokenPos = pos;
          if (pos >= end) {
              return token = SyntaxKind.EndOfFileToken;
          }
          let ch = text.charCodeAt(pos);

          // Special handling for shebang
          if (ch === CharacterCodes.hash && pos === 0 && isShebangTrivia(text, pos)) {
              pos = scanShebangTrivia(text, pos);
              if (skipTrivia) {
                  continue;
              }
              else {
                  return token = SyntaxKind.ShebangTrivia;
              }
          }

          switch (ch) {
              case CharacterCodes.lineFeed:
              case CharacterCodes.carriageReturn:
                  precedingLineBreak = true;
                  if (skipTrivia) {
                      pos++;
                      continue;
                  }
                  else {
                      if (ch === CharacterCodes.carriageReturn && pos + 1 < end && text.charCodeAt(pos + 1) === CharacterCodes.lineFeed) {
                          // consume both CR and LF
                          pos += 2;
                      }
                      else {
                          pos++;
                      }
                      return token = SyntaxKind.NewLineTrivia;
                  }
              case CharacterCodes.tab:
                // ...

  ```

  scan函数返回了``` SyntaxKind ``` 类型的值, 我们且来看看这到底是啥?
  通过源代码中的注释``` token > SyntaxKind.Identifer => token is a keyword ```, 我发现它是生成```token```的必要条件。 
  除此之外, 它还定义了各种关键字比如: ``` return ```, ``` super ```, ``` switch ``` ...。我们先暂且认定它为词法关键词的枚举。

  ```js
    // token > SyntaxKind.Identifer => token is a keyword
    // Also, If you add a new SyntaxKind be sure to keep the `Markers` section at the bottom in sync
    export const enum SyntaxKind {
        Unknown,
        EndOfFileToken,
        SingleLineCommentTrivia,
        MultiLineCommentTrivia,
        NewLineTrivia,
        WhitespaceTrivia,
        // We detect and preserve #! on the first line
        ShebangTrivia,
        // We detect and provide better error recovery when we encounter a git merge marker.  This
        // allows us to edit files with git-conflict markers in them in a much more pleasant manner.
        ConflictMarkerTrivia,
        // Literals
        NumericLiteral,
        StringLiteral,
        JsxText,
        JsxTextAllWhiteSpaces,
        RegularExpressionLiteral,
        NoSubstitutionTemplateLiteral,
        // Pseudo-literals
        TemplateHead,
        TemplateMiddle,
        TemplateTail,
        // Punctuation
        OpenBraceToken,
        ReturnKeyword,
        SuperKeyword,
        SwitchKeyword,
        ThisKeyword,
        ThrowKeyword,
        TrueKeyword,
        TryKeyword,
        TypeOfKeyword,
        VarKeyword,
        VoidKeyword,
        WhileKeyword,
        WithKeyword,
        // ...
    }
  ```

  继续阅读scan函数内的逻辑。我们发现后半部分的逻辑主要都是根据   ```let ch = text.charCodeAt(pos);``` 这句话有关。通过生成 Unicode 编码, 从而得到扫描的结果。那么我们可以得出一个简单的结论： 扫描器通过与输入的源代码进行词法分析, 得到对应的```SyntaxKind ```即“token”。