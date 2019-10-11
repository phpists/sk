import React from "react";
import * as Yup from "yup";
import { useFormikContext } from "formik";
import { SelectGroupField, SelectField, ToggleField } from "UI";

const AdScheduleStep = () => {
  const { values } = useFormikContext();

  let hours = [];
  let minutes = [
    "00",
    "30",
  ];
  let timeOptions = [];

  for (var i = 0; i < 24; i++) {
    let h;
    if (i < 10) {
      h = `0${i}`
    } else {
      h = (i)
    }

    hours.push(h)
  }

  hours.forEach(hour => {
    minutes.forEach((minute) => {
      timeOptions.push(
        {
          label: `${hour}:${minute}`,
          value: `${hour}:${minute}`,
        }
      )
    })
  });

  const weeks = [
    {
      day: 0,
      name: "Sunday"
    },
    {
      day: 1,
      name: "Monday"
    },
    {
      day: 2,
      name: "Tuesday"
    },
    {
      day: 3,
      name: "Wednesday"
    },
    {
      day: 4,
      name: "Thursday"
    },
    {
      day: 5,
      name: "Friday"
    },
    {
      day: 6,
      name: "Saturday"
    }
  ]

  const isStartDisabled = (day) => {
    let d = values.schedule[day]

    if (d) {
      return d && d.start === 0
    }

    return false
  }

  let startOptions = timeOptions
  startOptions.unshift({
    label: "Day off",
    value: 0,
  })


  return (
    <div className="px-2">
      <div className="flex flex-col -mx-4">
        {weeks.map(week => (
          <div className="flex items-center" key={week.day}>
            <div className="w-1/5 px-2">{week.name}</div>
            <div className="w-1/6 px-2">
              <ToggleField name="scheduled" label="Alone" value={true} />
            </div>
            <div className="w-2/5 px-2">
              <SelectGroupField
                label="Time"
                name="time"
              >
                <SelectField
                  className="w-full sm:w-1/2 lg:w-1/3"
                  inputClassName="w-full md:w-1/3"
                  label=""
                  name={`schedule.${week.day}.start`}
                  options={startOptions}
                  placeholder=""
                />
                <SelectField
                  className="w-full sm:w-1/2 lg:w-1/3"
                  inputClassName="w-full md:w-1/3"
                  label=""
                  value={isStartDisabled(week.day) ? null : ""}
                  name={`schedule.${week.day}.end`}
                  disabled={isStartDisabled(week.day)}
                  options={timeOptions}
                  placeholder=""
                />
              </SelectGroupField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AdScheduleStep.validationSchema = Yup.object().shape({
  // phone: Yup.string().required(),
  // recaptcha: Yup.string().required()
});

export default AdScheduleStep;
