import React from "react";
import { ReactComponent as FinderIcon } from "assets/images/icons/component/finder.svg";

const SearchBar = ({ className, placeholder, value, onChange }) => {
    return (
        <div className={`search-bar ${className}`}>
            <FinderIcon />
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar;
