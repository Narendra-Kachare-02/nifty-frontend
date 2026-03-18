interface AuthFooterProps {
  text?: string;
  links?: Array<{
    text: string;
    href: string;
  }>;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  text = 'By continuing, you agree to our',
  links = [
    { text: 'Terms', href: '#' },
    { text: 'Privacy Policy', href: '#' },
  ],
}) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-xs text-gray-600 leading-relaxed">
        {text}{' '}
        {links.map((link, index) => (
          <span key={link.text || index}>
            <a
              href={link.href}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
            >
              {link.text}
            </a>
            {index < links.length - 1 && ' and '}
          </span>
        ))}
      </p>
    </div>
  );
};
