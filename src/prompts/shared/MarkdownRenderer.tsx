import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null

  return (
    <div className="bg-amber-50 mt-5 p-7 border border-amber-600 rounded-2xl shadow-xl">
      <ReactMarkdown
        className="prose prose-lg leading-relaxed max-w-none text-gray-900 tracking-wide"
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1
              className="text-4xl font-extrabold my-6 border-b-4 pb-3 text-amber-900 border-amber-700 tracking-wide leading-tight"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-3xl font-bold my-5 text-amber-800 tracking-wide leading-tight"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-2xl font-semibold my-4 text-amber-700 leading-relaxed tracking-wide"
              {...props}
            />
          ),
          h4: ({ ...props }) => (
            <h4
              className="text-xl font-medium my-3 text-amber-600 tracking-wider"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p
              className="text-gray-900 text-lg my-4 leading-9 tracking-wide"
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-amber-600 pl-6 italic text-amber-900 my-5 bg-amber-100 p-5 rounded-xl shadow-md leading-8">
              {props.children}
            </blockquote>
          ),
          code: ({ inline, ...props }) =>
            inline ? (
              <code
                className="bg-amber-300 px-2 py-1 rounded text-amber-900 font-mono text-base font-semibold tracking-wider shadow-sm"
                {...props}
              />
            ) : (
              <pre className="bg-amber-100 text-gray-900 p-5 rounded-xl overflow-x-auto text-base leading-relaxed border border-amber-700 shadow-xl">
                <code {...props} />
              </pre>
            ),
          ul: ({ ...props }) => (
            <ul
              className="list-disc pl-7 my-5 text-gray-900 text-lg leading-9 space-y-2 tracking-wide"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="list-decimal pl-7 my-5 text-gray-900 text-lg leading-9 space-y-2 tracking-wide"
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li
              className="my-3 leading-8 text-amber-900 font-medium tracking-wide"
              {...props}
            />
          ),
          hr: () => (
            <hr className="border-t-4 border-amber-600 my-6 shadow-sm" />
          ),
          strong: ({ ...props }) => (
            <strong
              className="font-bold text-amber-900 tracking-wide"
              {...props}
            />
          ),
          em: ({ ...props }) => (
            <em className="italic text-amber-700 tracking-wide" {...props} />
          )
        }}
      />
    </div>
  )
}

export default MarkdownRenderer
