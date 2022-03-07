const $game = document.getElementById('game');
const $choose = document.getElementById('choose');
const $lotofacil = document.getElementById('lotofacil');
const $megasena = document.getElementById('megasena');
const $quina = document.getElementById('quina');
const $completeGame = document.getElementById('completeGame');
const $clearGame = document.getElementById('clearGame');
const $addToCart = document.getElementById('addToCart');
let cart = [];
let currentId = 1;
let currentGame;
let games;

function bets(){
    games.forEach((game)=>{
        const $div = document.createElement('div');
        $div.setAttribute('id', game.type);
        $div.setAttribute('value', game.type);
        $div.setAttribute('active', 'false');
        $div.setAttribute('data-js', "bets");
        $div.classList.add('chooseBnt', 'cursor_pointer');
        $div.textContent = game.type;
        $div.style.color = game.color;
        $div.style.border = 'solid'
        $div.style.borderColor = game.color;
        console.log(game);
        console.log(game.color);
        $choose.appendChild($div)
    })
}

(() => {
    fetch('./../utils/games.json')
        .then(res => res.json())
        .then(data => {
            games = data.types;
            console.log(games);
            bets();
        })
})()

function init(){

}

function addToCart(item) {
    cart.push(item);
}

function removeFromCart(id) {
    const aux = cart.filter((game)=>{
        return game.id != id
    });
    cart = aux;
}

function getCartValue(){
    const aux = cart.reduce((acc, game)=>{
        return acc + game.price
    }, 0)

    return aux;
}

function handlerValue(value) {
    return (
        value < 10 ?
        value[0] !== '0' ?
        '0' + value :
        value :
        value
    )
}

function handlerBtn(ele) {
    const selected = catchSelectedButtons();
    const check = ele.target.classList.contains('selected_btn');

    if (check) {
        return ele.target.classList.remove('selected_btn');
    }
    if (selected.length === currentGame.maxNumber) {
        return (
            alert('Este jogo atingiu a quantidade máxima de números selecionados')
        )
    }

    ele.target.classList.add('selected_btn');
}

function createBtn(value) {
    const number = handlerValue(value);
    const $Btn = document.createElement("div");
    $Btn.textContent = number;
    $Btn.value = number;
    $Btn.classList.add('game_btn');
    $Btn.classList.add('cursor_pointer');
    $Btn.setAttribute("data-js", "buttons");
    $Btn.addEventListener('click', handlerBtn);
    $game.appendChild($Btn);
}

function handlerButtons(range) {
    for (let i = 1; i <= range; i++) {
        createBtn(i);
    }
}

function getGameByName(name) {
    const aux = games.filter((item) => {
        return item.type === name
    });

    return aux[0];
}

function cleanDivs() {
    $game.innerHTML = '';
    const $bets = document.querySelectorAll('[data-js="bets"]');
    const length = $bets.length;
    for (let i = 0; i <= length; i++) {
        $bets[0].setAttribute('active', 'false');
    }
}

function toggleActiveGame(item) {
    item.setAttribute('active', 'true');
}

function changeDescription(text) {
    const $description = document.getElementById('description');
    $description.textContent = text;
}

function changeCurrentGame(game) {
    currentGame = null;
    currentGame = game;
}

function handlerGameType(ele) {
    const name = ele.target.textContent;
    const game = getGameByName(name);
    changeCurrentGame(game);
    cleanDivs();
    toggleActiveGame(ele.target);
    changeDescription(currentGame.description);
    handlerButtons(currentGame.range);
}

$lotofacil.addEventListener('click', handlerGameType);
$megasena.addEventListener('click', handlerGameType);
$quina.addEventListener('click', handlerGameType);

function catchSelectedButtons() {
    const $buttons = document.querySelectorAll('[data-js="buttons"]');
    const aux = [];
    const length = $buttons.length - 1;

    for (let i = 0; i <= length; i++) {
        const check = $buttons[i].classList.contains('selected_btn');
        check ? aux.push($buttons[i]) : ''
    }

    return aux;
}

function catchButtonsValues(buttons) {
    return (
        buttons.map((item) => {
            return item.value
        })
    )
}

function isGameOk(){
    const selecteds = catchSelectedButtons();
    const length = selecteds.length;

    if(length < 1){
        return false
    }

    return true
}

function handlerAddToCart(ele) {
    const selecteds = catchSelectedButtons();
    const selectedsValues = catchButtonsValues(selecteds);
    const newCartItem = creatCartItem(selectedsValues);
    const check = isGameOk();

    if(!check){
        return(
            alert("Você precisa selecionar no mínimo um número")
        )
    }

    clearGame();
    addToCart(newCartItem);
    renderCart();
}

$addToCart.addEventListener('click', handlerAddToCart);

function clearGame() {
    const $buttons = document.querySelectorAll('[data-js="buttons"]');
    const length = $buttons.length - 1;

    for (let i = 0; i <= length; i++) {
        $buttons[i].classList.remove('selected_btn');
    }
}

function handlerTrash(ele) {
    const id = ele.target.id;
    removeFromCart(id);
    renderCart();
}

function createTrash(id) {
    const $trash = document.createElement('div');
    $trash.setAttribute('id', id);
    $trash.classList.add('trash', 'cursor_pointer');
    $trash.addEventListener('click', handlerTrash);

    return $trash;
}

function handlerArrNumbers(arrNumbers) {
    let aux = arrNumbers.map((item) => {
        return handlerValue(item)
    })

    aux = `${aux}`.replaceAll(',', ', ');

    return aux;
}

function toLocaleBRL(value) {
    const aux = value.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    });

    return aux;
}

$clearGame.addEventListener('click', clearGame)

function renderCart() {
    const $cart_items = document.getElementById('cart_items');
    $cart_items.textContent = '';
    
    const $total = document.getElementById('total');
    const cartValue = getCartValue();
    $total.textContent = ` ${toLocaleBRL(cartValue)}`

    cart.forEach((game) => {
        const $wrapper = document.createElement('div');
        $wrapper.classList.add('cart_item_wrapper', 'margin_top30');

        const $trash = createTrash(game.id);

        const $contianer = document.createElement('div');
        $contianer.classList.add('cart_item', `cart_item_${game.type}`);

        const $numbers = document.createElement('div');
        $numbers.classList.add('fs15px', 'fw700');
        $numbers.textContent = handlerArrNumbers(game.numbers);

        const $description = document.createElement('div');
        $description.classList.add('fs16px');

        const $span = document.createElement('span');
        $span.classList.add('fw700', `fcolor_${game.type}`);
        $span.textContent = game.type;

        const $value = document.createElement('span');
        $value.textContent = ` ${toLocaleBRL(game.price)}`

        $description.append($span, $value);


        $contianer.append($numbers, $description);

        $wrapper.append($trash, $contianer);

        $cart_items.appendChild($wrapper);
    })
}

function creatCartItem(arrNumbers) {
    return({
        numbers: arrNumbers,
        type: currentGame.type,
        price: currentGame.price,
        id: currentId++
    })
}

function handlerNewSelecteds(newSelecteds) {
    const $buttons = document.querySelectorAll('[data-js="buttons"]');
    const length = $buttons.length - 1;

    newSelecteds.forEach((item) => {
        for (let i = 0; i <= length; i++) {
            const check = $buttons[i].value == item;

            if (check) {
                $buttons[i].classList.add('selected_btn');
            }
        }
    })
}

function handlerCompleteGame() {
    const selecteds = catchSelectedButtons();
    const selectedsValues = catchButtonsValues(selecteds);
    const missingNumbers = currentGame.maxNumber - selecteds.length;
    const newSelecteds = [];
    while (missingNumbers > 0) {
        const aux = handlerValue(Math.floor(Math.random() * currentGame.range + 1));
        const check = selectedsValues.includes(aux);
        if (check) {
            continue
        }

        newSelecteds.push(aux);

        if (newSelecteds.length === missingNumbers) {
            break;
        }
    }

    handlerNewSelecteds(newSelecteds);
    //selectedsValues.push(...newSelecteds);
    // const newCartItem =  creatCartItem(selectedsValues);
    // addToCart(newCartItem);
    // renderCart();
}

$completeGame.addEventListener('click', handlerCompleteGame);
