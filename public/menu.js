import {
	MENU,
	addItemToCart,
	removeItemFromCart,
	getCartFromLocalStorage,
	filterMenuByQuery,
	sortMenuByPrice,
	getTotalItemsInCart,
} from "./shared.js";

const cart = getCartFromLocalStorage();
const search = document.getElementById("menu-search-input");
const sort = document.querySelector(".section-topbar-cta");
/** @type { HTMLElement } */
const bottombarCta = document.querySelector(".bottombar-cta");
updateBottombarCtaText();

const defaultMenuList = Object.values(MENU);
let currentMenuList = defaultMenuList;
let sortingMode = "off";

//Fitur Search
search.addEventListener("keyup", cariList);
const sectionBody = document.querySelector(`.section-body`);

function cariList(event) {
	const text = event.target.value;
	if (!text) {
		currentMenuList = defaultMenuList;
	} else {
		currentMenuList = filterMenuByQuery(defaultMenuList, text);
	}
	sectionBody.replaceChildren();

	switch (sortingMode) {
		case "ascending":
			render(sortMenuByPrice(currentMenuList, "ascending"));
			break;
		case "descending":
			render(sortMenuByPrice(currentMenuList, "descending"));
			break;
		default:
			render(currentMenuList);
	}
}

sort.addEventListener(`click`, sortir);
function sortir() {
	let on = document.querySelector(".section-topbar-cta span");
	let sort;
	if (on.innerHTML === "Off") {
		on.innerHTML = "LOWEST";
		sortingMode = "ascending";
		sort = sortMenuByPrice(currentMenuList, "ascending");
	} else if (on.innerHTML === "LOWEST") {
		on.innerHTML = "HIGHEST";
		sortingMode = "descending";
		sort = sortMenuByPrice(currentMenuList, "descending");
	} else {
		on.innerHTML = "Off";
		sortingMode = "off";
		sort = currentMenuList;
	}
	sectionBody.replaceChildren();
	render(sort);
}

render(Object.values(MENU));

function render(menuList) {
	for (let menu of menuList) {
		renderCard(menu);
	}
}

function updateBottombarCtaText() {
	const totalItemsInCart = getTotalItemsInCart(cart);
	bottombarCta.innerText = `${totalItemsInCart} ${
		totalItemsInCart > 1 ? "items" : "item"
	} in cart`;
}

/**
 * @param { import("./shared.js").Item } menu
 */
function renderCard(menu) {
	const itemCardBodyFooter = document.createElement("div"); // Parent dari button 'Add To Cart'
	const itemCardQuantityEditor = document.createElement("div"); // Button + dan - setelah klik 'Add To Cart'
	const itemCardAddToCart = document.createElement("button"); // Button 'Add To Cart'

	const itemCard = document.createElement("div");
	itemCard.classList.add("item-card");

	const itemCardBody = document.createElement("div");
	itemCardBody.classList.add("item-card-body");

	//contoh addImage dan setAttribute - pada komponen apa
	const itemCardImage = document.createElement("img");
	itemCardImage.classList.add("item-card-image");
	itemCardImage.setAttribute("src", menu.imageUrl);

	// Title pada item
	const itemCardTitle = document.createElement("h3");
	itemCardTitle.classList.add("item-card-title");
	itemCardTitle.innerText = menu.name;

	// Menambahkan class pada footer card item
	itemCardBodyFooter.classList.add("item-card-body-footer");

	const itemCardPrice = document.createElement("span");
	itemCardPrice.classList.add("item-card-price");
	itemCardPrice.innerText = `Rp ${menu.price.toLocaleString()}`; // perhatikan ini

	// Menambahkan class untuk penampung button 'Add To Cart'
	itemCardQuantityEditor.classList.add("item-card-quantity-editor");

	// Mengurangi item dari cart
	const itemCardQuantityEditorButtonMinus = document.createElement("button");
	itemCardQuantityEditorButtonMinus.classList.add(
		"item-card-quantity-editor-button"
	);
	itemCardQuantityEditorButtonMinus.innerText = "-";
	//function kurang
	itemCardQuantityEditorButtonMinus.addEventListener("click", function () {
		itemCardQuantityEditorQuantity.innerText = String(
			Number(itemCardQuantityEditorQuantity.innerText) - 1
		);
		removeItemFromCart(menu.id, cart);
		if (itemCardQuantityEditorQuantity.innerText === "0") {
			itemCardBodyFooter.replaceChild(
				itemCardAddToCart,
				itemCardQuantityEditor
			);
		}
		updateBottombarCtaText();
	});

	const itemCardQuantityEditorQuantity = document.createElement("span");
	itemCardQuantityEditorQuantity.classList.add(
		"item-card-quantity-editor-quantity"
	);
	itemCardQuantityEditorQuantity.innerText = "1";

	const itemCardQuantityEditorButtonPlus = document.createElement("button");
	itemCardQuantityEditorButtonPlus.classList.add(
		"item-card-quantity-editor-button"
	);
	itemCardQuantityEditorButtonPlus.innerText = "+";
	itemCardQuantityEditorButtonPlus.addEventListener("click", function () {
		itemCardQuantityEditorQuantity.innerText = String(
			Number(itemCardQuantityEditorQuantity.innerText) + 1
		);
		addItemToCart(menu.id, cart); //nyimpen ke cart biar di simpen
		updateBottombarCtaText();
	});

	// Menambahkan item ke dalam Cart
	itemCardAddToCart.classList.add("item-card-add-to-cart");
	itemCardAddToCart.innerText = "Add to Cart";
	itemCardAddToCart.addEventListener("click", function () {
		//replaceChild
		itemCardQuantityEditorQuantity.innerText = "1";
		itemCardBodyFooter.replaceChild(
			itemCardQuantityEditor,
			itemCardAddToCart
		);
		addItemToCart(menu.id, cart);
		updateBottombarCtaText();
	});

	//append child atas ke bawah / dalam keluar
	itemCardBodyFooter.appendChild(itemCardPrice);
	if (cart[menu.id]) {
		itemCardQuantityEditorQuantity.innerText = cart[menu.id].toString();
		itemCardBodyFooter.appendChild(itemCardQuantityEditor);
	} else {
		itemCardBodyFooter.appendChild(itemCardAddToCart);
	}

	itemCardBody.appendChild(itemCardTitle);
	itemCardBody.appendChild(itemCardBodyFooter);

	itemCard.appendChild(itemCardBody);
	itemCard.appendChild(itemCardImage);

	//Qty Editor
	itemCardQuantityEditor.appendChild(itemCardQuantityEditorButtonMinus);
	itemCardQuantityEditor.appendChild(itemCardQuantityEditorQuantity);
	itemCardQuantityEditor.appendChild(itemCardQuantityEditorButtonPlus);

	//ambil Element
	const sectionBody = document.querySelector(".section-body");
	sectionBody.appendChild(itemCard);
}
