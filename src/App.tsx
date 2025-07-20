import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext.tsx';
import { DropProvider } from './DropContext.tsx';
import { ProductProvider } from './ProductContext.tsx';
import { ThemeProvider } from './ThemeContext.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import CartModal from './components/CartModal.tsx';
import Notification from './components/Notification.tsx';
import PageLoader from './components/PageLoader.tsx';

// Statically import page components to ensure reliable module resolution.
import HomePage from './components/HomePage.tsx';
import ShopPage from './components/ShopPage.tsx';
import GalleryPage from './components/GalleryPage.tsx';
import ProductDetailPage from './components/ProductDetailPage.tsx';


/**
 * --- Production-level Enhancements ---
 */

/**
 * An ErrorBoundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component tree.
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  // This lifecycle method is triggered after an error has been thrown by a descendant component.
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // This lifecycle method is also triggered after an error has been thrown by a descendant component.
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI.
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[var(--color-background)] text-[var(--color-text-primary)]">
          <h1 className="text-3xl font-serif font-bold text-[var(--color-danger)]">Something went wrong.</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">We've encountered a problem. Please try refreshing the page.</p>
          <button
            onClick={() => this.setState({ hasError: false }, () => window.location.reload())}
            className="btn btn-primary mt-6"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    // If there's no error, render the children as normal.
    return this.props.children;
  }
}

/**
 * A utility component that scrolls the window to the top whenever the route changes.
 * This ensures that navigating to a new page starts at the top of the content.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Effect runs every time the pathname changes.
  return null; // This component does not render anything.
};


/**
 * The main application component.
 * It sets up the overall structure, including routing and context providers.
 */
const App: React.FC = () => {
  return (
    // 1. ErrorBoundary catches runtime errors in the component tree.
    <ErrorBoundary>
      {/* 2. Context Providers wrap the application to provide global state. */}
      <ThemeProvider>
        <CartProvider>
          <DropProvider>
            <ProductProvider>
              {/* 3. HashRouter is used for client-side routing. */}
              <HashRouter>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen text-[var(--color-text-primary)] selection:bg-[var(--color-primary)]/30">
                  <Header />
                  <main className="flex-grow">
                    {/* 4. Suspense can be used for other async operations within pages. */}
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <CartModal />
                  <Notification />
                </div>
              </HashRouter>
            </ProductProvider>
          </DropProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
