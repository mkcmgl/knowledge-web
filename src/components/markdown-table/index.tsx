import React, { useEffect, useRef } from 'react';

interface MarkdownTableProps {
  text: string;
}

const MarkdownTable: React.FC<MarkdownTableProps> = ({ text }) => {
  const contentTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathpix-markdown-it@1.3.6/es5/bundle.js";
    script.async = true;
    document.head.appendChild(script);
    console.log(`text`,text);
    script.onload = () => {
      if (typeof window.render === 'function') {
        const options = {
          htmlTags: true,
        };
        const html = window.render(text, options);
        if (contentTextRef.current) {
          contentTextRef.current.innerHTML = html;
        }
      } else {
        console.error('render function is not available');
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [text]);

  return (
    <div style={{height:500,overflow:"auto", }}>
      <div ref={contentTextRef}></div>
    </div>
  );
};

export default MarkdownTable;
