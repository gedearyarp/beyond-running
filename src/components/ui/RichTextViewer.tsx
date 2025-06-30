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
                }
                .rich-text-viewer em {
                    font-style: italic;
                }
                .rich-text-viewer u {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
