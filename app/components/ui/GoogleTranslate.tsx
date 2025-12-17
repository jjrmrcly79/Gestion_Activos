'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function GoogleTranslate() {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        const addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
        document.body.appendChild(addScript);

        // @ts-ignore
        window.googleTranslateElementInit = () => {
            // @ts-ignore
            new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es',
                layout: 0, // 0 = Vertical, 1 = Horizontal, 2 = Inline
                autoDisplay: false,
            }, 'google_translate_element');
            setIsScriptLoaded(true);
        };

        return () => {
            // Clean up if needed, though usually global google scripts stick around
        };
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-2">
            <Globe className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <div id="google_translate_element" className="overflow-hidden bg-transparent" />
            <style jsx global>{`
                /* Hide the google top bar */
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                .goog-te-banner-frame {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                    position: static !important;
                }
                /* Hide the specific google translate iframe that pushes content down */
                iframe.goog-te-banner-frame {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                }
                
                /* Style the dropdown */
                .goog-te-gadget-simple {
                    background-color: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    font-family: inherit !important;
                    font-size: 14px !important;
                }
                .goog-te-gadget-simple .goog-te-menu-value {
                    color: inherit !important;
                }
                .goog-te-gadget-icon {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}
