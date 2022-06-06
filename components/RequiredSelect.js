import React from "react";
import PropTypes from "prop-types";

const noop = () => {
  // no operation (do nothing real quick)
};

const colourStyles = {
  /*control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderColor: isFocused & "var(--main-color)",
    boxShadow: isFocused & "0 0 0 1px var(--main-color)",
  }),*/
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    //const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isFocused ? "var(--main-color)" : "white",
      color: "#222",
      cursor: isDisabled ? "not-allowed" : "default",
      zIndex: "555555",
    };
  },
};

class RequiredSelect extends React.Component {
  state = {
    value: this.props.value || "",
  };

  selectRef = null;
  setSelectRef = (ref) => {
    this.selectRef = ref;
  };

  onChange = (value, actionMeta) => {
    this.props.onChange(value, actionMeta);
    this.setState({ value });
  };

  getValue = () => {
    if (this.props.value != undefined) return this.props.value;
    return this.state.value || "";
  };

  render() {
    const { SelectComponent, required, ...props } = this.props;
    const { isLoading, isDisabled } = this.props;
    const enableRequired = !isDisabled;

    return (
      <div className="w-100">
        <SelectComponent
          {...props}
          ref={this.setSelectRef}
          onChange={this.onChange}
          styles={colourStyles}
        />
        {enableRequired && (
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              opacity: 0,
              width: "100% !important",
              height: 0,
              position: "absolute",
            }}
            value={this.getValue()}
            onChange={noop}
            onFocus={() => this.selectRef.focus()}
            required={required}
          />
        )}
      </div>
    );
  }
}

RequiredSelect.defaultProps = {
  onChange: noop,
};

RequiredSelect.protoTypes = {
  // react-select component class (e.g. Select, Creatable, Async)
  selectComponent: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default RequiredSelect;
