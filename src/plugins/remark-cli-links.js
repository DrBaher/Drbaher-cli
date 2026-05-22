/**
 * Auto-link references to the eight CLIs in markdown content.
 * Walks text nodes inside paragraphs and list items, splits where matched,
 * and replaces matches with link nodes pointing to /tools/<cli>/.
 *
 * Skips text already inside links, code, or headings (which already have
 * their own anchor handling via rehype-autolink-headings).
 */
import { visit, SKIP } from 'unist-util-visit';

// Longest names first so e.g. "template-vault-cli" wins over a hypothetical
// "vault-cli" substring and the regex alternation prefers the full match.
const CLIS = ['template-vault-cli', 'contract-vault-cli', 'nda-review-cli', 'docx2pdf-cli', 'compare-cli', 'extract-cli', 'draft-cli', 'sign-cli'];
const PATTERN = new RegExp(`\\b(${CLIS.join('|')})\\b`, 'g');

const SKIP_PARENT_TYPES = new Set(['link', 'inlineCode', 'code', 'heading']);

export default function remarkCliLinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index == null) return;
      if (SKIP_PARENT_TYPES.has(parent.type)) return;

      const value = node.value;
      if (!value || !PATTERN.test(value)) {
        PATTERN.lastIndex = 0;
        return;
      }
      PATTERN.lastIndex = 0;

      const out = [];
      let last = 0;
      let m;
      while ((m = PATTERN.exec(value)) !== null) {
        if (m.index > last) {
          out.push({ type: 'text', value: value.slice(last, m.index) });
        }
        out.push({
          type: 'link',
          url: `/tools/${m[1]}/`,
          children: [{ type: 'inlineCode', value: m[1] }],
        });
        last = m.index + m[0].length;
      }
      if (last < value.length) {
        out.push({ type: 'text', value: value.slice(last) });
      }

      parent.children.splice(index, 1, ...out);
      return [SKIP, index + out.length];
    });
  };
}
