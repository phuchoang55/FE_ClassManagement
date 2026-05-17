import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type Variant = 'success' | 'error' | 'info' | 'warning';

const variantStyles: Record<Variant, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

const variantIcons: Record<Variant, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

interface Props {
  message: string;
  variant?: Variant;
}

export default function Alert({ message, variant = 'info' }: Props) {
  const Icon = variantIcons[variant];
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${variantStyles[variant]}`}
    >
      <Icon size={18} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
