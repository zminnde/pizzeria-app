
document.addEventListener("DOMContentLoaded", () => {

    //accessing elements
    const sortDropdown = document.getElementById('sort-dropdown');
    const menu = document.getElementById("menu");

    //event listener for sorting
    sortDropdown.addEventListener('change', (e) => {
        initialize(e.target.value);
    })

    window.onload = () => {
        //Open default tab on refresh
        document.getElementById("defaultOpen").click();
        initialize(sortDropdown.value);
    }

    //event listener for form submit button
    window.addEventListener("submit", (e) => {
        e.preventDefault();

        //Create required properties for pizza
        var name = document.getElementById("name").value;
        var price = Number.parseFloat(document.getElementById("price").value);
        var heat = Number.parseInt(document.getElementById("heat").value);
        var toppings = getToppings();
        var photo = document.querySelector('input[type=radio]:checked').value;

        //before doing anything, check that we have at least 2 toppings:
        if (toppings.length < 2) {
            alert("Please select at least 2 toppings for your pizza.")
            return;
        }

        //define Pizza object
        function Pizza(pizzaName, pizzaPrice, pizzaHeat, pizzaToppings, pizzaPhoto) {
            this.name = pizzaName;
            this.price = pizzaPrice;
            this.heat = pizzaHeat;
            this.heat = pizzaHeat;
            this.toppings = pizzaToppings;
            this.photo = pizzaPhoto;
        }

        //create new pizza and check if pizza already exists
        let pizza = new Pizza(name, price, heat, toppings, photo);
        let existingPizza = JSON.parse(sessionStorage.getItem(name));

        //update session storage
        sessionStorage.setItem(name, JSON.stringify(pizza));

        //If pizza already exists, update only one List item, else initialize whole menu, because we need to re-sort.
        //TODO: place new Item somewhere in between, without needing to recreate whole menu.
        if (existingPizza !== null && pizza.name === existingPizza.name) {
            updateMenuItem(name);
        } else {
            initialize(sortDropdown.value);
        }
        //clear form on submit
        e.target.reset();

    });

    //return topping array from form checkboxes
    function getToppings() {
        var arr = [];
        var checkedBoxes = document.querySelectorAll('input[type=checkbox]:checked');

        checkedBoxes.forEach(box => {
            arr.push(box.value);
        });
        return arr;
    }

    //Repopulate menu by sort value
    function initialize(sortVal) {
        //create empty array and clear menu
        var Pizzas = [];
        menu.innerHTML = "";

        if (sessionStorage.length !== 0) {
            for (let i = 0; i < sessionStorage.length; i++) {
                // put all pizza objects to array           
                Pizzas.push(JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
            }
            //sort an array
            Pizzas.sort(dynamicSort(sortVal));

            //create menu from sorted array
            for (let j = 0; j < Pizzas.length; j++) {
                createMenuItem(Pizzas[j].name);
            }
        }

    }

    //function used for sort logic
    function dynamicSort(sortVal) {
        return function (a, b) {
            var result = (a[sortVal] < b[sortVal]) ? -1 : (a[sortVal] > b[sortVal]) ? 1 : 0;
            return result;
        }
    }

    //this funcion creates one menu item
    function createMenuItem(name) {

        //create new wrapper div for pizza and give id
        var menuItem = document.createElement("div");
        menuItem.setAttribute("id", name);

        //get pizza object
        var pizza = JSON.parse(sessionStorage.getItem(name));

        pizza.price = pizza.price.toFixed(2); //2 decimal points for display

        //generate HTML markup and uset it for list item
        var markup = generateHTML(pizza);
        menuItem.innerHTML = markup;

        var deleteButton = menuItem.querySelector('button');
        deleteButton.addEventListener("click", () => {

            var result = confirm("Want to delete?");
            if (result) {
                sessionStorage.removeItem(name);
                menu.removeChild(document.getElementById(name));
            }

        });
        menu.appendChild(menuItem);
    }

    //generate menu item markup
    function generateHTML(pizza) {

        var markup = `<div class="item profile-row">
                        <div class="dp">
                            <img src="images/${pizza.photo}">
                        </div>
                        <div class="desc">
                            <h1>${pizza.name} ${getPeppers(pizza.heat)}</h1>
                            <p>Ingredients: ${(pizza.toppings).join(", ")}</p>
                            <p class="price">${pizza.price} Eur</p>
                            <div class="delete-button">
                                <button>Delete</button>
                            </div>
                            
                        </div>
                    </div>`;
        return markup;
    }

    //return pepper image markup
    function getPeppers(heat) {

        var markup = "";
        var pepper = `<img style="width:25px; height:25px;" src=images/pepper.svg>`;

        if (heat > 0) {
            for (let i = heat; i > 0; i--) {
                markup += pepper;
            }

        }
        return markup;
    }

    //update menu item if entered name already exists
    function updateMenuItem(name) {
        var menuItem = document.getElementById(name);
        var pizza = JSON.parse(sessionStorage.getItem(name));
        menuItem.innerHTML = generateHTML(pizza);
    }

    //logic for opening different tabs
    function openTab(event) {

        var destination = event.target.value;

        // Get all elements with class="tabcontent" and hide them
        var tabcontent = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }


        // Get all elements with class="tab-button" and remove the class "active"
        var tabButtons = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].className = tabButtons[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(destination).style.display = "block";
        event.currentTarget.className += " active";
    }

    document.querySelectorAll(".tab-button").forEach(button => {
        button.addEventListener("click", openTab);
    });
});



