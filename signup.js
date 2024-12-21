function displayError(id, message) {
    document.getElementById(id).textContent = message;
}
function clearError(id) {
    document.getElementById(id).textContent = '';
}
function validateEmail() {
    var email = $("#email").val();
    clearError("signupError");
    if (!isValidEmail(email)) {
        displayError("signupError", "Please enter a valid email");
        return;
    }
    requestOTP();
}
function isValidEmail(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@(gmail|yahoo)\.com$/;
    return emailPattern.test(email);
}
function showPassword() {
    var passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}
function requestOTP() {
    var email = $("#email").val();
    fetch('https://script.google.com/macros/s/AKfycbxSc6Gw92H2uTQrsUQeuhaS8pJp0GxI7DOFwj2MB0pXtXYGvJ7zlV6yAnL7-8RUDzg/exec?requestOTP=true&email='+email)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to check existing email');
            }
        })
        .then(data => {
            if(data === 'Email already exists') {
                displayError("signupError", data);
            } else {
                sendOTP(email);
            }
        })
        .catch(error => console.error('Error:', error));
}
function sendOTP(email) {
    fetch('https://script.google.com/macros/s/AKfycbxSc6Gw92H2uTQrsUQeuhaS8pJp0GxI7DOFwj2MB0pXtXYGvJ7zlV6yAnL7-8RUDzg/exec?requestOTP=true&email='+email)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to request OTP');
            }
        })
        .then(data => {
            if(data === 'OTP sent to Google Sheets') {
                $("#otpForm").show();
                $("#getOtpButton").hide();
            } else {
                displayError("signupError", data);
            }
        })
        .catch(error => console.error('Error:', error));
}
function verifyOTP() {
    var otpEntered = $("#otp").val();
    var email = $("#email").val();
    clearError("otpError");
    
    fetch('https://script.google.com/macros/s/AKfycbxSc6Gw92H2uTQrsUQeuhaS8pJp0GxI7DOFwj2MB0pXtXYGvJ7zlV6yAnL7-8RUDzg/exec?verifyOTP=true&email='+email+'&otp='+otpEntered)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Failed to verify OTP');
            }
        })
        .then(data => {
            if(data === 'OTP verified') {
                $("#signupPage").hide();
                $("#additionalDetailsPage").show();
            } else {
                displayError("otpError", data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function goToImageUpload() {
    // Validate additional details here
    // If validation passes:
    document.getElementById('additionalDetailsForm').style.display = 'none';
    document.getElementById('imageUploadForm').style.display = 'flex';
}

function saveAdditionalDetails() {
    var email = $("#email").val();
    var username = $("#username").val();
    var name = $("#name").val();
    var password = $("#password").val();
    var birthdate = $("#birthdate").val();
    var mobile = $("#mobile").val();
    var gender = $('input[name="gender"]:checked').val();
    var countryCode = $("#countryCode").val();
    var imageFile = document.getElementById("imageUpload").files[0];

    if (!imageFile) {
        displayError("imageUploadError", "Please upload an image.");
        return;
    }

    // Upload image to imgbb
    uploadImage(imageFile).then(imageUrl => {
        var age = calculateAge(new Date(birthdate));
        clearError("imageUploadError");

        if (age < 13) {
            displayError("imageUploadError", "You must be at least 13 years old to sign up.");
            return;
        }

        if (!isValidMobileNumber(mobile, countryCode)) {
            displayError("imageUploadError", "Please enter a valid mobile number.");
            return;
        }

        if (!isValidPassword(password)) {
            displayError("imageUploadError", "Password must be at least 8 characters long, contain at least one special character (@,#,$,%,!), one capital letter, and one number.");
            return;
        }

        // Send additional details including image URL to Google Sheets
        fetch('https://script.google.com/macros/s/AKfycbxSc6Gw92H2uTQrsUQeuhaS8pJp0GxI7DOFwj2MB0pXtXYGvJ7zlV6yAnL7-8RUDzg/exec?email='+email+'&username='+username+'&name='+name+'&password='+password+'&birthdate='+birthdate+'&age='+age+'&mobile='+mobile+'&gender='+gender+'&countryCode='+countryCode+'&imageUrl='+encodeURIComponent(imageUrl))
            .then(response => {
                if (response.ok) {
                    displayConfirmationMessage();
                    setTimeout(function() {
                        window.location.href = 'profile.html';
                    }, 1000);
                } else {
                    throw new Error('Failed to save data to Google Sheets');
                }
            })
            .catch(error => console.error('Error:', error));
    }).catch(error => {
        displayError("imageUploadError", "Image upload failed.");
        console.error('Image Upload Error:', error);
    });
}

function uploadImage(file) {
    return new Promise((resolve, reject) => {
        var formData = new FormData();
        formData.append("image", file);

        fetch('https://api.imgbb.com/1/upload?key=d524b55a2d4e0701e1706a7924c10e0c', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data.data.url); // Return the image URL
            } else {
                reject(data.error.message);
            }
        })
        .catch(reject);
    });
}

function isValidPassword(password) {
    var passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%!]).{8,}$/;
    return passwordPattern.test(password);
}

function isValidMobileNumber(mobile, countryCode) {
    var mobilePattern;
    switch (countryCode) {
        case '1': // USA
        case '91': // India
        case '92': // Pakistan
        case '977': // Nepal
            mobilePattern = /^\d{10}$/;
            break;
        default:
            mobilePattern = /^\d{10}$/;
    }
    return mobilePattern.test(mobile);
}

function calculateAge(birthDate) {
    var ageDifMs = Date.now() - birthDate.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function displayConfirmationMessage() {
    $("#additionalDetailsPage").hide();
    $("#confirmationPage").show();
}

document.getElementById('imageUpload').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var preview = document.getElementById('imagePreview');
        preview.src = e.target.result;
        preview.style.display = 'block';
    }
    reader.readAsDataURL(file);
});