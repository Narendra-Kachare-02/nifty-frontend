import React from 'react';

export type WorkflowMessageCardVariant = 'input' | 'output';

interface WorkflowMessageCardPropsInput {
  variant: 'input';
  children: string;
}

interface WorkflowMessageCardPropsOutput {
  variant: 'output';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export type WorkflowMessageCardProps = WorkflowMessageCardPropsInput | WorkflowMessageCardPropsOutput;

export const WorkflowMessageCard: React.FC<WorkflowMessageCardProps> = (props) => {
  if (props.variant === 'input') {
    return (
      <div className="flex justify-end pl-[12%] mb-2.5 animate-fade-in">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md shadow-blue-200/30">
          <p className="text-sm font-semibold leading-relaxed">{props.children}</p>
        </div>
      </div>
    );
  }

  const { children, fullWidth = false } = props;

  return (
    <div className="flex justify-start pr-[8%] mb-3 animate-fade-in">
      <div
        className={`${fullWidth ? 'w-full' : 'max-w-[92%]'} bg-white border border-gray-200/60 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm`}
      >
        {children}
      </div>
    </div>
  );
};
