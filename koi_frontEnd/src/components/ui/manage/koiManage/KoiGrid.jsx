import KoiCard from './KoiCard';
import EmptyKoiState from "./EmptyKoiState";
import PropTypes from "prop-types";

// Make sure to use 'export default' here
export default function KoiGrid({ koi, selectedKoiIds, onKoiClick, onKoiSelect }) {
  if (koi.length === 0) {
    return <EmptyKoiState />;
  }

  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-14 mb-2">
      {koi.map((koiItem, index) => (
        <KoiCard
          key={koiItem.id || index}
          koi={koiItem}
          onKoiClick={onKoiClick}
          onKoiSelect={onKoiSelect}
          isSelected={selectedKoiIds.includes(koiItem.id)}
        />
      ))}
    </div>
  );
}

KoiGrid.propTypes = {
  koi: PropTypes.array.isRequired,
  selectedKoiIds: PropTypes.array.isRequired,
  onKoiClick: PropTypes.func.isRequired,
  onKoiSelect: PropTypes.func.isRequired,
};
