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
const lblTempo = document.querySelector('#tempo')
const plvAleatoria = ['abacate', 'morango', 'Escada', 'Fralda', 'Leao', 'Passaro',
    'Nataçao', 'Banho', 'Musculaçao', 'Faca', 'Banana', 'Chave', 'Sapato', 'Relogio', 'Bolsa', 'Abraço',
    'Beijo', 'Flores', 'Criança', 'Bateria', 'Carro', 'Moto', 'Colar', 'Brinco', 'Casa', 'Igreja', 'Macaco',
    'Cha', 'Dançar', 'Sol', 'arvore', 'Musica', 'Pizza', 'Sorvete', 'Onibus', 'Maça', 'Espelho', 'Guitarra',
    'Livro', 'Estrela', 'Balao', 'Aviao', 'Elefante', 'Bola', 'Bebe', 'Peixe', 'Futebol', 'Beliscao',
    'Rolo', 'Basquete', 'Controle', 'Triste', 'Gato', 'Golfe', 'Tesoura', 'Colher',
    'Pular', 'Galinha', 'Sapo', 'Espirro', 'Martelo', 'Violao', 'Aplaudir', 'Tosse', 'Chifres', 'Pinguim',
    'Chorar', 'Rabo', 'Piada', 'Escova', 'Celular', 'Cachorro', 'Pato', 'Sofa', 'Fotografo',
    'oculos', 'Bale', 'Pipa', 'Cafe', 'Taxi', 'Cadeira', 'Elevador', 'Bicicleta', 'Fogao',
    'Copo', 'Orelhas', 'Chocolate', 'Pescador', 'Notebook', 'Lapis'];
/* Lista sem modificação par uso com acentos no futuro
const plvAleatoria = ['abacate', 'morango','Escada','Criança', 'Fralda', 'Leão', 'Pássaro', 
'Natação', 'Banho', 'Musculação', 'Faca', 'Banana', 'Chave', 'Sapato', 'Relógio', 'Bolsa', 'Abraço', 
'Beijo', 'Flores', 'Bateria', 'Carro', 'Moto', 'Colar', 'Brinco', 'Casa', 'Igreja', 'Macaco', 
'Chá', 'Dançar', 'Sol', 'Árvore', 'Música', 'Pizza', 'Sorvete', 'Ônibus', 'Maçã', 'Espelho', 'Guitarra', 
'Livro', 'Estrela', 'Balão', 'Avião', 'Elefante', 'Bola', 'Bebê', 'Peixe', 'Futebol', 'Beliscão', 
'Rolo', 'Basquete', 'Controle', 'Triste', 'Gato', 'Golfe', 'Tesoura', 'Colher', 
'Pular', 'Galinha', 'Sapo', 'Espirro', 'Martelo', 'Violão', 'Aplaudir', 'Tosse', 'Chifres', 'Pinguim', 
'Chorar', 'Rabo', 'Piada', 'Escova', 'Celular', 'Cachorro', 'Pato', 'Sofá', 'Fotógrafo', 
'Óculos', 'Balé', 'Pipa', 'Café', 'Táxi', 'Cadeira', 'Elevador', 'Bicicleta', 'Fogão', 
'Copo', 'Orelhas', 'Chocolate', 'Pescador', 'Notebook', 'Lápis']; 
*/
let letraTeste = '';
let tentativas = 6;
let segredo = [];
let palavra = [];
let erradas = [];
let certas = [];
let tempo = 100;

/* 
    Para arrumar:

    -Terminar a função singleplayer
    -Deixar a página mais estilizada
    
*/

divPrincipal.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnJogar").click();
    };
});

divJogo.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("btnTestar").click();
    };
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
    };
    console.log(segredo, palavra);
};

function contarEspacos() {                                                  /* Cria a tela da forca com os "espaços" (no meu caso, os números) de cada letra */
    let qntdd = '';
    for (let i = 0; i < plvSecreta.value.length; i++) {
        qntdd += palavra[i] + ' ';
        lblForca.innerHTML = qntdd;
    };
};

function reset() {
    tentativas = 6;                                                         /* Reinicia o jogo e volta para a tela de escolher a palavra secreta */
    divPrincipal.style.display = 'block';
    divJogo.style.display = null;
    plvSecretaBase.value = '';                                              /* reseta a palavra secreta no input do HTML */
    lblTentativas.innerHTML = tentativas;                                   /* reseta a quantidade de tentativas restantes */
    erradas = [];
    certas = [];
    lblLetrasErradas.innerHTML = '';
    document.getElementById("letra").focus();
    desenharBoneco();
    temporizador(false);
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
        };
    };
    document.getElementById("letra").focus();
};

function temporizador() {
    lblTempo.innerHTML = '100';
    tempo = 100;

    setTimeout(contar, 1000);
    function contar() {
        if (tempo > 0 && divJogo.style.display === 'block') {
            setTimeout(contar, 1000);
            tempo--;
            lblTempo.innerHTML = tempo;
        } else {
            if (tempo <= 0) {
                perdeu();
            };
        }
    }
};

btnJogar.addEventListener('click', function () {                            /* Configura o jogo para começar */
    jogar();
});

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
                    };
                };
                if (acertou === true) {
                    certas.push(letraTeste);
                    acertou = false;
                } else {
                    erradas.push(letraTeste)
                    lblLetrasErradas.innerHTML = erradas;
                    tentativas--;
                    desenharBoneco()
                    if (tentativas === 0) {
                        perdeu();
                    };
                };
                while (lblForca.innerHTML.includes(',') === true) {
                    lblForca.innerHTML = lblForca.innerHTML.replace(',', ' ');
                };
                lblTentativas.innerHTML = tentativas;
                letra.value = '';
            } else {
                alert('Você já testou esta letra. Por favor tente outra.');
            };
        };

        let forca = lblForca.innerHTML;                                     /* Transforma o texto que aparece na tela em algo que o PC pode comparar */
        for (let i = 0; i < lblForca.innerHTML.length; i++) {               /* Ex: de 'A B A C A T E' para 'ABACATE' e assim ver se completou a palavra*/
            forca = forca.replace(' ', '');
        };

        if (forca === plvSecreta.value) {
            setTimeout(ganhou, 100);
            function ganhou() { alert('Você Ganhou!!!') };
            setTimeout(reset, 200);
        };
        document.getElementById("letra").focus();
    }
);

function perdeu() {
    document.getElementById("letra").focus();
    setTimeout(perdeu, 100);
    function perdeu() { alert('Você perdeu. A palavra secreta era: ' + plvSecreta.value) };
    lblLetrasErradas.innerHTML = '';
    setTimeout(reset, 200);
}

function desenharBoneco() {
    switch (tentativas) {
        case 6:
            document.getElementById('boneco0').style.display = 'block';
            document.getElementById('boneco1').style.display = 'none';
            document.getElementById('boneco2').style.display = 'none';
            document.getElementById('boneco3').style.display = 'none';
            document.getElementById('boneco4').style.display = 'none';
            document.getElementById('boneco5').style.display = 'none';
            document.getElementById('boneco6').style.display = 'none';
            break;

        case 5:
            document.getElementById('boneco1').style.display = 'block';
            document.getElementById('boneco0').style.display = 'none';
            break;

        case 4:
            document.getElementById('boneco2').style.display = 'block';
            document.getElementById('boneco1').style.display = 'none';
            break;

        case 3:
            document.getElementById('boneco3').style.display = 'block';
            document.getElementById('boneco2').style.display = 'none';
            break;

        case 2:
            document.getElementById('boneco4').style.display = 'block';
            document.getElementById('boneco3').style.display = 'none';
            break;

        case 1:
            document.getElementById('boneco5').style.display = 'block';
            document.getElementById('boneco4').style.display = 'none';
            break;

        case 0:
            document.getElementById('boneco6').style.display = 'block';
            document.getElementById('boneco5').style.display = 'none';
            break;
    };
};