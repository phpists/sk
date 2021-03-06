import React, { Fragment } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { Field, useFormikContext } from "formik";

import { FormGroup, Dropdown } from "UI";
import dot from "dot-object";
import formErrors from "services/formErrors";

function SelectField({
  className,
  styles,
  labelClassName,
  label,
  name,
  placeholder,
  options,
  disabled,
  onSelect,
}) {
  const { touched, errors, setFieldValue } = useFormikContext();
  const error = formErrors.getErrorText(name, label, touched, errors);

  const getLabel = value => {
    const index = options.map(o => o.value).indexOf(value);

    return options[index] ? options[index].label : "";
  };

  const handleSelect = (name, value) => {
    if (onSelect) {
      onSelect(value);
    }

    setFieldValue(name, value, false);
  };

  return (
    <FormGroup
      className={cx(className, "relative")}
      style={styles}
      error={!!error}
    >
      <label className={labelClassName} htmlFor={name}>
        {error ? error : label}
      </label>

      <Field name={name}>
        {({ field: { value, ...rest } }) => (
          <Dropdown
            disabled={disabled}
            trigger={
              !disabled && (
                <div
                  className={cx(
                    "flex items-center h-full pl-4 text-sm",
                    !value ? "text-grey" : "text-black"
                  )}
                >
                  {value === null || value === "" ? placeholder : getLabel(value)}
                </div>
              )
            }
          >
            {({close}) => (
              <div>
                {options &&
                options.map((option, index) => (
                  <Fragment key={index}>
                    <input
                      id={`${name}-${option.value}`}
                      type="radio"
                      value={option.value === null ? "" : option.value}
                      checked={value === option.value}
                      name={name}
                      {...rest}
                    />
                    <label
                      className={cx(
                        "cursor-pointer leading-loose hover:text-red select-none",
                        value === option.value ? "text-red" : "text-black"
                      )}
                      htmlFor={`${name}-${option.value}`}
                      onClick={() => {
                        close();
                        handleSelect(name, option.value);
                      }}
                    >
                      {option.label}
                    </label>
                  </Fragment>
                ))
                }
              </div>
            )}
          </Dropdown>
        )}
      </Field>
    </FormGroup >
  );
}

SelectField.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

SelectField.defaultProps = {
  labelClassName: "text-grey"
};

export default SelectField;
