$(document).ready(function(){
    loadSettings();
});



function loadSettings() {
    $.post("dirs/settings/components/main.php", {
    }, function (data){
        $("#load_Settings").html(data);
        loaduserProfile();
        loadBusinessProfile();
    });
}


/*Function show modal to update Profile*/
function updateProfile(){
    $.post("dirs/settings/actions/get_profile.php",{
    },function(data){
        response = JSON.parse(data);
        if(jQuery.trim(response.isSuccess) == "success"){
        $("#modal-update-profile").modal('show');
            $("#fullname").val(response.Data.Fullname);
            $("#position").val(response.Data.Position);
            $("#contactnumber").val(response.Data.ContactNumber);
            $("#email").val(response.Data.Email);
            $("#website").val(response.Data.Website);
            $("#fbpage").val(response.Data.Fb);
            $("#viber").val(response.Data.Viber);
            $("#address").val(response.Data.HomeAddrss);
            $("#birthday").val(response.Data.Birthday);

        }else{
        $("#modal-update-profile").modal('hide');
            alert(jQuery.trim(response.Data));
        }
    });
}

/*Function show Profile*/
function loaduserProfile(){
    $.post("dirs/settings/actions/get_profile.php",{
    },function(data){
        response = JSON.parse(data);
        if(jQuery.trim(response.isSuccess) == "success"){
            $("#profile-name").text(response.Data.Fullname);
            $("#my-position").text(response.Data.Position);
            $("#my-contact").text(response.Data.ContactNumber);
            $("#my-email").text(response.Data.Email);
            $("#my-fb").text(response.Data.Fb);
            $("#my-viber").text(response.Data.Viber);
            $("#my-website").text(response.Data.Website);
            $("#home-address").text(response.Data.HomeAddrss);
            $("#my-bday").text(response.Data.Birthday);

        }else{
            alert(jQuery.trim(response.Data));
        }
    });
}

// Function update user password
function updatePassword() {
    $("#mdl-upd-password").modal("show");
}

/*Function to show password*/
function togglePassword() {
    const passwordField = document.getElementById('newpassword');
    const confirmPassword = document.getElementById('confirmpassword');
    const checkbox = document.getElementById('toggle-show-password');
    passwordField.type = checkbox.checked ? 'text' : 'password';
    confirmPassword.type = checkbox.checked ? 'text' : 'password';

}




/*Function show Business Profile*/
function loadBusinessProfile(){
    $.post("dirs/settings/actions/get_businessprofile.php",{
    },function(data){
        response = JSON.parse(data);
        if(jQuery.trim(response.isSuccess) == "success"){
            $("#business-name").text(response.Data.BusinessName);
            $("#business-type").text(response.Data.BusinessType);
            $("#business-industry").text(response.Data.Industry);
            $("#business-est").text(response.Data.DateEstablished);
            $("#business-owner").text(response.Data.OwnerName);
            $("#business-address").text(response.Data.Business_Addrss);
            $("#business-tin").text(response.Data.Business_tin);
            $("#business-permit").text(response.Data.Business_permit);
            $("#business-services").text(response.Data.Services);

            // Banner
            $("#business-bg-img").attr(
                "src",
                response.Data.BusinessBg 
                    ? "data:image/png;base64," + response.Data.BusinessBg 
                    : "../assets/image/logo/bosjpg.jpg"
            );

            // Logo
            $("#my-b-logo").attr(
                "src",
                response.Data.BusinessLogo 
                    ? "data:image/png;base64," + response.Data.BusinessLogo 
                    : "../assets/image/logo/noimage.avif"
            );
        }else{
            alert(jQuery.trim(response.Data));
        }
    });
}


//Function show modal update business
function updateBusiness(){
    $.post("dirs/settings/actions/get_businessprofile.php",{
    },function(data){
        response = JSON.parse(data);
        if(jQuery.trim(response.isSuccess) == "success"){
            $("#modal-update-business").modal("show");
            $("#bname").val(response.Data.BusinessName);
            $("#b-type").val(response.Data.BusinessType);
            $("#b-industry").val(response.Data.Industry);
            $("#b-est").val(response.Data.DateEstablished);
            $("#b-owner").val(response.Data.OwnerName);
            $("#b-address").val(response.Data.Business_Addrss);
            $("#b-tin").val(response.Data.Business_tin);
            $("#b-permit").val(response.Data.Business_permit);
            $("#b-services").val(response.Data.Services);
        }else{
            alert(jQuery.trim(response.Data));
        }
    });
}

/*Update Business Profile*/
$("#frm-update-business").submit(function(event){
    event.preventDefault();

    var Businessname    = $("#bname").val();
    var Businesstype    = $("#b-type").val();
    var Industry        = $("#b-industry").val();
    var Established     = $("#b-est").val();
    var Owner           = $("#b-owner").val();
    var BusinessAddress = $("#b-address").val();
    var Businesstin     = $("#b-tin").val();
    var Businesspermit  = $("#b-permit").val();
    var Services        = $("#b-services").val();

    $.post("dirs/settings/actions/update_business_profile.php", {
        Businessname: Businessname,
        Businesstype: Businesstype,
        Industry: Industry,
        Established: Established,
        Owner: Owner,
        BusinessAddress: BusinessAddress,
        Businesstin :Businesstin,
        Businesspermit: Businesspermit,
        Services: Services
    }, function(data){
        if($.trim(data) == "success"){
            loadSettings();
            $("#modal-update-business").modal('hide');
            Swal.fire({
                icon: "success",
                title: "Saved",
                text: "Successfully updated.",
                timer: 2000,
                showConfirmButton: false
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});


/*Update Profile*/
$("#frm-update-profile").submit(function(event){
    event.preventDefault();

    var Fullname        = $("#fullname").val();
    var Position        = $("#position").val();
    var Address         = $("#address").val();
    var Contactnumber   = $("#contactnumber").val();
    var Email           = $("#email").val();
    var Fbpage          = $("#fbpage").val();
    var Website         = $("#website").val();
    var Viber           = $("#viber").val();
    var Birthday        = $("#birthday").val();

    $.post("dirs/settings/actions/update_profile.php", {
        Fullname: Fullname,
        Position: Position,
        Address: Address,
        Contactnumber: Contactnumber,
        Email: Email,
        Website: Website,
        Fbpage :Fbpage,
        Viber: Viber,
        Birthday: Birthday
    }, function(data){
        if($.trim(data) == "success"){
            loadSettings();
            $("#modal-update-profile").modal('hide');
            Swal.fire({
                icon: "success",
                title: "Saved",
                text: "Successfully updated.",
                timer: 2000,
                showConfirmButton: false
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});



/*Update Security Password*/
$("#frm-update-password").submit(function(event){
    event.preventDefault();
    var Newpassword         = $("#newpassword").val();
    var ConfirmPassword     = $("#confirmpassword").val();

    if (Newpassword !== ConfirmPassword) {
        $("#error-msg").removeClass('d-none'); 
        return false; 
    } else {
        $("#error-msg").addClass('d-none');
    }

    $.post("dirs/settings/actions/update_password.php", {
        ConfirmPassword: ConfirmPassword,
    }, function(data){
        if($.trim(data) == "success"){
            loadSettings();
            $("#mdl-upd-password").modal('hide');
            Swal.fire({
                icon: "success",
                title: "Saved",
                text: "Successfully updated.",
                timer: 2000,
                showConfirmButton: false
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});


function uploadBusinessBg() {
    $("#modal-business-bg").modal("show");
}


/*Upload Business background Photo*/
$("#frm-upload-bg-business").submit(function (event) {
    event.preventDefault();

    var fileInput = $("#upload_b_photo")[0];

    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No photo selected",
            text: "Please select an image to upload."
        });
        return;
    }

    var formData = new FormData();
    formData.append("Photo", fileInput.files[0]);

    $.ajax({
        url: "dirs/settings/actions/upload_business_bg.php",
        type: "POST",
        data: formData,
        processData: false, // REQUIRED
        contentType: false, // REQUIRED
        success: function (data) {
            if ($.trim(data) === "success") {
                loadSettings();
                $("#modal-business-bg").modal("hide");
                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Successfully uploaded.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data
                });
            }
        }
    });
});


function updBusinessLogo() {
    $("#modal-business-logo").modal("show");
}


/*Upload Business background Photo*/
$("#frm-upload-logo-business").submit(function (event) {
    event.preventDefault();

    var fileInput = $("#upload_logo_photo")[0];

    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No photo selected",
            text: "Please select an image to upload."
        });
        return;
    }

    var formData = new FormData();
    formData.append("Photo", fileInput.files[0]);

    $.ajax({
        url: "dirs/settings/actions/upload_business_logo.php",
        type: "POST",
        data: formData,
        processData: false, // REQUIRED
        contentType: false, // REQUIRED
        success: function (data) {
            if ($.trim(data) === "success") {
                loadSettings();
                $("#modal-business-logo").modal("hide");
                Swal.fire({
                    icon: "success",
                    title: "Saved",
                    text: "Successfully uploaded.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data
                });
            }
        }
    });
});
