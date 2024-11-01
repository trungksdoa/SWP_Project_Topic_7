import { Input, Select, Space, Button, Checkbox } from 'antd';
import { SearchOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;

export default function KoiFilters({
  searchTerm,
  selectedPondFilter,
  sortCriteria,
  sortOrder,
  allSelected,
  ponds,
  onSearchChange,
  onPondFilterChange,
  onSortChange,
  onSortOrderToggle,
  onSelectAll,
  onCancelSelect,
  selectedKoiCount
}) {
  return (
    <div className="flex justify-between items-center mx-4 my-6">
      <div className="flex justify-start items-center w-1/3">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300, height: 45, fontSize: 16 }}
          className="mr-2"
          suffix={<SearchOutlined style={{ fontSize: 16 }} />}
        />
        <Select
          placeholder="Filter by pond"
          value={selectedPondFilter}
          onChange={onPondFilterChange}
          style={{ width: 200, height: 45 }}
          allowClear
        >
          {ponds?.map((pond) => (
            <Option key={pond.id} value={pond.id}>
              {pond.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="flex justify-end items-center w-1/3">
        <Space>
          <Select
            value={sortCriteria}
            style={{ width: 120 }}
            onChange={onSortChange}
          >
            <Option value="dateCreated">Date Created</Option>
            <Option value="name">Name</Option>
            <Option value="length">Length</Option>
            <Option value="weight">Weight</Option>
            <Option value="age">Age</Option>
            <Option value="pond">Pond</Option>
          </Select>
          <Button onClick={onSortOrderToggle}>
            {sortOrder === "asc" ? (
              <SortAscendingOutlined />
            ) : (
              <SortDescendingOutlined />
            )}
          </Button>
        </Space>
        <Checkbox
          onChange={(e) => onSelectAll(e.target.checked)}
          checked={allSelected}
          className="ml-2 mr-2 whitespace-nowrap"
        >
          Select All
        </Checkbox>
        <Button
          onClick={onCancelSelect}
          disabled={selectedKoiCount === 0}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

KoiFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  selectedPondFilter: PropTypes.number,
  sortCriteria: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  allSelected: PropTypes.bool.isRequired,
  ponds: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onPondFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSortOrderToggle: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onCancelSelect: PropTypes.func.isRequired,
  selectedKoiCount: PropTypes.number.isRequired
};