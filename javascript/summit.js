var serverAddress = "http://127.0.0.1:880";

function evento() {
    if (document.getElementById('evento').style.display == "none") {
        $("#formEvento")[0].reset();
        document.getElementsByClassName("btnAcao")[0].style.display = "none";
        for (i = 5; i < $("#formEvento")[0].length; i++) {
            if (i < $("#formEvento")[0].length - 1) {
                $("#formEvento")[0][i].disabled = true;
                $("#formEvento")[0][i].style.display = "";
                jQuery("label[for=" + $("#formEvento")[0][i].getAttribute("id") + "]")[0].style.display = "";
            }
            else {
                $("#formEvento")[0][i].style.display = "none";
                jQuery("label[for=" + $("#formEvento")[0][i].getAttribute("id") + "]")[0].style.display = "none";
            }
        }
        document.getElementById('evento').style.display = "";
        document.getElementById('cliente').style.display = "none";
    }
}

function cliente() {
    if (document.getElementById('cliente').style.display == "none") {
        $("#formCliente")[0].reset();
        document.getElementsByClassName("btnAcao")[1].style.display = "none";
        for (i = 5; i < $("#formCliente")[0].length; i++) {
            if (i < $("#formCliente")[0].length - 1) {
                $("#formCliente")[0][i].disabled = true;
                $("#formCliente")[0][i].style.display = "";
                jQuery("label[for=" + $("#formCliente")[0][i].getAttribute("id") + "]")[0].style.display = "";
            }
            else {
                $("#formCliente")[0][i].style.display = "none";
                jQuery("label[for=" + $("#formCliente")[0][i].getAttribute("id") + "]")[0].style.display = "none";
            }
        }
        document.getElementById('evento').style.display = "none";
        document.getElementById('cliente').style.display = "";
    }
}

function habilitaForm(status, funcao, modulo) {
    let form = document.querySelector(`#form${modulo}`);
    let indiceForm;
    if (modulo == "Evento") {
        indiceForm = 0;
    }
    else if (modulo == "Cliente") {
        indiceForm = 1;
    }
    let btnAcao = document.getElementsByClassName("btnAcao")[indiceForm];
    if (status == true) {
        btnAcao.style.display = "";
        document.getElementsByClassName("btnUpdate")[indiceForm].style.display = "none";
        document.getElementsByClassName("btnDelete")[indiceForm].style.display = "none";
        btnAcao.setAttribute("onclick", `executaXML("${funcao}","${modulo}")`);
        form[5].readOnly = false;
        if (funcao == "create") {
            btnAcao.textContent = "Cadastrar";
            btnAcao.className = "btnAcao btn btn-primary";
            //btnAcao.setAttribute("formaction", serverAddress + "/cadastrarEvento");
            for (i = 5; i < form.length; i++) {
                if (i < form.length - 1) {
                    form[i].value = "";
                    form[i].disabled = false;
                    form[i].style.display = "";
                    jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "";
                }
                else {
                    form[i].style.display = "none";
                    jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "none";
                }
            }
        }
        else if (funcao == "read") {
            btnAcao.textContent = "Consultar";
            btnAcao.className = "btnAcao btn btn-info";
            // btnAcao.setAttribute("formaction", serverAddress + "/consultarEvento");
            // btnAcao.setAttribute("formmethod", "GET");
            form[5].value = "";
            form[5].disabled = false;
            for (i = 5; i < form.length; i++) {
                form[i].value = "";
                form[i].disabled = true;
                jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "none";
                form[i].style.display = "none";
            }
        }
        else if (funcao == "update") {
            btnAcao.textContent = "Atualizar";
            btnAcao.className = "btnAcao btn btn-primary";
            // btnAcao.setAttribute("formaction", serverAddress + "/atualizarEvento");
            // btnAcao.setAttribute("formmethod", "GET");
            for (i = 5; i < form.length; i++) {
                form[i].value = "";
                form[i].disabled = false;
                jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "";
                form[i].style.display = "";
            }
        }
        else if (funcao == "delete") {
            btnAcao.textContent = "Excluir";
            btnAcao.className = "btnAcao btn btn-danger";
            // btnAcao.setAttribute("formaction", serverAddress + "/excluirEvento");
            // btnAcao.setAttribute("formmethod", "GET");
            form[5].value = "";
            form[5].disabled = false;
            for (i = 6; i < form.length; i++) {
                form[i].value = "";
                form[i].disabled = true;
                jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "none";
                form[i].style.display = "none";
            }
        }
    }
}

function executaXML(funcao, modulo) {
    let form = document.querySelector(`#form${modulo}`);
    let path;
    if (funcao == "create")
        path = serverAddress + `/cadastrar${modulo}`;
    else if (funcao == "read")
        path = serverAddress + `/consultar${modulo}`;
    else if (funcao == "update") {
        path = serverAddress + `/atualizar${modulo}`;
        for (i = 6; i < form.length; i++) {
            form[i].required = false;
        }
    }
    else if (funcao == "delete")
        path = serverAddress + `/excluir${modulo}`;
    if (!form.checkValidity())
        alert("Preencha o formulário corretamente!");
    else {
        var xmlhttp = new XMLHttpRequest();
        console.log("antes do open e send");
        xmlhttp.open("POST", path, true);
        xmlhttp.timeout = 1000;
        xmlhttp.ontimeout = function (e) {
            console.log("// XMLHttpRequest timed out.");
        }
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send($(`#form${modulo}`).serialize());
        console.log($(`#form${modulo}`).serialize());
        console.log("apos o open e send");

        xmlhttp.onreadystatechange = function (e) {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status >= 200) {
                    console.log("requisicao OK. " + xmlhttp.response);
                    sessionStorage.setItem("dadosXMLHTTP", xmlhttp.response);
                    if (funcao == "read")
                        consultaRegistro(modulo);
                    else if (funcao == "create" || funcao == "update" || funcao == "delete")
                        alerta(funcao, modulo);
                }
                else {
                    console.error("erro na requisicao. //" + xmlhttp.statusText);
                }
            }
        }
        console.log("apos o onreadystatechange");

        xmlhttp.onerror = function (e) {
            console.error(xmlhttp.statusText);
        }
    }
}

function consultaRegistro(modulo) {
    let form = document.querySelector(`#form${modulo}`);
    let indiceForm;
    if (modulo == "Evento") {
        evento();
        indiceForm = 0;
    }
    else if (modulo == "Cliente") {
        cliente();
        indiceForm = 1;
    }
    form[1].checked = true;
    habilitaForm(true, "read", modulo);
    populate(form, JSON.parse(sessionStorage.getItem("dadosXMLHTTP")));
    for (i = 5; i < form.length - 1; i++) {
        form[i].style.display = "";
        form[i].disabled = true;
        jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "";
        document.getElementsByClassName("btnUpdate")[indiceForm].style.display = "";
        document.getElementsByClassName("btnDelete")[indiceForm].style.display = "";
        document.getElementsByClassName("btnAcao")[indiceForm].style.display = "none";
    }
}

function alerta(funcao, modulo) {
    $(`#form${modulo}`)[0].reset();
    document.getElementById(modulo.toLowerCase()).style.display = "none";
    if (funcao == "create")
        alert(`${modulo} cadastrado com sucesso!`);
    else if (funcao == "update")
        alert(`${modulo} atualizado com sucesso!`);
    else
        alert(`${modulo} excluído com sucesso!`);
}

function populate(form, json) {
    $.each(json, function (key, value) {
        $('[name=' + key + ']', form).val(value);
    })
}

function editaRegistro(selecao, modulo) {
    let form = document.querySelector(`#form${modulo}`);
    form[selecao].checked = true;
    if (selecao == 2)
        habilitaForm(true, "update", modulo);
    else if (selecao == 3) {
        habilitaForm(true, "delete", modulo);
    }
    populate(form, JSON.parse(sessionStorage.getItem("dadosXMLHTTP")));
    form[5].readOnly = true;
    if (selecao == 3) {
        for (i = 6; i < form.length - 1; i++) {
            form[i].style.display = "";
            jQuery("label[for=" + form[i].getAttribute("id") + "]")[0].style.display = "";
        }
    }
}


function mostrarPainel(tipo, dados) {
    if (tipo == "evento") {
        $("#modalTitle").html("Evento.");
        $("#modalBody").html(function () {
            texto = "";
            for (i = 0; i < dados.length; i++) {
                texto += `<div><a href='#' onclick='console.log("teste da tag <a>")' >${dados[i].nome}</a></div>`;
            }
            return texto;
        });
        $("#myModal").modal();

    } else if (tipo == "cliente") {

    }
}