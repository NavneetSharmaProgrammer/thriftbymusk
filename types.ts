<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-g" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary Meta Tags -->
    <title>Thrift by Musk - Curated Vintage & Pre-Loved Fashion</title>
    <meta name="title" content="Thrift by Musk - Curated Vintage & Pre-Loved Fashion">
    <meta name="description" content="Shop curated vintage & pre-loved fashion from brands like Zara & Ralph Lauren at Thrift by Musk. Sustainable, timeless style with new drops.">
    <meta name="keywords" content="thrift store, vintage fashion, pre-loved, sustainable fashion, thrift india, curated thrift, zara, ralph lauren, online thrift store">
    <meta name="author" content="Thrift by Musk">
    <meta name="developer" content="Navneet Sharma, navneetsharmaprogrammer@gmail.com">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://thriftbymusk.com/">
    <meta property="og:title" content="Thrift by Musk - Curated Vintage & Pre-Loved Fashion">
    <meta property="og:description" content="Shop curated vintage & pre-loved fashion from brands like Zara & Ralph Lauren. Sustainable, timeless style with new drops.">
    <meta property="og:image" content="https://drive.google.com/file/d/1wE7L2p5N_N-HwXyJ2K8qY7tQ8jZ9k5F4/view?usp=drive_link">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://thriftbymusk.com/">
    <meta property="twitter:title" content="Thrift by Musk - Curated Vintage & Pre-Loved Fashion">
    <meta property="twitter:description" content="Shop curated vintage & pre-loved fashion from brands like Zara & Ralph Lauren. Sustainable, timeless style with new drops.">
    <meta property="twitter:image" content="https://drive.google.com/file/d/1wE7L2p5N_N-HwXyJ2K8qY7tQ8jZ9k5F4/view?usp=drive_link">

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
      /* ==========================================================================
         Theme System using CSS Custom Properties
         ========================================================================== */
      
      /* 1. Light Theme (Default) */
      :root {
        --color-primary: #8B5E34;
        --color-primary-hover: #7a522d;
        --color-background: #FDFCFB;
        --color-surface: #ffffff;
        --color-surface-alt: #f5f5f4;
        --color-border: #e5e7eb;
        --color-text-primary: #3D3D3D;
        --color-text-secondary: #4b5563;
        --color-text-muted: #9ca3af;
        --color-text-inverted: #ffffff;
        --color-danger: #dc2626;
        --color-success: #16a34a;
        --color-white: #ffffff;
        --color-black: #000000;
      }

      /* 2. Dark Theme */
      .dark {
        --color-primary: #c5a382;
        --color-primary-hover: #d4b598;
        --color-background: #121212;
        --color-surface: #1e1e1e;
        --color-surface-alt: #2a2a2a;
        --color-border: #404040;
        --color-text-primary: #e5e5e5;
        --color-text-secondary: #a3a3a3;
        --color-text-muted: #737373;
        --color-text-inverted: #1e1e1e;
        --color-danger: #f87171;
        --color-success: #4ade80;
      }
      
      /* 3. Sepia (Night Protection) Theme */
      .sepia {
        --color-primary: #8B5E34;
        --color-primary-hover: #7a522d;
        --color-background: #f4e9db;
        --color-surface: #fffaf0;
        --color-surface-alt: #fdf5e6;
        --color-border: #eaddc7;
        --color-text-primary: #5b4636;
        --color-text-secondary: #6d5d4b;
        --color-text-muted: #937965;
        --color-text-inverted: #ffffff;
        --color-danger: #c0392b;
        --color-success: #27ae60;
      }


      /* ==========================================================================
         Base & Global Styles
         ========================================================================== */
      
      html {
        scroll-padding-top: 80px; /* Offset for sticky header */
        scroll-behavior: smooth;
      }
      body {
        font-family: 'Inter', sans-serif;
        background-color: var(--color-background);
        color: var(--color-text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      .font-serif {
        font-family: 'Playfair Display', serif;
      }

       /* Button Styles */
       .btn {
            display: inline-block;
            padding: 0.75rem 2rem;
            text-align: center;
            font-weight: 600;
            border-radius: 0.5rem;
            transition-property: transform, background-color, color, opacity, box-shadow;
            transition-duration: 300ms;
            transition-timing-function: ease-in-out;
        }
        .btn:active {
            transform: scale(0.98) !important;
            opacity: 0.9;
        }
        .btn-primary {
            background-color: var(--color-primary);
            color: var(--color-text-inverted);
            border: 1px solid var(--color-primary);
        }
        .btn-primary:hover {
            background-color: var(--color-primary-hover);
            border-color: var(--color-primary-hover);
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(139, 94, 52, 0.2);
        }
        .btn-primary:disabled {
            background-color: var(--color-text-muted);
            border-color: var(--color-text-muted);
            color: var(--color-surface);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .btn-secondary {
            background-color: transparent;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
        }
        .btn-secondary:hover {
            background-color: var(--color-primary);
            color: var(--color-text-inverted);
            transform: scale(1.05);
        }

        /* Skeleton Loader Animation */
        @keyframes pulse {
          50% {
            background-color: var(--color-surface-alt);
          }
        }
        .product-card-image-container.is-loading {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Product Card & Image Styles */
        .product-card-image-container {
            position: relative;
            width: 100%;
            padding-top: 125%; /* 4:5 Aspect Ratio */
            overflow: hidden;
            background-color: var(--color-surface-alt);
        }
        .product-card-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        }
        .product-card .back {
            opacity: 0;
        }
        .product-card:hover .back {
            opacity: 1;
        }
        .product-card:hover .product-card-image {
            transform: scale(1.05);
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }

        /* Reveal on scroll animation */
        .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        /* Sold Out Ribbon */
        .sold-out-ribbon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }
        .dark .sold-out-ribbon {
             background-color: rgba(0, 0, 0, 0.6);
        }
        .sold-out-ribbon span {
            background-color: var(--color-danger);
            color: var(--color-white);
            padding: 8px 120px;
            font-weight: bold;
            font-size: 1.25rem;
            text-transform: uppercase;
            transform: rotate(-20deg);
            border: 2px solid var(--color-white);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            letter-spacing: 0.1em;
        }

        /* Hero Floating Shapes */
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        .hero-shape {
            position: absolute;
            border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
            animation: float 12s ease-in-out infinite;
            z-index: 0;
        }
        
        /* Accessibility Focus Ring */
        *:focus-visible {
            outline: 3px solid var(--color-primary-hover);
            outline-offset: 2px;
            border-radius: 4px;
        }

        /* Custom Checkbox styles */
        .custom-checkbox {
            appearance: none;
            background-color: var(--color-surface);
            margin: 0;
            font: inherit;
            color: var(--color-text-secondary);
            width: 1.15em;
            height: 1.15em;
            border: 0.15em solid currentColor;
            border-radius: 0.15em;
            transform: translateY(-0.075em);
            display: grid;
            place-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .custom-checkbox::before {
            content: "";
            width: 0.65em;
            height: 0.65em;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em var(--color-primary);
            transform-origin: bottom left;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }
        .custom-checkbox:checked::before {
            transform: scale(1);
        }
        .custom-checkbox:checked {
            border-color: var(--color-primary);
            background-color: var(--color-primary);
            color: var(--color-text-inverted);
        }
        .custom-checkbox:hover {
            border-color: var(--color-primary);
        }

        /* Toast Notification Styles */
        .toast-notification {
            position: fixed;
            bottom: 1.25rem;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            background-color: var(--color-text-primary);
            color: var(--color-background);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 100;
        }

        /* Product Detail Page Gallery Styles */
        .main-image-container {
            aspect-ratio: 4 / 5;
            background-color: var(--color-surface-alt);
            border-radius: 0.5rem;
            overflow: hidden;
            position: relative;
        }
        .main-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.3s ease-in-out;
        }
        .thumbnail-button {
            aspect-ratio: 1 / 1;
            border-radius: 0.5rem;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid transparent;
            transition: border-color 0.2s ease-in-out;
            opacity: 0.8;
        }
        .thumbnail-button:hover {
            opacity: 1;
        }
        .thumbnail-button.active {
            border-color: var(--color-primary);
            opacity: 1;
        }
        .thumbnail-button img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .aspect-video {
            position: relative;
            padding-top: 56.25%; /* 16:9 ratio */
        }
        .aspect-video > iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.1.0/",
    "react": "https://esm.sh/react@^19.1.0",
    "react-dom/": "https://esm.sh/react-dom@^19.1.0/",
    "react-router-dom": "https://esm.sh/react-router-dom@^7.7.0"
  }
}
</script>
</head>
  <body class="antialiased">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>