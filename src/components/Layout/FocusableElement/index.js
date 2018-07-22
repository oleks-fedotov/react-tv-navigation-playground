import React from 'react';
import { connect } from 'react-redux';

const FocusableComponent = ({ isFocused, children }) => {
    if (React.Children.only(children)) {
        return React.cloneElement(children, { isFocused });
    } else {
        throw new Error('FocusableComponent can have only one child');
    }
};

const mapStateToProps = ({ navigation }, ownProps) => ({
    isFocused: ownProps.id === navigation.focusedId
});

const connectedFocusableComponent = connect(mapStateToProps)(FocusableComponent);

export default connectedFocusableComponent;