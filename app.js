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

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	}

	//store objects into an array and data structure

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1 //represents not expense_list
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
				data.totals.exp += val;
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
				data.totals.inc += val;
			}

			//push it into our data structure
			data.allItems[type].push(newItem);

			//return the new element
			return newItem;
		},

		calculateBudget() {

			//calculate total income and expense
			calculateTotal('inc');
			calculateTotal('exp');

			//calculate the budget: income - expense
			data.budget = data.totals.inc - data.totals.exp;


			//calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		// test data structure
		testing: function() {
			console.log(data);
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
		expenseContainer: '.expense_list',
		budgetValue:'.budget_value',
		incomeValue: '.income_value',
		expenseValue: '.expense_value',
		percentage: '.expense_percentage'
	};

	return {

		//make object public
		getInput: function() {
			//return an object of input
			return {
				type: document.querySelector(DOMstrings.inputType).value,  //will be the value of select
				description: document.querySelector(DOMstrings.inputDesc).value,

				//parse string to float
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
				current.style.border = '';
			});

			//pointer focus back to the first input
			fieldsArr[0].focus();
		},

		clearFieldsStyle: function() {
			document.querySelector(DOMstrings.inputDesc).style.border = '';
			document.querySelector(DOMstrings.inputValue).style.border = '';
		},

		invaildInputUI(field) {
			this.clearFieldsStyle();

			document.querySelector(field).focus();
			document.querySelector(field).style.border = '1px solid #FF0000';
		},

		displayBudget(obj) {
			//console.log(obj);
			document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeValue).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseValue).textContent = obj.totalExp;
			
			if (obj.percentage > 0 ){
				document.querySelector(DOMstrings.percentage).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentage).textContent = '--';
			}
		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};
	
})();

// GLOBAL APP CONTROLLER //CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
	var DOM = UICtrl.getDOMstrings();
	var setupEventListeners = function() {
		

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {

			if(event.keycode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	var updateBudget = function() {

		//calculate the budget
		budgetCtrl.calculateBudget();

		//return the budget
		var budget = budgetCtrl.getBudget();

		//display the budget on the UI
		UICtrl.displayBudget(budget);

	};

	var ctrlAddItem = function() {
		var input, newItem;

		//get the field input 
		//calling UIController method
		input = UICtrl.getInput();
		//console.log(input);

		//check valid input
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			//add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			//clear the fields
			UICtrl.clearFields();

			//calculate and update budget
			updateBudget();


		} else if (input.description === '') {
			UICtrl.invaildInputUI(DOM.inputDesc);
		} else if (isNaN(input.value) || input.value <= 0) {
			UICtrl.invaildInputUI(DOM.inputValue);
		}
	
	};

	//initial function
	return {
		init: function() {
			console.log('Application has started.')
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: 0
			});
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();









