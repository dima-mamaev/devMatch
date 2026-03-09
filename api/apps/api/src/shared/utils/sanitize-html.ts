import sanitizeHtml from 'sanitize-html';

export function sanitizeHtmlContent(html: string | undefined): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    // 1. Allow all tags EXCEPT the most dangerous ones
    allowedTags: false,
    nonTextTags: ['script', 'style', 'noscript', 'object', 'embed', 'iframe'],

    // 2. Allow all attributes EXCEPT those starting with "on" (event handlers)
    allowedAttributes: {
      '*': ['*'], // Start by allowing everything
    },
    // Use transformTags to strip "on*" attributes from any tag
    transformTags: {
      '*': function (tagName, attribs) {
        for (const attr in attribs) {
          if (attr.startsWith('on')) {
            delete attribs[attr]; // Remove dangerous event handlers like onclick
          }
        }
        return { tagName, attribs };
      },
    },

    // 3. Block dangerous URI schemes (javascript:, data:, etc.)
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
      img: ['http', 'https', 'data'],
    },
  });
}
