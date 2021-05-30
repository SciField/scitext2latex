/*
 * @since 2020-09-09 22:53:14
 * @author acrazing <joking.young@gmail.com>
 */

import { selfCloseTags } from './config';
import { parse } from './parse';
import { INode, SyntaxKind } from './types';

export interface SafeHtmlOptions {
  allowedTags: string[];
  allowedAttrs: string[];
  tagAllowedAttrs: Record<string, string[]>;
  allowedUrl: RegExp;
}

export const safeHtmlDefaultOptions: SafeHtmlOptions = {
  allowedTags: [
    'link',
    'table',
    'td',
    'tr',
    'ol',
    'ul',
    'li',
    'section',
    'subsection',
    'equ',
    'fig',
    'thm',
    'alg',
    'comment',
    'quote',
    'note',
    'figs',
    'subfig'
  ],
  allowedAttrs: ['label'],
  tagAllowedAttrs: {
    section: ['title'],
    subsection: ['title'],
    fig :['src'],
    proof:['to'],
    comment:['cotent','author','color'],
    thm:['name'],
    alg:['name']
  },
  allowedUrl: /^(?:mailto|tel|https?|ftp|[^:]*[^a-z0-9.+-][^:]*):|^[^:]*$/i,
};

export function safeHtml(input: string, options: Partial<SafeHtmlOptions> = {}): string {
  const config: SafeHtmlOptions = {
    ...safeHtmlDefaultOptions,
    ...options,
    tagAllowedAttrs: {
      ...safeHtmlDefaultOptions.tagAllowedAttrs,
      ...options.tagAllowedAttrs,
    },
  };
  const ast = parse(input);
  return stringify(ast, config, input);
}

function stringify(ast: INode[], config: SafeHtmlOptions, input: string): string {
  return ast
    .map((node) => {
      if (node.type === SyntaxKind.Text) {
        return node.value;
      }
      if (config.allowedTags.indexOf(node.name) === -1) {
        throw new Error(`Not allowed tag "${node.name}"`);
      }
      if (selfCloseTags[node.name]) {
        if (node.body !== void 0) {
          throw new Error(`self closed tag "${node.name}" should not have body`);
        }
      } else {
        if (!node.body || !node.close) {
          throw new Error(`tag "${node.name}" should have body and close`);
        }
      }
      const attrs = node.attributes
        .filter((a) => {
          if (
            config.allowedAttrs.indexOf(a.name.value) > -1 ||
            config.tagAllowedAttrs[node.name]?.indexOf(a.name.value) > -1
          ) {
            if (!a.value) {
              return true;
            }
            if (a.name.value !== 'src' && a.name.value !== 'href') {
              return true;
            }
            if (config.allowedUrl.test(a.value.value)) {
              return true;
            }
            return false;
          }
          return false;
        })
        .map((a) => input.substring(a.start, a.end))
        .join(' ');
      const head = '<' + node.rawName + (attrs ? ' ' + attrs : '') + '>';
      if (!node.body) {
        return head;
      }
      return head + stringify(node.body, config, input) + `</${node.rawName}>`;
    })
    .join('');
}
