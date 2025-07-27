import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

interface RichTextViewerProps {
    content: string;
    className?: string;
}

export default function RichTextViewer({ content, className = "" }: RichTextViewerProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: "text-blue-500 hover:underline",
                },
            }),
        ],
        content,
        editable: false,
    });

    return (
        <div className="rich-text-viewer">
            <EditorContent editor={editor} className={className} />
            <style jsx global>{`
                .rich-text-viewer ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }
                .rich-text-viewer ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin: 0.5rem 0;
                }
                .rich-text-viewer ul li,
                .rich-text-viewer ol li {
                    margin-bottom: 0.25rem;
                }
                .rich-text-viewer p {
                    margin-bottom: 0.5rem;
                }
                .rich-text-viewer strong {
                    font-weight: bold;
                    font-family: 'itc-bold', sans-serif;
                }
                .rich-text-viewer em {
                    font-style: italic;
                }
                .rich-text-viewer i {
                    font-style: italic;
                }
                .rich-text-viewer u {
                    text-decoration: underline;
                }
                .rich-text-viewer h1,
                .rich-text-viewer h2,
                .rich-text-viewer h3,
                .rich-text-viewer h4,
                .rich-text-viewer h5,
                .rich-text-viewer h6 {
                    font-weight: bold;
                    margin: 1em 0 0.5em 0;
                    line-height: 1.2;
                }
                .rich-text-viewer h1 { font-size: 2rem; }
                .rich-text-viewer h2 { font-size: 1.5rem; }
                .rich-text-viewer h3 { font-size: 1.25rem; }
                .rich-text-viewer h4 { font-size: 1.1rem; }
                
                /* Styling for <i> tags based on parent context */
                .rich-text-viewer h1 i,
                .rich-text-viewer h2 i,
                .rich-text-viewer h3 i,
                .rich-text-viewer h4 i,
                .rich-text-viewer h5 i,
                .rich-text-viewer h6 i {
                    font-family: 'itc-bold-obl', sans-serif;
                }
                
                .rich-text-viewer p i {
                    font-family: 'itc-md-obl', sans-serif;
                }
                
                .rich-text-viewer div i {
                    font-family: 'itc-md-obl', sans-serif;
                }
                
                .rich-text-viewer span i {
                    font-family: 'itc-md-obl', sans-serif;
                }
                
                /* For smaller text contexts, use lighter oblique */
                .rich-text-viewer small i,
                .rich-text-viewer .text-xs i,
                .rich-text-viewer .text-sm i {
                    font-family: 'itc-xl-obl', sans-serif;
                }
                
                /* For larger text contexts, use bolder oblique */
                .rich-text-viewer .text-lg i,
                .rich-text-viewer .text-xl i,
                .rich-text-viewer .text-2xl i {
                    font-family: 'itc-demi-obl', sans-serif;
                }
            `}</style>
        </div>
    );
}
