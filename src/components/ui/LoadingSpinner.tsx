import { Loader2 } from 'lucide-react';

interface Props {
  text?: string;
}

export default function LoadingSpinner({ text = 'Đang tải...' }: Props) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
