document.addEventListener("DOMContentLoaded", () => {
    const resumoPedido = document.getElementById("resumoPedido");
    const totalPagamento = document.getElementById("totalPagamento");
    const formPagamento = document.getElementById("formPagamento");

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let total = 0;

    function atualizarResumo() {
        resumoPedido.innerHTML = "";
        total = 0;

        carrinho.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.nome} ${item.tamanho} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;
            resumoPedido.appendChild(li);
            total += item.preco * item.quantidade;
        });

        totalPagamento.textContent = total.toFixed(2);
    }

    formPagamento.addEventListener("submit", (e) => {
        e.preventDefault();

        const formaPagamento = document.querySelector("input[name='pagamento']:checked").value;
        const nome = document.getElementById("nome").value;
        const endereco = document.getElementById("endereco").value;
        const telefone = document.getElementById("telefone").value;
        const comentarios = document.getElementById("comentarios").value;

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const itensPedido = carrinho.map(item => ({
            nome: item.nome,
            tamanho: item.tamanho,
            quantidade: item.quantidade,
            preco: item.preco
        }));

        const scriptURL = "https://script.google.com/macros/s/AKfycbz3HhPlGlpGhpAtS4lAxbdhEgtpTzdLcG4oYN75FKNA_rTFqoOV4DdbUJ-oJ7BisQwd/exec"; // Substituir pelo ID no Apps Script

        fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify({
                nome: nome,
                endereco: endereco,
                telefone: telefone,
                pedido: itensPedido,
                total: total.toFixed(2),
                pagamento: formaPagamento,
                comentarios: comentarios
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(err => { throw new Error(err) });
                }
                return response.json();
            })
            .then(result => {
                if (result.status === "Sucesso") {
                    alert("Pedido confirmado com sucesso! Obrigado pela preferência.");
                    localStorage.removeItem("carrinho");
                    window.location.href = "index.html";
                } else {
                    alert(`Erro ao registrar o pedido: ${result.mensagem || "Detalhes não disponíveis"}`);
                    console.error("Erro:", result);
                }
            })
            .catch(error => {
                alert(`Erro ao registrar o pedido: ${error.message}`);
                console.error("Erro:", error);
            });
    });

    atualizarResumo();
});