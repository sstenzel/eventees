import React from "react";
import $ from "jquery";

const FilterCategoriesSingle = props => {
  $(".filter-sports__single").click(function() {
    $(".filter-sports__single")
      .not(this)
      .removeClass("active");
    $(this).toggleClass("active");
  });

  return (
    <div className="filter-sports__single">
      <img
        src={props.icon}
        alt="sport icon"
        onClick={e => props.onIconClick(props.categoryId)}
      />
    </div>
  );
};

export default FilterCategoriesSingle;
