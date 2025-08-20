/**
 * Augments the JSX IntrinsicElements to include the <model-viewer> custom element.
 * This prevents TypeScript errors when using the element in JSX.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'disable-zoom'?: boolean;
        'environment-image'?: string;
        'shadow-intensity'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
      }, HTMLElement>;
    }
  }
}

// This export makes the file a module, which is required for global augmentations.
export {};
