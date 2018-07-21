import React, { Component, PropTypes } from 'react'

const Columns = ({ children }) =>
    children.map((child, index) => {
        React.cloneElement(child, {
            navigationLeft: index > 0
                ? children[index - 1]
                : null,
            navigationRight: index < children.length - 1
                ? children[index + 1]
                : null
        });
    });

Columns.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
}

export default Columns;