import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import  {dark}  from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TypeScriptCodeMarkdownProps {
  code: string;
}

const TypeScriptCodeMarkdown: React.FC<TypeScriptCodeMarkdownProps> = ({ code }) => {
  const markdownWithCode = `
    \`\`\`tsx
    ${code}
    \`\`\`
  `;

  return (
    <div className="markdown-container">
      <ReactMarkdown >{markdownWithCode}</ReactMarkdown>
    </div>
  );
};

const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={dark}>
      {value}
    </SyntaxHighlighter>
  );
};

export default TypeScriptCodeMarkdown;
