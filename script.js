"use strict";

const account1 = {
  owner: "Pera Peric",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Zoran Zoric",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Moma Momic",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sima Simic",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const startXScreen = 0;
const startYScreen = 0;

const login_form = document.querySelector(".login_form");
const user_input_form = document.querySelector(".user_input_form");
const input_username = document.querySelector(".user_username");
const input_pin = document.querySelector(".user_pin");

const btn_submit_user = document.querySelector(".btn_submit_user");

const app = document.querySelector(".app");

const view_balance = document.querySelector(".view_balance");
const text = document.querySelector(".text");
const text_view_balance = document.querySelector(".text_view_balance");
const balance = document.querySelector(".balance");

const money_status = document.querySelector(".money_status");
const date_current_balance = document.querySelector(".date_current_balance");

const btn_logout = document.querySelector(".btn_logout");
const logged_user = document.querySelector(".logged_user");

const btn_transfer_money = document.querySelector(".btn_transfer_money");
const transfer_to = document.querySelector(".transfer_to");
const amount_to = document.querySelector(".amount_to");

const btnSort = document.querySelector(".btn_sort");

const loan_amount = document.querySelector(".loan_amount");
const btn_loan = document.querySelector(".btn_loan");

const deposit_money = document.querySelector(".deposit_money");
const widraw_money = document.querySelector(".widraw_money");
const percentage_money = document.querySelector(".percentage_money");

const calcAllInAccount = function (acc) {
  const deposite = acc.movements
    .filter((mov) => mov > 0)
    .reduce((a, b) => a + b, 0);
  deposit_money.textContent = `${deposite}€`;

  const withrawal = acc.movements
    .filter((mov) => mov < 0)
    .reduce((a, b) => a + b, 0);
  widraw_money.textContent = `${Math.abs(withrawal)}€`;

  const percentage = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  percentage_money.textContent = `${percentage}€`;
};

//Username need to bee created
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsername(accounts);

let currentlyUsingAccount;

// Button for user to login
btn_submit_user.addEventListener("click", (e) => {
  e.preventDefault();

  currentlyUsingAccount = accounts.find(
    (account) => account.username === input_username.value
  );

  if (currentlyUsingAccount.pin === Number(input_pin.value)) {
    logged_user.textContent = currentlyUsingAccount.owner;
  }

  login_form.style.display = "none";
  app.style.opacity = 100;

  upadeteAccount(currentlyUsingAccount);
});

// Display characteristics
const displayOwnerAccount = function (movement, sort = false) {
  text.innerHTML = "";

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach((element) => {
    let type = element > 0 ? "Deposit" : "Withdrawal";
    let color = element > 0 ? "green" : "red";
    let movment_element = element < 0 ? Math.abs(element) : element;

    const html = `<div class="text">
    <p>${type}</p>
    <p class="${color}">${movment_element}€</p>
  </div>`;

    text.insertAdjacentHTML("afterbegin", html);
  });
};

//Display amount
const displayOwnerAmount = function (amount) {
  amount.balance = amount.movements.reduce((acc, mov) => acc + mov, 0);
  money_status.textContent = `${amount.balance}€`;
};

const displayFullDate = function () {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let fullDay = day < 10 ? "0" + day : day;
  let fullMonth = month < 10 ? "0" + month : month;

  date_current_balance.textContent = `Today is: ${fullDay}/${fullMonth}/${year}`;
};

const upadeteAccount = function (account) {
  displayOwnerAccount(account.movements);

  displayOwnerAmount(account);

  displayFullDate();

  calcAllInAccount(account);
};

//Logout
btn_logout.addEventListener("click", (e) => {
  e.preventDefault();

  input_username.value = input_pin.value = "";
  login_form.style.display = "block";
  app.style.opacity = 0;

  window.scrollTo(startXScreen, startYScreen);
});

btn_transfer_money.addEventListener("click", (e) => {
  e.preventDefault();

  const amount_value = Number(amount_to.value);
  const reciverAcc = accounts.find((acc) => acc.username === transfer_to.value);
  transfer_to.value = amount_to.value = "";

  if (
    amount_value > 0 &&
    reciverAcc &&
    currentlyUsingAccount.balance >= amount_value &&
    reciverAcc?.username !== currentlyUsingAccount.username
  ) {
    currentlyUsingAccount.movements.push(-amount_value);
    reciverAcc.movements.push(amount_value);
    upadeteAccount(currentlyUsingAccount);
  }
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayOwnerAccount(currentlyUsingAccount.movements, !sorted);
  sorted = !sorted;
});

btn_loan.addEventListener("click", (e) => {
  e.preventDefault();

  let amount = Number(loan_amount.value);

  if (
    amount > 0 &&
    currentlyUsingAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentlyUsingAccount.movements.push(amount);
    upadeteAccount(currentlyUsingAccount);
  }
  loan_amount.value = "";
});
