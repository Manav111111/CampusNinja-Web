import React from 'react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`surface-card flex flex-col items-center justify-center text-center rounded-2xl p-10 my-6 border border-[var(--line)] bg-[var(--paper-raised)] ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--brand-50)] text-[var(--brand)] shadow-sm">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="font-display text-xl font-bold tracking-tight text-[var(--ink)] sm:text-2xl">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
