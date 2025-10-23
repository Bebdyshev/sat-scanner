import CryptoJS from 'crypto-js'

// Encryption keys provided by user
const KEY_1 = "1118394794UHWU29"
const KEY_2 = "DDWDEF2344564412"

/**
 * Decrypts a string using AES encryption with the provided keys
 * @param encryptedString - The encrypted string to decrypt
 * @param keyIndex - Which key to use (1 or 2), defaults to 1
 * @returns The decrypted string or null if decryption fails
 */
export function decryptString(encryptedString: string, keyIndex: 1 | 2 = 1): string | null {
  const key = keyIndex === 1 ? KEY_1 : KEY_2
  
  // Try different decryption methods
  const methods = [
    // Method 1: ECB mode with PKCS7 padding
    () => {
      const parsedKey = CryptoJS.enc.Utf8.parse(key)
      const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    
    // Method 2: CBC mode with PKCS7 padding (no IV)
    () => {
      const parsedKey = CryptoJS.enc.Utf8.parse(key)
      const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    
    // Method 3: ECB mode with Zero padding
    () => {
      const parsedKey = CryptoJS.enc.Utf8.parse(key)
      const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
      })
      return decrypted.toString(CryptoJS.enc.Utf8)
    },
    
    // Method 4: Try with Base64 decoding first
    () => {
      try {
        const parsedKey = CryptoJS.enc.Utf8.parse(key)
        const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch {
        return null
      }
    },
    
    // Method 5: Try with different key parsing
    () => {
      const parsedKey = CryptoJS.enc.Hex.parse(key)
      const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      return decrypted.toString(CryptoJS.enc.Utf8)
    }
  ]
  
  for (const method of methods) {
    try {
      const result = method()
      if (result && result.length > 0 && !result.includes('\u0000')) {
        return result
      }
    } catch {
      // Continue to next method
      continue
    }
  }
  
  return null
}

/**
 * Advanced decryption function that tries multiple algorithms and methods
 * @param encryptedString - The encrypted string to decrypt
 * @returns The decrypted string or null if all methods fail
 */
export function advancedDecrypt(encryptedString: string): string | null {
  const keys = [KEY_1, KEY_2]
  
  // Try different algorithms and methods
  const methods = [
    // AES methods
    (key: string) => {
      try {
        const parsedKey = CryptoJS.enc.Utf8.parse(key)
        const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch { return null }
    },
    
    (key: string) => {
      try {
        const parsedKey = CryptoJS.enc.Utf8.parse(key)
        const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch { return null }
    },
    
    // DES methods
    (key: string) => {
      try {
        const parsedKey = CryptoJS.enc.Utf8.parse(key)
        const decrypted = CryptoJS.DES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch { return null }
    },
    
    // Triple DES
    (key: string) => {
      try {
        const parsedKey = CryptoJS.enc.Utf8.parse(key)
        const decrypted = CryptoJS.TripleDES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch { return null }
    },
    
    // Try with different key formats
    (key: string) => {
      try {
        const parsedKey = CryptoJS.enc.Hex.parse(key)
        const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch { return null }
    },
    
    // Try with Base64 key
    (key: string) => {
      try {
        const parsedKey = CryptoJS.enc.Base64.parse(key)
        const decrypted = CryptoJS.AES.decrypt(encryptedString, parsedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
      } catch { return null }
    }
  ]
  
  // Try each key with each method
  for (const key of keys) {
    for (const method of methods) {
      try {
        const result = method(key)
        if (result && result.length > 0 && !result.includes('\u0000') && result !== encryptedString) {
          return result
        }
      } catch {
        continue
      }
    }
  }
  
  return null
}

/**
 * Decrypts a string using both keys and returns the successful result
 * @param encryptedString - The encrypted string to decrypt
 * @returns The decrypted string or null if both keys fail
 */
export function decryptWithBothKeys(encryptedString: string): string | null {
  // First try the advanced method
  const advancedResult = advancedDecrypt(encryptedString)
  if (advancedResult) {
    return advancedResult
  }
  
  // Try with key 1 first
  const result1 = decryptString(encryptedString, 1)
  if (result1) {
    return result1
  }
  
  // Try with key 2
  const result2 = decryptString(encryptedString, 2)
  if (result2) {
    return result2
  }
  
  return null
}

/**
 * Encrypts a string using AES encryption with the provided keys
 * @param plainText - The string to encrypt
 * @param keyIndex - Which key to use (1 or 2), defaults to 1
 * @returns The encrypted string
 */
export function encryptString(plainText: string, keyIndex: 1 | 2 = 1): string {
  try {
    const key = keyIndex === 1 ? KEY_1 : KEY_2
    
    // Parse the key as UTF-8
    const parsedKey = CryptoJS.enc.Utf8.parse(key)
    
    // Encrypt the string
    const encrypted = CryptoJS.AES.encrypt(plainText, parsedKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption failed:', error)
    throw error
  }
}

/**
 * Try to decrypt with different string formats and encodings
 * @param encryptedString - The encrypted string to decrypt
 * @returns The decrypted string or null if all methods fail
 */
export function tryDifferentFormats(encryptedString: string): string | null {
  
  // Try different string formats
  const formats = [
    encryptedString, // Original
    decodeURIComponent(encryptedString), // URL decoded
    atob(encryptedString), // Base64 decoded
    Buffer.from(encryptedString, 'base64').toString('utf8'), // Buffer decoded
    encryptedString.replace(/\\/g, ''), // Remove backslashes
    encryptedString.replace(/\s/g, ''), // Remove spaces
    encryptedString.replace(/[^a-zA-Z0-9+/=]/g, ''), // Keep only base64 chars
  ]
  
  for (const format of formats) {
    if (!format || format === encryptedString) continue
    
    try {
      const result = advancedDecrypt(format)
      if (result) {
        return result
      }
    } catch {
      continue
    }
  }
  
  return null
}

/**
 * Simple decryption methods - XOR, ROT13, Base64, etc.
 * @param encryptedString - The encrypted string to decrypt
 * @returns The decrypted string or null if all methods fail
 */
export function simpleDecrypt(encryptedString: string): string | null {
  const methods = [
    // Base64 decode
    () => {
      try {
        return atob(encryptedString)
      } catch { return null }
    },
    
    // ROT13
    () => {
      return encryptedString.replace(/[a-zA-Z]/g, (char) => {
        const code = char.charCodeAt(0)
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + 13) % 26) + 65)
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + 13) % 26) + 97)
        }
        return char
      })
    },
    
    // Caesar cipher (shift by 1-25)
    () => {
      for (let shift = 1; shift <= 25; shift++) {
        const result = encryptedString.replace(/[a-zA-Z]/g, (char) => {
          const code = char.charCodeAt(0)
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65)
          } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97)
          }
          return char
        })
        if (result !== encryptedString && result.length > 0) {
          return result
        }
      }
      return null
    },
    
    // XOR with key
    () => {
      const keys = [KEY_1, KEY_2]
      for (const key of keys) {
        try {
          let result = ''
          for (let i = 0; i < encryptedString.length; i++) {
            const charCode = encryptedString.charCodeAt(i)
            const keyChar = key.charCodeAt(i % key.length)
            result += String.fromCharCode(charCode ^ keyChar)
          }
          if (result && result !== encryptedString) {
            return result
          }
        } catch { continue }
      }
      return null
    },
    
    // Hex decode
    () => {
      try {
        if (/^[0-9a-fA-F]+$/.test(encryptedString)) {
          let result = ''
          for (let i = 0; i < encryptedString.length; i += 2) {
            const hex = encryptedString.substr(i, 2)
            result += String.fromCharCode(parseInt(hex, 16))
          }
          return result
        }
        return null
      } catch { return null }
    },
    
    // URL decode
    () => {
      try {
        return decodeURIComponent(encryptedString)
      } catch { return null }
    },
    
    // Reverse string
    () => {
      return encryptedString.split('').reverse().join('')
    },
    
    // Simple substitution (A=Z, B=Y, etc.)
    () => {
      return encryptedString.replace(/[a-zA-Z]/g, (char) => {
        const code = char.charCodeAt(0)
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(90 - (code - 65))
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(122 - (code - 97))
        }
        return char
      })
    },
    
    // Try to decode as UTF-8 bytes
    () => {
      try {
        const bytes = new Uint8Array(encryptedString.length)
        for (let i = 0; i < encryptedString.length; i++) {
          bytes[i] = encryptedString.charCodeAt(i)
        }
        return new TextDecoder('utf-8').decode(bytes)
      } catch { return null }
    },
    
    // Try to decode as Latin-1
    () => {
      try {
        const bytes = new Uint8Array(encryptedString.length)
        for (let i = 0; i < encryptedString.length; i++) {
          bytes[i] = encryptedString.charCodeAt(i)
        }
        return new TextDecoder('latin1').decode(bytes)
      } catch { return null }
    },
    
    // Try to decode as ASCII
    () => {
      try {
        let result = ''
        for (let i = 0; i < encryptedString.length; i++) {
          const char = encryptedString.charCodeAt(i)
          if (char >= 32 && char <= 126) {
            result += String.fromCharCode(char)
          }
        }
        return result
      } catch { return null }
    },
    
    // Try to decode as binary
    () => {
      try {
        let result = ''
        for (let i = 0; i < encryptedString.length; i++) {
          const char = encryptedString.charCodeAt(i)
          result += String.fromCharCode(char)
        }
        return result
      } catch { return null }
    },
    
    // Try to decode as octal
    () => {
      try {
        if (/^[0-7]+$/.test(encryptedString)) {
          let result = ''
          for (let i = 0; i < encryptedString.length; i += 3) {
            const octal = encryptedString.substr(i, 3)
            result += String.fromCharCode(parseInt(octal, 8))
          }
          return result
        }
        return null
      } catch { return null }
    },
    
    // Try to decode as decimal
    () => {
      try {
        if (/^\d+$/.test(encryptedString)) {
          let result = ''
          for (let i = 0; i < encryptedString.length; i += 3) {
            const decimal = encryptedString.substr(i, 3)
            result += String.fromCharCode(parseInt(decimal, 10))
          }
          return result
        }
        return null
      } catch { return null }
    }
  ]
  
  for (const method of methods) {
    try {
      const result = method()
      if (result && result !== encryptedString && result.length > 0) {
        return result
      }
    } catch {
      continue
    }
  }
  
  return null
}

/**
 * Node.js style decryption using AES-128-CBC with proper key and IV
 * @param hexString - The hex string to decrypt
 * @returns The decrypted string or null if decryption fails
 */
export function nodeStyleDecrypt(hexString: string): string | null {
  try {
    // Convert hex string to bytes
    const buf = CryptoJS.enc.Hex.parse(hexString)
    
    // Use the keys as key and IV (16 bytes each)
    const key = CryptoJS.enc.Utf8.parse(KEY_1) // 16 bytes
    const iv = CryptoJS.enc.Utf8.parse(KEY_2)  // 16 bytes
    
    // Decrypt using AES-128-CBC
    const decrypted = CryptoJS.AES.decrypt(
      buf.toString(CryptoJS.enc.Base64),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )
    
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    return result || null
  } catch (error) {
    console.error('Node style decrypt failed:', error)
    return null
  }
}

/**
 * Try to decrypt hex string with different approaches
 * @param encryptedString - The encrypted string to decrypt
 * @returns The decrypted string or null if all methods fail
 */
export function tryHexDecryption(encryptedString: string): string | null {
  // Check if it's a hex string
  if (!/^[0-9a-fA-F]+$/.test(encryptedString)) {
    return null
  }
  
  // Try Node.js style decryption first
  const nodeResult = nodeStyleDecrypt(encryptedString)
  if (nodeResult) {
    return nodeResult
  }
  
  // Try with swapped key and IV
  try {
    const buf = CryptoJS.enc.Hex.parse(encryptedString)
    const key = CryptoJS.enc.Utf8.parse(KEY_2) // Use second key as key
    const iv = CryptoJS.enc.Utf8.parse(KEY_1)  // Use first key as IV
    
    const decrypted = CryptoJS.AES.decrypt(
      buf.toString(CryptoJS.enc.Base64),
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )
    
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    if (result) {
      return result
    }
  } catch {
    // Continue to next method
  }
  
  return null
}

/**
 * Comprehensive decryption function that tries everything
 * @param encryptedString - The encrypted string to decrypt
 * @returns The decrypted string or null if all methods fail
 */
export function comprehensiveDecrypt(encryptedString: string): string | null {
  // Try hex decryption first (most likely for your case)
  const hexResult = tryHexDecryption(encryptedString)
  if (hexResult) {
    return hexResult
  }
  
  // Try simple methods
  const simpleResult = simpleDecrypt(encryptedString)
  if (simpleResult) {
    return simpleResult
  }
  
  // Try the advanced method
  const advancedResult = advancedDecrypt(encryptedString)
  if (advancedResult) {
    return advancedResult
  }
  
  // Try different formats
  const formatResult = tryDifferentFormats(encryptedString)
  if (formatResult) {
    return formatResult
  }
  
  // Try the original method
  const originalResult = decryptWithBothKeys(encryptedString)
  if (originalResult) {
    return originalResult
  }
  
  return null
}

/**
 * Utility function to test decryption with sample data
 * @param testString - Optional test string to decrypt
 * @returns Object with test results
 */
export function testDecryption(testString?: string): {
  success: boolean
  result?: string
  error?: string
} {
  if (!testString) {
    return {
      success: false,
      error: 'No test string provided'
    }
  }
  
  try {
    const result = comprehensiveDecrypt(testString)
    if (result) {
      return {
        success: true,
        result
      }
    } else {
      return {
        success: false,
        error: 'Decryption failed with all methods'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
