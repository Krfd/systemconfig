$(document).ready(function () {
  loadDashboard();
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $.post("dirs/incoming/picklistbasket/components/main.php", {}, function (data) {
    $("#basket_content").html(data)
  })
  cancelPicklist();
  // addToPicklist();
}

function loadReturn() {
  $.post("dirs/incoming/dashboard/incoming.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// function addToPicklist() {
  $(document).on("click", ".picklist-num", function() {
    
    const picklistNumber = $(this).data("picklist-num");

    console.log(`PICKLIST NUMBER: ${picklistNumber}`)

    // Swal.fire({
    //   icon: "question",
    //   title: "Save items to this picklist?",
    //   text: "This action cannot be change.",
    //   confirmButtonText: "Yes, save it",
    //   showCancelButton: true,
    //   cancelButtonText: "Not sure"
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     // API CALL TO CREATE PICKLIST

    //     $.ajax({
    //       url: "dirs/incoming/picklistbasket/actions/create_picklist.php",
    //       type: "POST",
    //       data: {Picklist: Picklist},
    //       dataType: "json",
    //       success: function(response) {
    //         if (response.isSuccess === "success") {
    //           Swal.fire({
    //             icon: "success",
    //             title: "Items added to picklist",
    //             confirmButtonText: "OKAY",
    //           })
    //         } else {
    //           Swal.fire({
    //             icon: "error",
    //             title: "Something went wrong",
    //             text: "Please contact the developer",
    //             confirmButtonText: "OKAY"
    //           })
    //         }
    //       }
    //     })
    //   }
    // })

    openPicklist();
  })
// }

function openPicklist() {
    $.post("dirs/incoming/picklistitems/picklistItem.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function cancelPicklist() {
  // Use event delegation
  $(document).on("click", ".cancel-picklist", function () {

    // console.log("Cancel picklist function triggered!");

    const picklistId = $(this).data("picklist");

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to cancel Picklist " + picklistId,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!"
    }).then((result) => {

      if (result.isConfirmed) {

        Swal.fire(
          "Cancelled!",
          "Picklist " + picklistId + " has been cancelled.",
          "success"
        );

        $(this).closest("tr").remove();


        // Optional: Call backend here
        // $.post("cancel.php", { id: picklistId });
      }
    });
  });
}



