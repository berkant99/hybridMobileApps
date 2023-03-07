function validate() {
    $('#company').on('change', showHideCompany);

    $('#submit').on('click', function (ev) {
        ev.preventDefault();

        let usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        let passwordRegex = /^\w{5,15}$/;
        let emailRegex = /@.*\./;
        let companyNumberRegex = /^[1-9]{1}[0-9]{3}$/;

        validateInput($('#username'), usernameRegex);
        validateInput($('#email'), emailRegex);
        validateInput($('#password'), passwordRegex);
        validateInput($('#confirm-password'), passwordRegex);
        validateInput($('#companyNumber'), companyNumberRegex);
    });

    function validateInput(input, regex) {
        if (!regex.test(input.val())) {
            input.css('border-color', 'red');
        } else {
            input.css('border-color', 'black');
        }
    }

    function showHideCompany() {
        if ($(this).is(':checked')) {
            $('#companyInfo').css('display', 'block');
        } else {
            $('#companyInfo').css('display', 'none')
        }
    }
}