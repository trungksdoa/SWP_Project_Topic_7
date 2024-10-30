import { Button } from 'antd';
import PropTypes from 'prop-types';

export default function KoiActions({
  onAddClick,
  onDeleteClick,
  onMoveClick,
  selectedCount,
  isDeleting,
  isMoving
}) {
  return (
    <div className="flex justify-center items-center">
      <button
        className="w-40 h-auto min-h-[2.5rem] py-1 px-1 border-black border-2 rounded-full flex items-center justify-center font-bold mr-2"
        onClick={onAddClick}
      >
        Add a new Koi
      </button>
      <button
        className={`w-40 h-auto min-h-[2.5rem] py-1 px-1 ${
          selectedCount > 0
            ? "bg-red-500 text-white"
            : "bg-gray-500 text-white"
        } rounded-full flex items-center justify-center font-bold`}
        disabled={selectedCount === 0 || isDeleting}
        onClick={onDeleteClick}
      >
        {isDeleting ? "Deleting..." : "Delete Koi"}
      </button>
      <button
        className={`w-40 h-auto min-h-[2.5rem] py-1 px-1 ${
          selectedCount > 0
            ? "bg-orange-500 text-white"
            : "bg-gray-500 text-white"
        } rounded-full flex items-center justify-center font-bold ml-2`}
        disabled={selectedCount === 0 || isMoving}
        onClick={onMoveClick}
      >
        {isMoving ? "Moving..." : "Move Koi"}
      </button>
    </div>
  );
}

KoiActions.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onMoveClick: PropTypes.func.isRequired,
  selectedCount: PropTypes.number.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isMoving: PropTypes.bool.isRequired
};