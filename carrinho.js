const lista = document.getElementById("lista-carrinho");
const mensagemCarrinhoVazio = document.getElementById("mensagem-carrinho-vazio");
const form = document.getElementById("form-final");
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function mostrarCarrinho() {
  lista.innerHTML = "";
  
  if (carrinho.length === 0) {
    mensagemCarrinhoVazio.style.display = "block"; 
  } else {
    mensagemCarrinhoVazio.style.display = "none"; 
    carrinho.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("pedido");

      div.innerHTML = `
        <strong>${item.nomePrato}</strong> - R$ ${item.preco.toFixed(2)}<br>
        Substituições: ${item.alteracoes || "Nenhuma"}<br>
        <button onclick="removerPedido(${index})">Remover</button><br><br>
      `;
      
      lista.appendChild(div);
    });
  }
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

  const nomeCliente = document.getElementById("nome").value.trim();
  if (nomeCliente === "") {
    alert("Por favor, informe o seu nome.");
    return;
  }

  const pagamento = document.getElementById("pagamento").value;
  if (pagamento === "") {
    alert("Por favor, selecione a forma de pagamento.");
    return;
  }

  const entrega = document.getElementById("entrega").value;
  if (entrega === "") {
    alert("Por favor, selecione uma opção para entrega/retirada/consumo local.");
    return;
  }

  const pedidoFinal = {
    nomeCliente,
    pagamento,
    entrega,
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
