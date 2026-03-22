import { MdErrorOutline, MdRefresh } from "react-icons/md";

function ErrorDisplay({ message, onRetry = null, className = "", retryLabel = "Retry", exception = null }) {
  if (!message && !exception) return null;

  const displayMessage = message || (exception?.message || 'An error occurred');

  return (
    <div className={`bg-red-50 border-2 border-red-300 text-red-800 px-4 py-4 rounded-lg ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <MdErrorOutline className="text-2xl text-red-600" />
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">
            {exception ? (
              <span className="uppercase text-xs tracking-wide text-red-700 font-bold">Exception</span>
            ) : (
              <span className="text-red-900">Error</span>
            )}
          </div>
          <p className="text-red-700 mb-2">{displayMessage}</p>
          {exception?.details && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800">
                Show Details
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40 text-red-900">
                {typeof exception.details === 'object'
                  ? JSON.stringify(exception.details, null, 2)
                  : exception.details}
              </pre>
            </details>
          )}
        </div>
        {onRetry && (
          <div className="shrink-0">
            <button
              onClick={onRetry}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
              aria-label="Retry"
            >
              <MdRefresh className="text-sm" />
              <span>{retryLabel}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
