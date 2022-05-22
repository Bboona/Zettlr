// /**
//   * @ignore
//   * BEGIN HEADER
//   *
//   * Contains:        Codeblock copy button rendering plugin
//   * CVM-Role:        CodeMirror Plugin
//   * Maintainer:      --
//   * License:         GNU GPL v3
//   *
//   * Description:     This plugin renders a button to copy code from within a fenced code block
//   *
//   * END HEADER
//   */

// import CodeMirror, { commands } from 'codemirror'
// import canRenderElement from './util/can-render-element'
// import { getCodeBlockRE } from '@common/regular-expressions';

// const codeBlockRE = getCodeBlockRE(true)

// /**
//  * Declare the markdownRenderCodeBlockButton command
//  *
//  * @param   {CodeMirror.Editor}  cm  The CodeMirror instance
//  */
// ;(commands as any).markdownRenderCodeBlockButton = function (cm: CodeMirror.Editor) {
//   // We'll only render the viewport
//   const viewport = cm.getViewport()
//   for (let i = viewport.from; i < viewport.to; i++) {
//     if (cm.getModeAt({ line: i, ch: 0 }).name !== 'markdown-zkn') {
//       continue
//     }

//     // First get the line and test if the contents contain a link
//     const line = cm.getLine(i)

//     for (const match of line.matchAll(codeBlockRE)) {
//       const which = match[1].length // 1=italic, 2=bold, 3=italic and bold
//       // Since we're using matchAll, index will not be undefined
//       const from = { line: i, ch: match.index as number }
//       const to = { line: i, ch: match.index as number + match[0].length }

//       if (!canRenderElement(cm, from, to)) {
//         continue
//       }

//       const span = document.createElement('span')
//       switch (which) {
//         case 1: // Italic
//           span.style.fontStyle = 'italic'
//           break
//         case 2: // Bold or strikethrough
//           if (match[1] === '~~') {
//             span.style.textDecoration = 'line-through'
//           } else {
//             span.style.fontWeight = 'bold'
//           }
//           break
//         case 3: // Both
//           span.style.fontStyle = 'italic'
//           span.style.fontWeight = 'bold'
//           break
//       }

//       // Replace the few things that can be part of an emphasis
//       let contents = match[2]
//       contents = contents.replace(/~~([^~]+?)~~/g, '<del>$1</del>')
//       contents = contents.replace(/`([^`]+?)`/g, '<code>$1</code>')

//       span.innerHTML = contents

//       const textMarker = cm.markText(
//         from, to,
//         {
//           className: 'test',
//           clearOnEnter: true,
//           replacedWith: span,
//           inclusiveLeft: false,
//           inclusiveRight: false
//         }
//       )

//       span.onclick = function (e) {
//         textMarker.clear()
//         cm.setCursor(cm.coordsChar({ left: e.clientX, top: e.clientY }))
//         cm.focus()
//       }
//     }
//   } // END for-loop
// }


/**
  * @ignore
  * BEGIN HEADER
  *
  * Contains:        Emphasis rendering plugin
  * CVM-Role:        CodeMirror Plugin
  * Maintainer:      Hendrik Erz
  * License:         GNU GPL v3
  *
  * Description:     This plugin renders emphasis such as italics and bold
  *
  * END HEADER
  */

 import CodeMirror, { commands } from 'codemirror'
 import canRenderElement from './util/can-render-element'
//import count_codeblock from 'source/common/modules/markdown-editor/hooks/codeblock-classes'

 // const emphasisRE = /(?<![\\])(?<=\s|^)([*_]{1,3}|~{2})((?!\s)[^*_]+?(?<![\s\\]))(?:[*_]{1,3}|~{2})(?=\s|$)/g
 const emphasisRE = /(?<![\\\w])([*_]{1,3}|~{2})((?!\s)[^*_]+?(?![\s\\]))(?:[*_]{1,3}|~{2})(?![\\\w])/g

 /**
  * Declare the markdownRenderEmphasis command
  *
  * @param   {CodeMirror.Editor}  cm  The CodeMirror instance
  */
 ;(commands as any).markdownRenderCodeBlockButton = function (cm: CodeMirror.Editor) {
   // We'll only render the viewport
   const viewport = cm.getViewport()
   for (let i = viewport.from; i < viewport.to; i++) {
     if (cm.getModeAt({ line: i, ch: 0 }).name !== 'markdown-zkn') {
       continue
     }

     // First get the line and test if the contents contain a link
     const line = cm.getLine(i)

     for (const match of line.matchAll(emphasisRE)) {
       const which = match[1].length // 1=italic, 2=bold, 3=italic and bold
       // Since we're using matchAll, index will not be undefined
       const from = { line: i, ch: match.index as number }
       const to = { line: i, ch: match.index as number + match[0].length }

       if (!canRenderElement(cm, from, to)) {
         continue
       }

       const span = document.createElement('span')
       switch (which) {
         case 1: // Italic
           span.style.fontStyle = 'italic'
           break
         case 2: // Bold or strikethrough
           if (match[1] === '~~') {
             span.style.textDecoration = 'line-through'
           } else {
             span.style.fontWeight = 'bold'
           }
           break
         case 3: // Both
           span.style.fontStyle = 'italic'
           span.style.fontWeight = 'bold'
           break
       }
       span.style.background = 'green'

       // Replace the few things that can be part of an emphasis
       let contents = match[2]
       contents = contents.replace(/~~([^~]+?)~~/g, '<del>$1</del>')
       contents = contents.replace(/`([^`]+?)`/g, '<code>$1</code>')

       span.innerHTML = contents

       const textMarker = cm.markText(
         from, to,
         {
           className: 'test',
           clearOnEnter: true,
           replacedWith: span,
           inclusiveLeft: false,
           inclusiveRight: false
         }
       )

       span.onclick = function (e) {
         textMarker.clear()
         cm.setCursor(cm.coordsChar({ left: e.clientX, top: e.clientY }))
         cm.focus()
       }
     }

     // -------------- CODE TO CREATE BUTTON -------------------------------
     // At the moment this only gets the first code block (the array[0] part)
     // This can be fixed later by adding a for loop over all the elements with
     // the class name
     //export default function copy_button (var count_position): void {
     //}
     var count_codeblock = 0
     const codeBlockRE = /^(?:\s{0,3}`{3}|~{3}).*/
     const lineCount = cm.lineCount()
     for (let j = 0; j<lineCount; j++){
       const line = cm.getLine(i)
       if (codeBlockRE.test(line)){
         //console.log(cm.getLine(++i))
         count_codeblock = count_codeblock + 1
       }
     }
    // console.log(count_codeblock,"count_codeblock")


     //console.log("count block",count_codeblock)
     //for (let i = 0; i < count_codeblock; i++) {

     //}
     let codeBlock = document.getElementsByClassName("code-block-first-line")[1]

     // Create a button
     let copyButton = document.createElement("button")
     copyButton.className = "code-block-copy-button"
     copyButton.innerText = "Copy Code Block"

     // If the code block does not already have a button
     // I added this because it seemed to be constantly adding buttons while
     // the render plugin was running
     // This way, only one button will be added to a code block
     if (codeBlock.querySelector(".code-block-copy-button") == null) {
       codeBlock.appendChild(copyButton)
     }
   } // END for-loop
 }

