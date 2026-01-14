function toast_alert($type, $title){
    // $type success, info, error, warning, question
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000
    });


    Toast.fire({
      icon: $type,
      title: $title
    })

  }