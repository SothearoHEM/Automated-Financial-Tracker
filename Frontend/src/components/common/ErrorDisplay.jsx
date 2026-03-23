import { MdRefresh } from "react-icons/md";
import { BiError } from "react-icons/bi";

function ErrorDisplay({ message, onRetry = null, className = "", retryLabel = "Retry", exception = null }) {
  if (!message && !exception) return null;

  const displayMessage = message || (exception?.message || 'An error occurred');

  return (
    <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg ${className}`} role="alert">
      <div className="flex flex-col items-center gap-2">
        <div className="shrink-0">
          <BiError className="text-7xl text-red-500 animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <div className="font-bold">
            {exception ? (
              <span className="uppercase text-sm tracking-wider text-red-600">Exception</span>
            ) : (
              <span className="text-2xl text-red-800">Error</span>
            )}
          </div>
          <p className="text-red-700 text-lg leading-relaxed">{displayMessage}</p>
          {exception?.details && (
            <details className="group text-left">
              <summary className="cursor-pointer flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors py-2">
                <span>Show Details</span>
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <pre className="mt-3 text-sm bg-red-100 border border-red-200 p-4 rounded-lg overflow-auto max-h-64 text-red-900 shadow-inner">
                {typeof exception.details === 'object'
                  ? JSON.stringify(exception.details, null, 2)
                  : exception.details}
              </pre>
            </details>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
            aria-label="Retry"
          >
            <MdRefresh className="text-xl" />
            <span>{retryLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
