import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { DebounceSelect, DebounceSelectProps, SelectOption } from "@components/Form";

import { TableColumnType } from "../interface";
import TableHeaderFilterLabel from "./FilterLabel";

interface TableHeaderFilterProps {
  column: TableColumnType;
  onChange: (dataIndex: string, value?: string | number) => void;
}

const TableHeaderFilter = ({ column, onChange }: TableHeaderFilterProps) => {
  const { formatMessage } = useIntl();

  const [optionSearch, setOptionSearch] = useState("");

  const columnTitle = useMemo<string>(() => {
    if (typeof column.title === "string") {
      return column.title;
    }

    return column.title?.toString() ?? "";
  }, [column]);

  const columnDataIndex = useMemo(() => String(column.dataIndex), [column]);

  const { data: options, isFetching: isFetchingOptions } = useQuery({
    queryKey: ["table", "header", "filter", columnDataIndex, optionSearch, column.onGetFilterOptions],
    queryFn: () => column.onGetFilterOptions!(optionSearch),
  });

  const selectOptions = useMemo(() => {
    if (!options) {
      return [];
    }

    return options.map((option) => ({ value: option.value, label: option.text }));
  }, [options]);

  const handleFetchOptions = useCallback(async (search: string) => {
    setOptionSearch(search);
  }, []);

  const handleRenderLabel = useCallback<Required<DebounceSelectProps>["labelRender"]>(
    ({ label }) => {
      return <TableHeaderFilterLabel title={columnTitle} text={String(label)} />;
    },
    [columnTitle],
  );

  const handleChange = useCallback(
    (value: unknown) => {
      onChange(String(columnDataIndex), value as string);
    },
    [columnDataIndex, onChange],
  );

  return (
    <DebounceSelect
      allowClear
      className="table-header-filter mb-6 mr-6 block min-w-56 last:mr-0"
      isFetching={isFetchingOptions}
      labelRender={handleRenderLabel}
      name={`header-${columnDataIndex}`}
      options={selectOptions as unknown as SelectOption[]}
      placeholder={formatMessage({ id: "select_name" }, { name: columnTitle })}
      onFetch={handleFetchOptions}
      onChange={handleChange}
    />
  );
};

export default memo(TableHeaderFilter);
