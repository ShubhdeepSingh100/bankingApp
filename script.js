'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' '; //for empty the container

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; //we are using slice because we want to sort the copy not the original array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //mov is the current element in the array that we are looping over
    //adding new movements at the top and older movements at the bottom
    //now we have to create an html that looks like movements element that is movements row

    const html = `<div class="movements__row">
             <div class="movements__type          movements__type--${type}">${
      i + 1
    } ${type}deposit</div>
             
             <div class="movements__value">${mov}</div> 
             </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); //this method accepts two strings the first string is the position in which we want to attach the html after begin means i want to insert new child element afte the biginning of the parent element, second argument is the string containing the html that we want to insert
  }); //now we have to attach this html with the container for that we will use a method called insert adjacent html and we are going to call this on movements element
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}EUR`;
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//updating UI
const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

//event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  //console.log('LOGIN');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and message
    labelWelcome.textContent = `welcome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //so that the cursor will not be on pin

    //updating UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update ui
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);
    //.indexOf(23);

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// // console.log(accounts);
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// //using above filter method using for of loop

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// //for withdrawls
// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(withdrawals);

// //accumulator -> snowball
// // const balance = movements.reduce(function (
// //   accumulator,
// //   currentValue,
// //   index,
// //   array
// // ) {
// //   console.log(`Iteration ${index} : ${accumulator}`);
// //   return accumulator + currentValue;
// // },
// // 0); //initial value of accumulator

// //writing above code using arrow function

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// //doing above thing using for loop
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2); //we will always need a seperate variable while using for loop

// //maximum value using reduce

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);
// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// // const currencies = new Map([
// //   ['USD', 'United States dollar'],
// //   ['EUR', 'Euro'],
// //   ['GBP', 'Pound sterling'],
// // ]);

// /////////////////////////////////////////////////
// //chaining of methods : eg we want to take all the movements deposits then convert them from euro to dollars and finally add them all up
// const eurToUsd = 1.1;

// //Pipeline
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0); //we can change the method if the first one returns an array, we can also call this as a pipeline that process our data

// console.log(totalDepositsUSD);

// console.log(movements);

// //equality
// console.log(movements.includes(-130));

// //SOME: condition

// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0); // is there any movements greater than 0??

// console.log(anyDeposits);

// //EVERY
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //Seperate callback

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1.2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// //flat
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// //flatMap
// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);

//sorting

//strings

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); //it modifies the original array
console.log(owners);

//numbers
console.log(movements);
console.log(movements.sort()); //sort method does the sorting based on strings, it converts everything to string and then it do sorting

//return <0,A,B(keep order)
//return >0,B,A(switch order)

//Ascending
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) return 1;
//     if (a < b) return -1;
//   })
// );
movements.sort((a, b) => a - b);
console.log(movements);

//Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b - a);
console.log(movements);

//more ways of crearting and filling arrays
