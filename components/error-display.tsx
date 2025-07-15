import { FiAlertCircle } from "react-icons/fi";

const ErrorDisplay = ({ message = "Something went wrong. Please try again." }: { message?: string }) => {
  return (
    <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
      <FiAlertCircle className="mr-2 w-6 h-6 flex-shrink-0" />
      <strong className="font-bold mr-1">Error:</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

export default ErrorDisplay;
