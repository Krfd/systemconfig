 $(document).ready(function () {
   $("#togglePassword").on("click", function () {
     const input = $("#Password");
     const type = input.attr("type") === "password" ? "text" : "password";
     input.attr("type", type);
     $(this).toggleClass("bi-eye bi-eye-slash");
   });

   if (getCookie("Username") && getCookie("Password")) {
     $("#Username").val(getCookie("Username"));
     $("#Password").val(getCookie("Password"));
     $("#save-login").prop("checked", true);
   }

   $("#save-login").on("change", function () {
     if (this.checked) {
       setCookie("Username", $("#Username").val(), 7);
       setCookie("Password", $("#Password").val(), 7);
     } else {
       deleteCookie("Username");
       deleteCookie("Password");
     }
   });

   $("#frm_login").on("submit", function (event) {
     event.preventDefault();

     var $frm = $(this);
     var Username = $frm.find("input[name='Username']").val().trim();
     var Password = $frm.find("input[name='Password']").val().trim();

     $.post("actions/login.php", { 
       Username: Username, 
       Password: Password 
     }, function (data) {
       var response = JSON.parse(data);

       if (response.response === "OK") {
         $frm[0].reset();
         if ($("#save-login").is(":checked")) {
           setCookie("Username", Username, 7);
           setCookie("Password", Password, 7);
         }

         var role = response.role; 

         if (role === "Admin") {
           window.location.assign("index.php");
         } else {
           window.location.assign("login.php");
         }

       } else {
         console.log("Login failed: " + response.message);
       }
     });
   });
 });

 function setCookie(name, value, days) {
   const date = new Date();
   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
   document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString() + "; path=/";
 }

 function getCookie(name) {
   const value = `; ${document.cookie}`;
   const parts = value.split(`; ${name}=`);
   if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
 }

 function deleteCookie(name) {
   document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
 }
