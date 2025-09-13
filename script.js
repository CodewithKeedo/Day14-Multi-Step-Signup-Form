let currentStep = 1;
const totalSteps = 3;

//Load saved data from localStorage on page load
document.addEventListener('DOMContentLoaded', ()=>{
    loadFormData();
    showStep(currentStep);
});
//Show the specified step and update progress bar
function showStep(step){
    document.querySelectorAll('.form-step').forEach((stepElement,index)=>{
        stepElement.classList.toggle('active',index + 1 === step);
    });
    document.querySelectorAll('.progress-step').forEach((stepElement,index)=>{
        stepElement.classList.toggle('active', index + 1 <= step);
    });
    const progress = ((step - 1)/(totalSteps - 1))* 100;
    document.getElementById('progress').style.width = `${progress}%`;

    currentStep = step;
}
//Navigate to the next step with validation
function nextStep(step){
    if(validateStep(currentStep)){
        saveFormData();
        showStep(step);
    }
}
//Navigate to the previous step
function prevStep(step){
    showStep(step);
}
//Validate the current step
function validateStep(step){
    const stepElement = document.getElementById(`step-${step}`);
    const inputs = stepElement.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        input.classList.remove('error');
        const errorMessage = input.nextElementSibling?.classList.contains('error-message')
        ?input.nextElementSibling
        :null;
        if(errorMessage) errorMessage.remove();
        if(!input.value.trim()){
            isValid = false;
            input.classList.add('error');
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = `${input.name} is required`;
            input.insertAdjacentElement('afterend',error);
        }
    });
    //Additional validation for password confirmation
    if(step === 3){
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if(password !== confirmPassword){
            isValid = false;
            const confirmInput = document.getElementById('confirmPassword');
            confirmInput.classList.add('error');
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = 'Passwords do not match';
            confirmInput.insertAdjacentElement('afterend',error);
        }
    }
    return isValid;
}
//Save form data to localStorage
function saveFormData(){
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    localStorage.setItem('signupFormData',JSON.stringify(formData));
}
//Load form data from localStorage
function loadFormData(){
    const savedData = localStorage.getItem('signupFormData');
    if(savedData){
        const formData = JSON.parse(savedData);
        document.getElementById('firstName').value = formData.firstName || "";
        document.getElementById('lastName').value = formData.lastName || "";
        document.getElementById('dob').value = formData.dob || "";
        document.getElementById('email').value = formData.email || "";
        document.getElementById('phone').value = formData.phone || "";
        document.getElementById('address').value = formData.address || "";
        document.getElementById('username').value = formData.username || "";
        document.getElementById('password').value = formData.password || "";
        document.getElementById('confirmPassword').value = formData.confirmPassword || "";
    }
}
//Handle form submission
const form = document.getElementById('multi-step-form');
form.addEventListener('submit',e =>{
    e.preventDefault();
    if(validateStep(currentStep)){
        saveFormData();
        alert('Form submitted successfully');
        localStorage.removeItem('signupFormData'); //clear localStorage
        form.reset();
        showStep(1);
    }
});