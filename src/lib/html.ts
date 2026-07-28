/** Matches a paragraph with no real content: <p><br></p>, <p></p>, <p>&nbsp;</p>. */
const EMPTY_PARAGRAPH = /<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi;

/** Splits on <pre> blocks, keeping them as captured (odd-indexed) chunks. */
const PRE_BLOCK = /(<pre[\s\S]*?<\/pre>)/gi;

/**
 * Normalise Quill's HTML for display.
 *
 * Quill writes a blank <p><br></p> between paragraphs. The previous cleanup
 * turned each into a bare <br/>, which then sat between two block-level
 * paragraphs — that both prevents their vertical margins from collapsing and
 * contributes a line box of its own, so the gap rendered at roughly three
 * times what the stylesheet intends. The paragraph margins already separate
 * paragraphs, so these are dropped instead of converted.
 *
 * Runs of &nbsp; collapse to a single space: .ql-editor sets
 * `white-space: pre-wrap`, which would otherwise preserve them as visible gaps.
 *
 * Content inside <pre> is left completely untouched — those blocks hold the
 * only meaningful newlines and indentation on the site (code samples).
 */
export const cleanPostHtml = (html = ''): string =>
  html
    .split(PRE_BLOCK)
    .map((chunk, index) =>
      // Odd indices are the captured <pre> blocks.
      index % 2 === 1
        ? chunk
        : chunk.replace(EMPTY_PARAGRAPH, '').replace(/(?:&nbsp;)+/gi, ' ')
    )
    .join('');
