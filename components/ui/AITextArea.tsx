'use client';

import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AITextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    context: 'work-order' | 'risk' | 'general' | 'strategy' | 'investment' | 'lifecycle' | 'asset' | 'inventory' | 'assessment';
    label?: string;
}

export default function AITextArea({ context, label, className, ...props }: AITextAreaProps) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState((props.value as string) || (props.defaultValue as string) || '');
    const textareaId = props.id || props.name || `ai-text-${Math.random().toString(36).substr(2, 9)}`;

    const handleEnhance = async () => {
        if (!value) return;
        setLoading(true);

        try {
            const res = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: value, context })
            });

            const data = await res.json();
            if (data.result) {
                const enhanced = data.result;
                setValue(enhanced);

                // Keep DOM in sync for formal forms and trigger change
                setTimeout(() => {
                    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
                    if (textarea) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                        if (nativeInputValueSetter) {
                            nativeInputValueSetter.call(textarea, enhanced);
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                            textarea.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }, 0);
            }
        } catch (e) {
            alert('AI Service Unavailable');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">{label}</label>
                    <button
                        type="button"
                        onClick={handleEnhance}
                        disabled={loading || !value}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {loading ? 'Thinking...' : 'AI Enhance'}
                    </button>
                </div>
            )}
            <div className="relative">
                <textarea
                    {...props}
                    id={textareaId}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        props.onChange?.(e);
                    }}
                    className={`w-full p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-purple-200 transition-shadow ${className}`}
                />
                {!label && (
                    <button
                        type="button"
                        onClick={handleEnhance}
                        disabled={loading || !value}
                        className="absolute right-2 bottom-2 p-1.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-50"
                        title="Enhance with AI"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    </button>
                )}
            </div>
            <p className="text-[10px] text-muted-foreground text-right">* AI suggestions are drafts. Please verify before submitting.</p>
        </div>
    );
}
