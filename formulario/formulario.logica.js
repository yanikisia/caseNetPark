document.addEventListener('DOMContentLoaded', () => {

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
    
    cnpjCompanyInput.addEventListener('input', event => {
        cnpjCompanyInput.value = formatCnpj(cnpjCompanyInput.value);
    });
    
    payCompanycnpjInput.addEventListener('input', event => {
        payCompanycnpjInput.value = formatCnpj(payCompanycnpjInput.value);
    });

    zipCodeInput.addEventListener('input', event => {
        const zipCodeEvent = zipCodeInput.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
        zipCodeInput.value = !zipCodeEvent[1] ? zipCodeEvent[1] : zipCodeEvent[1]  +  (zipCodeEvent[2] ? '-' + zipCodeEvent[2] : '');
      console.log(`The value of payCompany is ${zipCodeInput.value}`);
    });

    bussinessPhone.addEventListener('input', event => {
       bussinessPhone.value = formatPhone(bussinessPhone.value);
    });

    financialPhone.addEventListener('input', event => {
        financialPhone.value = formatPhone(financialPhone.value);
    });

    zipCodeInput.addEventListener('focusout', event => {
        const zipCodeOutHyphen = zipCodeInput.value.replace(/-/g , '');
        pesquisarCep(zipCodeOutHyphen);
    });

    bussinessEmail.addEventListener('focusout', event => {
      emailIsValid(bussinessEmail.value);
    });

    payContractEmail.addEventListener('focusout', event => {
      emailIsValid(payContractEmail.value);
    });

    payCompanyEmail.addEventListener('focusout', event => {
      emailIsValid(payCompanyEmail.value);
    });

    financialEmail.addEventListener('focusout', event => {
      emailIsValid(financialEmail.value);
    });

    isSamePay.addEventListener('change', function (event) {
        if (isSamePay.checked) {
            document.getElementById('payForm').style.display = 'none';
        } else {
            document.getElementById('payForm').style.display = 'grid';
        }
    });

    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        console.log('submit');
        console.log(event.target.value);
      });
});
 
pesquisarCep = async(zipCode)  => {
    const url =  `https://viacep.com.br/ws/${zipCode}/json/`;
    const dada = await fetch(url).then(async(reveivedDada) => {
        const adress = await reveivedDada.json();
        if (adress?.erro) {
            openModalErrorCep();
        } else if(adress.uf !=='SP') {
            openModalErrorOutSP();
        }
        fillFormAdress(adress);
       
    }).catch((erro) => {
        console.error(erro);
    });
}

fillFormAdress = (endereco) => {
    document.getElementById('adress').value = endereco.logradouro;
    document.getElementById('county').value = endereco.localidade;
    document.getElementById('city').value = endereco.bairro;
    document.getElementById('state').value = endereco.uf;
}

openModalErrorCep = () => {
    document.location.href="#popupErrorCep";
}

openModalErrorOutSP = () => {
    document.location.href="#popupErrorOutSP";
}

openModalErrorEmail = () => {
    document.location.href="#popupErroEmail";
}

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

formatCnpj = (cnpjCompanyInput) => {
    let cnpjCompany = cnpjCompanyInput.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    cnpjCompany = !cnpjCompany[2] ? cnpjCompany[1] : cnpjCompany[1] + '.' + cnpjCompany[2] + '.' + cnpjCompany[3] + '/' + cnpjCompany[4] + (cnpjCompany[5] ? '-' + cnpjCompany[5] : '');
    return cnpjCompany;
}

emailIsValid = (email) => {
    const regexValidation = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;
    if (regexValidation.test(email)){
        return true; }
        else{
            openModalErrorEmail();
        return false;
        }
    
}