import React from "react";
import { Formik, validateYupSchema, yupToFormErrors } from "formik";
import PropTypes from "prop-types";
import Router from "next/router";
import { useSteps } from "hooks";
import { Button, FormGroup } from "UI";
import { getErrors } from "utils";

function EditEmployeeForm({ initialValues, children }) {
  const { step, setStep } = useSteps("editEmployee");

  const activeStep = React.Children.toArray(children)[step];
  const isLastStep = step === React.Children.count(children) - 1;

  const prev = () => {
    let currentStep = step <= 0 ? 0 : step - 1;
    setStep(currentStep);
  };

  const next = () => {
    setStep(Math.min(step + 1, children.length - 1));
  };

  const validate = values => {
    if (activeStep.props.validationSchema) {
      try {
        validateYupSchema(values, activeStep.props.validationSchema, true);
      } catch (err) {
        return yupToFormErrors(err);
      }
    }

    return {};
  };

  const handleSubmits = async (
    values,
    { setSubmitting, setErrors, setStatus }
  ) => {
    setStatus(null);

    if (activeStep.props.onStepSubmit) {
      const { status, message, errors } = await activeStep.props.onStepSubmit(
        values
      );

      setSubmitting(false);

      if (errors instanceof Object) {
        setErrors(errors);
      } else if (!status && message) {
        setStatus(message);
      }

      if (status) {
       next();
      }
    }

    if (isLastStep) {
      try {
        setStep(0);
        Router.back();
      } catch (e) {
        if (getErrors(e) instanceof Object) {
          setErrors(getErrors(e));
        }
      }
      return;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmits}
    >
      {({ handleSubmit, isSubmitting, status }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-start mx-auto hd:w-7/12 my-5">
            <div className="w-full p-8 hd:p-0">
              {activeStep}

              {status && (
                <FormGroup className="error text-center">
                  <span>{status}</span>
                </FormGroup>
              )}
            </div>
          </div>

          <div className="border-b border-divider" />

          <div className="flex flex-col items-start mx-auto hd:w-7/12">
            <div className="w-full p-8 hd:px-0">
              <Button
                level={step <= 0 ? "grey" : "primary"}
                className="text-xl px-16 mb-4 md:mb-0 sm:mr-4"
                onClick={() => prev()}
                type="button"
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="text-xl px-16"
                disabled={isSubmitting}
              >
                {isLastStep ? "Save" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}

EditEmployeeForm.Step = ({ children }) => children;

EditEmployeeForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
};

export default EditEmployeeForm;
