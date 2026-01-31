import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-center my-8">
             <h3 className="text-red-400 font-bold mb-2">Component Error</h3>
             <p className="text-sm text-gray-400 mb-4">Our visualization engine encountered an unexpected error.</p>
             <button onClick={() => this.setState({ hasError: false })} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors cursor-pointer">
                Try to Recover
             </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
