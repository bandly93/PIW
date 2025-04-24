import * as yup from 'yup';

// Yup schema with confirm password match
export const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(6, 'Minimum 6 characters')
    .matches(/[!@#$%^&*]/, 'Must include a special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});