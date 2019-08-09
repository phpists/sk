import React, {Component, Fragment} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Recaptcha from "react-recaptcha";

class LoginForm extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.src =
            "https://www.google.com/recaptcha/api.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() {
        const {onLogin} = this.props;

        return (
            <Formik
                initialValues={{username: '', password: '', recaptcha: "",}}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required('Field is required'),
                    password: Yup.string().required('Field is required'),
                    recaptcha: Yup.string().required('Field is required'),
                })}
                onSubmit={({username, password, recaptcha}, {setSubmitting}) => {
                    onLogin({
                        variables: {
                            username,
                            password,
                            recaptcha,
                        },
                    });
                    setSubmitting(false);
                }}
            >
                {({handleSubmit, isSubmitting, touched, errors, setFieldValue}) => (
                    <Fragment>
                        <Form onSubmit={handleSubmit}>
                            <Field type="email" name="username"/>
                            <ErrorMessage name="username" component="div"/>
                            <Field type="password" name="password"/>
                            <ErrorMessage name="password" component="div"/>
                            <div className="form-group">
                                <Recaptcha
                                    sitekey="6LdhMbIUAAAAAJwdU2c6JCp1w4t9yhtzc6aJt0nT"
                                    render="explicit"
                                    verifyCallback={(response) => {
                                        setFieldValue("recaptcha", response);
                                    }}
                                />
                                {errors.recaptcha
                                && touched.recaptcha && (
                                    <p>{errors.recaptcha}</p>
                                )}
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                Login
                            </button>
                        </Form>
                    </Fragment>
                )}
            </Formik>
        )
    }
}

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
