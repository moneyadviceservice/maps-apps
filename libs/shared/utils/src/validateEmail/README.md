# validateEmail

Email validation utility using Zod for RFC-compliant email validation.

## Usage

### Basic Validation

```typescript
import { validateEmail } from '@maps-react/utils/validateEmail';

const isValid = validateEmail('user@example.com');
// Returns: true

const isInvalid = validateEmail('invalid@');
// Returns: false
```

## API

### `validateEmail(email: string): boolean`

Validates an email address and returns a boolean.

**Parameters:**

- `email` - The email address string to validate

**Returns:**

- `true` if the email is valid
- `false` if the email is invalid

## Validation Rules

The validator checks for RFC-compliant email addresses including:

- Valid characters in local and domain parts
- Proper @ symbol placement
- Valid domain structure (TLD must be 2+ characters)
- No consecutive dots
- No leading/trailing dots
- No spaces
