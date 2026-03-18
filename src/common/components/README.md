# Common Reusable Components

This directory contains all reusable UI components following a clean folder structure where each component has its own folder.

## Folder Structure

```
src/common/components/
├── index.ts                  # Central export file
├── Loading/
│   └── index.tsx
├── AuthContainer/
│   └── index.tsx
├── AuthHeader/
│   └── index.tsx
├── AuthFooter/
│   └── index.tsx
├── FormSection/
│   └── index.tsx
├── Button/
│   └── index.tsx
├── PhoneInput/
│   └── index.tsx
├── OTPInput/
│   └── index.tsx
├── Divider/
│   └── index.tsx
└── InfoBox/
    └── index.tsx
```

## Components

### **AuthContainer**
Container wrapper for authentication pages with consistent styling.
```tsx
import { AuthContainer } from '@/common/components';

<AuthContainer>
  {/* Your content */}
</AuthContainer>
```

### **AuthHeader**
Header section with darker blue gradient (blue-700/800/900) for better UI contrast.
```tsx
import { AuthHeader } from '@/common/components';

<AuthHeader
  title="Welcome Back"
  subtitle="Sign in to continue to your account"
  icon={<YourCustomIcon />} // optional
/>
```

### **AuthFooter**
Footer section with Terms and Privacy Policy links for authentication pages.
```tsx
import { AuthFooter } from '@/common/components';

// Default usage
<AuthFooter />

// Custom usage
<AuthFooter
  text="By continuing, you agree to our"
  links={[
    { text: 'Terms of Service', href: '/terms' },
    { text: 'Privacy Policy', href: '/privacy' },
  ]}
/>
```

### **FormSection**
Content section with gray background and consistent padding.
```tsx
import { FormSection } from '@/common/components';

<FormSection>
  {/* Your form content */}
</FormSection>
```

### **PhoneInput**
Phone number input with +91 prefix for India, with automatic validation.
```tsx
import { PhoneInput } from '@/common/components';

<PhoneInput
  value={phoneNumber}
  onChange={setPhoneNumber}
  label="Phone Number" // optional
  placeholder="98765 43210" // optional
  helperText="We'll send you a verification code" // optional
/>
```

### **OTPInput**
6-digit OTP input with auto-focus, backspace navigation, and paste support.
```tsx
import { OTPInput } from '@/common/components';

<OTPInput
  value={otp}
  onChange={setOtp}
  length={6} // optional, defaults to 6
  label="Verification Code" // optional
/>
```

### **Button**
Reusable button with multiple variants.
```tsx
import { Button } from '@/common/components';

<Button
  type="submit"
  variant="primary" // primary | secondary | outline
  disabled={false}
  onClick={handleClick}
  fullWidth={true}
>
  Button Text
</Button>
```

**Variants:**
- `primary`: Blue gradient (from-blue-600 to-blue-700)
- `secondary`: White with gray border
- `outline`: White with gray border (hover changes to blue)

### **Divider**
Horizontal divider with optional text.
```tsx
import { Divider } from '@/common/components';

<Divider text="OR" />
```

### **InfoBox**
Information/notice box with icon and variants.
```tsx
import { InfoBox } from '@/common/components';

<InfoBox variant="info" icon={<CustomIcon />}>
  Your message here
</InfoBox>
```

**Variants:**
- `info`: Blue background (default)
- `warning`: Yellow background
- `success`: Green background

### **Loading**
Loading spinner component.
```tsx
import { Loading } from '@/common/components';

<Loading />
```

## Usage

### Import Single Component
```tsx
import { Button } from '@/common/components';
```

### Import Multiple Components
```tsx
import {
  AuthContainer,
  AuthHeader,
  AuthFooter,
  FormSection,
  PhoneInput,
  Button,
  Divider,
  InfoBox,
} from '@/common/components';
```

### Complete Example
```tsx
import { useState } from 'react';
import {
  AuthContainer,
  AuthHeader,
  AuthFooter,
  FormSection,
  PhoneInput,
  Button,
  Divider,
} from '@/common/components';

export const MyAuthPage = () => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <AuthContainer>
      <AuthHeader
        title="Sign In"
        subtitle="Enter your phone number"
      />
      
      <FormSection>
        <form onSubmit={handleSubmit} className="space-y-5">
          <PhoneInput value={phone} onChange={setPhone} />
          <Button type="submit">Continue</Button>
        </form>
        
        <Divider />
        
        <AuthFooter />
      </FormSection>
    </AuthContainer>
  );
};
```

## Design System

### Colors
- **Header Background**: `from-blue-700 via-blue-800 to-blue-900` (dark gradient)
- **Primary Button**: `from-blue-600 to-blue-700` (gradient)
- **Background**: `gray-50`
- **Borders**: `gray-300`, `blue-100`

### Spacing
- Consistent padding: `p-3`, `p-6`, `py-6`, `px-6`
- Gap spacing: `gap-2`, `gap-3`
- Margin: `mt-2`, `mt-4`, `mt-6`, `mb-2`, `mb-4`

### Typography
- Headers: `text-3xl font-bold text-white`
- Labels: `text-sm font-bold text-gray-800`
- Helper text: `text-xs font-medium text-gray-600`
- Body: `text-base text-gray-900`

## Benefits

✅ **DRY Principle**: Zero code duplication across pages
✅ **Maintainability**: Update once, reflect everywhere
✅ **Consistency**: Uniform styling and behavior
✅ **Type Safety**: Full TypeScript support
✅ **Scalability**: Easy to add new components
✅ **Clean Structure**: Each component in its own folder
✅ **Accessibility**: Proper labels and ARIA attributes
✅ **Responsive**: Mobile-first design approach

## Adding New Components

1. Create a new folder: `src/common/components/MyComponent/`
2. Create `index.tsx` inside the folder
3. Export the component from `src/common/components/index.ts`:
   ```ts
   export { MyComponent } from './MyComponent';
   ```
4. Use it anywhere:
   ```tsx
   import { MyComponent } from '@/common/components';
   ```
