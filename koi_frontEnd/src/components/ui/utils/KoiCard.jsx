import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
const itemCard = ({ data, onClick, onQuickView }) => {
  return (
    <div className="relative text-center">
      <div
        className="w-16 h-16 mx-auto mb-1 overflow-hidden rounded-full shadow hover:shadow-md cursor-pointer transition-shadow duration-200"
        onClick={() => onClick(data)}
      >
        <img
          src={data.imageUrl}
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <h3
          className="text-xs font-medium truncate max-w-[80px] cursor-pointer hover:text-blue-600"
          onClick={() => onKoiClick(koi)}
        >
          {data.name}
        </h3>
        <Button
          type="link"
          size="small"
          className="text-xs text-gray-500 hover:text-blue-600 p-0 h-auto flex items-center gap-0.5"
          onClick={() => onQuickView(koi)}
        >
          <EyeOutlined className="text-xs" />
          View result
        </Button>
      </div>
    </div>
  );
};

KoiCard.propTypes = {
  koi: PropTypes.object.isRequired,
  onKoiClick: PropTypes.func.isRequired,
  onQuickView: PropTypes.func.isRequired,
};

export default KoiCard;