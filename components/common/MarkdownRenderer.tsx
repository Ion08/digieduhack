import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const htmlContent = useMemo(() => {
    if (!content) return { __html: '' };
    // Using marked to parse markdown into HTML.
    // gfm: true enables GitHub Flavored Markdown (tables, etc.)
    // breaks: true makes newlines into <br> tags
    const parsedHtml = marked.parse(content, { gfm: true, breaks: true }) as string;
    return { __html: parsedHtml };
  }, [content]);

  return (
    <div
      // The `prose` classes from Tailwind's typography plugin style the raw HTML.
      // `prose-sm` provides sensible defaults for small text.
      // `max-w-none` removes the max-width constraint from prose.
      // `dark:prose-invert` inverts the colors for dark mode.
      className={`prose prose-sm max-w-none text-content dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={htmlContent}
    />
  );
};