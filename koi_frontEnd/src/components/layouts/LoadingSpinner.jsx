const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[450px]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      <span className="ml-4 text-xl">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;