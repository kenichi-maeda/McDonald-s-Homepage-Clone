const cart_window = document.querySelector('.cart-window');
const cartButton = document.querySelector('.cart-button');
const closeButton = document.querySelector('.close-button');
const clearButton = document.querySelector('.clear-cart');
const cart_dom = document.querySelector('.cart');
const items = document.querySelector('.cart-amount');
const total = document.querySelector('.total-amount');
const contents = document.querySelector('.contents');
const menu_dom = document.querySelector('.Menu-center');


let shopping_cart = []
let buttonsDOM = []

class Menu{
    async getMenu(){
        try{
            let result = await fetch("menu.json");
            let data = await result.json();
            let menu = data.items;
            menu = menu.map(item=>{
                const{title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image}
            })
            return menu
        } catch (error){
            console.log(error)
        }
    }
}

class UI{
    displayMenu(menu){
        let result = '';
        menu.forEach(product => {
            result += `
                <article class="foods">
                    <div class="image-container">
                        <img 
                         src="${product.image}"
                         alt="foods" 
                         class="food-image">
                     </div>
                    <h3>${product.title}</h3>
                    <h4>${product.price}</h4>
                    <div class="button-container">
                        <button data-id=${product.id}>Add to Cart</button>
                    </div>
                </article>`;
        });
        cart_dom.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".cart-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = shopping_cart.find(item => item.id==id);
            if(inCart){
                
            }
            button.addEventListener("click", event=>{
                let cartItem ={...Storage.getProduct(id), amount:1};
                
                shopping_cart = [...shopping_cart, cartItem];
                console.log(shopping_cart);

                Storage.saveMenu(shopping_cart);

                this.setCartValues(shopping_cart);

                this.addCartItem(cartItem);

                this.showCart();
            })   
        
        });
    }

    setCartValues(shopping_cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        shopping_cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        total.innerText = parseFloat(tempTotal.toFixed(2));
        items.innerText = itemsTotal;
    }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('items');
        div.innerHTML = `<img src=${item.image}>
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="delete" data-id=${item.id}>Delete</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="amount" data-id=${item.amount}>1</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div> `;
        contents.appendChild(div);
    }
    showCart(){
        cart_window.classList.add('transparentBcg');
        cart_dom.classList.add('showCart');

    }
}

class Storage{
    static saveMenu(menu){
        localStorage.setItem("menu", JSON.stringify(menu));
    }
    static getProduct(id){
        let menu = JSON.parse(localStorage.getItem('menu'));
        return menu.find(product => product.id==id);
    }
    static saveCart(shopping_cart){
        localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI();
    const menu = new Menu();

    menu.getMenu().then(menu=>{
    ui.displayMenu(menu)
    Storage.saveMenu(menu);
    }).then(()=>{
        ui.getBagButtons();
    });
});
