import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { CITIES } from "queries";
import {useTranslation} from "react-i18next";

import {
  Button,
  CheckboxField,
  FormGroup,
  TextField,
  SelectField,
  TextAreaField,
  FileField,
  LocationSearchInput,
  Loader,
  PhoneField
} from "UI";
import { getErrors } from "utils";
import {useQuery} from "@apollo/react-hooks";
import {ALL_CLUB_TYPES} from "queries/clubQuery";

function NewClubForm({ onSubmit }) {
  const [error, setError] = useState(null);
  const {t, i18n} = useTranslation();

  const { loading: citiesLoading, data: { cities } = {} } = useQuery(CITIES);

  const {loadingClubTypes, data: {club_types} = {}} = useQuery(ALL_CLUB_TYPES);

  if (citiesLoading || loadingClubTypes) {
    return <Loader/>;
  }

  const handleSubmits = async (values, { setSubmitting, setErrors }) => {
    try {
      await onSubmit({
        variables: {
          input: values
        }
      });
    } catch (e) {
      if (getErrors(e) instanceof Object) {
        setErrors(getErrors(e));
      } else {
        setError(getErrors(e));
      }
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        club_type_id: "",
        description: "",
        index: "",
        city_id: "",
        address: "",
        phone: "",
        email: "",
        start_time: "",
        end_time: "",
        website: "",
        logotype: null,
        // access_phone_edit: false,
        moderator: {
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
        }
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
        club_type_id: Yup.number().required(),
        description: Yup.string().required(),
        index: Yup.string(),
        city_id: Yup.number(),
        address: Yup.string().required(),
        phone: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        website: Yup.string().url(),
        moderator: Yup.object().shape( {
          first_name: Yup.string().required(),
          last_name: Yup.string().required(),
          email: Yup.string().email().required(),
          phone: Yup.string().required(),
        })
      })}
      onSubmit={handleSubmits}
    >
      {({ handleSubmit, isSubmitting, status }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-start mx-auto hd:w-7/12 p-10">
            {error && (
              <FormGroup className="error text-center">
                <span>{error}</span>
              </FormGroup>
            )}

            <div className="text-4xl font-extrabold">{t('clubs.information')}</div>
            <div className="flex w-full -mx-3">
              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.club_name')}
                name="name"
                placeholder=""
              />

              <SelectField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.type')}
                name="club_type_id"
                options={(club_types || []).map(c => ({value: parseInt(c.id), label: c.name}))}
                placeholder=""
              />
                <TextField
                    type="time"
                    name="start_time"
                    label="From"
                    className="mr-2"
                />

                <TextField
                    type="time"
                    name="end_time"
                    label="To"
                />
            </div>

            <div className="flex w-full -mx-3">
              <TextAreaField
                className="relative px-3 w-2/3"
                label={t('clubs.about_club')}
                name="description"
                placeholder=""
                rows={7}
                textLength={3000}
              />
              <FileField
                className="px-3 w-1/3"
                label={t('clubs.logotype')}
                name="logotype"
              />
            </div>

            <div className="text-4xl font-extrabold mt-12">
              {t('clubs.club_location_and_contacts')}
            </div>

            <div className="flex w-full -mx-3">
              <LocationSearchInput/>

              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.index')}
                name="index"
                placeholder=""
              />

              {/*<TextField*/}
              {/*  className="px-3 w-1/3"*/}
              {/*  inputClassName="w-1/3"*/}
              {/*  label="City"*/}
              {/*  name="city"*/}
              {/*  placeholder=""*/}
              {/*/>*/}

              <SelectField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.city')}
                name="city_id"
                options={cities.map(c => ({value: c.id, label: c.name}))}
                placeholder=""
              />

              {/*<TextField*/}
              {/*  className="px-3 w-1/3"*/}
              {/*  inputClassName="w-1/3"*/}
              {/*  label="Adress"*/}
              {/*  name="address"*/}
              {/*  placeholder=""*/}
              {/*/>*/}
            </div>

            <div className="flex w-full -mx-3">
              <PhoneField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.phone_exampl')}
                name="phone"
                placeholder="+4179"
              />

              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.mail')}
                name="email"
                placeholder=""
              />

              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('layout.webpage')}
                name="website"
                placeholder=""
              />
            </div>

            <div className="text-4xl font-extrabold mt-12">
              {t('clubs.set_admin_for_club')}
            </div>

            <div className="flex w-full -mx-3">
              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('common.name')}
                name="moderator.first_name"
                placeholder=""
              />

              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('register.last_name')}
                name="moderator.last_name"
                placeholder=""
              />

              <TextField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('register.mail')}
                name="moderator.email"
                placeholder=""
              />
            </div>

            <div className="flex w-full -mx-3">
              <PhoneField
                className="px-3 w-1/3"
                inputClassName="w-1/3"
                label={t('clubs.club_admin_phone_number')}
                name="moderator.phone"
                placeholder="+4179"
              />

              <div className="px-3 w-2/3 flex items-center">
                <CheckboxField
                  label={t('clubs.enable_edit_profiles')}
                  name="access_phone_edit"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-divider" />

          <div className="flex flex-col items-start mx-auto hd:w-7/12 p-10">
            <Button
              type="submit"
              className="text-xl px-12"
              disabled={isSubmitting}
            >
              {t('clubs.create_club_account')}
            </Button>

            <p className="mt-8 text-sm">
              {t('clubs.agree_terms_and_privacy_policy')}
            </p>
          </div>
        </form>
      )}
    </Formik>
  );
}

NewClubForm.propTypes = {
  onSubmit: PropTypes.func.isRequired

};

export default NewClubForm;
