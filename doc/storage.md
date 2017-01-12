## Using the Storage module

**This document does not apply to apps that are migrated from v1 of the Zendesk
App Framework.**

The Storage module provides helper methods to interact with `localStorage`. It is important to note that different installations of the same app may have the same url, in which case they will share `localStorage` on the same browser even across different accounts. The storage module scopes `localStorage` keys using the key passed to its constructor. You can pass the installation id to the storage constructor to prevent conflicts between different installations.

## Reference

### constructor

#### Arguments

* `scopeKey`: String to be used for scoping `localStorage` keys.

```javascript
import Storage from 'storage';

const storage = new Storage(scopeKey);
```

### `storage.get(key)`

```javascript
console.log(storage.get('user'));
```

#### Returns
The value stored for the passed key.

### `storage.set(key, value)`
Stores a value for the passed key.

```javascript
storage.set('user', 'Mikkel');
console.log(storage.get('user')); // Mikkel

// or

storage.set('user', { id: 1, name: 'Mikkel' });
console.log(storage.get('user').name); // Mikkel
```

### `storage.set(obj)`
Stores each key, value pair.

```javascript
storage.set({
  id: '1',
  user: 'Mikkel'
});

console.log(storage.get('id')); // 1
```
