import { db } from './firebase.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const lista = document.getElementById("lista-carrinho");
const form = document.getElementById("form-final");
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function mostrarCarrinho() {
  lista.innerHTML = "";
  carrinho.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("pedido"); 
    

    const img = document.createElement("img");
    img.src = item.imagem; 
    img.alt = item.nomePrato;
    img.classList.add("imagem-prato");  
    
 
    div.innerHTML = `
      <strong>${item.nomePrato}</strong> - R$ ${item.preco.toFixed(2)}<br>
      Substituições: ${item.alteracoes || "Nenhuma"}<br>
      <button onclick="removerPedido(${index})">Remover</button><br><br>
    `;
    

    div.prepend(img); 
    
    lista.appendChild(div);
  });
}

window.removerPedido = function(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  mostrarCarrinho();
};

form.onsubmit = async (e) => {
  e.preventDefault();

  if (carrinho.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  const pedidoFinal = {
    nomeCliente: document.getElementById("nome").value,
    pagamento: document.getElementById("pagamento").value,
    entrega: document.getElementById("entrega").value,
    pedidos: carrinho,
    criadoEm: new Date()
  };

  try {
    await addDoc(collection(db, "pedidos"), pedidoFinal);
    alert("Pedido enviado com sucesso!");
    localStorage.removeItem("carrinho");
    window.location.href = "index.html";
  } catch (e) {
    console.error("Erro ao enviar:", e);
    alert("Erro ao enviar pedido.");
  }
};

mostrarCarrinho();
