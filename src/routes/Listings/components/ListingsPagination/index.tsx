import React, { FC } from "react";
import { Select, Pagination } from "antd";
import { ListingsFilter } from "../../../../lib/graphql/globalTypes";

interface Props {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

const { Option } = Select;

export const ListingsPagination: FC<Props> = ({
  filter,
  setFilter,
  page,
  total,
  limit,
  setPage,
}) => {
  return (
    <div className="listings-filters">
      <span>Filter By</span>
      <Select
        value={filter}
        onChange={(filter: ListingsFilter) => setFilter(filter)}
      >
        <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>
          Price: Low to High
        </Option>
        <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>
          Price: High to Low
        </Option>
      </Select>
      <Pagination
        className="listings-pagination"
        current={page}
        total={total}
        defaultPageSize={limit}
        hideOnSinglePage
        showLessItems
        onChange={(pageValue) => setPage(pageValue)}
      />
    </div>
  );
};
