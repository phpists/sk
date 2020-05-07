import { useQuery } from "@apollo/react-hooks";
import checkLoggedIn from "lib/checkLoggedIn";
import { Filter } from "UI";
import { GET_FILTERS_STATE, GIRLS_FILTER_OPTIONS, ALL_EMPLOYEES } from "queries";
import EmployeesBox from "components/EmployeesBox";
import { usePagination } from "hooks";
import {useState} from "react";
import {Sort} from "UI";
import React from "react";
import filterHelpers from "UI/Filter/helpers";
import {useTranslation} from "react-i18next";

const GirlsSearch = ({ user, entityName, fields, filters }) => {
  const [page, setPage] = usePagination();
  const [filtersState, setFiltersState] = useState({});
  const {t, i18n} = useTranslation();
  console.log(filters[entityName]);
  let stateFilters = filtersState;

  if (Object.keys(filtersState).length === 0) {
    stateFilters = filterHelpers.filterFilters(filters[entityName]);
  }

  let filteredFilters = stateFilters;

  console.log(filteredFilters);

  let filtersForQuery = Object.assign({}, filteredFilters);

  // 1 - active, 2 - coming soon
  filtersForQuery.show_level = filtersForQuery.show_level ? [1, 2] : [1];

  const { loading: employeesLoading, error: employeesError, data: { employees } = {}, refetch, networkStatus } = useQuery(ALL_EMPLOYEES, {
    variables: {
      first: 10,
      page,
      filters: {
        ...filtersForQuery
      }
    }
  });

  function setFilter(key, value) {
    filteredFilters[key] = value;

    setFiltersState(filterHelpers.filterFilters(filteredFilters));

    refetch();
  }

  function setFilters(filters) {
    setFiltersState(filterHelpers.filterFilters(filters));
    refetch();
  }

  const sorts = [
    {
      id: 1,
      label: t('employees.first_young'),
      orderBy: [
        {
          field: "age",
          order: 'ASC',
        }
      ],
    },
    {
      id: 2,
      label: t('employees.first_old'),
      orderBy: [
        {
          field: "age",
          order: 'DESC',
        }
      ],
    },
  ];

  const filterName = entityName.replace('_', ' ');

  return (
    <>
      <Filter
        name={filterName}
        inititalState={filters[entityName]}
        filters={filteredFilters}
        fields={fields}
        setFilter={setFilter}
        setFilters={setFilters}
        bgClass="employee-search"
      />
      <EmployeesBox
        sortComponent={<Sort sorts={sorts} setFilter={setFilter} orderBy={filteredFilters.orderBy}/>}
        loading={employeesLoading}
        error={employeesError}
        page={page}
        setPage={setPage}
        employees={employees}
        networkStatus={networkStatus}
      />
    </>
  );
};

GirlsSearch.getInitialProps = async ctx => {
  const { loggedInUser: user } = await checkLoggedIn(ctx.apolloClient);
  if (!user) {
    return {};
  }
  return { user };
};

export default GirlsSearch;
