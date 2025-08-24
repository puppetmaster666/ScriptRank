// components/designSystem.tsx
import { ReactNode } from 'react'
import Link from 'next/link'

// ===== PAGE LAYOUT WRAPPER =====
interface PageLayoutProps {
  children: ReactNode
  title?: string
  showTitle?: boolean
}

export function PageLayout({ children, title, showTitle = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showTitle && title && (
        <div className="border-b-2 border-black">
          <h1 className="page-title">{title}</h1>
        </div>
      )}
      <main className="page-content">
        {children}
      </main>
    </div>
  )
}

// ===== BUTTON COMPONENT =====
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  children: ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  href,
  children, 
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseClasses = 'font-ui font-medium transition-all duration-200 border-2 border-black rounded-lg inline-block text-center cursor-pointer'
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-white hover:text-black',
    secondary: 'bg-white text-black hover:bg-black hover:text-white',
    outline: 'bg-transparent text-black hover:bg-black hover:text-white'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:bg-black hover:text-white' : ''
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`
  
  if (href && !disabled) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ===== CARD COMPONENT =====
interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const hoverClasses = hover ? 'hover:translate-y-[-2px] hover:shadow-lg cursor-pointer' : ''
  
  return (
    <div 
      className={`bg-white border-2 border-black rounded-lg p-6 transition-all ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ===== INPUT COMPONENT =====
interface InputProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  name?: string
}

export function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required,
  error,
  disabled = false,
  name
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-ui font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 border-black rounded-lg font-body text-base 
          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-500' : 'border-black'}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-body">{error}</p>
      )}
    </div>
  )
}

// ===== TEXTAREA COMPONENT =====
interface TextareaProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  rows?: number
  error?: string
  disabled?: boolean
  name?: string
}

export function Textarea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required,
  rows = 4,
  error,
  disabled = false,
  name
}: TextareaProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-ui font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`w-full px-4 py-3 border-2 border-black rounded-lg font-body text-base 
          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all
          resize-none
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-500' : 'border-black'}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-body">{error}</p>
      )}
    </div>
  )
}

// ===== SELECT COMPONENT =====
interface SelectProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  required?: boolean
  error?: string
  disabled?: boolean
  name?: string
}

export function Select({ 
  label, 
  value, 
  onChange, 
  options,
  required,
  error,
  disabled = false,
  name
}: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-ui font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 border-black rounded-lg font-body text-base 
          focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all
          appearance-none bg-white
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-500' : 'border-black'}`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500 font-body">{error}</p>
      )}
    </div>
  )
}

// ===== BADGE COMPONENT =====
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'default'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    default: 'bg-gray-100 text-gray-800 border-gray-300'
  }
  
  return (
    <span className={`inline-block px-3 py-1 text-sm font-ui font-medium border rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ===== LOADING SPINNER =====
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} border-black border-t-transparent rounded-full animate-spin`}></div>
    </div>
  )
}

// ===== TABS COMPONENT =====
interface TabsProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b-2 border-black">
      <nav className="flex gap-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 font-ui font-medium transition-all ${
              activeTab === tab.id
                ? 'border-b-4 border-black text-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ===== EMPTY STATE COMPONENT =====
interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
      {description && (
        <p className="font-body text-gray-600 mb-6">{description}</p>
      )}
      {action && (
        <Button 
          variant="primary" 
          href={action.href}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
