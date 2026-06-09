import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-10", className)}>
      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      {text && <p className="text-gray-400 text-sm font-medium">{text}</p>}
    </div>
  );
}
