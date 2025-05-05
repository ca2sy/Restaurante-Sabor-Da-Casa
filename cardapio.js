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

  // Estruturas para os tipos de prato
  const tipos = {
    prato: { titulo: "Pratos Principais", container: document.createElement("div") },
    sobremesa: { titulo: "Sobremesas", container: document.createElement("div") },
    bebida: { titulo: "Bebidas", container: document.createElement("div") }
  };

  // Estilizando os containers para cada tipo de prato
  for (const tipo in tipos) {
    tipos[tipo].container.classList.add("container");
  }

  // Loop para adicionar os pratos
  snapshot.forEach(doc => {
    const prato = doc.data();
    const tipo = prato.tipo?.toLowerCase(); 

    if (!tipos[tipo]) return; // Verifica se o tipo existe

    const botao = document.createElement("button");
    botao.classList.add("prato-btn");
    if (!prato.disponivel) botao.classList.add("indisponivel");

    botao.innerHTML = `
      <img src="${prato.imagem}" alt="${prato.nome}">
      <strong>${prato.nome}</strong><br>
      R$ ${Number(prato.preco).toFixed(2)}<br>
      ${prato.descricao}<br>
      ${prato.vegetariano ? "<span class='vegetariano'>Vegetariano</span>" : ""}
      ${prato.alergicos ? "<span class='alergicos'>Contém alérgenos: " + prato.alergicos + "</span>" : ""}
    `;

    botao.onclick = () => {
      if (!prato.disponivel) {
        alert("Produto indisponível no momento.");
        return;
      }
      pratoSelecionado = prato;
      formulario.style.display = "block";  // Exibe o formulário para personalização
    };

    tipos[tipo].container.appendChild(botao);
  });

  // Adiciona os títulos e os contêineres ao cardápio
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

// Processamento do formulário de pedido
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

// Cancela o pedido e esconde o formulário
cancelarBtn.onclick = () => {
  formSub.reset();
  formulario.style.display = "none";
};

carregarCardapio();
