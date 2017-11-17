# Examples

## Basics

### Define class
```javascript
class User extends DataObject {
	fullName() {
		return this.firstName + " " + this.lastName;
	}
}
```

### Create object
```javascript
const u = User.create({firstName: 'Pertti', lastName: 'Laamanen'});

```
### Change object data
```javascript
u.firstName = 'Esa'

console.log(`Nice to meet you ${u.fullName}!`);

// output: Nice to meet you Esa Laamanen!`

```
### Undo changes to object
```javascript
u.undo();

console.log(`I think you were called ${u.fullName} originally...`);

// output: I think you were called Pertti Laamanen originally...
```
## Events

### save
```javascript
DataObject.on('save', () => {
	console.log('Let\'s catch every save call!');
});

User.on('save', u => {
	console.log(`User ${u.fullName} is being saved!`);
});

u.save();

// output: User Martti Laamanen is being saved!
//         Let's catch every save call!

```
## change
```javascript
User.on('change:firstName', (u, prevName, newName) => {
	console.log(`${prevName} → ${newName}`)
});

u.firstName = 'Martti';

u.save();

// output: Pertti → Martti
```
