//BUDGET CONTROLLER //MODEL
var budgetController = (function() {

	//create income and expense object
	//use function constructor to create lot of objects
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	//store objects into an array and data structure

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	//all public methods
	return {
		addItem: function(type, des, val) {
			var newItem, ID; 

			//ID = LAST ID + 1
			//create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//Create new item based on type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//push it into our data structure
			data.allItems[type].push(newItem);

			//return the new element
			return newItem;
		},

		// test data structure
		testing: function() {
			console.log(newItem);
		}

	};
	

})();

//UI CONTROLLER //VIEW
var UIController = (function() {

	var DOMstrings = {
		inputType: '.add_type',
		inputDesc: '.add_desc',
		inputValue: '.add_value',
		inputBtn: '.add_btn',
		incomeContainer: '.income_list',
		expenseContainer: '.expense_list'
	};

	return {

		//make object public
		getInput: function() {
			//return an object of input
			return {
				type: document.querySelector(DOMstrings.inputType).value,  //will be the value of select
				description: document.querySelector(DOMstrings.inputDesc).value,
				value: document.querySelector(DOMstrings.inputValue).value
			}
			
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;
			// create html string with placeholder text

			if(type === 'exp') {
				element = DOMstrings.expenseContainer;

				html = '<div class="item clearfix" id="expense_%id%"><div class="item_desc">%description%</div><div class="right"><div class="item_value">- %value%</div><div class="item_percentage">20%</div><div class="item_delete"><button class="item_delete_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="income_%id%"> <div class="item_desc">%description%</div> <div class="right"><div class="item_value">+ %value%</div><div class="item_delete"><button class="item_delete_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace the placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// insert the html to the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);	

		},
 
		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDesc + ", " + DOMstrings.inputValue);

			//convert a string to an array
			fieldsArr = Array.prototype.slice.call(fields);

			//can access currentValue, index and arr
			fieldsArr.forEach(function(current, index, array) {
				current.value = "";
			});

			//pointer focus back to the first input
			fieldsArr[0].focus();

		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};
	
})();

// GLOBAL APP CONTROLLER //CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {

			if(event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	

	var ctrlAddItem = function() {
		var input, newItem;

		//get the field input 
		//calling UIController method
		input = UICtrl.getInput();
		//console.log(input);

		//add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		//add the item to the UI
		UICtrl.addListItem(newItem, input.type);

		//clear the fields
		UICtrl.clearFields();

		//calculate the budget

		//display the budget on the UI
	};

	//initial function
	return {
		init: function() {
			console.log('Application has started.')
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();









