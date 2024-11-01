export default function EmptyKoiState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center min-h-[450px] text-gray-500">
      <svg 
        className="w-24 h-24 mb-4 text-gray-300"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 4h18M9 3v2m6-2v2"
        />
      </svg>
      <div className="text-xl font-medium mb-2">No Koi Found</div>
      <p className="text-gray-400">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
}
