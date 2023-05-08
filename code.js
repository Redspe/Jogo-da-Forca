const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const btnJogar = document.querySelector('#btnJogar');
const btnSair = document.querySelector('#btnSair');
const btnTestar = document.querySelector('#btnTestar');
const plvSecretaBase = document.querySelector('#plvSecretaBase');
const plvSecretaBasE = document.querySelector('#plvSecretaBasE');
let plvSecreta = document.querySelector('#plvSecreta');
let plv = '';
let letraTeste = document.querySelector('#letraTeste');
const letra = document.querySelector('#letra');
let lblForca = document.querySelector('#lblForca');
let letras = [];
let tentativas = 6
const lblTentativas = document.querySelector('#tentativas');

divPrincipal.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnJogar").click();
    }
});

divJogo.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnTestar").click();
    }
});

function separarLetras() {                                                  /* separa as letras da palavra dada em um array */
    letras = []                                                             /* reseta o array para que limpe os dados da outra partida */
    for (let i = 0; i < plvSecreta.value.length; i++) {                     /* faz um loop para pegar cada letra separadamente */
        letras.push(plvSecreta.value[i]);                                   /* "empurra" as letras para dentro da array EX: 'abacate' vira ['a','b','a','c','a','t','e'] */
    }
}

function contarEspacos() {                                                  /* Cria a tela da forca com os "espaços" (no meu caso, os números) de cada letra */
    let qntdd = ''
    for (let i = 0; i < plvSecreta.value.length; i++) {
        qntdd += (i + 1) + ' ';
        lblForca.innerHTML = qntdd;
    }
}

function reset() {                                                          /* Reinicia o jogo e volta para a tela de escolher a palavra secreta */
    divPrincipal.style.display = 'block';
    divJogo.style.display = null;
    plvSecretaBase.value = '';                                              /* reseta a palavra secreta no input do HTML */
    lblTentativas.innerHTML = tentativas                                    /* reseta a quantidade de tentativas restantes */
}

btnJogar.addEventListener('click',                                          /* Configura o jogo para começar */
    function () {
        if (plvSecretaBase.value !== '') {                                  /* Testa se tem alguma coisa escrita */
            divPrincipal.style.display = 'none';
            divJogo.style.display = 'block';
            plv = plvSecretaBase.value;
            plvSecreta.value = plv.toUpperCase();
            separarLetras();
            contarEspacos();
        } else {
            alert('Por favor coloque uma palavra');
        }
    }
);      

btnSair.addEventListener('click', function () { reset() });                 /* Botão para sair da partida */

btnTestar.addEventListener('click',
    function () {
        lblTentativas.innerHTML = tentativas;
        let letraT = letra.value;                                           /* Pega o VALOR da var 'letra' e guarda dentro de 'letraT' */
        letraTeste = letraT.toUpperCase();                                  /* Formata a palavra para facilitar a visualização e as comparações que virão */
        if (letra.value.length !== 1) {                                     /* Testa se tem nenhuma ou mais de uma letra na caixa de texto */
            alert('Por favor coloque UMA letra');                   
        } else {
            let acertou = false;
            
            for (let i = 0; i < plvSecreta.value.length; i++) {
                if (letraTeste === plvSecreta.value[i]) {
                    lblForca.innerHTML = lblForca.innerHTML.replace(i + 1, letraTeste);
                    acertou = true;
                }
            }
            if (acertou === true) { acertou = false; } else {
                tentativas--;
                if (tentativas === 0) {
                    alert('Você perdeu');
                    tentativas = 6;
                    reset();
                }
            }
            
            lblTentativas.innerHTML = tentativas;
            letra.value = '';
        }

        let forca = lblForca.innerHTML;                                     /* Transforma o texto que aparece na tela em algo que o PC pode comparar */
        for (let i = 0; i < lblForca.innerHTML.length; i++) {               /* Ex: de 'A B A C A T E' para 'ABACATE' e assim ver se completou a palavra*/
            forca = forca.replace(' ', '')
        }

        if (forca === plvSecreta.value) {
            alert('Você Ganhou!!!')
            tentativas = 6
            reset()

        }
    }
);