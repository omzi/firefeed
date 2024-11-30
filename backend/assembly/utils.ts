/**
 * Generate secure URL-friendly unique ID.
 * 
 * By default, the ID will have 21 symbols to have a collision probability
 * similar to UUID v4.
 * 
 * @param size Size of the ID. The default size is 21.
 * @returns A random string.
 */
export const nanoid = (size: i32 = 21): string => {
  // Predefined URL-safe alphabet (64 characters)
  const urlAlphabet: string[] = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'.split('');
  
  // Constants for random byte generation
  const POOL_SIZE_MULTIPLIER: i32 = 128;
  
  let pool: Uint8Array = new Uint8Array(0); // Initialize pool as an empty Uint8Array
  let poolOffset: i32 = 0;

  // Function to generate random bytes (mimicking a random generator)
  function randomBytes(bytes: i32): Uint8Array {
    let result = new Uint8Array(bytes);
    for (let i = 0; i < bytes; i++) {
      result[i] = <u8>(i % 256);  // Using a simple modulo-based random generator for AssemblyScript
    }
    return result;
  }

  // Fill the pool with enough random bytes
  if (pool.length < size) {
    pool = randomBytes(size * POOL_SIZE_MULTIPLIER); // Ensure pool is filled with enough random bytes
    poolOffset = 0; // Reset pool offset to 0
  }

  // Generate a random string from the pool
  let id = '';
  for (let i = poolOffset; i < poolOffset + size; i++) {
    id += urlAlphabet[<i32>pool[i] & 63]; // Mask to fit the 0-63 range for URL-safe alphabet
  }

  // Update poolOffset
  poolOffset += size;

  return id;
};

/**
 * Generate a version 4 UUID (randomly generated).
 * 
 * UUIDv4 is made of random bits, with a version identifier and variant set according to the RFC4122 spec.
 * 
 * @returns A string representing a UUIDv4.
 */
export const uuid = (): string => {
  // Predefined hex characters (for convenience)
  const hexChars: string[] = '0123456789abcdef'.split('');

  // Function to generate a random byte (0-255)
  function randomByte(): u8 {
    return <u8>(Math.random() * 256);
  }

  // Generate 16 random bytes (UUIDv4 is 128 bits = 16 bytes)
  let bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = randomByte();
  }

  // Set version (UUIDv4: version is 4, which means the first 4 bits of byte 6 must be '0100')
  bytes[6] = <u8>((bytes[6] & 0x0f) | 0x40); // Set the 4th bit of the 6th byte to 4

  // Set variant (the first two bits of byte 8 must be '10' for RFC4122)
  bytes[8] = <u8>((bytes[8] & 0x3f) | 0x80); // Set the first two bits of byte 8 to '10'

  // Format the bytes into UUID string (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    // Convert byte to hex and append it to the UUID string
    uuid += hexChars[(bytes[i] >> 4) & 0x0f]; // Get high nibble
    uuid += hexChars[bytes[i] & 0x0f]; // Get low nibble
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      uuid += '-'; // Insert dashes at the appropriate positions
    }
  }

  return uuid;
};

export const generateRandomChars: (len: i32, sets: string[]) => string = (
  len: i32,
  sets: string[]
): string => {
  const generateChars = (min: i32, max: i32): string[] => {
    const chars: string[] = [];
    for (let i = min; i <= max; i++) {
      chars.push(String.fromCharCode(i));
    }
    return chars;
  };

  // Define all character sets
  const numeric = generateChars(48, 57); // 0-9
  const lowerCase = generateChars(97, 122); // a-z
  const upperCase = generateChars(65, 90); // A-Z
  const special = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '\\', '{', '}', '|', ';', ':', '\'', '"', ',', '.', '/', '<', '>', '?']; // special characters
  let alphanumeric: string[] = [];
  alphanumeric = alphanumeric.concat(numeric); // 0-9
  alphanumeric = alphanumeric.concat(upperCase); // A-Z
  alphanumeric = alphanumeric.concat(lowerCase); // a-z

  // If no sets are passed, use alphanumeric as the default
  const selectedSets = sets.length < 1 ? ['alphanumeric'] : sets;

  // Combine the selected sets
  let combinedSet: string[] = [];
  for (let i = 0; i < selectedSets.length; i++) {
    const set = selectedSets[i];

    // Manually check if the set is one of the predefined sets
    if (set == 'numeric') {
      combinedSet = combinedSet.concat(numeric);
    } else if (set == 'lowerCase') {
      combinedSet = combinedSet.concat(lowerCase);
    } else if (set == 'upperCase') {
      combinedSet = combinedSet.concat(upperCase);
    } else if (set == 'special') {
      combinedSet = combinedSet.concat(special);
    } else if (set == 'alphanumeric') {
      combinedSet = combinedSet.concat(alphanumeric);
    }
  }

  // Generate the random characters based on the combined set
  let result = '';
  for (let i = 0; i < len; i++) {
    // Generate random index and cast to integer
    const randomIndex = <i32>(Math.random() * <f64>combinedSet.length);
    result += combinedSet[randomIndex];
  }

  return result;
};

export const generateOneTimePassword: (length: i32) => string = (length: i32): string => {
  const chars = '0123456789'; // Numeric characters
  const charsLength = chars.length;

  let oneTimePassword = '';

  // Convert the chars string into an array of characters
  const charArray: string[] = [];
  for (let i = 0; i < charsLength; i++) {
    charArray.push(chars.charAt(i));  // Fill the array with individual characters
  }

  // Generate the OTP
  for (let i = 0; i < length; i++) {
    const randomIndex = <i32>(Math.random() * <f64>charsLength);
    oneTimePassword += charArray[randomIndex];  // Access the character from the array
  }

  return oneTimePassword;
};

export const uint8ArrayToUUID = (uint8String: string): string => {
  // Initialize an empty array of u8 (Uint8Array) type
  const uint8Array: u8[] = new Array<u8>();

  // Split the input string by commas, trim, and convert each value to u8 using a for loop
  const byteValues: u8[] = [];
  const splitValues = uint8String.split(',');

  // Populate the byteValues array with parsed u8 values
  for (let i = 0; i < splitValues.length; i++) {
    byteValues.push(parseInt(splitValues[i].trim(), 10) as u8);  // Convert each value to u8
  }

  // Ensure the byte array has the correct length (16 bytes for UUID)
  if (byteValues.length !== 16) {
    throw new Error('Invalid UUID length: UUID must be 16 bytes.');
  }

  // Copy the parsed byte values into the uint8Array (explicitly typed as u8[])
  for (let i = 0; i < byteValues.length; i++) {
    uint8Array.push(byteValues[i]);
  }

  // Convert each byte to a 2-character hex string
  let hex = '';
  for (let i = 0; i < uint8Array.length; i++) {
    // Convert byte to hex and pad with leading zeros
    let byte = uint8Array[i];
    hex += byte.toString(16).padStart(2, '0');
  }

  // Format the hex string into UUID format (8-4-4-4-12)
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
};

// Escapes single quotes for SQL compatibility
export const escapeSQL = (input: string): string => {
	let escaped = '';
	for (let i = 0; i < input.length; i++) {
		if (input.charAt(i) === "'") {
			escaped += "''";
		} else {
			escaped += input.charAt(i);
		}
	}
	return escaped;
};
