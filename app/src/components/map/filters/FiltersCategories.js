import React, { Component } from "react";

import FilterCategoriesSingle from "./FiltersCategoriesSingle";

const API_GET_CATEGORIES = "http://localhost:8000/category";

class FilterCategories extends Component {
  state = {
    categories: []
  }

  componentWillMount() {
    fetch(API_GET_CATEGORIES)
      .then(response => response.json())
      .then(data => this.setState({ categories: data }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="col-12 mt-4">
        <div className="form__element">
          <div className="form__element__inner">
            <h4 className="heading">Wybierz kategorie:</h4>
            <div className="filter-sports">
              {this.state.categories.map((category,key) => (
                <FilterCategoriesSingle
                  categoryId={category.id}
                  icon={`/images/category-icons/${category.markup}`}
                  onIconClick={this.props.onIconClick}
                  key={key}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FilterCategories;
