import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useStylist } from '../StylistContext';
import { fileToBase64 } from '../utils';
import { CloseIcon, SparklesIcon, CameraIcon, ArrowUpTrayIcon, LoadingIcon, ArrowLeftIcon } from './Icons';

const VirtualStylistModal: React.FC = () => {
  const { isStylistOpen, toggleStylist } = useStylist();
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('How can I style this?');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrompt('How can I style this?');
    setResponse('');
    setError('');
    setIsLoading(false);
  };

  useEffect(() => {
    if (isStylistOpen) {
      resetState();
    }
  }, [isStylistOpen]);
  
  useEffect(() => {
    if (!isStylistOpen) return;
    const modalNode = modalRef.current;
    if (!modalNode) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement;
    const focusableElements = modalNode.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') toggleStylist();
        if (event.key === 'Tab') {
            if (event.shiftKey) { 
                if (document.activeElement === firstElement) { lastElement.focus(); event.preventDefault(); }
            } else { 
                if (document.activeElement === lastElement) { firstElement.focus(); event.preventDefault(); }
            }
        }
    };

    modalNode.addEventListener('keydown', handleKeyDown);
    return () => {
        modalNode.removeEventListener('keydown', handleKeyDown);
        previouslyFocusedElement?.focus();
    };
  }, [isStylistOpen, toggleStylist, imageFile, response]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const getAdvice = async () => {
    if (!imageFile || !prompt) {
      setError('Please provide an image and a question.');
      return;
    }
    
    // API key is sourced from environment variables.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setError('API key is not configured. This feature is unavailable.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey });
      const base64Image = await fileToBase64(imageFile);

      const imagePart = {
        inlineData: { mimeType: imageFile.type, data: base64Image },
      };
      const textPart = { text: prompt };

      const genAIResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: "You are a friendly and encouraging fashion stylist named 'Musk'. Provide concise, helpful, and positive styling advice based on the user's image and question. Suggest specific types of clothing (e.g., 'high-waisted jeans', 'a leather jacket'), colors, or accessories. Structure your response with a friendly greeting, followed by 2-3 bullet points with suggestions, and a positive closing remark. Keep your entire response under 150 words. Do not use markdown formatting for lists; use simple dashes (-) or asterisks (*)."
        }
      });
      
      setResponse(genAIResponse.text);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isStylistOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <LoadingIcon className="w-16 h-16 text-[var(--color-primary)] mb-4"/>
            <h3 className="text-xl font-semibold">Finding inspiration...</h3>
            <p className="text-[var(--color-text-secondary)]">Your personal stylist is thinking.</p>
        </div>
      );
    }

    if (response) {
      return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-3">
                 <img src={imagePreview!} alt="User's clothing item" className="w-20 h-20 object-cover rounded-lg bg-[var(--color-surface-alt)]" />
                 <div>
                    <p className="font-semibold text-[var(--color-text-secondary)]">Your question:</p>
                    <p className="italic">"{prompt}"</p>
                 </div>
              </div>
              <div className="bg-[var(--color-surface-alt)] p-4 rounded-lg space-y-3 whitespace-pre-wrap font-sans text-sm">
                 {response}
              </div>
            </div>
            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] mt-auto">
               <button onClick={resetState} className="btn btn-secondary w-full">Ask Another Question</button>
            </div>
        </div>
      );
    }

    if (imagePreview) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-2">
                        <ArrowLeftIcon className="w-4 h-4" /> Back
                    </button>
                    <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-64 object-contain rounded-lg bg-[var(--color-surface-alt)]" />
                    <div>
                        <label htmlFor="style-prompt" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Your Question</label>
                        <textarea
                            id="style-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)] focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                            placeholder="e.g., What shoes would go with this?"
                        />
                    </div>
                </div>
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] mt-auto">
                    <button onClick={getAdvice} className="btn btn-primary w-full">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Get Advice
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <SparklesIcon className="w-16 h-16 text-[var(--color-primary)] opacity-50 mb-4"/>
            <h3 className="text-xl font-semibold">Your Personal AI Stylist</h3>
            <p className="text-[var(--color-text-secondary)] mt-2 mb-6">Need styling advice? Upload a photo of an item and I'll help you out!</p>
            <div className="w-full space-y-3 max-w-xs">
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary w-full flex items-center justify-center gap-2">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    Upload Photo
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary w-full flex items-center justify-center gap-2">
                     <CameraIcon className="w-5 h-5" />
                    Use Camera
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                />
            </div>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={toggleStylist} role="dialog" aria-modal="true" aria-labelledby="stylist-heading">
      <div ref={modalRef} className="w-full max-w-md h-[80vh] max-h-[600px] bg-[var(--color-surface)] flex flex-col shadow-2xl rounded-lg" style={{ animation: 'zoomIn 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
        <style>{`@keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
        
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
            <h2 id="stylist-heading" className="text-xl font-serif font-bold flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-[var(--color-primary)]"/>
                Virtual Stylist
            </h2>
            <button onClick={toggleStylist} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" aria-label="Close virtual stylist">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-grow overflow-hidden relative">
            {renderContent()}
        </div>

        {error && (
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded-lg text-sm text-center animate-fade-in">
                {error}
            </div>
        )}
      </div>
    </div>
  );
};

export default VirtualStylistModal;