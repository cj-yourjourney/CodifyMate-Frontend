import React, { ChangeEvent } from 'react'

interface TextareaProps {
  name: string
  value: string
  placeholder: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  className?: string
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  value,
  placeholder,
  onChange,
  rows = 3,
  className = ''
}) => {
  return (
    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      rows={rows}
      className={`textarea textarea-bordered text-lg placeholder:text-lg w-full ${className}`}
    />
  )
}

export default Textarea
