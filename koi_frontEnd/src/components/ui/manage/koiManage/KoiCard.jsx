import { Checkbox } from 'antd';
import PropTypes from "prop-types";
const KoiCard = ({ koi, onKoiClick, onKoiSelect, isSelected }) => {
  return (
    <div className="text-center relative">
      <div 
        className="w-full cursor-pointer rounded-xl relative flex flex-col"
        onClick={() => onKoiClick(koi)}
      >
        <div className="h-48 overflow-hidden rounded-xl relative">
          <img
            src={koi.imageUrl}
            alt={koi.name}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          <Checkbox
            onChange={() => onKoiSelect(koi.id)}
            checked={isSelected}
            className="absolute top-2 right-3 z-10 border-1 border-black rounded-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <h3 className="cursor-pointer mt-2 font-semibold truncate px-2">
          {koi.name}
        </h3>
      </div>
    </div>
  );
};

KoiCard.propTypes = {
  koi: PropTypes.object.isRequired,
  onKoiClick: PropTypes.func.isRequired,
  onKoiSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default KoiCard;