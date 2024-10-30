import { Spin } from 'antd';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[450px]">
      <Spin size="large" />
      <span className="mt-4 text-gray-500">Loading koi data...</span>
    </div>
  );
}