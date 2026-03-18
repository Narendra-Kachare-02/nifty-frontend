interface FormSectionProps {
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ children }) => {
  return <div className="px-6 py-6 bg-gray-50">{children}</div>;
};
