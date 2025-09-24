const buttonsAdd = document.querySelectorAll('.grid-item__btn');
const btnContainersSwitch = document.querySelectorAll('.grid-item__btn-switch');

buttonsAdd.forEach((button) => {
    button.addEventListener('click', (event) => {
        button.classList.add("hidden");
        const parentEl = button.parentElement;
        const pictureEl = parentEl.parentElement.querySelector(".grid-item__image");
        parentEl.classList.add("isSelected");
        pictureEl.classList.add("isSelected");
        const containerSwitch = parentEl.querySelector(".grid-item__btn-switch");
        containerSwitch.classList.add("active");
        containerSwitch.querySelector("p").innerText++;

        createNewItem(event.target);
        if (!cartPlaceholderText.classList.contains("hidden")) {
            cartPlaceholderText.classList.add("hidden");
        }
        if (!cartImage.classList.contains("hidden")) {
            cartImage.classList.add("hidden");
        }
        if (!cartSection.classList.contains("cart-not-empty")) {
            cartSection.classList.add("cart-not-empty");
        }
        cartQuantityCounter.innerText++;
        if (!cartContainer.classList.contains("active")) {
            cartContainer.classList.add("active");
        }

    })
});

const cartImage = document.querySelector(".cart__image");
const cartPlaceholderText = document.querySelector(".cart__placeholder");
const cartSection = document.querySelector(".cart-section");
const cartContainer = cartSection.querySelector(".cart-item__container");

btnContainersSwitch.forEach(div => {
    const decrementBtn = div.querySelector(".decrement-cart");
    const incrementBtn = div.querySelector(".increment-cart");
    let textEl = div.querySelector("p");

    const titleProduct = div.parentElement.parentElement.nextElementSibling.querySelector(".grid-item__title").innerText;
    decrementBtn.addEventListener("click", (event) => {
        textEl.innerText--;
        cartQuantityCounter.innerText--;

        changeCartAmount(titleProduct, textEl.innerText, "-");


        if (textEl.innerText === "0") {
            removeCart(event.target.parentElement);
            deleteCartItem(titleProduct);
            if (cartQuantityCounter.innerText === "0") {
                emptyCart();
            }
        }

    })

    incrementBtn.addEventListener("click", () => {
        textEl.innerText++;
        cartQuantityCounter.innerText++;

        changeCartAmount(titleProduct, textEl.innerText, "+");
    })
});

function emptyCart() {
    cartImage.classList.remove("hidden");
    cartPlaceholderText.classList.remove("hidden");
    cartSection.classList.remove("cart-not-empty");
    cartContainer.classList.remove("active");
}

function removeCart(containerSwitch) {
    containerSwitch.classList.remove("active");
    const parentEl = containerSwitch.parentElement;
    const buttonAdd = parentEl.querySelector(".grid-item__btn");
    const picture = parentEl.parentElement.querySelector(".grid-item__image");
    parentEl.classList.remove("isSelected");
    picture.classList.remove("isSelected");
    buttonAdd.classList.remove("hidden");
}

let cartQuantityCounter = document.querySelector(".cart__quantity-counter");

let totalPriceEl = cartContainer.querySelector(".cart-item__total-price");

function createNewItem(target) {
    const parentEl = target.parentElement.parentElement.parentElement;
    const counterCartProduct = target.nextElementSibling.querySelector("p").innerText;
    const titleProduct = parentEl.querySelector(".grid-item__title").innerText;
    const priceProduct = parentEl.querySelector(".grid-item__price").innerText.replace("$", "");

    const newCartItem = document.createElement("div");
    cartContainer.querySelector(".cart-item__grid").appendChild(newCartItem);
    newCartItem.classList.add("cart-item");

    const leftContainer = document.createElement("div");
    newCartItem.appendChild(leftContainer);
    leftContainer.classList.add("left-container");

    const button = document.createElement("button");
    newCartItem.appendChild(button);

    button.addEventListener("click", (event) => {
        const switchContainer = target.parentElement.querySelector(".grid-item__btn-switch");
        removeCart(switchContainer);
        newCartItem.remove();

        const amountProductsPara = switchContainer.querySelector("p");
        const amount = amountProductsPara.innerText;
        amountProductsPara.innerText = "0";
        cartQuantityCounter.innerText -= amount;
        const currentTotalPrice = parseFloat(priceProduct) * amount;
        const totalPrice = totalPriceEl.innerText.replace("$", "");
        totalPriceEl.innerText = `$${(totalPrice - currentTotalPrice).toFixed(2)}`

        if (cartQuantityCounter.innerText === "0") {
            emptyCart();
        }

    })

    const titleNewItem = document.createElement("p");
    leftContainer.appendChild(titleNewItem);
    titleNewItem.innerText = titleProduct;

    const div = document.createElement("div");
    leftContainer.appendChild(div);

    const cartAmount = document.createElement("p");
    const singlePrice = document.createElement("p");
    const sumPrice = document.createElement("p");

    div.appendChild(cartAmount);
    cartAmount.classList.add("cart-item__amount");
    cartAmount.innerText = `${counterCartProduct}x`;

    div.appendChild(singlePrice);
    singlePrice.classList.add("cart-item__single-price");
    singlePrice.innerText = `@ $${priceProduct}`

    div.appendChild(sumPrice);
    sumPrice.classList.add("cart-item__sum-price");
    sumPrice.innerText = `$${priceProduct}`;

    calcTotalPrice(priceProduct, null);
}

function deleteCartItem(titleProduct) {
    let cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach(cartItem => {
        if (cartItem.querySelector(".left-container").querySelector("p").innerText === titleProduct) {
            cartItem.remove();
        }
    })
}

function changeCartAmount(titleProduct, amount, operation) {
    let cartItems = document.querySelectorAll(".cart-item");
    cartItems.forEach(cartItem => {
        if (cartItem.querySelector(".left-container").querySelector("p").innerText === titleProduct) {
            cartItem.querySelector(".cart-item__amount").innerText = `${amount}x`;
            const sumEl = cartItem.querySelector(".cart-item__sum-price");

            const priceSingleProduct = parseFloat(cartItem.querySelector(".cart-item__single-price").innerText.replace("@ $", ""));
            let sum = priceSingleProduct * amount;
            sumEl.innerText = `$${sum.toFixed(2)}`;

            calcTotalPrice(priceSingleProduct, operation);
        }
    })
}

function calcTotalPrice(priceProduct, operation) {
    let totalPrice = parseFloat(totalPriceEl.innerText.replace("$", ""));
    if (operation === null || operation === "+") {
        totalPrice += parseFloat(priceProduct);
        totalPriceEl.innerText = `$${totalPrice.toFixed(2)}`;
    }
    if (operation === "-") {
        totalPrice -= parseFloat(priceProduct);
        totalPriceEl.innerText = `$${totalPrice.toFixed(2)}`;
    }
}

const checkoutBtn = document.querySelector(".cart-item__checkout");

checkoutBtn.addEventListener("click", (event) => {
    checkout();
})

const overlay = document.querySelector(".overlay");
const main = document.querySelector("main");
const checkoutContainer = document.querySelector(".checkout-container");

function checkout() {
    if (!document.body.classList.contains("no-scroll"))
        document.body.classList.add("no-scroll");
    overlay.hidden = false;
    main.setAttribute("inert", "");
    footer.setAttribute("inert", "");

    checkoutContainer.classList.add("active");

    checkoutContainer.querySelector(".cart-item__total-price").innerText = totalPriceEl.innerText;
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(cartItem => {
        const copy = cartItem.cloneNode(true);
        checkoutContainer.querySelector(".cart-item__grid").appendChild(copy);
    })

    checkoutContainer.querySelectorAll(".cart-item").forEach(item => {
        item.querySelector("button").remove();

        const div = document.createElement("div");
        div.classList.add("item-cart__left-div");
        item.prepend(div);
        const leftContainer = item.querySelector(".left-container");

        const productTitle = item.querySelector(".left-container").querySelector("p").innerText;

        const thumbnail = document.createElement("img");
        let productTitleTrimmed;

        switch (productTitle) {
            case "Waffle with Berries":
                productTitleTrimmed = "waffle";
                break;
            case "Vanilla Bean Crème Brûlée":
                productTitleTrimmed = "creme-brulee";
                break;
            case "Macaron Mix of Five":
                productTitleTrimmed = "macaron";
                break;
            case "Classic Tiramisu":
                productTitleTrimmed = "tiramisu";
                break;
            case "Pistachio Baklava":
                productTitleTrimmed = "baklava";
                break;
            case "Lemon Meringue Pie":
                productTitleTrimmed = "meringue";
                break;
            case "Red Velvet Cake":
                productTitleTrimmed = "cake";
                break;
            case "Salted Caramel Brownie":
                productTitleTrimmed = "brownie";
                break;
            case "Vanilla Panna Cotta":
                productTitleTrimmed = "panna-cotta";
                break;
        }
        thumbnail.src = `assets/images/image-${productTitleTrimmed}-thumbnail.jpg`
        thumbnail.alt = "";

        div.appendChild(thumbnail);
        div.appendChild(leftContainer);

        const totalPriceEl = item.querySelector(".cart-item__sum-price");
        item.appendChild(totalPriceEl);
    })

    const resetBtn = document.querySelector(".new-order");

    resetBtn.addEventListener("click", (event) => {
        document.body.classList.remove("no-scroll");
        main.removeAttribute("inert");
        footer.removeAttribute("inert");

        overlay.hidden = true;
        checkoutContainer.classList.remove("active");
        checkoutContainer.querySelector(".cart-item__grid").querySelectorAll(".cart-item").forEach(item => {
            item.remove();
        })
        emptyCart();
        cartQuantityCounter.innerText = "0";
        cartContainer.querySelectorAll(".cart-item").forEach(item => {
            item.remove();
        })
        const switches = document.querySelectorAll(".grid-item__btn-switch");
        switches.forEach(switchEl => {
            removeCart(switchEl);
            switchEl.querySelector("p").innerText = "0";
        })
        totalPriceEl.innerText = "$0.00"
    })
}

const footer = document.getElementById("footer");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            footer.classList.add("visible");
        } else {
            footer.classList.remove("visible");
        }
    });
}, {threshold: 1.0}); // 100% sichtbar

observer.observe(footer);


