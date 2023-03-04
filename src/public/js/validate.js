function validator(formSelector) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    // 1. Lấy element form.
    // 2. Lấy input cần validate
    // 3. Khởi tạo Obj key-Name input, value - function handle.
    // 4. Lập qua các key-value <--> nameInput- rules đưa vào init formRules
    var formRules = {};
    /*
        - Quy ước :
        + Nếu có lỗi trả về message
        + Nếu không thì trả undefined
    */
    var validateRules = {
        require: (value) => {
            return value ? undefined : 'Vui lòng nhập trường này!';
        },
        isEmail: (value) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email !';
        },
        min: (min) => {
            return (value) => {
                return value.length >= min ? undefined : `Trường này phải tối đa ${min} ký tự!`;
            };
        },
        isConfirmed: (value) => {
            const passwordConfirmation = document.querySelector('#password').value.split('').join('');
            console.log(value === passwordConfirmation);
            return value === passwordConfirmation ? undefined : 'Mật khẩu nhập lại không chính xác!';
        },
    };
    const formElement = document.querySelector(formSelector);
    if (formElement) {
        const inputs = formElement.querySelectorAll('[name][rules]');
        for (let input of inputs) {
            const rules = input.getAttribute('rules').split('|');
            for (let rule of rules) {
                const isHasValue = rule.includes(':');
                var ruleInfo;
                if (isHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                let ruleFunc = validateRules[rule];
                if (isHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }
            // Lắng nghe sự kiện change,...
            input.onblur = handleValidate;
            input.oninput = handleClearErr;
        }
        function handleValidate(event) {
            var errMsg;
            const ruleName = event.target.name;
            const rules = formRules[ruleName];
            const ruleValue = event.target.value.split(' ').join('');
            console.log(ruleValue);
            for (let i = 0; i < rules.length; i++) {
                errMsg = rules[i](ruleValue);
                if (errMsg !== undefined) {
                    break;
                }
            }
            // Nếu có lỗi thì hiển thi ra UI
            if (errMsg) {
                const formGroup = getParent(event.target, '.form-group');
                if (formGroup) {
                    const spanMsg = formGroup.querySelector('.span-message');
                    if (spanMsg) {
                        formGroup.classList.add('active');
                        spanMsg.innerHTML = errMsg;
                    }
                }
            }
            return !errMsg;
        }
        function handleClearErr(event) {
            const formGroup = getParent(event.target, '.form-group');
            if (formGroup && formGroup.classList.contains('active')) {
                formGroup.classList.remove('active');
                const spanMsg = formGroup.querySelector('.span-message');
                if (spanMsg) {
                    spanMsg.innerHTML = '';
                }
            }
        }
    }
    if (formElement) {
        formElement.onsubmit = (event) => {
            event.preventDefault();
            const inputs = formElement.querySelectorAll('[name][rules]');
            var isValid = true;
            for (let input of inputs) {
                if (!handleValidate({ target: input })) {
                    isValid = false;
                }
            }
            isValid && formElement.submit();
        };
    }
}
