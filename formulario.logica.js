document.addEventListener('DOMContentLoaded', () => {
    // declaraÇão de variaveis referentes aos elementos html respectivos;
    
        const cnpjCompanyInput = document.getElementById('companyCnpj');
        const payCompanycnpjInput = document.getElementById('payCompanycnpj');
        const zipCodeInput = document.getElementById('zipCode');
        const bussinessPhone = document.getElementById('bussinessPhone');
        const financialPhone = document.getElementById('financialPhone');
        const bussinessEmail = document.getElementById('bussinessEmail');
        const payContractEmail = document.getElementById('payContractEmail');
        const payCompanyEmail = document.getElementById('payCompanyEmail');
        const financialEmail = document.getElementById('financialEmail');
        const isSamePay = document.getElementById('isSamePay');
        const formData = document.querySelector('form');
        const formTrigger = formData.querySelector("button.submit");
        const submitEvent = new SubmitEvent("submit", { submitter: formTrigger });
        const popErroRecaptchaClose = document.getElementById("popupErroRecaptcha");
        const calendar = document.getElementById('eventDay');
        let currentelyDate= new Date();
    
    // Formatação de data para que o calendario nao aceite datas previas ao dia Atual.
        currentelyDate.setHours(currentelyDate.getHours() -3);
        currentelyDate = currentelyDate.toISOString().split('T')[0];
        calendar.setAttribute('min', currentelyDate);
    
    // Listener do input cnpjtCompany que aplica a formatação regex correta ao input cnpj.
        cnpjCompanyInput.addEventListener('input', () => {
            cnpjCompanyInput.value = formatCnpj(cnpjCompanyInput.value);
        });
    
    // Listener do input payCompanycnpjInput que aplica a formatação regex correta ao input de cnpj.
        payCompanycnpjInput.addEventListener('input', () => {
            payCompanycnpjInput.value = formatCnpj(payCompanycnpjInput.value);
        });
    
    // Listener do input zipCodeInput que aplica a formatação regex correta ao input de cep.
        zipCodeInput.addEventListener('input', () => {
            const zipCodeEvent = zipCodeInput.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
            zipCodeInput.value = !zipCodeEvent[1] ? zipCodeEvent[1] : zipCodeEvent[1]  +  (zipCodeEvent[2] ? '-' + zipCodeEvent[2] : '');
        });
    
    // Listener do input bussinessPhone que aplica a formatação regex correta ao input de celular do contato profissioal.
        bussinessPhone.addEventListener('input', () => {
           bussinessPhone.value = formatPhone(bussinessPhone.value);
        });
    
    // Listener do input financialPhone que aplica a formatação regex correta ao input de celular referente ao contato financeiro.
        financialPhone.addEventListener('input', () => {
            financialPhone.value = formatPhone(financialPhone.value);
        });
    
    // Listener do input zipCodeInput, que é chamado depois que o input sai de foco, 
    // o cep é formatado pra sua forma sem hifen e a função que ira fazer a requisição com o cep passado é chamada.
        zipCodeInput.addEventListener('focusout', () => {
            const zipCodeOutHyphen = zipCodeInput.value.replace(/-/g , '');
            pesquisarCep(zipCodeOutHyphen);
        });
    
    // Listener do input bussinessEmail que checar o email passado e chama a função de validação de email.
        bussinessEmail.addEventListener('focusout', () => {
          const email = emailIsValid(bussinessEmail.value);
          if(!email) {
            payCompanyEmail.value = '';
          }
        });
    
    // Listener do input payContractEmail que checar o email passado e chama a função de validação de email.
        payContractEmail.addEventListener('focusout', () => {
          const email = emailIsValid(payContractEmail.value);
          if(!email) {
            payCompanyEmail.value = '';
          }
        });
    
    //  Listener do input payCompanyEmail que checar o email passado e chama a função de validação de email.
        payCompanyEmail.addEventListener('focusout', () => {
          const email = emailIsValid(payCompanyEmail.value);
          if(!email) {
            payCompanyEmail.value = '';
          }
        });
    
    //  Listener do input financialEmail que checar o email passado e chama a função de validação de email.
        financialEmail.addEventListener('focusout', () => {
          const email = emailIsValid(financialEmail.value);
          if (!email) {
            financialEmail.value = '';
          }
        });
    
    // Listener checkbox que checar quando ver uma mudança na checkbox,
    // se a checkbox estiver marcada como 'true', os campos referentes a empresa pagante serão retiradas do formulario e será retirado a parte de 'obrigatório',
    // se false os campos irão aparecer e continuar como obrigatórios.
        isSamePay.addEventListener('change', function () {
            if (isSamePay.checked) {
                document.getElementById('payCompanyName').removeAttribute('required');
                document.getElementById('payContractName').removeAttribute('required');
                 payCompanycnpjInput.removeAttribute('required');
                 payCompanyEmail.removeAttribute('required');
                 payContractEmail.removeAttribute('required');
                document.getElementById('payForm').style.display = 'none';
            } else {
                document.getElementById('payForm').style.display = 'grid';
            }
        });
    
    // Listener da ação de 'submit' do formulário que irá fazer uma requisição para o recaptcha para checar o score da interação do usuário com o site
    // se esse score for menos de 0.5, um modal de erro será chamado, se não o modal de sucesso será aberto e o formulário será enviado normalmente.
        formData.addEventListener('submit', event => {
            event.preventDefault();
            const zipCodeOutHyphen = zipCodeInput.value.replace(/-/g , '');
            pesquisarCep(zipCodeOutHyphen);
        grecaptcha.ready(function() {
            grecaptcha.execute('6LdRCXggAAAAAO-cYwNz9V02kTaovM5aMfOI3ngp', {action: 'submit'}).then(function async(token) {
                const secrectKey = '6LdRCXggAAAAACne3SMhrwhG5zHOhhQdNCJzsdPu';
               fetch(`https://cors-anywhere.herokuapp.com/https://www.google.com/recaptcha/api/siteverify?secret=${secrectKey}&response=${token}`,
                { mode: 'cors', method: 'POST'}).then(async(response) => {
                   const data = await response.json();
                   if ( data.score < 0.5) {
                       openModalErrorRecaptcha();
                   } else {
                        openModalSuccess(formData);
                   }
               });
            });
          });
    
        });
    
    //Listener do modal de erro do reCaptcha, faz com que a janela seja recarregada toda vez que o modal fechar;
        popErroRecaptchaClose.addEventListener('click', (event) => {
        document.location.reload(true);
        });
    });
    
    // Função que faz uma requisição com um cep passado, e chama a função de preencher os campos do formulário referentes ao endereço.
    // @0params zipCode o cep que se quer fazer a pesquisa 
    pesquisarCep = async(zipCode)  => {
        const url =  `https://viacep.com.br/ws/${zipCode}/json/`;
        const data = await fetch(url).then(async(reveivedData) => {
            const adress = await reveivedData.json();
            if (adress.erro) {
                openModalErrorCep();
            } else if(adress.uf !=='SP') {
                openModalErrorOutSP();
            } else {
            fillFormAdress(adress);
            }
       
        }).catch((erro) => {
            console.error(erro);
        });
    }
    
    // Função que preenche os campos de rua, municipio e estado, quando o cep passado é válido.
    fillFormAdress = (endereco) => {
        document.getElementById('adress').value = endereco.logradouro;
        document.getElementById('county').value = endereco.localidade;
        document.getElementById('state').value = endereco.uf;
    }
    
    // Chamada de Modal de erro do cep
    openModalErrorCep = () => {
        document.location.href="#popupErrorCep";
    }
    
    // Chamada de modal de erro quando cep é fora de são paulo e recarrega a pagina.
    openModalErrorOutSP = () => {
        document.location.href="#popupErrorOutSP";
          document.location.reload(true);
    }
    
    // Chamada de modal de formatação incorreta do email.
    openModalErrorEmail = () => {
        document.location.href="#popupErroEmail";
    }
    
    // Chamada de modal de erro do reCaptcha.
    openModalErrorRecaptcha = () => {
        document.location.href="#popupErroRecaptcha";
    }
    
    // Chamada de modal de sucesso de envio do formulário.
    openModalSuccess = (form) => {
        document.location.href="#popupSuccess";
        form.submit();
    }
    
    // Função de formatação regex dos números de celulares passados.
    //@parans bussinesPhone números de celulares para ser formatado.
    //@return newBussinessPhone número formatado.
    formatPhone = (bussinessPhone) => {
        let newBussinessPhone = bussinessPhone.replace(/\D/g,"");
        newBussinessPhone = newBussinessPhone.replace(/^0/,"");
    
        if (newBussinessPhone.length > 10) {
            // 11+ digitos. Formatar como $5+$4.
            newBussinessPhone = newBussinessPhone.replace(/^(\d\d)(\d{5})(\d{4}).*/,"($1) $2-$3");
        }
        else if (newBussinessPhone.length > 5) {
            // 6..10 digitos. Formatar como $4+$4
            newBussinessPhone = newBussinessPhone.replace(/^(\d\d)(\d{4})(\d{0,4}).*/,"($1) $2-$3");
        }
        else if (newBussinessPhone.length > 2) {
           // 3..5 digitos. Adicionar (xx)..
            newBussinessPhone = newBussinessPhone.replace(/^(\d\d)(\d{0,5})/,"($1) $2");
        }
       return newBussinessPhone;
    }
    
    // Função que formata com regex os cnpj passado para o formato correto.
    // @params cnpjCompanyInput cnpj para ser formatado.
    // return cnpjCompany cnpj já no formato correto.
    formatCnpj = (cnpjCompanyInput) => {
        let cnpjCompany = cnpjCompanyInput.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
        cnpjCompany = !cnpjCompany[2] ? cnpjCompany[1] : cnpjCompany[1] + '.' + cnpjCompany[2] + '.' + cnpjCompany[3] + '/' + cnpjCompany[4] + (cnpjCompany[5] ? '-' + cnpjCompany[5] : '');
        return cnpjCompany;
    }
    
    // Função de validação do email por regex.
    //@params email email para ser válidado.
    //return boolean retorna verdadeiro se tiver no formato certo e false caso não esteja.
    emailIsValid = (email) => {
        const regexValidation = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
        if (regexValidation.test(email)){
            return true; }
            else{
                openModalErrorEmail();
            return false;
            }
        
    }