let tColor = document.getElementById('tColorA');
let tColorB = document.getElementById('tColorB');
let tColorC = document.getElementById('tColorC');

let cDetails = document.querySelector('.card-details');


let cNumber =  document.getElementById('number');
cNumber.addEventListener('keyup', function(e) {
    let num = cNumber.value;

    let newValue = "";
    num = num.replace(/\s/g, '');
    for(var i = 0; i < num.length; i++) {
        if(i%4 == 0 && i > 0) newValue = newValue.concat(" ");
        newValue = newValue.concat(num[i]);
        cNumber.value = newValue;
    }

    let ccNum = document.getElementById('c-number');
    if(num.length<16) {
        ccNum.style.border="1px solid red";
    } else {
        ccNum.style.border="1px solid greenyellow";
    }
});

let eDate = document.getElementById('e-date');

eDate.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); 
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
    
    // Validation styling
    if (value.length < 5) {
        eDate.style.border = "1px solid red";
    } else {
        eDate.style.border = "1px solid greenyellow";
    }
});

// Handle backspace properly
eDate.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
        let value = e.target.value;
        if (value.length === 3 && value.charAt(2) === '/') {
            e.target.value = value.substring(0, 2);
            e.preventDefault();
        }
    }
});

let cvv = document.getElementById('cvv');
cvv.addEventListener('keyup', function(e) {
    let elen = cvv.value;
    let cvvBox = document.getElementById('cvv-box');
    if(elen.length<3) {
        cvvBox.style.border="1px solid red";
    } else {
        cvvBox.style.border="1px solid greenyellow";
    }
});
