import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("EduLyra render error:", error);
  }

  handleReload = () => window.location.reload();
  handleHome = () => { window.location.href = "/"; };

  render() {
    if (this.state.hasError) {
      return (
        <div className="landing-shell grid min-h-screen place-items-center px-6 text-center">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/[.06] p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#22D3EE] text-xl font-black text-white">E</div>
            <h1 className="mt-5 text-2xl font-black text-white">EduLyra is recovering</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">A page encountered an unexpected error. Your saved local data is preserved.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" className="btn-primary" onClick={this.handleReload}>Reload</button>
              <button type="button" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white" onClick={this.handleHome}>Home</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);