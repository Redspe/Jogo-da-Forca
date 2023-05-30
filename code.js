const divPrincipal = document.querySelector('#divPrincipal');
const divJogo = document.querySelector('#divJogo');
const btnJogar = document.querySelector('#btnJogar');
const btnSair = document.querySelector('#btnSair');
const btnTestar = document.querySelector('#btnTestar');
const btnPlvAleat = document.querySelector('#btnPlvAleat');
const plvSecretaBase = document.querySelector('#plvSecretaBase');
const letra = document.querySelector('#letra');
const lblForca = document.querySelector('#lblForca');
const lblTentativas = document.querySelector('#tentativas');
const lblLetrasErradas = document.querySelector('#lblLetrasErradas');
const lblTempo = document.querySelector('#tempo');
const lblPontos = document.querySelector('#pontos');
const body = document.querySelector('#body');

/* Última vez contado: 119 palavras */
const plvsAleatorias = [
    'Abacate', 'Morango', 'Escada', 'Criança', 'Fralda', 'Leão', 'Pássaro', 'Natação', 'Banho',
    'Academia', 'Faca', 'Banana', 'Chave', 'Sapato', 'Relógio', 'Bolsa', 'Abraço', 'Beijo', 'Flores',
    'Bateria', 'Carro', 'Moto', 'Colar', 'Brinco', 'Casa', 'Igreja', 'Macaco', 'Chá', 'Dançar', 'Sol',
    'Árvore', 'Música', 'Pizza', 'Sorvete', 'Ônibus', 'Maçã', 'Espelho', 'Guitarra', 'Livro', 'Estrela',
    'Balão', 'Avião', 'Elefante', 'Bola', 'Bebê', 'Peixe', 'Futebol', 'Toalha', 'Papel higiênico',
    'Basquete', 'Controle remoto', 'Triste', 'Gato', 'Golfe', 'Tesoura', 'Colher', 'Pular', 'Galinha',
    'Sapo', 'Espirro', 'Martelo', 'Violão', 'Aplaudir', 'Tosse', 'Chifres', 'Pinguim', 'Chorar', 'Rabo',
    'Piada', 'Escova de dente', 'Celular', 'Cachorro', 'Pato', 'Sofá', 'Fotógrafo', 'Óculos', 'Balé',
    'Pipa', 'Café', 'Táxi', 'Cadeira', 'Elevador', 'Bicicleta', 'Fogão', 'Copo', 'Orelhas', 'Chocolate',
    'Pescador', 'Notebook', 'Lápis', 'JavaScript', 'HTML', 'CSS', 'Internet', 'WWW', 'Google', 'ChatGPT',
    'Python', 'Programação', 'Jogos', 'VSCode', 'Chrome', 'FireFox', 'Microsoft', 'Apple', 'Windows',
    'Algoritmo', 'Nuvem', 'Linux', 'Harware', 'Software', 'Java', 'Bug', 'Antivírus', 'Backup',
    'Bluetooth', 'Computador', 'Endereço IP', 'VPN'
];
let plvSecreta = '';
let letraTeste = '';
let tentativas = 6;
let segredo = [];
let palavra = [];
let erradas = [];
let certas = [];
let pontos = 0;
const tempoIni = 120;
let tempo = tempoIni;
let timer;

/* 
    Para arrumar:
    - Colocar dicas das palavras caso só falte 2-3 tentativas
    - Deixar a página mais estilizada
    - Otimizar o código
*/

/* 
    Feitos (para facilitar versionamento):
    - Adicionar frases compostas
    - Timer único (sem ter que mudar vários lugares)
    - Terminar a função acentos
    - Terminar mudança da cor de fundo
    - Terminar a função pontos
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
    const numAleat = Math.floor(Math.random() * plvsAleatorias.length);
    jogar(plvsAleatorias[numAleat]);
});

function separarLetras() {
    /* reseta o array para que limpe os dados da outra partida */
    segredo = [];
    palavra = [];

    /* "empurra" as letras para dentro da array EX: 'abacate' vira ['a','b','a','c','a','t','e'] */
    for (let i = 0; i < plvSecreta.length; i++) {
        segredo.push(plvSecreta[i]);
        /* Se a 'palavra' dada tiver espaços (ou seja, é uma frase) colocar espaços para separar */
        if (plvSecreta[i].includes(' ')) {
            palavra.push('\u00a0');
        } else {
            palavra.push('_');
        }

    }
};

/* Cria os "espaços" que separam cada letra na tela do jogo */
function contarEspacos() {
    let qntdd = '';
    for (let i = 0; i < plvSecreta.length; i++) {
        qntdd += palavra[i] + ' ';
        lblForca.innerHTML = qntdd;
    }
};

/* Limpa a partida anterior e volta para a tela de escolher a palavra secreta */
function reset() {
    tentativas = 6;
    divPrincipal.style.display = 'block';
    divJogo.style.display = null;
    plvSecretaBase.value = '';
    lblTentativas.innerHTML = tentativas;
    plvSecretaBase.focus();
    erradas = [];
    certas = [];
    lblLetrasErradas.innerHTML = '';
    desenharBoneco();
    clearInterval(timer);
};

function jogar(palavra) {
    /* Se receber uma palavra, troca o texto do input 'plvSecretaBase' */
    if (typeof (palavra) === 'string' && palavra !== '') {
        plvSecretaBase.value = palavra;
    }
    /* Testa se tem alguma coisa escrita */
    if (plvSecretaBase.value === '') {
        alert('Por favor coloque uma palavra');
    } else {
        divPrincipal.style.display = 'none';
        divJogo.style.display = 'block';
        plvSecreta = plvSecretaBase.value.toUpperCase();
        separarLetras();
        contarEspacos();
        temporizador();
    }
    letra.focus();
};


function temporizador() {
    tempo = tempoIni;
    lblTempo.innerHTML = tempo;

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
                    if (tentativas > 1) { mudaCorFundo('#ff000055', 1, divJogo); }
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
        testeGanhou();
    }
);

/* Transforma o texto que aparece na tela em algo que o PC pode comparar */
/* Ex: de 'A B A C A T E' para 'ABACATE' e assim ver se completou a palavra*/
function testeGanhou() {
    let forca = lblForca.innerHTML;
    forca = forca.replaceAll(' ', '');
    forca = forca.replaceAll('&nbsp;', ' ');

    if (forca === plvSecreta) {
        mudaCorFundo('#00ff0077', 3, body)
        setTimeout(ganhou, 1750);
        function ganhou() { alert('Você Ganhou!!!') };
        setTimeout(reset, 1800);
        pontos++;
        lblPontos.innerHTML = pontos;
    }
    letra.focus();
}

function perdeu() {
    mudaCorFundo('#ff000099', 3, body)
    setTimeout(msg, 1750);
    function msg() { alert('Você perdeu. A palavra secreta era: ' + plvSecreta) };
    lblLetrasErradas.innerHTML = '';
    setTimeout(reset, 1800);
    clearInterval(timer);
}

/* Quando chamada, ativa o boneco de acordo com a quantid de tentativas e desativa os outros */
function desenharBoneco() {
    const boneco = 6 - tentativas;
    for (let i = 0; i < 7; i++) {
        document.getElementById('boneco' + i).style.display = i === boneco ? 'block' : 'none';
    }
}

/* Recebe uma letra/frase e remove o acento (funciona separando o Unicode do acento do da letra) */
/* Ex: O caractere 'à' ('\u00e0') é a combinação do 'a' ('\u0061') com o acento '`' ('\u0300') */
/* A função abaixo retira as marcas do \u0300 (`) até o \u036f (' ͯ ')*/
function removeAcento(letra) {
    return letra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function mudaCorFundo(cor, vezes, obj) {
    let contaVezes = 0;
    let corOriginal = body.style.backgroundColor;
    function piscar() {
        console.log(vezes, contaVezes);
        if (contaVezes === vezes) { return; }
        if (corOriginal === obj.style.backgroundColor) {
            obj.style.backgroundColor = cor;
            console.log('cor');
        } else {
            contaVezes++;
            obj.style.backgroundColor = corOriginal;
            console.log('corOriginal');
        }
        setTimeout(piscar, 250);
    }
    piscar();
};