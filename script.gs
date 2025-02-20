function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = new Date();
        var nome, endereco, telefone, pedido, total, pagamento, comentarios;

        if (e.postData && e.postData.contents) {
            var postData = JSON.parse(e.postData.contents);
            nome = postData.nome;
            endereco = postData.endereco;
            telefone = postData.telefone;
            pedido = postData.pedido;
            total = postData.total;
            pagamento = postData.pagamento;
            comentarios = postData.comentarios;
        } else {
            throw new Error("Nenhum dado de pedido recebido.");
        }

        pedido.forEach(item => {
            sheet.appendRow([
                nome, 
                endereco, 
                telefone, 
                item.nome,
                item.tamanho,
                item.quantidade,
                item.preco,
                total,
                pagamento,
                comentarios,
                data
            ]);
        });

        return ContentService.createTextOutput(JSON.stringify({ status: "Sucesso" }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log(error);
        return ContentService.createTextOutput(JSON.stringify({ status: "Erro", mensagem: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}