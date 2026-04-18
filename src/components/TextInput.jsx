import { TextField } from '@mui/material';

function TextInput({ label, value, name, onChange, type = 'text', ...props }) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      variant="outlined"
      {...props}
    />
  );
}

export default TextInput;
