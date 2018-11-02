import React from 'react';
import { PropTypes } from 'prop-types';
import './style.css';

const RowHeader = ({ title }) => (
    <div className="row-header">
        {title}
    </div>
);

RowHeader.propTypes = {
    title: PropTypes.string,
};

export default RowHeader;
