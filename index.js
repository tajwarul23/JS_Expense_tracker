document.addEventListener("DOMContentLoaded", () => {
  //grabbing element
  let expense_name = document.querySelector("#expense_name");
  let expense_amount = document.querySelector("#expense_amount");
  let add_button = document.querySelector("#add_button");

  let details = document.querySelector("#details");
  let totalText = document.querySelector("#total");
  let clearBtn = document.querySelector("#clear");
  let description = document.querySelector("#description");
  let text = document.querySelector("#text");

  //the array where each element is an object {name, amount, id} and the object represents the expense details
  let expenses = JSON.parse(localStorage.getItem("expense")) || [];

  //implementing add.expense button
  add_button.addEventListener("click", () => {
    //taking input
    let e_name = expense_name.value;
    let e_amount = expense_amount.value;
    let mod_amount = parseInt(e_amount);

    //input validation
    if (!e_amount.length || !e_name.length || isNaN(mod_amount)) {
      alert("Please Enter Appropiate Values");
      return;
    }

    //modifiying the input string for better UX
    let modified_name = e_name[0].toUpperCase();
    for (let i = 1; i < e_name.length; i++) {
      modified_name += e_name[i];
    }

    //reseting the input field
    expense_amount.value = "";
    expense_name.value = "";

    //creating the object
    let expense = {
      name: modified_name,
      amount: e_amount,
      id: Date.now(),
    };

    //pushing the object to the array
    expenses.push(expense);

    //saving to localStorage
    save();

    //rendering the expense details after adding new expense
    render();
  });

  //function to save into the localStorage
  function save() {
    localStorage.setItem("expense", JSON.stringify(expenses));
  }

  //function to render the details section
  function render() {
    //whenever the render is called is clear all the previous data and push the newly added data with the previous one's
    details.innerHTML = "";

    if (expenses.length) {
      description.classList.remove("hidden");
      text.classList.remove("hidden");
    } else {
      description.classList.add("hidden");
      text.classList.add("hidden");
    }
    if (expenses.length) {
      let total = 0;

      //looping through every element to show on ui
      for (let i = 0; i < expenses.length; i++) {
        let ex = expenses[i].name;
        let amount = expenses[i].amount;

        total += parseInt(amount);

        //creating the list element
        let li = document.createElement("li");
        li.className =
          "flex justify-around bg-gray-700 items-center py-2 rounded-md mt-5";
        li.innerHTML = `  
            
          
            <h1>${ex}</h1>
            <h1>Cost: $${amount}</h1>
            <button class="bg-red-700 p-1 rounded-md cursor-pointer">
              Remove
            </button>
          
          `;

        details.appendChild(li);

        //implementing delete button
        let dltBtn = li.querySelector("button");
        dltBtn.addEventListener("click", () => {
          const confirmDelete = confirm(
            `Are you sure you want to remove ${expenses[i].name}?`
          );
          if (confirmDelete) {
            total -= parseInt(amount);
            //filtering the rest of the elements
            expenses = expenses.filter((ex) => ex.id !== expenses[i].id);
            save();
            li.remove();

            render();
          }
        });
      }
      totalText.innerText = `Total : $${total}`;
    }
  }

  //implementing the clear button
  clearBtn.addEventListener("click", () => {
    let clearMsg = confirm("Are you sure you want to clear all data?");
    if (clearMsg) {
      localStorage.removeItem("expense");
      expenses.length = 0;
      render();
    }
  });

  render();
});
