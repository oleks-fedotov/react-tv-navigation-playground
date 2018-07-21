import React from 'react';
import PropTypes from 'prop-types';

const Rows = ({ children }) =>
    children.map((child, index) =>
        <div>
            {
                React.cloneElement(child, {
                    navigationUp: index > 0
                        ? children[index - 1]
                        : null,
                    navigationDown: index < children.length - 1
                        ? children[index + 1]
                        : null
                })
            }
        </div>
    );

Rows.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
};

export default Rows;