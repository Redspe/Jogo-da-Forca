const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const btnJogar = document.querySelector('#btnJogar');
const btnSair = document.querySelector('#btnSair');
const btnTestar = document.querySelector('#btnTestar');
const btnPlvAleat = document.querySelector('#btnPlvAleat');
const plvSecretaBase = document.querySelector('#plvSecretaBase');
const plvSecretaBasE = document.querySelector('#plvSecretaBasE');
const plvSecreta = document.querySelector('#plvSecreta');
const letra = document.querySelector('#letra');
const lblForca = document.querySelector('#lblForca');
const lblTentativas = document.querySelector('#tentativas');
const lblLetrasErradas = document.querySelector('#lblLetrasErradas');
const lblTempo = document.querySelector('#tempo');

const plvAleatoria = ['Abacate', 'Morango','Escada','Criança', 'Fralda', 'Leão', 'Pássaro', 
'Natação', 'Banho', 'Musculação', 'Faca', 'Banana', 'Chave', 'Sapato', 'Relógio', 'Bolsa', 'Abraço', 
'Beijo', 'Flores', 'Bateria', 'Carro', 'Moto', 'Colar', 'Brinco', 'Casa', 'Igreja', 'Macaco', 
'Chá', 'Dançar', 'Sol', 'Árvore', 'Música', 'Pizza', 'Sorvete', 'Ônibus', 'Maçã', 'Espelho', 'Guitarra', 
'Livro', 'Estrela', 'Balão', 'Avião', 'Elefante', 'Bola', 'Bebê', 'Peixe', 'Futebol', 'Beliscão', 
'Rolo', 'Basquete', 'Controle', 'Triste', 'Gato', 'Golfe', 'Tesoura', 'Colher', 
'Pular', 'Galinha', 'Sapo', 'Espirro', 'Martelo', 'Violão', 'Aplaudir', 'Tosse', 'Chifres', 'Pinguim', 
'Chorar', 'Rabo', 'Piada', 'Escova', 'Celular', 'Cachorro', 'Pato', 'Sofá', 'Fotógrafo', 
'Óculos', 'Balé', 'Pipa', 'Café', 'Táxi', 'Cadeira', 'Elevador', 'Bicicleta', 'Fogão', 
'Copo', 'Orelhas', 'Chocolate', 'Pescador', 'Notebook', 'Lápis']; 

let letraTeste = '';
let tentativas = 6;
let segredo = [];
let palavra = [];
let erradas = [];
let certas = [];
let tempo = 120;
let timer;

/* 
    Para arrumar:

    -Terminar a função acentos
    -Deixar a página mais estilizada
    
*/

divPrincipal.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnJogar.click();
    }
});

divJogo.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnTestar.click();
    }
});

btnPlvAleat.addEventListener('click', function palavraAleatoria() {
    const numAleat = Math.floor(Math.random() * plvAleatoria.length);
    jogar(plvAleatoria[numAleat]);
});

function separarLetras() {                                                  /* separa as letras da palavra dada em um array */                                                          /* reseta o array para que limpe os dados da outra partida */
    segredo = [];
    palavra = [];
    for (let i = 0; i < plvSecreta.value.length; i++) {                     /* faz um loop para pegar cada letra separadamente */                                /* "empurra" as letras para dentro da array EX: 'abacate' vira ['a','b','a','c','a','t','e'] */
        segredo.push(plvSecreta.value[i]);
        palavra.push('_');
    }
};

function contarEspacos() {                                                  /* Cria a tela da forca com os "espaços" (no meu caso, os números) de cada letra */
    let qntdd = '';
    for (let i = 0; i < plvSecreta.value.length; i++) {
        qntdd += palavra[i] + ' ';
        lblForca.innerHTML = qntdd;
    }
};

function reset() {
    tentativas = 6;                                                         /* Reinicia o jogo e volta para a tela de escolher a palavra secreta */
    divPrincipal.style.display = 'block';
    divJogo.style.display = null;
    plvSecretaBase.value = '';                                              /* reseta a palavra secreta no input do HTML */
    lblTentativas.innerHTML = tentativas;                                   /* reseta a quantidade de tentativas restantes */
    plvSecretaBase.focus();
    erradas = [];
    certas = [];
    lblLetrasErradas.innerHTML = '';
    desenharBoneco();
    clearInterval(timer);
};

function jogar(palavra) {

    if (typeof (palavra) === 'string' && palavra !== '') {
        plvSecretaBase.value = palavra;
        divPrincipal.style.display = 'none';
        divJogo.style.display = 'block';
        plvSecreta.value = plvSecretaBase.value.toUpperCase();
        separarLetras();
        contarEspacos();
        temporizador();
    } else {
        if (plvSecretaBase.value !== '') {                                  /* Testa se tem alguma coisa escrita */
            divPrincipal.style.display = 'none';
            divJogo.style.display = 'block';
            plvSecreta.value = plvSecretaBase.value.toUpperCase();
            separarLetras();
            contarEspacos();
            temporizador();
        } else {
            alert('Por favor coloque uma palavra');
        }
    }
    letra.focus();
};

function temporizador() {
    lblTempo.innerHTML = '120';
    tempo = 120;

    timer = setInterval(contar, 1000);
    function contar() {
        if (tempo > 0 && divJogo.style.display === 'block') {
            tempo--;
            lblTempo.innerHTML = tempo;
        } else {
            if (tempo <= 0) {
                perdeu();
                clearInterval(timer);
            }
        }
    }
};

/* Configura o jogo para começar */
btnJogar.addEventListener('click', function () {
    jogar();
});

/* Botão para sair da partida */
btnSair.addEventListener('click', function () {
    reset();
});

btnTestar.addEventListener('click',
    function () {
        lblTentativas.innerHTML = tentativas;
        
        /* Pega o VALOR da variável 'letra', transforma em LETRA MAIUSCULA e manda retirar o acento */
        letraTeste = removeAcento(letra.value.toUpperCase());

        /* Testa se tem nenhuma ou mais de uma letra na caixa de texto */
        if (letra.value.length !== 1) {
            alert('Por favor coloque UMA letra');
        } else {
            if (certas.includes(letraTeste) === false && erradas.includes(letraTeste) === false) {
                let acertou = false;
                let abc = '';
                for (let i = 0; i < segredo.length; i++) {
                    if (letraTeste === removeAcento(segredo[i])) {
                        palavra[i] = segredo[i];
                        lblForca.innerHTML = palavra;
                        acertou = true;
                    }
                }
                if (acertou === true) {
                    certas.push(letraTeste);
                    acertou = false;
                } else {
                    erradas.push(letraTeste);
                    lblLetrasErradas.innerHTML = erradas;
                    tentativas--;
                    desenharBoneco();
                    if (tentativas === 0) {
                        perdeu();
                    }
                }
                while (lblForca.innerHTML.includes(',') === true) {
                    lblForca.innerHTML = lblForca.innerHTML.replace(',', ' ');
                }
                lblTentativas.innerHTML = tentativas;
                letra.value = '';
            } else {
                alert('Você já testou esta letra. Por favor tente outra.');
            }
        }

        let forca = lblForca.innerHTML;                                     /* Transforma o texto que aparece na tela em algo que o PC pode comparar */
        for (let i = 0; i < lblForca.innerHTML.length; i++) {               /* Ex: de 'A B A C A T E' para 'ABACATE' e assim ver se completou a palavra*/
            forca = forca.replace(' ', '');
        }

        if (forca === plvSecreta.value) {
            setTimeout(ganhou, 100);
            function ganhou() { alert('Você Ganhou!!!') };
            setTimeout(reset, 200);
        }
        letra.focus();
    }
)

function perdeu() {
    setTimeout(perdeu, 100);
    function perdeu() { alert('Você perdeu. A palavra secreta era: ' + plvSecreta.value) };
    lblLetrasErradas.innerHTML = '';
    setTimeout(reset, 200);
    clearInterval(timer);
}

function desenharBoneco() {
    const boneco = 6 - tentativas;
    for (let i = 0; i < 7; i++) {
        document.getElementById('boneco' + i).style.display = i === boneco ? 'block' : 'none';
    }
}

function removeAcento(letra) {
    return letra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}