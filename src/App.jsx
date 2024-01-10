/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => ({
  ...product,
  category: categoriesFromServer
    .find(category => product.categoryId === category.id),
}));

const preparedproducts = products.map(product => ({
  ...product,
  user: usersFromServer.find(user => product.category.ownerId === user.id),
}));

function filteredList(goods, filterType, quary) {
  let resultGoods = [...goods];

  if (filterType !== 'All') {
    resultGoods = resultGoods
      .filter(good => good.user.name === filterType);
  }

  if (quary) {
    const normalizedQuary = quary.toLowerCase().trim();

    resultGoods = resultGoods
      .filter(good => good.name.toLowerCase().includes(normalizedQuary));
  }

  return resultGoods;
}

export const App = () => {
  const [fiterByName, setfilterField] = useState('All');
  const [filterByText, setfilterByText] = useState('');
  // const [filterByCategory, setfilterByCategory] = useState('All');
  const visibleList = filteredList(preparedproducts, fiterByName, filterByText);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setfilterField('All')}
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({ 'is-active': fiterByName === 'All' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => setfilterField(user.name)}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': fiterByName === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={(event) => {
                    setfilterByText(event.currentTarget.value);
                  }}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterByText}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterByText && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={() => setfilterByText('')}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={() => {
                  setfilterField('All');
                  setfilterByText('');
                }}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleList.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleList.map(visibleProduct => (
                  <tr data-cy="Product" key={visibleProduct.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {visibleProduct.id}
                    </td>

                    <td data-cy="ProductName">{visibleProduct.name}</td>
                    <td data-cy="ProductCategory">
                      {`${visibleProduct.category.icon} - ${visibleProduct.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames(
                        { 'has-text-link': visibleProduct.user.sex === 'm' },
                        { 'has-text-danger': visibleProduct.user.sex === 'f' },
                      )}
                    >
                      {visibleProduct.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
