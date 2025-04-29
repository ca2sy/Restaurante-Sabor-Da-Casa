import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const cardapioEl = document.getElementById("cardapio");
const formulario = document.getElementById("formulario-pedido");
const formSub = document.getElementById("form-substituicao");
const cancelarBtn = document.getElementById("cancelar-form");

let pratoSelecionado = null;

async function carregarCardapio() {
  const pratosRef = collection(db, "pratos");
  const snapshot = await getDocs(pratosRef);

  cardapioEl.innerHTML = ""; 

  
  const tipos = {
    prato: {
      titulo: "Pratos Principais",
      container: document.createElement("div")
    },
    sobremesa: {
      titulo: "Sobremesas",
      container: document.createElement("div")
    },
    bebida: {
      titulo: "Bebidas",
      container: document.createElement("div")
    }
  };

  
  for (const tipo in tipos) {
    tipos[tipo].container.classList.add("container");
  }

  
  snapshot.forEach(doc => {
    const prato = doc.data();
    const tipo = prato.tipo?.toLowerCase(); 

    if (!tipos[tipo]) return; 

    const botao = document.createElement("button");
    botao.classList.add("prato-btn");
    if (!prato.disponivel) botao.classList.add("indisponivel");

    botao.innerHTML = `
      <img src="${prato.imagem}" alt="${prato.nome}">
      <strong>${prato.nome}</strong><br>
      R$ ${Number(prato.preco).toFixed(2)}<br>
      ${prato.descricao}<br>
      ${prato.vegetariano ? "Vegetariano" : ""}<br>
      ${prato.alergicos ? "Contém alérgenos: " + prato.alergicos : ""}
    `;

    botao.onclick = () => {
      if (!prato.disponivel) {
        alert("Produto indisponível no momento.");
        return;
      }
      pratoSelecionado = prato;
      formulario.style.display = "block";
    };

    tipos[tipo].container.appendChild(botao);
  });

  
  for (const tipo of ["prato", "sobremesa", "bebida"]) {
    const { titulo, container } = tipos[tipo];
    if (container.childNodes.length > 0) {
      const h2 = document.createElement("h2");
      h2.textContent = titulo;
      cardapioEl.appendChild(h2);
      cardapioEl.appendChild(container);
    }
  }
}


  
formSub.onsubmit = (e) => {
  e.preventDefault();
  const alteracoes = document.getElementById("alteracoes").value;

  const pedido = {
    nomePrato: pratoSelecionado.nome,
    preco: pratoSelecionado.preco,
    alteracoes: alteracoes
  };

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.push(pedido);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert("Pedido adicionado ao carrinho!");
  formSub.reset();
  formulario.style.display = "none";
};

cancelarBtn.onclick = () => {
  formSub.reset();
  formulario.style.display = "none";
};

function transformarImagemCinza(url) {

  return url;
}

carregarCardapio();
