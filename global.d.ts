declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'disable-zoom'?: boolean;
      'environment-image'?: string;
      'shadow-intensity'?: string | number;
      style?: React.CSSProperties;
    };
  }
}
