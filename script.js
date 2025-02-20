document.addEventListener("DOMContentLoaded", () => {
    const listaCarrinho = document.getElementById("listaCarrinho");
    const totalElement = document.getElementById("total");
    const btnFinalizar = document.querySelector(".btn-finalizar");
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    atualizarCarrinho();

    document.querySelectorAll(".produto button.adicionar").forEach(botao => {
        botao.addEventListener("click", (event) => {
            try {
                const produtoDiv = event.target.parentElement;
                const nome = produtoDiv.querySelector("h3")?.innerText || produtoDiv.querySelector("p").innerText;
                const tamanhoSelect = produtoDiv.querySelector("select");
                const tamanho = tamanhoSelect ? `(${tamanhoSelect.options[tamanhoSelect.selectedIndex].text})` : "";
                const precoElement = tamanhoSelect || produtoDiv;
                const preco = parseFloat(precoElement.value || precoElement.innerText.replace("R$", "").replace(",", "."));
                const produtoId = produtoDiv.dataset.id;

                const itemExistente = carrinho.find(item => item.id === produtoId && item.tamanho === tamanho);

                if (itemExistente) {
                    itemExistente.quantidade++;
                } else {
                    carrinho.push({
                        id: produtoId,
                        nome: nome,
                        tamanho: tamanho,
                        preco: preco,
                        quantidade: 1
                    });
                }

                localStorage.setItem("carrinho", JSON.stringify(carrinho));
                atualizarCarrinho();
            } catch (error) {
                console.error("Erro ao adicionar item ao carrinho:", error);
                alert("Ocorreu um erro ao adicionar o item ao carrinho. Por favor, tente novamente.");
            }
        });
    });

    function atualizarCarrinho() {
        try {
            listaCarrinho.innerHTML = "";
            let total = 0;

            carrinho.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.nome} ${item.tamanho} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;

                const botaoRemover = document.createElement("button");
                botaoRemover.textContent = "Remover";
                botaoRemover.classList.add("remover-item"); // Adiciona classe para estilização

                botaoRemover.addEventListener("click", () => {
                    carrinho = carrinho.filter(itemCarrinho => !(itemCarrinho.id === item.id && itemCarrinho.tamanho === item.tamanho));
                    localStorage.setItem("carrinho", JSON.stringify(carrinho));
                    atualizarCarrinho();
                });

                li.appendChild(botaoRemover);
                listaCarrinho.appendChild(li);
                total += item.preco * item.quantidade;
            });

            totalElement.textContent = total.toFixed(2);
        } catch (error) {
            console.error("Erro ao atualizar carrinho:", error);
            alert("Ocorreu um erro ao atualizar o carrinho. Por favor, tente novamente.");
        }
    }


    btnFinalizar.addEventListener("click", (event) => {
        event.preventDefault(); // Impede o envio do formulário

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio! Adicione alguns itens para finalizar o pedido.");
            return;
        }

        try {
            let resumoPedido = "Itens no seu carrinho:\n\n";
            carrinho.forEach(item => {
                resumoPedido += `${item.nome} ${item.tamanho} x ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
            });
            resumoPedido += `\nTotal: R$ ${totalElement.textContent}`;

            if (confirm(resumoPedido + "\n\nDeseja confirmar o pedido?")) {
                window.location.href = "pagamento.html";
            }

        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            alert("Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente.");
        }
    });

    const carrinhoToggle = document.querySelector(".carrinho-toggle");
    const carrinhoElement = document.querySelector(".carrinho");

    carrinhoToggle.addEventListener("click", () => {
        carrinhoElement.classList.toggle("recolhido");
    });
});