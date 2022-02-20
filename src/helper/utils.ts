export function dataFormatada(data: Date): String {
    var dd = String(data.getDate() + 1).padStart(2, '0');
    var mm = String(data.getMonth() + 1).padStart(2, '0');
    var yyyy = data.getFullYear();

    var today = yyyy + '-' + mm + '-' + dd;
    var tempo = data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds()
    var dataFormatada = today + " " + tempo;
    return dataFormatada;
}

export function dataAmanhaFormatada(data: Date): String {
    var amanha = new Date(new Date(data).getTime() + 60 * 60 * 24 * 1000);
    return dataAmanhaFormatada(amanha);
}