import React from "react";
import PropTypes from "prop-types";
import { Formik, validateYupSchema, yupToFormErrors } from "formik";

import { useSteps } from "hooks";
import { Button, FormGroup } from "UI";

function ForgotForm({ onSubmit, children }) {
  const { step, setStep } = useSteps("forgot");

  const stepLength = React.Children.count(children);
  const activeStep = React.Children.toArray(children)[step];
  const isLastStep = step === React.Children.count(children) - 1;

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

  const handleSubmits = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);

    if (activeStep.props.onStepSubmit) {
      const { status, message } = await activeStep.props.onStepSubmit(values);

      setSubmitting(false);

      if (status) {
        next();
      } else if (!status && message) {
        setStatus(message);
      }
    }

    if (isLastStep) {
      try {
        await onSubmit();
        setStep(0);
      } catch (e) {}
      return;
    }
  };

  return (
    <Formik
      initialValues={{
        phone: "",
        password: "",
        password_confirmation: "",
        recaptcha: "",
        code: ""
      }}
      validate={validate}
      onSubmit={handleSubmits}
    >
      {({ handleSubmit, isSubmitting, status }) => (
        <form onSubmit={handleSubmit}>
          <div className="block text-lg text-center mt-4 font-medium">
            Step {step + 1} / {stepLength}
          </div>

          {activeStep}

          {status && (
            <FormGroup className="error text-center">
              <span>{status}</span>
            </FormGroup>
          )}

          <Button
            type="submit"
            className="text-xl min-w-full"
            disabled={isSubmitting}
          >
            {{
              0: "Send verification code",
              1: "Check verification code",
              2: "Confirm",
              3: "Go to Login page"
            }[step] || "Next step"}
          </Button>
        </form>
      )}
    </Formik>
  );
}

ForgotForm.Step = ({ children }) => children;

ForgotForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ForgotForm;