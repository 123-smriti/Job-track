import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-[#17352b] text-white hover:bg-[#245544] focus-visible:ring-[#17352b]',
  secondary: 'border border-[#cbd9d0] bg-white text-[#17352b] hover:border-[#17352b] hover:bg-[#f5f8f4] focus-visible:ring-[#17352b]',
  soft: 'bg-[#e4f0e7] text-[#216145] hover:bg-[#d2e6d8] focus-visible:ring-[#216145]',
  ghost: 'text-[#53665d] hover:bg-[#edf3ee] hover:text-[#17352b] focus-visible:ring-[#17352b]',
}

function Button({ children, variant = 'primary', className = '', to, type = 'button', ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`

  if (to) {
    return <Link className={classes} to={to} {...props}>{children}</Link>
  }

  return <button className={classes} type={type} {...props}>{children}</button>
}

export default Button
