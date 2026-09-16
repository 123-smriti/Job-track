function Input({ label, id, className = '', ...props }) {
  return (
    <label className="block text-sm font-semibold text-[#29483c]" htmlFor={id}>
      {label}
      <input
        id={id}
        className={`mt-2 w-full rounded-lg border border-[#cbd9d0] bg-white px-3.5 py-3 text-sm text-[#17352b] outline-none transition placeholder:text-[#9aaba1] focus:border-[#5e9b78] focus:ring-4 focus:ring-[#dcefe2] ${className}`}
        {...props}
      />
    </label>
  )
}

export default Input
