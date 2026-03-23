import { BiError } from "react-icons/bi";

function ErrorForm({ message, className = "", exception = null }) {
  if (!message && !exception) return null;

  const displayMessage = message || (exception?.message || 'An error occurred');

  return (
    <div className={`flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md ${className}`} role="alert">
      <BiError className="text-red-600 shrink-0 mt-0.5"/>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">{displayMessage}</p>
        {exception?.details && (
          <details className="group mt-1">
            <summary className="cursor-pointer text-[10px] text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
              <span>Show details</span>
              <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <pre className="mt-2 text-[10px] bg-red-100 border border-red-200 p-2 rounded overflow-auto max-h-48 text-red-900">
              {typeof exception.details === 'object'
                ? JSON.stringify(exception.details, null, 2)
                : exception.details}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ErrorForm;
