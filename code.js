const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const btnJogar = document.querySelector('#btnJogar');
const btnSair = document.querySelector('#btnSair');
const btnTestar = document.querySelector('#btnTestar');
const plvSecretaBase = document.querySelector('#plvSecretaBase');
const plvSecretaBasE = document.querySelector('#plvSecretaBasE');
const plvSecreta = document.querySelector('#plvSecreta');
const letra = document.querySelector('#letra');
const lblForca = document.querySelector('#lblForca');
const lblTentativas = document.querySelector('#tentativas');
const letrasErradas = document.querySelector('#letrasErradas');
let plv = '';
let letraTeste = document.querySelector('#letraTeste');
let tentativas = 6;
let segredo = [];
let palavra = [];
let erradas = [];
let certas = [];

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

function palavraAleatoria() {

}

function separarLetras() {                                                  /* separa as letras da palavra dada em um array */                                                          /* reseta o array para que limpe os dados da outra partida */
    segredo = [];
    palavra = [];
    for (let i = 0; i < plvSecreta.value.length; i++) {                     /* faz um loop para pegar cada letra separadamente */                                /* "empurra" as letras para dentro da array EX: 'abacate' vira ['a','b','a','c','a','t','e'] */
        segredo.push(plvSecreta.value[i]);
        palavra.push('_');
    }
    console.log(segredo, palavra);
}

function contarEspacos() {                                                  /* Cria a tela da forca com os "espaços" (no meu caso, os números) de cada letra */
    let qntdd = '';
    for (let i = 0; i < plvSecreta.value.length; i++) {
        qntdd += palavra[i] + ' ';
        lblForca.innerHTML = qntdd;
    }
}

function reset() {                                                          /* Reinicia o jogo e volta para a tela de escolher a palavra secreta */
    divPrincipal.style.display = 'block';
    divJogo.style.display = null;
    plvSecretaBase.value = '';                                              /* reseta a palavra secreta no input do HTML */
    lblTentativas.innerHTML = tentativas;                                   /* reseta a quantidade de tentativas restantes */
    document.getElementById("letra").focus();
}

btnJogar.addEventListener('click',                                          /* Configura o jogo para começar */
    function jogar(palavra) {
        if (typeof (palavra) === String && palavra !== '') {
            plvSecretaBase.value = palavra;
            console.log(palavra)
        } else {
            if (plvSecretaBase.value !== '') {                              /* Testa se tem alguma coisa escrita */
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
        document.getElementById("letra").focus();
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
            if (certas.includes(letraTeste) === false && erradas.includes(letraTeste) === false) {
                let acertou = false;
                let abc = '';
                for (let i = 0; i < segredo.length; i++) {
                    if (letraTeste === segredo[i]) {
                        palavra[i] = letraTeste;
                        lblForca.innerHTML = palavra;

                        acertou = true;
                    }
                }
                if (acertou === true) {
                    certas.push(letraTeste)
                    acertou = false;
                } else {
                    erradas.push(letraTeste)
                    letrasErradas.innerHTML = erradas
                    tentativas--;
                    if (tentativas === 0) {
                        document.getElementById("letra").focus();
                        alert('Você perdeu. A palavra secreta era: ' + plvSecreta.value);
                        tentativas = 6;
                        erradas = [];
                        certas = [];
                        letrasErradas.innerHTML = '';
                        reset();
                    }
                }
                while (lblForca.innerHTML.includes(',') === true) {
                    lblForca.innerHTML = lblForca.innerHTML.replace(',', ' ');
                }
                lblTentativas.innerHTML = tentativas;
                letra.value = '';
            } else {
                alert('Você já testou esta letra. Por favor tente outra.')
            }

        }

        let forca = lblForca.innerHTML;                                     /* Transforma o texto que aparece na tela em algo que o PC pode comparar */
        for (let i = 0; i < lblForca.innerHTML.length; i++) {               /* Ex: de 'A B A C A T E' para 'ABACATE' e assim ver se completou a palavra*/
            forca = forca.replace(' ', '');
        }

        if (forca === plvSecreta.value) {
            alert('Você Ganhou!!!');
            erradas = [];
            certas = [];
            letrasErradas.innerHTML = '';
            tentativas = 6;
            reset();
        }
        document.getElementById("letra").focus();
    }
);