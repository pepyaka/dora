import type { Root } from "mdast";
import { VFile } from "vfile";
import { visit } from "unist-util-visit";

// RegExps
const reNumberDot = /^(?<marker>\d+\.)\s*(?<text>.+)/;
const reLatinParen = /^\s*(?<marker>\([a-z]\))\s*(?<text>.+)/;
const reRomanParen =
  /^\s*(?<marker>\(M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})\))\s*(?<text>.+)/i;
const reNumberParen = /^\s*(?<marker>\([0-9]+\))\s*(?<text>.+)/;

export function myRemarkPluginToIncreaseHeadings() {
  return function (tree: Root, file: VFile) {
    if (file.data.astro?.frontmatter?.regulation) {
      processRegulationMarkdownTree(tree);
    }
  };
}

function processRegulationMarkdownTree(tree: Root) {
      let numberDotCounter =1, latinParenCounter = 1, romanParenCpunter = 1, numberParenCounter = 1;
      // '`' is before 'a'
      let prevLatinParenCharCode = "a".charCodeAt(0) - 1;
      visit(tree, function (node) {
        if (node.type === "text") {
          const line = node.value;
          const numberDotMatch = line.match(reNumberDot);
          const latinParenMatch = line.match(reLatinParen);
          const romanParenMatch = line.match(reRomanParen);
          const numberParenMatch = line.match(reNumberParen);

          let level: MarkerLevel, marker: string = "", text: string = "";

          // marker like '4.'
          if (numberDotMatch?.groups) {
            const { marker, text } = numberDotMatch.groups;
            if (marker === '1.') {
              numberDotCounter = 1;
            }
            let prefix = `${numberDotCounter}. `;
            numberDotCounter += 1;
          } // marker like '(d)'
          else if (latinParenMatch?.groups) {
            ({ marker, text } = latinParenMatch.groups);
            const latinParenCharCode = marker.charCodeAt(1);
            // latin and roman could have same letters
            if (
              marker === "(a)" ||
              latinParenCharCode - 1 === prevLatinParenCharCode
            ) {
              level = MarkerLevel.LatinParen;
              prevLatinParenCharCode = latinParenCharCode;
            } else {
              level = MarkerLevel.RomanParen;
            }
          } // marker like '(iv)'
          else if (romanParenMatch?.groups) {
            ({ marker, text } = romanParenMatch.groups);
            level = MarkerLevel.RomanParen;
          } // marker like '(4)'
          else if (numberParenMatch?.groups) {
            const { marker, text } = numberParenMatch.groups;
            if (marker === '(1)') {
              numberParenCounter = 1;
            }
            numberParenCounter += 1;
          }
        }
      });
  
}
export enum MarkerLevel {
  Undefined = 0,
  NumberDot = 1,
  LatinParen = 2,
  RomanParen = 3,
  NumberParen = 4,
}

type PlainItem = {
  level: MarkerLevel;
  marker: string;
  text: string;
};

export type NestedItem = {
  fragment: string;
  text: string;
  children: NestedItem[];
};

// const plainItems: PlainItem[] = [];

// // Create a plain items list
// $("p").each(function (n) {
//   const line = $(this).text();
//   const numberDotMatch = line.match(reNumberDot);
//   const latinParenMatch = line.match(reLatinParen);
//   const romanParenMatch = line.match(reRomanParen);
//   const numberParenMatch = line.match(reNumberParen);

//   let level: MarkerLevel, marker: string, text: string;

//   // marker like '4.'
//   if (numberDotMatch?.groups) {
//     ({ marker, text } = numberDotMatch.groups);
//     level = MarkerLevel.NumberDot;
//   }
//   // marker like '(d)'
//   else if (latinParenMatch?.groups) {
//     ({ marker, text } = latinParenMatch.groups);
//     const latinParenCharCode = marker.charCodeAt(1);
//     // latin and roman could have same letters
//     if (marker === "(a)" || latinParenCharCode - 1 === prevLatinParenCharCode) {
//       level = MarkerLevel.LatinParen;
//       prevLatinParenCharCode = latinParenCharCode;
//     } else {
//       level = MarkerLevel.RomanParen;
//     }
//   }
//   // marker like '(iv)'
//   else if (romanParenMatch?.groups) {
//     ({ marker, text } = romanParenMatch.groups);
//     level = MarkerLevel.RomanParen;
//   }
//   // marker like '(4)'
//   else if (numberParenMatch?.groups) {
//     ({ marker, text } = numberParenMatch.groups);
//     level = MarkerLevel.NumberParen;
//   }
//   // There should not be any other markers
//   else {
//     throw Error(`Mismatch correct patern line #${n}:\n${line}`);
//   }

//   plainItems.push({ level, marker, text });
// });
