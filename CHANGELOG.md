# Changelog

## 1.0.5
- Changed file operations to be sync to avoid race conditions.
- Added CLI tool to package.

## 1.0.2
- Added call buffer to avoid race conditions when working with repeated file calls. (Temporary?)
- Correctly returning 404's instead of just breaking the server.

## 1.0.0
- Initial Release