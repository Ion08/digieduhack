import React from 'react';
import { Source } from '../types';
import { Icon } from './common/Icon';

export const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.substring(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
        console.error("Invalid URL for YouTube", e);
        return null;
    }
};

export const SourceViewer: React.FC<{ source: Source | null }> = ({ source }) => {
    if (!source) {
        return (
            <div className="p-4 flex flex-col items-center justify-center h-full text-center text-content/60">
                <Icon icon="book" className="w-16 h-16 mb-4"/>
                <h4 className="font-bold">No sources in this chapter yet.</h4>
                <p>Click the '+' button to add your first study source!</p>
            </div>
        );
    }

    if (source.type === 'web' && source.url) {
        // A simple message is shown instead of an iframe to avoid cross-origin issues in many environments.
        return (
             <div className="p-4 prose prose-sm max-w-none dark:prose-invert text-content">
                <h4 className="font-bold text-xl mb-4">{source.title}</h4>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                    Click here to view the web source in a new tab &rarr;
                </a>
                <p className="mt-4 text-xs text-content/60">(Note: Web pages are not embedded directly to ensure security and compatibility.)</p>
                <h5 className="font-bold mt-6">AI-Generated Summary:</h5>
                <p className="whitespace-pre-wrap">{source.content}</p>
            </div>
        )
    }
    
    const embedUrl = source.type === 'youtube' ? getYouTubeEmbedUrl(source.url || '') : null;

    return (
        <div className="p-4 prose prose-sm max-w-none dark:prose-invert text-content">
            <h4 className="font-bold text-xl mb-4">{source.title}</h4>
            {embedUrl && (
                <div className="aspect-video mb-4">
                    <iframe src={embedUrl} title={source.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg w-full h-full"></iframe>
                </div>
            )}
            <p className="whitespace-pre-wrap">{source.content}</p>
        </div>
    );
};
