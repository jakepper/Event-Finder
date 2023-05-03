import "./TextInput.css";

import { ChangeEvent } from "react";

type TextInputProps = {
   value: string,
   label: string,
   placeholder: string,
   type: string,
   onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function TextInput({ value, label, placeholder, type, onChange } : TextInputProps) {
   const name = label.toLowerCase().replaceAll(' ', '');
   return (
      <div className="text-input-group">
         <input 
            value={value} 
            onChange={onChange} 
            type={type}
            placeholder={placeholder}
            name={name}
            id={name}
            required
         />
         <label htmlFor={name}>{ label }</label>
      </div>
   );
}