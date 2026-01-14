  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  $("#frm_login").on("submit", function (e) {
    e.preventDefault();
    const $frm = $("#frm_login");
    const Username = $frm.find("input[name='Username']").val();
    const Password = $frm.find("input[name='Password']").val();

    $.post("actions/login.php", { Username: Username, Password: Password })
      .done(function (data) {
        const response = JSON.parse(data);

        if (response.response === "ERROR") {
          Toast.fire({
            icon: "error",
            title: "Login Failed: " + response.message
          });
        } else if (response.response === "OK") {
          Toast.fire({
            icon: "success",
            title: `Welcome, ${response.message}`  
          }).then(() => {
            window.location.assign("index.php"); 
          });
        }
      })
      .fail(function () {
        Toast.fire({
          icon: "error",
          title: "An error occurred while processing your request. Please try again."
        });
      });
  });


  function loadrecovery() {
      Swal.fire({
          html: "Please wait....",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
              Swal.showLoading();
          }
      }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
              window.location.href = "modules/recovery.php";
          }
      });
  }
