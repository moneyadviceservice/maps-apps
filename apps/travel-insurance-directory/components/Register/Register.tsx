import { FormEvent, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/index';
import { TextInput } from '@maps-react/form/components/TextInput';

const inputClasses =
  'border-gray-400 w-full h-10 px-3 m-px border rounded focus:outline-purple-700 focus:shadow-focus-outline tool-field';
const buttonStyles = [
  'text-blue-600 bg-green-300 hover:text-blue-600 active:text-blue-600 hover:bg-green-500 active:bg-green-500 active:outline-blue-600',
];
export const Register = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (!data.otp) {
      setShowOTP(true);
    }

    try {
      const response = await fetch(`/api/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      if (response.error) {
        console.error('Next api route call failed', response);

        return;
      }

      if (response.success) {
        console.log('Registration successful');
        if (showOTP) {
          setSuccess(true);
        }
      }
    } catch (err) {
      console.error('Error in handleSubmitUser:', err);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-100 border border-green-400 rounded">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">
          Registration Successful
        </h2>
        <p className="text-green-700">
          You have successfully registered. You are now logged in and can
          continue to register your firm.
        </p>
      </div>
    );
  }

  const inputs = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Individual Reference Number', key: 'individualReferenceNumber' },
    { label: 'Email Address', key: 'emailAddress' },
    { label: 'Job Title', key: 'jobTitle' },
    { label: 'Mobile Phone', key: 'mobilePhone' },
  ];

  return (
    <form
      data-testid="registerForm"
      method="POST"
      className="mt-6"
      id="registerForm"
      action="/api/register-user"
      noValidate
      onSubmit={(e) => onSubmit(e)}
    >
      {inputs.map(({ label, key }) => (
        <div className="mb-8" key={key}>
          <TextInput
            data-testid={key}
            hint={`Enter your ${label}`}
            hasGlassBoxClass={true}
            className={twMerge(inputClasses)}
            name={key}
            id={key}
            type={'text'}
          />
        </div>
      ))}

      {showOTP && (
        <div className="mb-8">
          <TextInput
            data-testid={'otp'}
            hint={'Enter your OTP'}
            hasGlassBoxClass={true}
            className={twMerge(inputClasses)}
            name={'otp'}
            id={'otp'}
            type={'text'}
          />
        </div>
      )}

      <Button
        className={twMerge(buttonStyles, 'mt-16')}
        data-testid="signupUser"
      >
        {showOTP ? 'Confirm OTP Code' : 'Register'}
      </Button>
    </form>
  );
};
