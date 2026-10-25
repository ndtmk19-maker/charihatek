import { isValidApiKeyFormat } from '../src/engine/ai-generator.js';

console.log('Testing AI Generator functions...');

// Test 1: API Key format validator
const validKey = 'AIzaSyA_DummyKey1234567890abcdefghijklmnopqr';
const invalidKey = '123';
const emptyKey = '';

if (isValidApiKeyFormat(validKey)) {
  console.log('  ✓ PASS: Valid API key accepted');
} else {
  console.error('  ✗ FAIL: Valid API key rejected');
  process.exit(1);
}

if (!isValidApiKeyFormat(invalidKey) && !isValidApiKeyFormat(emptyKey)) {
  console.log('  ✓ PASS: Invalid API keys rejected');
} else {
  console.error('  ✗ FAIL: Invalid API key accepted');
  process.exit(1);
}

console.log('AI Generator tests passed successfully!');
