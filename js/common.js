/****** SETTINGS AND CONSTANTS ******/

/* sets whether debug messages should be printed */
const DEBUG_MODE = true;

/* stores customer data after checkout */
var customerInfo = {
	name: "",
	email: ""
}

/* 
	images are licensed under creative commons.
	names are (mostly) randomly generated. 
*/

const products = [
	{
		id: 1,
		name: "Spearmint Crystal",
		price: 46,
		img: "green-drink.jpg",
		category: "Smoothie"
	},
	{
		id: 2,
		name: "River Wave",
		price: 42,
		img: "yellow-drink.jpg",
		category: "Smoothie"
	},
	{
		id: 3,
		name: "Arctic Walk",
		price: 33,
		img: "strawberry-banana.jpg",
		category: "Smoothie"
	},
	{
		id: 4,
		name: "Gentle Blizzard",
		price: 32,
		img: "orange-drink.jpg",
		category: "Smoothie"
	},
	{
		id: 5,
		name: "Dazzling Health",
		price: 38,
		img: "blueberry.jpg",
		category: "Smoothie"
	},
	{
		id: 6,
		name: "Summer Paradise",
		price: 38,
		img: "strawberry.jpg",
		category: "Smoothie"
	},
	{
		id: 7,
		name: "Rough Touch",
		price: 47,
		img: "bread-rolls.jpg",
		category: "Bread"
	},
	{
		id: 8,
		name: "French Dream",
		price: 33,
		img: "baguette.jpg",
		category: "Bread"
	},
	{
		id: 9,
		name: "Good Morning",
		price: 37,
		img: "baguette-2.jpg",
		category: "Bread"
	},
	{
		id: 10,
		name: "Light and Sweet",
		price: 31,
		img: "loaf.jpg",
		category: "Bread"
	},
	{
		id: 11,
		name: "Our Bread",
		price: 30,
		img: "rye-bread.jpg",
		category: "Bread"
	},
	{
		id: 12,
		name: "Wet Sour",
		price: 32,
		img: "bread-rolls-2.jpg",
		category: "Bread"
	},
	{
		id: 13,
		name: "Balanced Slammer",
		price: 32,
		img: "cap.jpg",
		category: "Coffee"
	},
	{
		id: 14,
		name: "Innocent Java",
		price: 40,
		img: "cap-2.jpg",
		category: "Coffee"
	},
	{
		id: 15,
		name: "Orange Volcano",
		price: 32,
		img: "cap-3.jpg",
		category: "Coffee"
	},
	{
		id: 16,
		name: "Imaginary Tornado",
		price: 47,
		img: "cap-4.jpg",
		category: "Coffee"
	}
];

/****** HELPER FUNCTIONS AND CODE ******/

if (DEBUG_MODE) {
	/* code to run in debug mode goes here */
} else {
	/* overwrite console.log with empty function to suppress output */
	console.log = function(){};
}

function getCookie(key) {
	/* 
		helper: gets cookie with input key
		source: https://stackoverflow.com/questions/10730362/get-cookie-by-name 
	*/
	var value = "; " + document.cookie;
	var parts = value.split("; " + key + "=");
	if (parts.length == 2) {
		return parts.pop().split(";").shift();;
	}
}

function renderFileToContainer(url, containerSelector, callback) {
	/*
		gets the contents of the .html file at the specified url,
		and puts it in the container specified by the CSS selector
		containerSelector. the callback function is run after that
		is done. an usage example is at the bottom of this file.
	*/

	fetch("./"+url).then(function (response) {
		return response.text();
	}).then(function (html) {
		document.querySelector(containerSelector).innerHTML = html;
		if (callback) {
			callback();
		}
	});
}

function renderFinishedCallback() {
	/* code that we want to run after the header/footer has finished loading goes here */

	/* bind cart button onclick to open cart, add cart item counters */
	var openCartButtons = document.getElementsByClassName("show-cart-btn");
	
	for (var i = 0; i < openCartButtons.length; i++) {
		openCartButtons[i].addEventListener('click', showCartDialog);

		/* check whether button already has a cart item counter, add one if not */
		if (!openCartButtons[i].querySelector(".cart-counter")) {
			var cartCounter = document.createElement("span");
			cartCounter.innerText = getTotalItemsInCart();
			cartCounter.classList.add("cart-counter");
			openCartButtons[i].appendChild(cartCounter);
		}
	}
}

/****** CART-RELATED CODE ******/

var cart = [];

function storeCart() {
	/* stores cart to cookie */
	var cartString = JSON.stringify(cart);
	console.log("Current cart stored to cookie: " + cartString);
	document.cookie = "cart="+btoa(cartString)+";";
}

function loadCart() {
	/* loads cart from stored cookie */
	var cartCookie = getCookie("cart");
	if (cartCookie) {
		var cartString = atob(getCookie("cart"));
		console.log("Loaded cart cookie: " + cartString);
		if (cartString) {
			cart = JSON.parse(cartString);
		}
	}
}

function getTotalItemsInCart() {
	/* returns the total amount of items in the cart. */
    var itemCount = 0;
    for (var i = 0; i < cart.length; i++) {
        itemCount += cart[i].count;
    }
    return itemCount;
}

function getTotalItemCost() {
	/* returns the total cost of items in the cart. */
    var totalCost = 0;
    for (var i = 0; i < cart.length; i++) {
        totalCost += cart[i].count * getItemData(cart[i].id, products).price;
    }
    return totalCost;
}

function updateCartCounter() {
    var cartCounters = document.getElementsByClassName("cart-counter");
    for (var i = 0; i < cartCounters.length; i++) {
		var cartCounter = cartCounters[i];
		cartCounter.innerText = getTotalItemsInCart();
		cartCounter.classList.add("counter-updated");
		(function(counter) {
			setTimeout(function(){
				counter.classList.remove("counter-updated");
			}, 200);
		})(cartCounter);
    }
}

function emptyCart() {
	/* clears the cart variable and updates the cart if it is open. */
	cart = [];
	if (document.querySelector(".dialog-visible .cart")) {
		renderCart();
	}
    storeCart();
    updateCartCounter();
}

function checkoutCallback() {
	renderFileToContainer("shared-html/checkout.html", ".checkout", checkoutRenderedCallback);
}

function checkoutRenderedCallback() {
	renderCartSummary();
	var orderNowButtons = document.querySelector(".dialog").getElementsByClassName("place-order-btn");

    for (var i = 0; i < orderNowButtons.length; i++) {
        orderNowButtons[i].removeEventListener('click', showCheckoutSuccessDialog);
        orderNowButtons[i].addEventListener('click', showCheckoutSuccessDialog);
    }
}

function showCheckoutSuccessDialog() {
	/* check if form is valid - if not trigger form errors by clicking a button inside the form */
	var form = document.querySelector(".dialog form");
	if (!form.checkValidity()) {
		const triggerButton = document.createElement('button')
		form.appendChild(triggerButton)
		triggerButton.click()
		form.removeChild(triggerButton)
		return;
	}

	customerInfo.name = document.querySelector('input[name="first-name"]').value;
	customerInfo.email = document.querySelector('input[name="email"]').value;
	emptyCart();
	showDialog("Checkout", '<div class="checkout"><p>Your order has been placed, ' + customerInfo.name + '!</p><p>A receipt has been sent to ' + customerInfo.email + ', and we\'ll send you another email when your order ships.</p></div>', '');
}

function showCheckoutDialog() {
    showDialog("Checkout", '<div class="checkout"><p>Checkout?</p></div>', '<button class="place-order-btn">Place Order</button> <button class="close-dialog-btn">Cancel</button>', checkoutCallback);
}

function getCartItemCount(itemId) {
	/* gets the amount we have of an item, if we have it in the cart. */
	var item = getItemData(itemId, cart);
	if (item) {
		return item.count;
	}
	return 0;
}

function setCartItemCount(itemId, count) {
	var item = getItemData(itemId, products);
	if (item) {
		if (count > 0) {
            var existingItem = cart.filter(e => e.id === itemId);
            if (existingItem.length != 0) {
                /* product exists, set count */
                existingItem[0].count = count;
            } else {
                var newItem = {
                    id: itemId,
                    count: count
                };
                cart.push(newItem);
            }
            storeCart();
		} else {
            var existingItem = cart.filter(e => e.id === itemId);
            if (existingItem.length != 0) {
				/* remove item if it exists */
                cart.splice(cart.findIndex(e => e.id == itemId), 1);
            }
        }
        updateCartCounter();
	}
}

function getItemData(itemId, target) {
	/* gets the data associated with a product stored in our products list */
	var item = target.filter(e => e.id === itemId);
	if (item.length > 0) {
		return item[0];
	}
	return false;
}

function renderCartSummary() {
	/* renders cart from cart variable */
	const cart_container = document.querySelector(".cart-summary");
	cart_container.innerHTML = "<p>Your cart is empty.</p>";

	/* set up cart DOM contents */
	if (cart.length > 0) {
		const list = document.createElement("ul");
		cart_container.innerHTML = "";
		cart_container.appendChild(list);
		for (i = 0; i < cart.length; i++) {
			/* add each cart item */
			const li = document.createElement("li");
			const itemData = getItemData(cart[i].id, products);
			li.innerText = itemData.name + " (" + cart[i].count + ")";
			list.appendChild(li);
		}

		var sumElement = document.createElement("p");
		sumElement.classList.add("text-center");
		sumElement.innerText = "Cost: " + getTotalItemCost() + " NOK";
		cart_container.appendChild(sumElement);
    }
    
	console.log("Attempted to render cart summary, current cart: " + JSON.stringify(cart));
}

function renderCart() {
	/* renders cart from cart variable */
	const cart_container = document.querySelector(".cart");
	cart_container.innerHTML = "<p>Your cart is empty.</p>";

	/* set up cart DOM contents */
	if (cart.length > 0) {
		const list = document.createElement("ul");
		const sum = document.createElement("li");
		list.classList.add("cart-items");
		cart_container.innerHTML = "";
		cart_container.appendChild(list);

		for (i = 0; i < cart.length; i++) {			
			/* add each cart item */

			const itemData = getItemData(cart[i].id, products);
			
			/* set up output containers */
			const li = document.createElement("li");
			li.classList.add("row");

			const col1 = document.createElement("div");
			col1.classList.add("col-50p");
			const col2 = document.createElement("div");
			col2.classList.add("col-50p");
			col2.classList.add("input-container")

			/* set up container content */
			const img = document.createElement("div");
			img.style.backgroundImage = "url('./img/"+itemData.img + "')";
			img.classList.add("product-img");

			const name = document.createElement("span");
			name.innerText = itemData.name + " (" + (cart[i].count * itemData.price) + " NOK)";
			name.classList.add("product-name");

			/* create and bind events for cart buttons and inputs */
			const countInput = document.createElement("input");
			countInput.type = "number";
			countInput.min = "0";
			countInput.dataset.productId = cart[i].id;
			countInput.value = cart[i].count;

			const countUpdateBtn = document.createElement("button");
			countUpdateBtn.innerText = "Update";
			countUpdateBtn.classList.add("inverted");
			countUpdateBtn.dataset.productId = cart[i].id;
			countUpdateBtn.addEventListener("click", function(e){
				var productId = this.dataset.productId;
				var input = document.querySelector("input[data-product-id='" + productId + "']");
				setCartItemCount(parseInt(productId), parseInt(input.value));
				renderCart();
			});

			const removeBtn = document.createElement("button");
			removeBtn.innerText = "Remove";
			removeBtn.classList.add("inverted");
			removeBtn.dataset.productId = cart[i].id;
			removeBtn.addEventListener("click", function(e){
				console.log(this.dataset.productId);
				setCartItemCount(parseInt(this.dataset.productId), 0);
				renderCart();
			});

			/* add all elements to their respective parents */
			col1.appendChild(img);
			col1.appendChild(name);

			col2.appendChild(countInput);
			col2.appendChild(countUpdateBtn);
			col2.appendChild(removeBtn);

			li.appendChild(col1);
			li.appendChild(col2);

			list.appendChild(li);
		}

		sum.classList.add("sum-container");
		sum.innerHTML = "Total cost: <span>" + getTotalItemCost() + " NOK</span>";
		list.appendChild(sum);
    }
    
    var dialog = document.querySelector(".dialog");

	/* bind cart button listeners */
    var checkoutButtons = dialog.getElementsByClassName("checkout-btn");
    var emptyCartButtons = dialog.getElementsByClassName("empty-cart-btn");

    for (var i = 0; i < checkoutButtons.length; i++) {
		checkoutButtons[i].removeEventListener('click', showCheckoutDialog);
		checkoutButtons[i].classList.add("disabled");
		checkoutButtons[i].disabled = true;
		checkoutButtons[i].title = "You need to have some items in your cart before you can check out.";

		if (getTotalItemsInCart() > 0) {
			checkoutButtons[i].addEventListener('click', showCheckoutDialog);
			checkoutButtons[i].classList.remove("disabled");
			checkoutButtons[i].disabled = false;
			checkoutButtons[i].title = "";
		}
    }

    for (var i = 0; i < emptyCartButtons.length; i++) {
        emptyCartButtons[i].removeEventListener('click', showEmptyCartDialog);
		emptyCartButtons[i].classList.add("hidden");
		
		if (getTotalItemsInCart() > 0) {
			emptyCartButtons[i].addEventListener('click', showEmptyCartDialog);
			emptyCartButtons[i].classList.remove("hidden");
		}
	}
	
	console.log("Attempted to render cart, current cart: " + JSON.stringify(cart));
}

function showEmptyCartDialog() {
	/* ask the user to confirm that they want to empty their cart */
	showDialog("Confirm", '<p>Are you sure you wish to empty your cart?</p>', '<button onclick="emptyCart();hideDialog();">Yes, empty my cart</button> <button class="close-dialog-btn">Cancel</button>');
}

function showCartDialog() {
    showDialog("Cart", '<div class="cart"></div>', '<button class="checkout-btn">Checkout</button> <button class="empty-cart-btn">Empty cart</button> <button class="close-dialog-btn">Close</button>', renderCart);
}

/****** DIALOG-RELATED CODE ******/

/* default template used for rendering the dialog window */
const dialogTemplateHtml = '' +
    '<div class="dialog">' +
        '<div class="dialog-header"><h4 class="dialog-title"></h4><button class="close-dialog-btn">x</button></div>' +
        '<div class="dialog-content">' +
            '<p>test</p>' +
        '</div>' +
        '<div class="dialog-footer"></div>' +
    '</div>';

function hideDialog() {
	document.querySelector("body").classList.remove("dialog-visible");
	console.log("Attempted to hide dialog");
}

function showDialog(title, contentHtml, footerHtml, onRenderCallback) {
	/* 
		shows a dialog window.
		title: shows up in the title of the dialog.
		contentHtml: any html, shows up in the dialog body.
		footerHtml: any html, shows up in the footer. contains a close button by default.
		onRenderCallback: function, runs after the dialog is finished rendering. useful for adding buttons.
	*/

    var body = document.querySelector("body");

	/* create dialog container if it doesn't exist */
    if (!document.querySelector(".dialog-backdrop")) {
        var dialogContainer = document.createElement("div");
		dialogContainer.className = "dialog-backdrop";
		dialogContainer.innerHTML = dialogTemplateHtml;
		body.appendChild(dialogContainer);   
	}
	
	var dialog = document.querySelector(".dialog");
	
	/* check if we already have an open dialog */
    if (body.classList.contains("dialog-visible") && !dialog.classList.contains("dialog-hidden")) {
        /* hide current dialog, open new one after a delay to give it time to close */
        dialog.classList.add("dialog-hidden");
        setTimeout(function(){ showDialog(title, contentHtml, footerHtml, onRenderCallback); }, 500);
        return;
    }
	
	var dialogContainer = document.querySelector(".dialog-backdrop");
	
	/* set up dialog contents */
	var outputTitle = 'Dialog';
	var outputContentHtml = '<p>No content specified</p>';
	var outputFooterHtml = '<button class="close-dialog-btn">Close</button>';
	
	if (title && title.length > 0) {
		outputTitle = title;
	}
	
	if (contentHtml && contentHtml.length > 0) {
		outputContentHtml = contentHtml;
	}
	
	if (footerHtml && title.length > 0) {
		outputFooterHtml = footerHtml;
	}
	
	dialog.querySelector(".dialog-title").innerHTML = outputTitle;
	dialog.querySelector(".dialog-content").innerHTML = outputContentHtml;
	dialog.querySelector(".dialog-footer").innerHTML = outputFooterHtml;
	
	/* bind button event listeners */
    var closeButtons = dialog.getElementsByClassName("close-dialog-btn");
	
	for (var i = 0; i < closeButtons.length; i++) {
		 closeButtons[i].addEventListener('click', hideDialog);
    }
	
	dialogContainer.addEventListener('click', hideDialog);
	dialog.addEventListener('click', function(e){e.stopPropagation();});
	
	/* run callback function if set */
	if (onRenderCallback) {
		onRenderCallback();
	}
	
	/* show dialog */
    body.classList.add("dialog-visible");
	dialog.classList.remove("dialog-hidden");
	console.log("Attempted to show dialog with title " + outputTitle);
}

/****** CODE TO RUN ON PAGE LOAD ******/

loadCart();

renderFileToContainer("shared-html/header.html", "header", renderFinishedCallback);

renderFileToContainer("shared-html/footer.html", "footer", renderFinishedCallback);