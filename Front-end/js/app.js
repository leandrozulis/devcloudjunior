const submitButton = document.querySelector('#app form button');
const zipCodeField = document.querySelector('#app form input');
const content = document.querySelector('#app main');

submitButton.addEventListener('click', run);

function run(event) {
  event.preventDefault();

  const zipCode = zipCodeField.value;
  zipCode = zipCode.replace(' ', '');
  zipCode = zipCode.replace('.', '');
  zipCode = zipCode.trim();
  
  content.innerHTML = '';
  
  if (zipCode.length < 8 || zipCode.length > 9) {
    createLine("CEP precisa ter no mínimo 8 números sem mascara e no máximo 9 com mascará")
    return;
  }
  
  axios({
    method: "post",
    url: "http://localhost:3333/cep",
    data: {
      cep: zipCode
    },
  }).then((res) => {      
    if (res.status === 201) {
      createLine("CEP em processamento!")
    }

    console.log(res.data)

    setTimeout(() => {
      axios({
        method: "get",
        url: `http://localhost:3333/consulta/${res.data.id}`
      }).then((response) => {          

        const retCep = response.data.retCep;

        if (!retCep || Object.keys(retCep).length === 0) {
          content.innerHTML = '';
          createLine('Falha para consultar CEP');
          return;
        }

        content.innerHTML = '';

        createLine(retCep.cep);
        createLine(retCep.logradouro);
        createLine(retCep.complemento);
        createLine(retCep.unidade);
        createLine(retCep.bairro);
        createLine(retCep.localidade);
        createLine(retCep.uf);
        createLine(retCep.ibge);
        createLine(retCep.gia);
      }).catch((error) => {
        content.innerHTML = '';
        createLine('Erro no retorno');
      })
    }, 5000)
  });
}

function createLine(text) {
  const line = document.createElement('p');
  const text = document.createTextNode(text);

  line.appendChild(text);
  content.appendChild(line);
}