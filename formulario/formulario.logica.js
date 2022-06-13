document.addEventListener('DOMContentLoaded', () => {

    const cnpjCompanyInput = document.getElementById('companyCnpj');
    const payCompanycnpjInput = document.getElementById('payCompanycnpj');
    const zipCodeInput = document.getElementById('zipCode');
    const bussinessPhone = document.getElementById('bussinessPhone');
    const financialPhone = document.getElementById('financialPhone');
    
    cnpjCompanyInput.addEventListener('input', event => {
        cnpjCompanyInput.value = formatCnpj(cnpjCompanyInput.value);
    });
    
    payCompanycnpjInput.addEventListener('input', event => {
        payCompanycnpjInput.value = formatCnpj(p.value);
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
            openModalError();
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

openModalError = () => {
    document.location.href="#popup1";
}

openModalErrorOutSP = () => {
    document.location.href="#popup2";
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
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}