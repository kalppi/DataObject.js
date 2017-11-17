class User extends DataObject {
	fullName() {
		return this.firstName + " " + this.lastName;
	}
}

const u = User.create({firstName: 'Pertti', lastName: 'Laamanen'});

u.firstName = 'Esa'

console.log(`Nice to meet you ${u.fullName}!`);

u.undo();

console.log(`I think you were called ${u.fullName} originally...`);


DataObject.on('save', () => {
	console.log('Let\'s catch every save call!');
});

User.on('save', u => {
	console.log(`User ${u.fullName} is being saved!`);
});

User.on('change:firstName', (u, prevName, newName) => {
	console.log(`${prevName} → ${newName}`)
});

u.firstName = 'Martti';

u.save();